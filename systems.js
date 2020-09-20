import { Bubble } from './Bubble';
import { Germ } from './Germ';
import React from 'react';
import Matter from 'matter-js';
import move from './move.js';
import placeGerms from './placeGerms.js'
import scaleBody from './functions/scaleBody';
import checkIfLeuksAreAllocated from './functions/checkIfLeuksAreAllocated';
import SetUpBodies from './functions/class-setup-bodies';
import SystemsHelpers from './functions/class-systems-helpers';

import constants from './constants';
const { GERM , GERMS, LEUK, LEUKS, LIGHTGREEN, DESTCONTROL, BUBBLE, WIN, LOSE, BUBBLEPRESS, CONTROLS, STAGING, SIZES } = constants;

const distance = ( [x1,y1], [x2,y2] ) => {
	return Math.hypot(Math.abs(y2-y1),Math.abs(x2-x1));
}

const slope = ( [x1,y1], [x2,y2] ) => {
	return ( y2 - y1 ) / ( x2 - x1 );
}

const matterFunctions = new SetUpBodies();
const helpers = new SystemsHelpers( matterFunctions );


const logTwo = ( x ) => Math.log( x ) / Math.log( 2 );
/*
const modalUpdateStyle = {
	width: 'auto',
	height: 'auto',
	borderRadius: 5,			        
}

const modalGameOverStyle = {
	width: 'auto',
	height: 'auto',
	borderRadius: 0,
	margin: 0
}
*/
const Physics = (entities, { time }) => {
    let engine = entities["physics"].engine;
    Matter.Engine.update(engine, time.delta);
    return entities;
}

export { Physics };

const PressGerm = (entities, { touches, screen, dispatch }) => {
	touches.filter( t => t.type === 'press' ).forEach( t => {
		let { phase } = entities.controls ;
		if ( phase == 'b' || phase == 'c' || entities.modal.visible ){
			return entities;
		}

		let { pageX, pageY } = t.event,
			center,
			props,
			deltaY,
			deltaX,
			eventDistance,
			keys = Object.keys(entities),
			destId = keys.find(key => entities[key].dest ),
			bubbles = keys.filter(key => entities[key].type === BUBBLE /*|| entities[key].type == STAGING*/),
			bubblesAndStaging = bubbles.slice(),
			currentDestKey = bubbles.find( bubble => entities[bubble].dest );
				
		bubblesAndStaging.push( STAGING );
		let currentStartKey = bubblesAndStaging.find( bubble => entities[bubble].start );

		if ( pageY > entities.controls.y ){
			
			if ( ( phase == 'p' || phase == 'r' ) && entities.controls.leuksAreAllocated ){

				
				//Remove destination designation on current destination bubble
					let currentDest = keys.find( key => entities[key].dest )
					let currentStart = keys.find( key => entities[key].start );
					if ( currentDest ) entities[currentDest].dest = false;
					if ( currentStart ) entities[currentStart].start = false;
					entities.controls.phase = 'c';
					entities.controls.history.push('c');
					return entities;
				
			}
		} else if ( pageY > entities.staging.y ){
			if ( bubbles.indexOf( currentStartKey ) > -1 ) entities[currentStartKey].start = false;
			if ( ! currentDestKey ) {
				entities.staging.start = ! entities.staging.start;
			} else {
				entities[currentDestKey].dest = false;
			}
		}

		const destination = keys.find( id => entities[id].dest);
		const active = keys.find( id => entities[id].active );
		const freeToMove = keys.find( id => entities[id].freeToMove )

		let closestEntityId = 0;
		let closest = null;

		let included = [ BUBBLE, CONTROLS ];
		for (let entity in entities){
			if ( included.indexOf(entities[entity].type) != -1 ){
				let radius  = entities[entity].radius;
				let { x, y } = entities[entity].body.position;
				
				center = [
					x + radius, 
					y + radius
				];

				eventDistance = distance(center,[pageX, pageY]);
				
				if (! closest && eventDistance < 50 || eventDistance < closest){
					closest = eventDistance;
					closestEntityId = entity;
				}

			}
		}

		if (! closest )return entities;

		const setDest = ( bubbleArr, startKey ) =>{
			let currentBubbleKey = bubbles.find( bubble => entities[bubble].dest );
			if ( currentBubbleKey ) {
				entities[currentBubbleKey].dest = false;
			}
			/*if target is current dest key, prevent overwriting 
			the user's action to set this bubble's destination property to 
			false (above). If target is current start key, avoid settng the 
			target to also be the destination.
			*/
			if ( currentBubbleKey != closestEntityId && startKey != closestEntityId ) entities[closestEntityId].dest=true;

		}

		//let { type }  = entities[closestEntityId];
		
		
		//if ( type === 'destControl' ){
 		/*if ( phase == 'p' ){
			setDest( bubbles );
		} else {*/
			//alert( 'cSK: ' + currentStartKey );
			
			if ( ! currentStartKey ){
				entities[closestEntityId].start = true;
			} else if ( !currentDestKey && currentStartKey == closestEntityId ){
				//alert('setStart')
				entities[currentStartKey].start=false;
			} else {
				//alert( 'cSK: ' + (currentStartKey).toString() + ' cE-1: ' + (closestEntityId-1).toString() );
				setDest( bubbles, currentStartKey );
			}
		//}
		/*} else if ( type == 'germ' || type == 'leuk' ){
			if ( entities[closestEntityId].freeToMove  && closest < 100 ){
				entities[closestEntityId].active=true
			}
		}*/
		entities = {...entities};
		
		/*Matter.Body.applyForce(entities[closestEntity].body,{
			x:entities[closestEntity].body.position.x,
			y:entities[closestEntity].body.position.y
		},{
			x:0,
			y:.0001
		})*/
		
		
	})

	return entities;
	
}

