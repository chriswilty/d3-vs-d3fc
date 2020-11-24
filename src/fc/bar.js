import { scaleBand, scaleLinear } from 'd3-scale';
import { annotationSvgLine } from '@d3fc/d3fc-annotation';
import { chartCartesian } from '@d3fc/d3fc-chart';
import '@d3fc/d3fc-element';
import { extentLinear } from '@d3fc/d3fc-extent';
import { autoBandwidth, seriesSvgBar, seriesSvgMulti } from '@d3fc/d3fc-series';

import { annotationFormatter, barColour, dateFormatter, moneyFormatter } from 'src/formatters';

//start
const fcBarChart = selection => {
    const { sales, targets } = selection.datum();
    const fillColour = barColour(targets);

    const yExtent = extentLinear()
        .include([0])
        .pad([0, 0.2])
        .accessors([d => d.value]);

    const bar = autoBandwidth(seriesSvgBar())
        .crossValue(d => d.date)
        .mainValue(d => d.value)
        .align('left')
        .decorate(g => g
            .select('.bar > path')
            .style('fill', fillColour)
        );

    const annotationLine = annotationSvgLine()
        .value(d => d.value)
        .decorate(selection => {
            selection.enter().select('line').attr('stroke-dasharray', '4');
            selection.enter().select('g.left-handle')
                .append('text')
                .attr('x', 0)
                .attr('y', -5);
            selection.enter().select('g.right-handle').remove();
            // data-dependent label: redraw on update not just on enter
            selection.select('g.left-handle text').text(annotationFormatter);
        });

    const multiPlot = seriesSvgMulti()
        .series([bar, annotationLine])
        .mapping((data, i, series) => series[i] === annotationLine ? data.targets : data.sales);

    const chart = chartCartesian(scaleBand(), scaleLinear())
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
//end

export default fcBarChart;