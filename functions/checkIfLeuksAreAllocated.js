import constants from '../constants.js';
const { LEUK } = constants;

export default function checkIfLeuksAreAllocated( entities, keys ){
	return ! keys.filter( key => entities[key].type == LEUK ).find( leukKey => entities[leukKey].bubble == -1 );
}