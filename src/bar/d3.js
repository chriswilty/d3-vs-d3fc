import * as d3 from 'd3';
import { dateFormatter, moneyFormatter, annotationFormatter, barColour } from 'src/formatters';

const d3BarChart = selection => {
    const { sales, targets } = selection.datum();

    const width = parseInt(selection.style('width'));
    const height = parseInt(selection.style('height'));
    const margin = { top: 32, right: 64, bottom: 32, left: 16 };
    const fillColour = barColour(targets);

    const xScale = d3.scaleBand()
        .domain(sales.map(d => d.date))
        .rangeRound([margin.left, width - margin.right])
        .paddingInner(0.2)
        .paddingOuter(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(sales, d => d.value) * 1.1])
        .range([height - margin.bottom, margin.top])
        .nice();

    const xAxis = g => g
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale)
            .tickFormat(dateFormatter)
            .tickSizeOuter(6))
        .call(g => g.select('.domain').attr('stroke-width', '1.5'));

    const yAxis = g => g
        .attr('transform', `translate(${width - margin.right}, 0)`)
        .call(d3.axisRight(yScale).ticks(5, moneyFormatter))
        .call(g => g.select('.domain').attr('stroke-width', '1.5'))
        .call(g => g.append('text')
            .attr('x', margin.right + 5)
            .attr('y', (height) / 2)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'middle')
            .attr('transform',
                `rotate(-90, ${margin.right - 5}, ${height / 2})`)
            .classed('y-label', true)
            .text('Sales (millions)'));

    selection.select('svg').remove();
    const svg = selection.append('svg')
        .attr('viewBox', [0, 0, width, height]);

    svg.append('text')
        .attr('x', `${width / 2}`)
        .attr('y', `${margin.top / 2}`)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .text('2019 Cumulative Sales');

    svg.append('g')
        .attr('fill', '#999')
        .selectAll('rect')
        .data(d => d.sales)
        .join('rect')
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.value))
        .attr('height', d => yScale(0) - yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('fill', fillColour);

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    const annotationLines = svg.selectAll('g.annotation-line')
        .data(d => d.targets)
        .enter()
        .append('g')
        .classed('annotation-line', true)
        .attr('transform', d => `translate(0, ${yScale(d.value)})`);

    annotationLines.append('line')
        .attr('x1', `${margin.left}`)
        .attr('x2', `${width - margin.right}`)
        .attr('stroke', '#bbb')
        .attr('stroke-dasharray', '4');

    annotationLines.append('text')
        .attr('x', margin.left)
        .attr('y', -5)
        .text(annotationFormatter);
};

export default d3BarChart;