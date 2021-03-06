import Matter, { Bodies, Body, Bounds, Composite, Detector, Engine, World } from 'matter-js';
import SystemsHelpers from './class-systems-helpers';
import Rect from '../Rect';
import constants from '../constants';
const { BUBBLER, STAGINGHEIGHT, CONTROLSHEIGHT, GERMR } = constants;

export default class SetUpBodies {

	constructor(  height, width ){
		this.engine = Engine.create({ enableSleeping: false});
		this.world = this.engine.world;
		this.world.gravity.y = 0;
		this.height = height;
		this.width = width;
		//this.bubbleCoords = [{x:50,y:100},{x:100,y:150},{x:250, y:400}, {x:200, y:300},{x:100,y:460}];
		this.bubbleCoords=[];
		//this.checkFilters({ group: 2, });
	}

	clearEngine(){
		Engine.clear(this.engine);
	}

	clearWorld(){
		World.clear( this.world );
	}

	checkFilters( toTest ){
		const filters = [this.getContainerFilter(), this.getDetectionFilter(), this.getBubbleFilter(), this.getInnerCellFilter(), this.getOuterCellFilter(), this.getInterBubbleCellFilter]
		filters.forEach( filter => console.log(Detector.canCollide(toTest, filter)));
	}

	getWalls(){
		const options = {
			collisionFilter: { 
				group: 2,
			}, 
			isStatic: true
		},
		walls = {};
		let left, right, top, bottom;

		left = Bodies.rectangle(-1,this.height/2,2,this.height,options );
		right = Bodies.rectangle(this.width+1, this.height/2, 2, this.height, options );
		top = Bodies.rectangle( this.width/2, -1, this.width, 2, options);
		bottom = Bodies.rectangle( this.width/2, this.height+1, this.width, 2, options)
		const bodies = [ top, left, right, bottom ];
		const height = this.height;
		World.add( this.world, bodies );

		walls.left = {
			type: 'bound',
			body: left,
			height: height,
			width: 1,
			renderer: Rect,
		}

		walls.top = {
			type: 'bound',
			body: top,
			height: 1,
			width: this.width,
			renderer: Rect,
		}

		walls.right = {
			type: 'bound',
			body: right,
			height: this.height,
			width: 1,
			renderer: Rect,
		}

		walls.bottom = {
			type: 'bound',
			body: bottom,
			height: 1,
			width: this.width,
			renderer: Rect,
		}

		return walls;
	}

	/**
	 * @method matterCell
	 * 
	 * creates a body representing the cell (leuk or germ) in the physics simulation.
	 * Adds the body to the world and returns a reference to the body.
	 * 
	 * @param {number} x x-coordinate for the leuk or germ
	 * @param {number} y y-coordinate for the leuk or germ
	 * @param {string} location whether the cell is located outside or inside a bubble 
	 * 
	 * @return {object} A reference to the entity's body.
	 */

	matterCell( x, y, outside ){
		const collisionFilter = outside ? this.getOuterCellFilter() : this.getInnerCellFilter();
		const options = { collisionFilter };
		const body = Bodies.circle( x, y, GERMR, options );
		World.add( this.world, body );
		return body;
	}

	/**
	 * creates the physics engine representation of a bubble and adds it to the world
	 * 
	 * @param {number} index the entity key for the bubble
	 * 
	 * @return {object} an object of type Matter.Composite representing the bubble.
	 */

	matterBubble( index, radius, coords ){
		//let bubbleX = 25 + 134*index,//i == 0 ? 20 : Math.trunc( destControlR + Math.random() * ( width - 60 )),
		//bubbleY = 224 + 5 * index;//100 + Math.random() * (height - 2 * bubbleR - stagingHeight - 10 - controlsHeight - 100),
		coords = coords || this.getBubbleCoords( index );
		radius = radius || BUBBLER;
		const { x, y }		  = coords;
		//console.log('bubbleX', bubbleX, 'bY', bubbleY);
		//console.log('coords', coords);
		mBubble = Matter.Bodies.circle( x, y, radius, {
			collisionFilter: this.getBubbleFilter(),
			isStatic: true,
			id: 'bubble'
		});
		const mComposite = Matter.Composite.create(),
			  rectLength = Math.sqrt( 2 ) * this.bubbleR,
			  rectOffset = rectLength/2;

		const octagon = this.octagon( radius );
		/*const left = Bodies.rectangle( bubbleX - .9 * this.bubbleR, bubbleY, 1, rectLength, {
						collisionFilter: this.getContainerFilter(),
						isStatic: true,
						id: 'container' + index
					} ),
			  right = Bodies.rectangle( bubbleX + .9* this.bubbleR, bubbleY, 1, rectLength,{
						collisionFilter: this.getContainerFilter(),
						isStatic: true
					}),
			  top = Bodies.rectangle( bubbleX, bubbleY -.9* this.bubbleR, rectLength, 1,{
						collisionFilter: this.getContainerFilter(),
						isStatic: true
					} ),
			  bottom = Bodies.rectangle( bubbleX, bubbleY + .9*this.bubbleR, rectLength, 1,{
						collisionFilter: this.getContainerFilter(),
						isStatic: true
					} );*/
		rects = this.makeOctagonRects( x, y, octagon );
		//detectorOct = this.makeDetector( bubbleX, bubbleY, octagon )
		Matter.Composite.add( mComposite, [mBubble].concat( rects ) );
		//if ( index == 0) console.log( rects[0] );
		//console.log( Detector.canCollide( this.getContainerFilter(), this.constructor.getInnerCellFilter() ) );
		return mComposite;
	}

