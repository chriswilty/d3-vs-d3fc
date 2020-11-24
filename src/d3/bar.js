import { max } from 'd3-array';
import { axisBottom, axisRight } from 'd3-axis';
import { scaleBand, scaleLinear } from 'd3-scale';
import { annotationFormatter, barColour, dateFormatter, moneyFormatter } from 'src/formatters';

//start
const d3BarChart = selection => {
    const { sales, targets } = selection.datum();
    const width = parseInt(selection.style('width'));
    const height = parseInt(selection.style('height'));
    const margin = { top: 30, right: 60, bottom: 50, left: 16 };
    const fillColour = barColour(targets);

    const xScale = scaleBand()
        .domain(sales.map(d => d.date))
        .rangeRound([margin.left, width - margin.right])
        .paddingInner(0.2)
        .paddingOuter(0.1);

    const yScale = scaleLinear()
        .domain([0, max(sales, d => d.value) * 1.2])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(axisBottom(xScale).tickFormat(dateFormatter).tickSizeOuter(6))
        .call(g => g.select('.domain').attr('stroke-width', '1.5'));

    const yAxis = g => g
        .attr('transform', `translate(${width - margin.right}, 0)`)
        .call(axisRight(yScale).ticks(5, moneyFormatter))
        .call(g => g.select('.domain').attr('stroke-width', '1.5'))
        .call(g => g.append('text')
            .attr('x', margin.right + 5)
            .attr('y', (height) / 2)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'middle')
            .attr('transform', `rotate(-90, ${margin.right - 5}, ${height / 2})`)
            .classed('y-label', true)
            .text('Sales (millions)')
        );

    const svg = selection.append('svg').attr('viewBox', [0, 0, width, height]);
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
//end

export default d3BarChart;