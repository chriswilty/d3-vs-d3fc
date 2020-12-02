import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import { chartCartesian } from '@d3fc/d3fc-chart';
import { extentLinear } from '@d3fc/d3fc-extent';
import { seriesSvgPoint } from '@d3fc/d3fc-series';
import '@d3fc/d3fc-element';

const fcBubbleChart = selection => {
    const dataPoints = selection.datum();
    const numberFormat = d3.format(',.3d');
    const tickFormat = d3.format('~s');

    const bubbleColour = d3.scaleOrdinal()
        .domain(['low', 'lower-middle', 'upper-middle', 'high'])
        .range(['#963', '#c99', '#9c9', '#0c0']);

    const bubbleSize = d3.scaleLinear()
        .domain(extentLinear().accessors([d => d.deathsPerMillion])(dataPoints))
        .range([16,512]);

    const pointSeries = seriesSvgPoint()
        .crossValue(d => d.population)
        .mainValue(d => d.totalCases)
        .size(d => bubbleSize(d.deathsPerMillion))
        .decorate(selection => {
            selection.enter()
                .attr('fill', d => bubbleColour(d.income))
                .attr('stroke', 'white')
                .append('title')
                .text(d =>
                    `${d.country}:  ` +
                    `${numberFormat(d.casesPerMillion)} cases/M  ` +
                    `${numberFormat(d.deathsPerMillion)} deaths/M`
                );
        });

    const legend = legendColor()
        .scale(bubbleColour)
        .title('Income group')
        .ascending(true)
        .shape('circle')
        .shapeRadius(6);

    const chart = chartCartesian(d3.scaleLog(), d3.scaleLog())
        .xDomain(extentLinear().accessors([d => d.population])(dataPoints))
        .yDomain(extentLinear().accessors([d => d.totalCases])(dataPoints))
        .chartLabel('Covid-19: Reported Cases')
        .xLabel('Population')
        .xTicks(5, tickFormat)
        .yLabel('Total Cases')
        .yTicks(7, tickFormat)
        .yNice()
        .yOrient('left')
        .svgPlotArea(pointSeries)
        .decorate(selection => {
            selection.enter()
                .append('d3fc-svg')
                .classed('legend', true)
                .select('svg')
                .call(legend);
        });

    selection.call(chart);
};

export default fcBubbleChart;
