import * as d3 from 'd3';

const dateFormatter = d3.timeFormat('%b');
const moneyFormatter = d3.format('$.0f');
const annotationFormatter = ({ name, value }) => name + ': ' + d3.format('$.1f')(value) + 'M';
const barColour = targets => d => (d.value >= (targets.find(t => t.name === 'low') || {}).value ? '#0c0' : 'inherit');

export {
    dateFormatter,
    moneyFormatter,
    annotationFormatter,
    barColour
}