import * as d3 from 'd3';
import { annotationSvgLine } from '@d3fc/d3fc-annotation';
import { chartCartesian } from '@d3fc/d3fc-chart';
import { extentLinear } from '@d3fc/d3fc-extent';
import { autoBandwidth, seriesSvgBar, seriesSvgMulti } from '@d3fc/d3fc-series';

const fcBarChart = selection => {
    const { sales, targets } = selection.datum();

    const dateFormatter = d3.timeFormat('%b');
    const moneyFormatter = d3.format('$.0f');
    const annotationFormatter = ({ name, value }) => name + ': ' + d3.format('$.1f')(value) + 'M';
    const barColour = d => (d.value >= (targets.find(t => t.name === 'low') || {}).value ? '#0c0' : 'inherit');

    const yExtent = extentLinear()
        .include([0])
        .pad([0, 0.1])
        .accessors([d => d.value]);

    const bars = autoBandwidth(seriesSvgBar())
        .crossValue(d => d.date)
        .mainValue(d => d.value)
        .align('left')
        .decorate(g => g.select('.bar > path').style('fill', barColour));

    const annotationLines = annotationSvgLine()
        .value(d => d.value)
        .label(annotationFormatter)
        .decorate(selection => {
            selection.enter().select('line').attr('stroke-dasharray', '4');
            const texts = selection.enter().select('g.right-handle text').remove().nodes();
            selection.enter().select('g.left-handle')
                .append((_,i) => texts[i])
                .attr('x', 0)
                .attr('dy', '-0.33em');
        });

    const multiPlot = seriesSvgMulti()
        .series([bars, annotationLines])
        .mapping((data, i, series) => series[i] === annotationLines ? data.targets : data.sales);

    const chart = chartCartesian(d3.scaleBand(), d3.scaleLinear())
        .chartLabel('2019 Cumulative Sales')
        .xDomain(sales.map(d => d.date))
        .xTickFormat(dateFormatter)
        .xPadding(0.2)
        .yDomain(yExtent(sales))
        .yTicks(5, moneyFormatter)
        .yLabel('Sales (millions)')
        .yNice()
        .svgPlotArea(multiPlot);

    selection.call(chart);
}

export default fcBarChart;