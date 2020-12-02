import * as d3 from 'd3';
import '@d3fc/d3fc-element';

import d3BubbleChart from './d3';
import fcBubbleChart from './fc';
import d3Code from '!raw-loader!./d3.js';
import fcCode from '!raw-loader!./fc.js';
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
data.sort((a,b) => b.deathsPerMillion - a.deathsPerMillion);

export default () => {
    d3.select('.d3 > .chart').datum(data).call(d3BubbleChart);
    d3.select('.fc > .chart').datum(data).call(fcBubbleChart);
    d3.select('.d3 > .code').text(d3Code);
    d3.select('.fc > .code').text(fcCode);
    const resizeListener = () => d3.select('.d3 > .chart').call(d3BubbleChart);
    window.addEventListener('resize', resizeListener);

    return () => {
        window.removeEventListener('resize', resizeListener);
        d3.select('d3fc-group.cartesian-chart').remove();
        d3.select('.d3 > .chart > svg').remove();
    }
}