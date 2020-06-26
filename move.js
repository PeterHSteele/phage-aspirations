import constants from './constants';
import Matter from 'matter-js';
const { GERM, LEUK, SIZES } = constants;
import scaleBody from './functions/scaleBody';
import checkIfLeuksAreAllocated from './functions/checkIfLeuksAreAllocated';
import SetUpBodies from './functions/class-setup-bodies';

const distance = ( [x1,y1], [x2,y2] ) => {
	return Math.hypot(Math.abs(y2-y1),Math.abs(x2-x1));
}

const slope = ( [x1,y1], [x2,y2] ) => {
	return ( y2 - y1 ) / ( x2 - x1 );
}
 
export default function move( es, mover, moverId ){

		let prevConstraint = Matter.Composite.allConstraints( es.physics.world ).find( constraint => constraint.id === moverId );
		
		if ( prevConstraint ){
			Matter.Composite.remove( es.physics.world, prevConstraint );
		}
		let dist = distance( [mover.body.position.x, mover.body.position.y], [mover.destination[1], mover.destination[0]] );
		let vector = slope( [mover.body.position.x, mover.body.position.y], [mover.destination[1], mover.destination[0]] );
		let velocity = 4/Math.abs(vector); 
		
		let nextCoords = mover.body.position.x < mover.destination[1] ? 
			[ mover.body.position.y + (velocity * vector), mover.body.position.x + velocity ] :
			[ mover.body.position.y - (velocity * vector), mover.body.position.x - velocity ];
		let nextDist = distance( [nextCoords[1], nextCoords[0]], [mover.destination[1], mover.destination[0]]);
		//alert( 'dist: ' + dist + ' nextDist: ' +nextDist );

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
			mover.body.collisionFilter = SetUpBodies.getInnerCellFilter();

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
			  //alert(moverId);
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

			/*var bubbleConstraint = Matter.Constraint.create({
				bodyA: mover.body,
				bodyB: bubble.body,
				length: bubble.radius - 5,
				stiffness: .5,
				damping: 0,
				id: moverId
			});
			let constraints = Matter.Composite.allConstraints( es.physics.world );
			if (constraints.length){
				alert(constraints[constraints.length-1].id)
			}*/
			mover.destination = []
			//Matter.World.add(es.physics.world, bubbleConstraint)
			
			es.controls.leuksAreAllocated = checkIfLeuksAreAllocated( es, Object.keys( es ) );
			
		}


}