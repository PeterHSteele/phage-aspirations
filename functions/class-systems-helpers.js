/*
Functions called by Systems functions, which are themselves called each frame.
Some of these are called each frame as well, but some are utilities called only
under specific conditions.
*/

import { Body, Bodies, Composite, Detector, Vector, World } from 'matter-js';
import constants from '../constants';
import placeGerms from '../placeGerms';
import SetUpEntities from './class-setup-entities';
import { ListViewComponent } from 'react-native';
const { SIZES, LEUK, GRAYGREEN, BLUE, ORANGE, BUBBLE, STOP, LIGHTMAUVE, LIGHTBLUE, BUBBLESCALEFACTOR } = constants;

export default class SystemsHelpers{
	constructor( setUpBodies ){
		this.matterFunctions = setUpBodies
		this.animationScales = [ 
			[ 0,1,2 ],
			[ 1,2,0 ],
			[ 2,0,1 ] 
		];
	}

	slope = ( [x1,y1], [x2,y2] ) => {
		return ( y2 - y1 ) / ( x2 - x1 );
	}

	static random( max, min = 0 ){
		return min + Math.random() * ( max - min );
	}

	static randomBool(){
		return Math.random() < .5;
	}

	distance = ( [x1,y1], [x2,y2] ) => {
		return Math.hypot(Math.abs(y2-y1),Math.abs(x2-x1));
	}

	/** 
	Selects the next germ to move and sets its destination
	and collisionFilter properties to allow it to do so.

	@param entities       Object      the game entities
	@param bubbleKeys     Array       keys for the bubble entities
	@param allocations    Object      Instructions for how many germs should go to each bubble. Takes form of { bubbleKey: int }
	@param source 	       Array	   the germs eligible to move
	@param fromBubble	   Bool 	   whether germ is already located in a bubble, in which case its collision filter must be changed.
	
	@return void
	*/

	prepareMover( entities, bubbleKeys, allocations, source, fromBubble ){
		let destId = bubbleKeys.find( bubbleKey =>  entities[bubbleKey].germs.length < allocations[bubbleKey] );
		//console.log( destId );
		if ( ! destId ){ /*alert(Object.keys(allocations).reduce((a,b) => allocations[a] + allocations[b], 0 ))*/ alert(Object.keys(allocations).map( key => allocations[key]))}
		let dest = entities[destId];
		//if( !destId)console.log( 'germslength', entities[destId].germs );
		//console.log('source', source);
		let newMoverId = source[0];
		let newMover = entities[newMoverId]
		newMover.active = true;
		let { x, y } = dest.body.position;
		newMover.destination = [ y , x , destId ];
		Body.set(newMover.body, 'collisionFilter', this.matterFunctions.getInterBubbleCellFilter());
		this.velocityMove( entities, newMover, newMoverId);
	}

	velocityMove( es, mover ){
		const { velocity }= mover.body;
		if ( Math.abs( velocity.x ) > .02 || Math.abs( velocity.y ) > .02 ){
			return;
		}

		const [ y, x ] 	   = mover.destination,
			  targetAngle  = Vector.angle( mover.body.position, { x, y} ),
			  { sin, cos } = Math,
			  speed = 10;

		const vector = {
			x: cos( targetAngle ) * speed,
			y: sin( targetAngle ) * speed
		};

		Body.setVelocity( mover.body, vector );
	}

	applyForceMove( es, mover, moverId ){
		const { velocity }= mover.body;
		if ( velocity.x != 0 || velocity.y != 0){
			return;
		}
		let dist = this.distance( [mover.body.position.x, mover.body.position.y], [mover.destination[1], mover.destination[0]] );
		const [ y, x ] 	   = mover.destination,
			  targetAngle  = Vector.angle( mover.body.position, { x, y} ),
			  { sin, cos } = Math,
			  force = .0004;

		const vector = {
			x: cos( targetAngle ) * force,
			y: sin( targetAngle ) * force
		};

		//console.log( vector );

		Body.applyForce( mover.body, mover.body.position, vector );
	}

