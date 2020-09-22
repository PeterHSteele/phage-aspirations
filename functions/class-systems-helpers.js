/*
Functions called by Systems functions, which are themselves called each frame.
Some of these are called each frame as well, but some are utilities called only
under specific conditions.
*/

import { Body, Bodies, Composite, Detector, Vector, World } from 'matter-js';
import constants from '../constants';
import placeGerms from '../placeGerms';
import SetUpEntities from './class-setup-entities';
const { SIZES, LEUK, GRAYGREEN, BLUE, ORANGE, BUBBLE, STOP, LIGHTMAUVE, LIGHTBLUE } = constants;

export default class SystemsHelpers{
	constructor( setUpBodies ){
		this.matterFunctions = setUpBodies
		this.animiationColors = [ 
			[ GRAYGREEN, LIGHTBLUE, LIGHTMAUVE ],
			[ LIGHTMAUVE, GRAYGREEN, LIGHTBLUE ],
			[ LIGHTBLUE, LIGHTMAUVE, GRAYGREEN ]
		];
	}

	slope = ( [x1,y1], [x2,y2] ) => {
		return ( y2 - y1 ) / ( x2 - x1 );
	}

	random( max ){
		return Math.random() * max;
	}

	randomBool(){
		return Math.random() > .49;
	}

	distance = ( [x1,y1], [x2,y2] ) => {
		return Math.hypot(Math.abs(y2-y1),Math.abs(x2-x1));
	}

	/*
	Selects the next germ to move and sets its destination
	and collisionFilter properties to allow it to do so.

	entities       Object      the game entities
	bubbleKeys     Array       keys for the bubble entities
	allocations    Object      Instructions for how many germs should go to each bubble. Takes form of { bubbleKey: int }
	source 	       Array	   the germs eligible to move
	fromBubble	   Bool 	   whether germ is already located in a bubble, in which case its collision filter must be changed.
	*/

	prepareMover( entities, bubbleKeys, allocations, source, fromBubble ){
		let destId = bubbleKeys.find( bubbleKey =>  entities[bubbleKey].germs.length < allocations[bubbleKey] );
		//console.log( destId );
		if ( ! destId ){ /*alert(Object.keys(allocations).reduce((a,b) => allocations[a] + allocations[b], 0 ))*/ alert(Object.keys(allocations).map( key => allocations[key]))}
		let dest = entities[destId];
		//if( !destId)console.log( 'germslength', entities[destId].germs );
		let newMoverId = source[0];
		let newMover = entities[newMoverId]
		newMover.active = true;
		let { x, y } = dest.body.position;
		newMover.destination = [ y , x , destId ];
		this.velocityMove( entities, newMover, newMoverId);
		if (fromBubble){
			newMover.collisionFilter = matterFunctions.getInterBubbleCellFilter();
		}
	}

	velocityMove( es, mover ){
		const { velocity }= mover.body;
		if ( Math.abs( velocity.x ) > .005 || Math.abs( velocity.y ) > .005 ){
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
		if ( bubble.leuks.length + bubble.germs.length === SIZES[bubble.size + 1] ){
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
		bubbleKeys.forEach( e => {
			bubbleState[e] = {
				...entities[e], 
				leuks: entities[e].leuks.slice(), 
				germs: entities[e].germs.slice()
			}
		})
		return bubbleState;
	}

	scaleBody( bubble, increase ){
		Body.scale( bubble.body, 1.2, 1.2 );
		bubble.radius *= 1.2;
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
			if  ( bubble.flashFrames.colors.length == 0  ){
				bubble.flashFrames.time = 0;
				bubble.flashFrames.colors = this.animiationColors[index % 3];
 			} else if ( bubble.flashFrames.time > 150 ) {
 				let last = bubble.flashFrames.colors.pop();
 				bubble.flashFrames.colors.unshift( last );
 				bubble.flashFrames.time=0;
 			} else {
 				bubble.flashFrames.time += time.delta
 			}
	}

	totalLeuksInGame( bubbleState ){
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
				colors:[],
			}
		}
		Composite.remove( entities.physics.world, entities[removed].body );
		delete entities[removed];
	}

	startRealignment( entities, dispatch ){
		const { controls, physics, draw, modal } = entities,
			  bubbleState = this.getBubbleState( entities ),
		 	  leuksInGame = this.totalLeuksInGame( bubbleState );
		
		entities.controls.phase = 'r';

		/*if number of leuks has decreased or increased by 40% today, end today's session.*/
		if ( leuksInGame <= controls.pauseThreshold[0] || leuksInGame >= controls.pauseThreshold[1] ){
			dispatch({ type: STOP })
			controls.saveEntities( entities )
			return entities;
		}

		const newModal = {
			message: 'You get ' + controls.newLeuks + ' new leuks!',
			visible: true
		}

		const newControls = {
			phase: 'r',
			history: controls.history.concat('r'),
			leuksAreAllocated: false,
			bubbleState,
			germAllocations: placeGerms( controls.newGerms, bubbleState )
		}
		
		Object.assign( entities.controls, newControls );
		Object.assign( entities.modal, newModal );
		
		return Object.assign(
			entities,
			draw.newLeuksAndGerms( controls.newLeuks, controls.newGerms, Object.keys(entities) )
		);
	}

	doubleGerms( entities ){
		const germKeys = Object.keys( entities )
			.filter( key =>  entities[key].type === 'germ' )
			.map( key => key * 1),
		
			{ random, randomBool } = this;
		
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