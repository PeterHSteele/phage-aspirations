//alert('keypress at: '+pageX);

		/*let radius = 4
		let { x, y } = entities[0].body.position;
		center = [
					x + radius, 
					y + radius
				];
		//deltaY = Math.abs(pageY-center[0]);
		//deltaX = Math.abs(pageX-center[1]);
		let distance0 = distance( center, [pageX, pageY] )
		//alert('pageX0: '+pageX+' x: '+x+' pageY: '+pageY + ' y: '+ center[1] );

		x = entities[1].body.position.x;
		y= entities[1].body.position.y;
		center = [
			x + radius, 
			y + radius
		];
		//alert('pageX: '+pageX+' x: '+x+' pageY: '+pageY + ' y: '+ center[1] );
		//deltaY = Math.abs(pageY-center[0]);
		//deltaX = Math.abs(pageX-center[1]);
		let distance1 = distance( center, [pageX,pageY])
		alert('distance0: '+distance0+ ' distance1: ' + distance1 ) ;

		closestEntity = distance0< distance1 ? 0 : 1;
*/

//alert(distance);
				//alert('px: '+ pageX + ' pY: ' +pageY + ' x: '+ x + ' y: ' + y);
				//alert(entities[entity].status)

//alert(closestEntity);
		//alert(entities[closestEntity.body);
		//alert(entities[closestEntity].body.position.x);

		 /*0: { pos: [280, 200], radius: 25, dest: true, germs: 0, renderer: <Bubble />},
			        1: { 
			        	pos: [400, 20], 
			        	radius: germR, 
			        	background: 'midnightblue', 
			        	active: false, 
			        	flag: true,
			        	renderer: <Germ />},
			        3: { pos: [width/2, 20], radius:5,body: germ, background:'midnightblue', active:false,flag:true,renderer:<Germ/>},
			        1: { pos: [400, 280], radius: 25, renderer: <Bubble />},*/

			      /* 0: {
				        	pos: [20, mGerm1X],
							radius: germR,
							body: mGerm1,
							active: false,
							background: 'midnightblue',
							flag: true,
							status: 'germ',
							renderer: <Germ />
						},
					1: {
						pos: [20, mGerm2X],
							radius: germR,
							body: mGerm2,
							active: false,
							background: 'lightblue',
							flag: true,
							status: 'germ',
							renderer: <Germ />
					}*/

availableIds.slice( 0, staging.germs.count ).forEach( e => {
		let germX = width/2
		let mGerm = Matter.Bodies.circle( germX, staging.germs.y, staging.germs.r, {
			collisionFilter:{
				group: 1
			},
		});
		Matter.World.add( physics.world, mGerm);
		germs[e] = { 
			pos: [germY, germX],
			radius: germR,
			body: mGerm,
			active: false,
			type: GERM,
			bubble: -1,
			background: MIDNIGHTBLUE,
			flag: true,
			moves: 0,
			freeToMove: true,
			renderer: <Germ />
		}
	});

	availableIds.slice( staging.leuks.count ).forEach( e => {
		let leukX = width/2;
		let mLeuk = Matter.Bodies.circle( leukX, staging.leuks.y, staging.leuks.r, {
			collisionFilter:{
				group: 1
			}
		} );
		Matter.World.add(physics.world, mLeuk);
		leuks[e] = {
			pos: [leukY, leukX ],
			radius: staging.leuks.r,
			body: mLeuk,
			active: false,
			type: LEUK,
			bubble: -1,
			moves: 0,
			background: LIGHTGREEN,
			freeToMove: true,
			renderer: <Germ />
		}
	})
	*/

const doubleGameOverBalls( n, entities, color ){

	new Array( n ).fill(false).forEach((e,i)=>{

		let balls = {}

		const body = Matter.Circle.create( entities[n].body.position.x, entities[n].body.position.y, 20, {
			collisionFilter: {
				group: 1
			}
		});

		balls[ i + n ] = {
			background: color,
			body: body,
			radius: 20,
			renderer: Germ
		}

		Matter.World.add( world, body );
		return balls;

	})

}

