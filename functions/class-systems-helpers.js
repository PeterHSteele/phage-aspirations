/*
Functions called by Systems functions, which are themselves called each frame.
Some of these are called each frame as well, but some are utilities called only
under specific conditions.
*/

import { Body, Composite, Detector, Vector } from 'matter-js'
import constants from '../constants';
const { SIZES, LEUK, GRAYGREEN, BLUE, ORANGE } = constants;

export default class SystemsHelpers{
	constructor( setUpBodies ){
		this.matterFunctions = setUpBodies
		this.animiationColors = [ 
			[ GRAYGREEN, BLUE, ORANGE ],
			[ ORANGE, GRAYGREEN, BLUE ],
			[ BLUE, ORANGE, GRAYGREEN ]
		];
	}

	slope = ( [x1,y1], [x2,y2] ) => {
		return ( y2 - y1 ) / ( x2 - x1 );
	}

	distance = ( [x1,y1], [x2,y2] ) => {
		return Math.hypot(Math.abs(y2-y1),Math.abs(x2-x1));
	}

	move( es, mover, moverId ){
		
		let dist = this.distance( [mover.body.position.x, mover.body.position.y], [mover.destination[1], mover.destination[0]] );
		let vector = this.slope( [mover.body.position.x, mover.body.position.y], [mover.destination[1], mover.destination[0]] );
		let velocity = 4/Math.abs(vector); 
		
		let nextCoords = mover.body.position.x < mover.destination[1] ? 
			[ mover.body.position.y + (velocity * vector), mover.body.position.x + velocity ] :
			[ mover.body.position.y - (velocity * vector), mover.body.position.x - velocity ];
		let nextDist = this.distance( [nextCoords[1], nextCoords[0]], [mover.destination[1], mover.destination[0]]);

		if ( dist > es[0].radius ){
			Matter.Body.setPosition( mover.body,{
				x: nextCoords[1],
				y: nextCoords[0]
			})
        
		}
		else {
			Matter.Body.applyForce( mover.body, mover.body.position, {
				x: nextCoords[1] > mover.body.position.x ? .0001 : -.0001,
				y: nextCoords[0] > mover.body.position.y ? .0001 : -.0001,
			})
			//mover.body.collisionFilter = SetUpBodies.getInnerCellFilter();

			/*Matter.Body.setPosition(mover.body, {
				x: mover.destination[1],
				y: mover.destination[0]
			});*/
			/*Matter.Body.setVelocity( mover.body, {
				x: 0,
				y: 0
			})*/
			mover.active = false;
			
			//mover.freeToMove = false;

			const destinationId=mover.destination[2];
			const bubble = es[destinationId];
			Matter.Composite.add( bubble.composite, mover.body )

			const updateBubbleContents = ( cellType ) => {
			  if ( mover.bubble > -1 ){
			  	let inCurrentBubble = es[mover.bubble][cellType];
			  	let moverIndex = inCurrentBubble.indexOf( moverId );
			  	inCurrentBubble.splice( moverIndex, 1);
			
			  } else {
			  	 es.controls[cellType]--;
			  }
			 
			  bubble[cellType].push( moverId );
			  
			  mover.bubble = destinationId;
			  //scale body if need be
			  if ( bubble.leuks.length + bubble.germs.length === SIZES[bubble.size + 1] ){
				let constraints = Matter.Composite.allConstraints( es.physics.world ).filter( constraint => {
					return bubble.leuks.indexOf( constraint ) > -1 || bubble.germs.indexOf( constraint ) > -1;
				})
			  	scaleBody( bubble, true, constraints );
			  }
			}

			updateBubbleContents( mover.type + 's' );

			if ( es.controls.phase == 'p' && es.controls.leuks + es.controls.germs == 0 ){
				es.controls.phase = 'b';
				es.controls.history.push('b')
			}
			
			mover.destination = []
			
			es.controls.leuksAreAllocated = checkIfLeuksAreAllocated( es, Object.keys( es ) );
			
		}
	}

	velocityMove( es, mover ){
		const { velocity }= mover.body;
		if ( Math.abs( velocity.x ) > .002 || Math.abs( velocity.y ) > .002 ){
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

	scaleBody( bubble, increase ){
		Body.scale( bubble.body, 1.2, 1.2 );
		bubble.radius *= 1.2;
		bubble.size += 1;
		Composite.allBodies( bubble.composite ).forEach( body => {
			if ( body.id != 'bubble' ) {
				Composite.remove( bubble.composite, body );
			}
		} )
		octagon = this.matterFunctions.octagon( bubble.radius );
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

}