	updateBubbleContents( mover, moverId, bubble, bubbleId, entities ){
		//set active status to false
		mover.active = false;
		//stop the body
		const { x, y } = mover.body.velocity;
		Body.setVelocity(mover.body,{
			x: x/4,
			y: y/4
		});
		//set collisionFilter to keep it trapped in bubble
		mover.body.collisionFilter = this.matterFunctions.getInnerCellFilter();
		//keep track of where the mover cell is currently located
		const cellType = mover.type + 's';
		if ( mover.bubble > -1 ){
			let inCurrentBubble = entities[mover.bubble][cellType];
			let moverIndex = inCurrentBubble.indexOf( moverId );
			inCurrentBubble.splice( moverIndex, 1);	
		} else {
			entities.controls[cellType]--;
		}
			 
		bubble[cellType].push( moverId );
			  
		mover.bubble = bubbleId;

		//scale body if need be
		//console.log( 'checkresize', bubble.leuks.length + bubble.germs.length, bubble.size);
		if ( bubble.leuks.length + bubble.germs.length === SIZES[bubble.size] ){
			this.scaleBody( bubble, true );
		}
		mover.destination = [];
	}

	getBubbleKeys( entities ){
		return Object.keys( entities ).filter( key => entities[key].type == BUBBLE );
	}

	getBubbleState( entities ){
		let bubbleState = {},
			bubbleKeys = this.getBubbleKeys(entities);
			//console.log('get bubble state', Object.keys(entities).filter(key=>entities[key].type==BUBBLE));
		bubbleKeys.forEach( e => {
			bubbleState[e] = {
				//...entities[e], 
				leuks: entities[e].leuks.slice(), 
				germs: entities[e].germs.slice()
			}
		})
		return bubbleState;
	}

	scaleBody( bubble, increase ){
		Body.scale( bubble.body, BUBBLESCALEFACTOR, BUBBLESCALEFACTOR );
		bubble.radius *= BUBBLESCALEFACTOR;
		bubble.size += 1;
		Composite.allBodies( bubble.composite ).forEach( body => {
			if ( body.id != 'bubble' ) {
				Composite.remove( bubble.composite, body );
			}
		} );
		const octagon = this.matterFunctions.octagon( bubble.radius ),
		rects = this.matterFunctions.makeOctagonRects( bubble.body.position.x, bubble.body.position.y, octagon );
		Composite.add( bubble.composite, rects );
	}

	checkIfLeuksAreAllocated( entities, keys ){
		return ! keys.filter( key => entities[key].type == LEUK ).find( leukKey => entities[leukKey].bubble == -1 );
	}

	animateRings( bubble, time, index ){
			if  ( bubble.flashFrames.scales.length == 0  ){
				bubble.flashFrames.time = 0;
				bubble.flashFrames.scales = this.animationScales[index % 3];
				bubble.flashFrames.isAnimated = true;
				//bubble.flashFrames.scale = index % 3;
 			} else if ( bubble.flashFrames.time > 150 ) {
 				let last = bubble.flashFrames.scales.pop();
 				bubble.flashFrames.scales.unshift( last );
				bubble.flashFrames.time=0;
				bubble.flashFrames.isAnimated = false;
				bubble.flashFrames.scales=[]
				/*bubble.flashFrames.scale++;
				if (bubble.flashFrames.scale===3){
					bubble.flashFrames.scale = 0
				}*/
 			} else {
 				bubble.flashFrames.time += time.delta
 			}
	}

	totalLeuksInGame( bubbleState ){
		//console.log('tlig', Object.keys(bubbleState).map(key => bubbleState[key].leuks));
		return Object.keys( bubbleState ).reduce((a,b)=>a + bubbleState[b].leuks.length, 0)
	}

