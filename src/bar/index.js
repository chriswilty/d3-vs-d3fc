import * as d3 from 'd3';
import { randomGeometricBrownianMotion } from '@d3fc/d3fc-random-data';

import d3BarChart from './d3';
import fcBarChart from './fc';
import d3Code from '!raw-loader!./d3.js';
import fcCode from '!raw-loader!./fc.js';

const generator = randomGeometricBrownianMotion().steps(11);
const createData = () => ({
    targets: [
        { name: 'low', value: 4.5 },
        { name: 'high', value: 7.2}
    ],
    sales: generator(1).map((d, i) => ({
        date: new Date(2019, i + 1, 0), //Last day of preceding month
        value: d + i / 2
    }))
})

export default () => {
    const data = createData();

    d3.select('.d3 > .chart').datum(data).call(d3BarChart);
    d3.select('.fc > .chart').datum(data).call(fcBarChart);
    d3.select('.d3 > .code').text(d3Code);
    d3.select('.fc > .code').text(fcCode);

    const resizeListener = () => d3.select('.d3 > .chart').call(d3BarChart);
    window.addEventListener('resize', resizeListener);

    // Return cleanup function for when chart is discarded.
    return () => {
        window.removeEventListener('resize', resizeListener);
        d3.select('d3fc-group.cartesian-chart').remove();
        d3.select('.d3 > .chart > svg').remove();
    }
};