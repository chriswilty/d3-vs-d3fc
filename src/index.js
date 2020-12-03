import * as d3 from 'd3';

import drawBars from 'src/bar';
import drawBubbles from 'src/bubble';

// TODO: add navigation between charts?
const clickHandler = drawFunction => event => {
    cleanupFunction && cleanupFunction();

    d3.selectAll('button').attr('disabled', null);

    event.target.setAttribute('disabled', '');
    cleanupFunction = drawFunction();
};

let cleanupFunction = drawBars();

d3.select('button.bars').attr('disabled', true).on('click', clickHandler(drawBars));
d3.select('button.bubbles').on('click', clickHandler(drawBubbles));