	/**
	 * getBubbleCoords
	 * gets an x and y coordinate for a new bubble at the beginning of the game.
	 * 
	 * @param {number} index To generate bubbles, a loop is run X times, generating X bubbles. This is the current iteration in that loop.
	 * 
	 * @return {object} the coordinates in {x,y} form.
	 */

	getBubbleCoords( index ){
		const random = SystemsHelpers.random,
		bubbleCoords = this.bubbleCoords,
		minX = 2 * BUBBLER,
		maxX = this.width - BUBBLER,
		maxY = this.height - CONTROLSHEIGHT - ( STAGINGHEIGHT + 10 ) - ( BUBBLER + 5 ) - 2 * BUBBLER,
		minY = BUBBLER + 50,
		bubbleCircumference = 2 * BUBBLER,
		save = new Array(index);
		
		const getRandomPoint = () => {
			let x = random( maxX, minX ),
				y = random( maxY, minY );
				
			return { 
				pt: { x, y },
				bounds: {
					min: {x: x - bubbleCircumference, y: y - bubbleCircumference}, 
					max: {x: x + bubbleCircumference, y: y + bubbleCircumference}
				}
			}
		}

		const overlaps = ( bounds, pt ) => Bounds.contains( bounds, pt );

		const causesOverlap = ( bounds ) => {
			for ( i = 0; i<bubbleCoords.length; i++ ){
				if ( overlaps( bounds, bubbleCoords[i]) ){
					return true;
				}
			}
			//console.log('bubbleCoords',bubbleCoords);
			return false;
		}

		let randomPoint = getRandomPoint();

		while ( causesOverlap(randomPoint.bounds) ){
			console.log('has overlap' )
			randomPoint = getRandomPoint();
		}

		this.bubbleCoords.push( randomPoint.pt );
		return randomPoint.pt;
	}

	makeDetector( x, y, octagon ){
		const rects = [],
			  opts = {
					collisionFilter: this.getDetectionFilter(),
					isStatic:true
			  }
		for ( var i = 0; i < 8; i++ ){
			rects.push( 
				Bodies.rectangle(
					octagon.xS[i],
					octagon.yS[i],
					1,
					octagon.height,
					opts
				)
			)
			Body.rotate( rects[i], octagon.rotations[i] * -1 );
		} 
		const detector = Matter.Bodies.circle( x, y, 1, {...opts, id: 'detector' } ); 
		Body.setParts( detector, rects );
		return detector;
	}

	makeOctagonRects( x, y, octagon ){
		const rects = [];
		for ( var i = 0; i < 8; i++ ){
			rects.push( 
				Bodies.rectangle(
					x  + octagon.xS[i],
					y  + octagon.yS[i],
					1,
					octagon.height,
					{
						collisionFilter: this.getContainerFilter(),
						isStatic: true,
						id: octagon.ids[i]
					}
				)
			)
			//console.log( 'bubbleR', this.bubbleR * octagon.height )
			Body.rotate( rects[i], octagon.rotations[i] * -1 );
		} 
		/*console.log( 'are we tight?', rects.map( ( e, i, a) => {
			if (i < a.length - 1 ) {
				return Bounds.overlaps( e.bounds, a[i+1].bounds) 
			}}));*/
		//console.log( rects[0].position ); 
		return rects;
	}