export { PressGerm };

const Fight = ( entities, { touches, time, dispatch } ) => {
	//if ( Math.random() < .01 ) console.log(entities.controls.allocations);
	//if ( keys.find( key => newEntities[key].active ) || keys.find( key => newEntities[key].freeToMove ) ){
	if ( ! entities.controls || entities.controls.gameOver || entities.controls.phase != 'b' ) {
		return entities;
	}
	//if (Math.random() < .015 ) console.log('right after', entities.controls.germAllocations);
	const keys = Object.keys( entities )
	let { controls, modal, endGame } = entities;

	const bubbles = keys.filter( key => entities[key].type === 'bubble' );
	const bubblesWithGerms = bubbles.filter( key => entities[key].germs.length );
	const bubblesWithLeuks = bubbles.filter( key => entities[key].leuks.length );
	
	if ( ! bubblesWithGerms.length || ! bubblesWithLeuks.length ){
		dispatch({ type: !bubblesWithGerms.length ? WIN : LOSE })
		controls.gameOver = true;
		return entities;
		
	}
	const bubblesWithBoth = bubblesWithGerms.filter( e => bubblesWithLeuks.indexOf(e) > -1 );

	if (! bubblesWithBoth.length){
		return helpers.startRealignment( entities, dispatch );
	}

	bubblesWithBoth.forEach(( bubbleKey, index ) => {
		helpers.animateRings( entities[bubbleKey], time, index )
	})

	bubblesWithBoth.forEach( bubbleKey => {
		let bubble = entities[bubbleKey];
		//alert(bubble);
		const delayCheck = Math.trunc( Math.random() * 100 );
		//alert(delayCheck)
		if ( delayCheck > 1 ){
			return;
		}
		//alert('germs: '+ bubble.germs + ' leuks: ' + bubble.leuks)
		const germPercentage = bubble.germs.length * 100 / ( bubble.germs.length + bubble.leuks.length );
		let unfairnessRating = Math.abs( 50 - germPercentage );
		let threshold;
		if ( unfairnessRating > 1){
			let adjustment = logTwo( unfairnessRating )
			threshold = germPercentage < 50 ? germPercentage + adjustment : germPercentage - adjustment;
		} 
		else{
			threshold = germPercentage;
		}
		
		//pick whether to remove germ or leuk
		const type = Math.round( Math.random() * 100 ) < threshold ? GERMS : LEUKS;
		entities = helpers.removeCell( entities, keys, bubble, type );

	})

	return entities;
} 

export { Fight }

//export { Physics };

const MoveLeuk = ( es, {touches} ) => {
//touches.filter(t=> t.type=== 'press').forEach(press=>{
	let ids = Object.keys(es);
	let destId = ids.find( id => es[id].dest )
	let dest = es[destId];
	let startId = ids.find( id => es[id].start );
	let start = es[startId]; 
	let moverId = ids.find( id => es[id].active );
	let mover = es[moverId];
	let next;
	
	const setDestCoords = ( leuk, destination, id ) => {
		leuk.active=true;

		let destPos = [destination.body.position.y, destination.body.position.x];
		let destCoordY = destPos[0];  
		let destCoordX = destPos[1];

		leuk.destination = [ destCoordY, destCoordX, id ];

	}

	if ( dest && startId && startId != 'staging' && !mover ){
		next = es[ids.find( id =>es[id].type === LEUK && es[id].bubble == startId )];
		if ( next ){
			//Add the collisiong filter that allows the germ to travel through the bubble walls
			next.body.collisionFilter = matterFunctions.getInterBubbleCellFilter();
			//tell the germ where to go
			setDestCoords( next, dest, destId );
		}
	} else if ( dest && !mover ){
		let next = es[ids.find( id =>es[id].type === LEUK && es[id].bubble < 0 )];
		if (! next){
			return es;
		}
		setDestCoords( next, dest, destId );
	} 

	if ( mover ){
		helpers.velocityMove( es, mover, moverId );
	}
	
	return es;
}

