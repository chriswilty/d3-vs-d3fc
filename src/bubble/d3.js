import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';

const d3BubbleChart = selection => {
    const dataPoints = selection.datum();
    const numberFormat = d3.format(',.3d');
    const tickFormat = d3.format('~s');

    const width = parseInt(selection.style('width'));
    const height = parseInt(selection.style('height'));
    const margin = { top: 32, right: 16, bottom: 48, left: 64 };

    const xScale = d3.scaleLog()
        .domain([d3.min(dataPoints, d => d.population), d3.max(dataPoints, d => d.population)])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLog()
        .domain([d3.min(dataPoints, d => d.totalCases), d3.max(dataPoints, d => d.totalCases)])
        .range([height - margin.bottom, margin.top])
        .nice();

    const xAxis = g => g
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5, tickFormat))
        .call(g => g.select('.domain').attr('stroke-width', '1.5'))
        .call(g => g.append('text')
            .attr('x', (margin.left + width - margin.right) / 2)
            .attr('y', margin.bottom - 5)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'middle')
            .classed('x-label', true)
            .text('Population'));

    const yAxis = g => g
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(7, tickFormat))
        .call(g => g.select('.domain').attr('stroke-width', '1.5'))
        .call(g => g.append('text')
            .attr('x', -margin.left -margin.right)
            .attr('y', height / 2)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'middle')
            .attr('transform',
                `rotate(-90, ${-margin.left - 5}, ${(height - margin.top) / 2})`)
            .classed('y-label', true)
            .text('Total Cases'));

    const bubbleColour = d3.scaleOrdinal()
        .domain(['low', 'lower-middle', 'upper-middle', 'high'])
        .range(['#963', '#c99', '#9c9', '#0c0']);

    const bubbleSize = d3.scaleLinear()
        .domain([d3.min(dataPoints, d => d.deathsPerMillion), d3.max(dataPoints, d => d.deathsPerMillion)])
        .range([16,512]);

    const legend = legendColor()
        .scale(bubbleColour)
        .title('Income group')
        .ascending(true)
        .shape('circle')
        .shapeRadius(6);

    selection.select('svg').remove();
    const svg = selection.append('svg')
        .attr('viewBox', [0, 0, width, height]);

    svg.append('text')
        .attr('x', `${width / 2}`)
        .attr('y', `${margin.top / 2}`)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .text('Covid-19: Reported Cases');

    const points = svg.selectAll('g.point')
        .data(dataPoints)
        .enter()
        .append('g')
        .classed('point', true)
        .attr('transform', d => `translate(${xScale(d.population)}, ${yScale(d.totalCases)})`)
        .attr('fill', d => bubbleColour(d.income))
        .attr('stroke', 'white');
    points.append('path')
        .attr('d', d => d3.symbol().size(bubbleSize(d.deathsPerMillion))());
    points.append('title')
        .text(d =>
            `${d.country}:  ` +
            `${numberFormat(d.casesPerMillion)} cases/M  ` +
            `${numberFormat(d.deathsPerMillion)} deaths/M`);

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);
    svg.append('g')
        .classed('legend', true)
        .attr('transform', `translate(${width - 110}, ${height - 130})`)
        .call(legend);
};

export default d3BubbleChart;