{
					physics: {
						engine: engine,
						world: world
					},
			        ...bubbles,
			        ...germs,
			        ...leuks,
			        ...destControls,
			        controls: { 
			        	cellRange: [ 2 * bubbleCount, 2 * bubbleCount + germCount + leukCount - 1 ],
			        	leuks: leukCount, 
			        	germs: germCount,
			        	newLeuks: this.props.score,
			        	newGerms: 3,
			        	width: width,
			        	phase: 'p',
			        	history: ['p'],
			        	nextLeuks: 3,
			        	startRealignment,
			        	gameOver: false,
			        	handlePress: this.handleFinishAlignment,
			        	renderer: <Controls /> 
			        },
			        draw:{
			        	newLeuksAndGerms
			        },
			        modal: {
			        	message: 'You get ' + leukCount + ' leuks!' ,
			        	visible: false,
			        	frames: 0,
			        	renderer: <StatusModal />
			        }
			    }

//if (Math.random()* 1000 <5){alert(entities.controls.leuks)}
			/*if ( ! entities.controls.leuks > 0 ){
				Object.keys( entities )
				.filter( key => {
					const { type } = entities[key];
					return type == GERM || type == LEUK;
				})
				.forEach( key => entities[key].freeToMove = false );
			}*/

Fight handlegameover
/*if ( ! endGame.time ){
			endGame.time = time.current;
			return entities;
		} else if ( time.current - endGame.time > 3000){
			return !bubblesWithGerms.length ? 
			{...entities, ...endGame.endOfGame( entities, 'win' )} : 
			{...entities, ...endGame.endOfGame( entities, 'lose' )}; 
		} else {
			return entities;
		}*/

Fight handle phase change
/*keys.filter( key => entities[key].type === 'germ' || entities[key].type === 'leuk' ).forEach( cell => {
			entities[cell].freeToMove = true;
		} )*/

/*
	handleSubmitPress( leuks ){

		const { refs } = this;
		let entities = this.state.entities;
		let filtered = Object.keys( entities ).filter( key => entities[key].type === LEUK );
	
		for ( let i = 0; i < leuks ; i++){
			entities[filtered[i]].active=true
		}
		Matter.Composite.clear( entities.physics.world, false, true );
		refs.engine.swap(entities)
		this.setState({
			bubbleControl:{
				visible: false
			}
		})
	}
*/

<BubbleControl
				style={styles.bubbleControl}
				visible={this.state.bubbleControl.visible}
				handleSubmitPress={this.handleSubmitPress}
				></BubbleControl>

/*let germKeys = keys.filter( key => entities[key].type === GERM );
		if (! germAllocations){
			let bubbleKeys = keys.filter( key => entities[key].type === BUBBLE );
			let bubbleCount = bubbleKeys.length;
			let totalGerms = germKeys.length;
			let perBubble = Math.floor(totalGerms/bubbleCount)
			remainder = totalGerms % bubbleCount;
			es.controls.germAllocations = new Array( bubbleCount ).fill( perBubble );
		
		let destId = germs.find
		
		
		
	

	let allocations = []
	let allocationIndex = 0
	while ( remainder ){
		allocations[allocationIndex]++;
		allocationsIndex++;
		remainder--;
	}

	allocations.forEach( allocation => {
		let currentKey
		while (allocation>0){
			currentGerm = germs.find( key => ! entities[key].destination.length );
			entities[currentKey]
		}
	})

	bubbleKeys./*map( bubbleKey => entities[bubbleKey] ).forEach(key => {
		for ( let i = 0; i < allocation; i++){
			entities = move( entities, entities[bubbleKey], bubbleKey, GERM )
		}
	})
	}*/

/*var bubbleConstraint = Matter.Constraint.create({
				bodyA: mover.body,
				bodyB: bubble.body,
				length: bubble.radius - 5,
				stiffness: .5,
				damping: 0,
				id: moverId
			});
			let constraints = Matter.Composite.allConstraints( es.physics.world );
			*/

let prevConstraint = Matter.Composite.allConstraints( es.physics.world ).find( constraint => constraint.id === moverId );
		
		if ( prevConstraint ){
			Matter.Composite.remove( es.physics.world, prevConstraint );
		}

/*constraints.forEach( constraint => {
			constraint.length *= 1.2;
		} );*/
	/*} else if (bubble.germs.length + bubble.leuks.length ) {
		Matter.Body.scale( bubble.body, .833333333, .833333333 )
		bubble.radius = 25; 
	}*/

