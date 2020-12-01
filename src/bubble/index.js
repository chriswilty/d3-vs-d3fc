import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import { chartCartesian } from '@d3fc/d3fc-chart';
import { extentLinear } from '@d3fc/d3fc-extent';
import { seriesSvgPoint } from '@d3fc/d3fc-series';
import '@d3fc/d3fc-element';

import fcCode from '!raw-loader!./index.js';
import data from './corona.json';

/*
 *  Covid data from Worldometers: https://bit.ly/2Jj4H90
 *  Income data from World Bank: https://bit.ly/33ux2zS
 */
data.forEach(country => {
    Object.keys(country).filter(prop => !['country', 'income'].includes(prop)).forEach(prop => {
        const value = country[prop].replace(/,/g, '');
        country[prop] = (prop.endsWith('PerMillion') ? parseFloat : parseInt)(value) || 0;
    });
    country.deathsPerMillion = country.totalDeaths / (country.population / 1_000_000);
});

export default () => {
    const numberFormat = d3.format(',.3d');

    const bubbleColour = d3.scaleOrdinal()
        .domain(['low', 'lower-middle', 'upper-middle', 'high'])
        .range(['#963', '#c99', '#9c9', '#0c0']);

    const bubbleSize = d3.scaleLinear()
        .range([10,500])
        .domain(extentLinear().accessors([d => d.deathsPerMillion])(data));

    const pointSeries = seriesSvgPoint()
        .crossValue(d => d.population)
        .mainValue(d => d.totalCases)
        .size(d => bubbleSize(d.deathsPerMillion))
        .decorate(selection => {
            selection.enter()
                .attr('fill', d => bubbleColour(d.income))
                .attr('stroke', d => bubbleColour(d.income))
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
        .xDomain(extentLinear().accessors([d => d.population])(data))
        .yDomain(extentLinear().accessors([d => d.totalCases])(data))
        .chartLabel('Covid-19: Reported Cases')
        .xLabel('Population')
        .xTicks(5, d3.format('~s'))
        .yLabel('Total Cases')
        .yTicks(7, d3.format('~s'))
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

    d3.select('.fc > .chart').datum(data).call(chart);
    d3.select('.fc > .code').text(fcCode);

    return () => {
        d3.select('d3fc-group.cartesian-chart').remove();
    }
}