	/** 
	* removeCell
	* removes a cell killed during battle phase from the board

	@param entities 	Object 		The game entities
	@param bubble	   	Object	 	Bubble entity in which fight is occuring
	@param type			String      type of cell to remove
	@return void
	*/

	removeCell( entities, bubble, type ){
		let removed = bubble[type].pop();
		if ( ! bubble[type].length ){
			bubble.flashFrames = {
				time: 0,
				scales:[],
			}
		}
		if ( ! entities[removed]) console.log('entity to be removed does not exist', removed);
		Composite.remove( entities.physics.world, entities[removed].body );
		delete entities[removed];
	}

	startRealignment( entities, dispatch ){
		const { controls } = entities,
			  bubbleState = this.getBubbleState( entities ),
		 	  leuksInGame = this.totalLeuksInGame( bubbleState );
		
		entities.controls.phase = 'r';

		/*if number of leuks has decreased or increased by 40% today, end today's session.*/
		if ( leuksInGame <= controls.pauseThreshold[0] || leuksInGame >= controls.pauseThreshold[2] ){
			const [modal, newControls, newTransition] = this.prepareGamePauseTransition( controls, leuksInGame );
			Object.assign(entities.modal, modal); 
			Object.assign(entities.controls,newControls);
			Object.assign(entities.transition, newTransition);
			//console.log('tFrames', entities.controls.transitionFrames);
			return entities;
		}

		const newModal = {
			message: 'You get ' + controls.newLeuks + ' new leuks!',
			visible: true, 
			frames: 120
		}

		const newControls = {
			phase: 'r',
			//history: controls.history.concat('r'),
			leuksAreAllocated: false,
			bubbleState,
			germAllocations: placeGerms( controls.newGerms, bubbleState )
		}
		
		Object.assign( entities.controls, newControls );
		Object.assign( entities.modal, newModal );
		
		return Object.assign(
			entities,
			controls.newLeuksAndGerms( controls.newLeuks, controls.newGerms, Object.keys(entities) )
		);
	}

	prepareGamePauseTransition( controls, leuksInGame ){
		const start = controls.pauseThreshold[1],
			  dir = start < leuksInGame ? 'up' : 'down',
			  message = `Leuks have gone ${dir} today, from ${start} to ${leuksInGame}. We\'ll pick this up tomorrow.`;

		const modal = {
			message,
			visible: true,
			frames: 150 
		};

		const newControls = { phase: 't' }

		const newTransition = { transitionFrames: 200 };

		return [modal, newControls, newTransition];
	}

	handleEndOfDay( data, dispatch, eodFn ){
		dispatch({ type: STOP })
		eodFn( data )
	}

	stopGame( entities, dispatch){
		dispatch({ type: STOP, data: entities });
		entities.controls.saveEntities( entities );
	}

	doubleGerms( entities ){
		const germKeys = Object.keys( entities )
			.filter( key =>  entities[key].type === 'germ' )
			.map( key => key * 1),
		
			{ random, randomBool } = this.constructor;
		
		let currentLength = germKeys.length, 
			newEntities = {}
		
		germKeys.forEach( (key,i) => {
			const { x, y } = entities[key].body.position;
			const body = Bodies.circle( x, y, entities[0].radius );
			newEntities[key + currentLength] = SetUpEntities.gameOverGerm( entities[0].background, body, entities[0].radius );
			World.add( entities.physics.world, body )
			
			const xDir = randomBool() ? 1: -1,
			yDir = randomBool() ? 1 : -1,
			xMag = random( .0005 ),
			yMag = random( .0005 ),
			vector = { 
				x: xDir * xMag, 
				y: yDir * yMag
			}
			Body.applyForce( body, body.position, vector )
		})
		entities.gameOver.count += currentLength;
		entities.gameOver.doubleTime = 0;
		return {...entities, ...newEntities };
	}

}