	octagon( radius ){
		radius = 1.12 * radius;
		const toRadians = ( deg ) => deg * Math.PI / 180;

		//1:30 - 3
		const farSide = Math.abs( Math.sin( 22.5 * Math.PI/180 ) );
		const nearSide =  Math.sqrt( 1 - Math.pow(farSide, 2) );
		const y1 = -1 * ( Math.sin( 22.5 * Math.PI/180 ) * nearSide );
		const x1 =  Math.sqrt( Math.pow( nearSide, 2 ) - Math.pow( y1, 2 ) );
		const height =farSide * 2 * radius;
		const rotation1 = toRadians( 22.5 );

		//12 - 1:30
		const x2 = -1 * y1;
		const y2 = -1 * x1;
		//10:30 - 12
		const x3 = y1;
		const y3 = -1 * x1;
		//9 - 10:30 
		const x4 = -1 * x1;
		const y4 = y1;
		//7:30 - 9
		const x5 = -1 * x1;
		const y5 = -1 * y1;
		//6-7:30
		const x6 = y1;
		const y6 = x1;
		//4:30 -6
		const x7 = -1 * y1;
		const y7 = x1;
		// 3 - 4:30
		const x8 = x1;
		const y8 = -1 * y1;

		const rotations = new Array(8).fill(22.5).map(( e, index ) => toRadians( e + 45 * index  )),
			  xS = [ x1, x2, x3, x4, x5, x6, x7, x8 ].map( e => e * radius ),
			  yS = [ y1, y2, y3, y4, y5, y6, y7, y8 ].map( e => e * radius ), 
			  ids = [1.5, 12, 10.5, 9, 7.5, 6, 4.5, 3]//name after clock positions where segment starts, going clockwise, ie, segment from 1:30 - 3:00 is id '1.5', 12:00 to 1:30 is '12'
		
		return {
			rotations,
			xS,
			yS,
			height,
			ids
		}

	}

	getBody( composite, id ){
		return Composite.get( composite, id, 'body' );
	}
	/*
	octagon(){
		const toRadians = ( deg ) => deg * Math.PI / 180;

		//1:30 - 3
		const farSide = Math.abs( Math.sin( 22.5 * Math.PI/180 ) );
		const nearSide =  Math.sqrt( 1 - Math.pow(farSide, 2) );
		const y1 = -1 * ( Math.sin( 22.5 * Math.PI/180 ) * nearSide );
		const x1 =  Math.sqrt( Math.pow( nearSide, 2 ) - Math.pow( y1, 2 ) );
		const height =farSide * 2;
		const rotation1 = toRadians( 22.5 );

		//12 - 1:30
		const x2 = -1 * y1;
		const y2 = -1 * x1;
		//10:30 - 12
		const x3 = y1;
		const y3 = -1 * x1;
		//9 - 10:30 
		const x4 = -1 * x1;
		const y4 = y1;
		//7:30 - 9
		const x5 = -1 * x1;
		const y5 = -1 * y1;
		//6-7:30
		const x6 = y1;
		const y6 = x1;
		//4:30 -6
		const x7 = -1 * y1;
		const y7 = x1;
		// 3 - 4:30
		const x8 = x1;
		const y8 = -1 * y1;

		const rotations = new Array(8).fill(22.5).map(( e, index ) => toRadians( e + 45 * index  ));
		const xS = [ x1, x2, x3, x4, x5, x6, x7, x8 ];
		const yS = [ y1, y2, y3, y4, y5, y6, y7, y8 ];
		const heights = [ height, height, height, height, height, height, height, height ];
		const ids = [1.5, 12, 10.5, 9, 7.5, 6, 4.5, 3]//name after clock positions where segment starts, going clockwise, ie, segment from 1:30 - 3:00 is id '1.5', 12:00 to 1:30 is '12'
		return {
			rotations,
			xS,
			yS,
			heights,
			ids
		}

	}
*/
	isInside( bodyA, bodyB ){
		//console.log( 'body check' );
		return ( 
			Bounds.contains( bodyA.bounds, bodyB.bounds.min ) &&
			Bounds.contains( bodyA.bounds, bodyB.bounds.max )
		);
	}

	getDetectionFilter(){
		return{
			group: 5,
			category: 8,
			mask: 8
		}
	}

	getContainerFilter(){
		return {
			group: 3,
			category: 4,
			mask: 2
		}
	}

	getInnerCellFilter(){
		return {
			group: 2,
			category: 2,
			mask: 4
		}
	}

	getOuterCellFilter(){
		return {
			group: 4,
			category: 4,
			mask: 2
		}
	}

	getInterBubbleCellFilter(){
		return {
			group: 5,
			category: 16,
			mask: 16,
		}
	}

	getBubbleFilter(){
		return {
			group: 1,
			category: 1,
			mask: 1
		}
	}
}