export { MoveLeuk }

const DoubleGerms = ( entities, { time } ) => {

	if ( ! entities.gameOver || entities.gameOver.count > 64 ){
		return entities;
	}

	let { count, doubleTime } = entities.gameOver;

	if ( ! doubleTime ){
		return {...entities,gameOver:{...entities.gameOver, doubleTime:time.current}};
	} else if ( time.current - doubleTime > 3000) {
		return {
			...entities,
			gameOver:{ ...entities.gameOver, count: count * 2, doubleTime: time.current },
			...helpers.doubleGerms( entities )
		};
	} else {
		return entities;
	}
}

export { DoubleGerms };

const MoveGerm = ( entities, {touches} ) => {
	if (entities.gameOver){
		return entities;
	}
	const { phase, germAllocations, bubbleState } = entities.controls;
	if ( phase != 'c' ){
		return entities;
	}
	const keys = Object.keys( entities );
	const germs = keys.filter( key => entities[key].type == GERM );
	//return if destination already set
	let moverId = germs.find( germ => entities[germ].active );
	let allocations = germAllocations;
	//console.log('allos',allocations)
	if ( ! Object.keys(allocations).length ) { 
		//alert( 'leuks: ' + entities.controls.bubbleState[0].leuks );
		//console.log('inside the conidtional we shouldnt be inside of');
		allocations = placeGerms( entities.controls.germs, entities.controls.bubbleState );
		entities.controls.germAllocations = allocations; 
	}
	let bubbleKeys = Object.keys( allocations );
	//send new germs first
	let newGermKeys = keys.filter( key => entities[key].type == GERM && entities[key].bubble < 0 )

	if ( newGermKeys.length ){
		helpers.prepareMover( entities, bubbleKeys, allocations, newGermKeys, false );
	} else {
		let overflowBubble = bubbleKeys.find( bubbleKey => entities[bubbleKey].germs.length > allocations[bubbleKey] );
		if ( overflowBubble ){
			helpers.prepareMover( entities, bubbleKeys, allocations, overflowBubble.germs, true );
			/*let destId = bubbleKeys.find( bubbleKey => entities[bubbleKey].germs.length < allocations[bubbleKey] )
			let dest = entities[destId];
			let newMoverId = entities[overflowBubble].germs[0]
			let newMover = entities[newMoverId]

			newMover.active = true;
			let { x, y } = dest.body.position;
			let adjustment = dest.radius - newMover.radius;
			newMover.destination = [ y + adjustment, x + adjustment, destId ];
			newMover.body.collisionFilter = matterFunctions.getInterBubbleCellFilter();
			helpers.velocityMove( entities, newMover, newMoverId );*/
		} else {
		//console.log('right before', entities.controls.germAllocations)
		entities.controls.phase = 'b';
		}
	} 
	
	return entities;
}

export { MoveGerm }

const CheckContainerClose = ( entities ) => {
	if (! entities.controls ){
		return entities;
	}
	const { phase } = entities.controls; 
	if ( phase != 'p' &&  phase != 'c' && phase != 'r' ){
		return entities;
	}
	const keys = Object.keys( entities ),
		  activeKey = keys.find( key => entities[key].active );
	if ( ! activeKey ){
		return entities;
	}
	const active = entities[activeKey];
	const destinationId = active.destination[2],
		  destination 	= entities[destinationId];

	if ( matterFunctions.isInside( destination.body, active.body ) ){
		helpers.updateBubbleContents( active, activeKey, destination, destinationId, entities );
		entities.controls.leuksAreAllocated = helpers.checkIfLeuksAreAllocated( entities, keys );
	} 

	return entities;
}

export { CheckContainerClose };

const ToggleModal = ( entities ) => {
	let { modal } = entities;

	if ( ! modal || ! modal.visible){
		return entities;
	}
		if ( modal.frames < 80 ){
			modal.frames++
		} else {
			modal.frames = 0;
			modal.visible = false
		}

	return entities;
}

export { ToggleModal }