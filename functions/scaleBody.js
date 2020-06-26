import Matter from 'matter-js';
import SetUpBodies from './class-setup-bodies';

export default function scaleBody( bubble, increase ){
		Matter.Body.scale( bubble.body, 1.2, 1.2 );
		bubble.radius *= 1.2;
		bubble.size += 1;
		Matter.Composite.allBodies( bubble.composite ).forEach( body => {
			if( body.id != 'bubble' ) {
				Matter.Composite.remove( bubble.composite, body );
			}
		} )
		const matterFunctions = new SetUpBodies();
		octagon = matterFunctions.octagon( bubble.radius );
		rects = matterFunctions.makeOctagonRects( bubble.body.position.x, bubble.body.position.y, octagon );
		Matter.Composite.add( bubble.composite, rects );
		/*constraints.forEach( constraint => {
			constraint.length *= 1.2;
		} );*/
	/*} else if (bubble.germs.length + bubble.leuks.length ) {
		Matter.Body.scale( bubble.body, .833333333, .833333333 )
		bubble.radius = 25; 
	}*/


}