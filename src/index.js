import * as d3 from 'd3';
import { randomGeometricBrownianMotion } from '@d3fc/d3fc-random-data';

import d3BarChart from 'src/d3/bar';
import fcBarChart from 'src/fc/bar';

import 'src/styles.css';

const generator = randomGeometricBrownianMotion().steps(11);
const data = {
    targets: [{
        name: 'low',
        value: 4.5
    }, {
        name: 'high',
        value: 7.2
    }],
    sales: generator(1).map((d, i) => ({
        date: new Date(2019, i + 1, 0), //Last day of preceding month
        value: d + i / 2
    }))
};

d3.select('.d3').datum(data).call(d3BarChart);
d3.select('.fc').datum(data).call(fcBarChart);