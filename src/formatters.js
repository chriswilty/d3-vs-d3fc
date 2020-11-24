import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

const dateFormatter = timeFormat('%b');
const moneyFormatter = format('$.0f');
const annotationFormatter = ({ name, value }) => name + ': ' + format('$.1f')(value) + 'M';
const barColour = targets => d => d.value >= (targets.find(t => t.name === 'low') || {}).value ? '#0c0' : 'inherit';

export {
    dateFormatter,
    moneyFormatter,
    annotationFormatter,
    barColour
}