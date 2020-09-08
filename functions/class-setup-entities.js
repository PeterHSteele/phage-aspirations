import React from 'react';
import constants from '../constants';
const { CONTROLSHEIGHT, STAGINGHEIGHT, PURPLE, CONTROLS, BUBBLECOUNT } = constants;
import Rect from '../Rect';
import Controls from '../Controls';
import { Body, World, Bodies, Vector } from 'matter-js';
import StatusModal from '../Modal';

export default class SetUpEntities {
	constructor( width, height, engine, world, setUpBodies ){
		Object.assign( this, { width, height, engine, world, setUpBodies })
	}

	initGetEntities = ( leuks, germs, entities = {} ) => {
		const { width, height, engine, world, setUpBodies } = this;
		const controlsBody = Bodies.rectangle( 0, height - CONTROLSHEIGHT, width, CONTROLSHEIGHT );
		
		const stagingAreaHeight = STAGINGHEIGHT,
			stagingAreaWidth = .8 * width,
			stagingAreaY = height - CONTROLSHEIGHT - ( stagingAreaHeight + 10 );

		const stagingBody = Bodies.rectangle( width/2, stagingAreaY + stagingAreaHeight/2, stagingAreaWidth, stagingAreaHeight, { collisionFilter: { group: 2 } } );

		return {
						physics: {
							engine: engine,
							world: world
						},
						staging:{
							type: 'staging',
							body: stagingBody,
							height: stagingAreaHeight,
							width: stagingAreaWidth,
							offset: { x: 0, y: 0 },
							y: stagingAreaY,
							radius: 0,
							start: false,
							color: PURPLE,
							renderer: <Rect />
						},
						controls: { 
							cellRange: [ BUBBLECOUNT, BUBBLECOUNT + germs + leuks - 1 ],
							type: CONTROLS,
							body: controlsBody,
							width: width,
							y: height - CONTROLSHEIGHT,
							height: CONTROLSHEIGHT,
							leuks: leuks, 
							germs: germs,
							bubbleState: {},
							newLeuks: leuks,
							newGerms: germs,
							germAllocations:{},
							bubbleCount: BUBBLECOUNT,
							leuksAreAllocated: false,
							width,
							phase: 'p',
							history: ['p'],
							gameOver: false,
							renderer: <Controls /> 
						},
						modal: {
							message: 'You get ' + leuks + ' leuks!' ,
							visible: false,
							frames: 0,
							renderer: <StatusModal />
						},
						...setUpBodies.getWalls()		
		}
	}

	getGameOverEntities( gameOverFn, color = MIDNIGHTBLUE, radius = width/30, engine, world ){
		Matter.World.clear( world, false, true );
		let newEntities = {
			physics:{
				engine, 
				world
			}
		}

		let options = {collisionFilter: { group: 1}, isStatic: true};
		
		const rect = Matter.Bodies.rectangle( width/4, height/4, width/2, height/2, options)

		rect.render.strokeStyle="#ff4500"
		rect.render.lineWidth=4

		newEntities.gameOver =  {
			handlePress: gameOverFn,
			radius,
			doubleTime: null,
			width: width/2,
			height: height/2,
			count: 2,
			message:'game over',
			body: rect,
			renderer: GameOver,
			offset: Vector.sub(rect.bounds.min, rect.position)
		}

		let left, right, top, bottom;

		left = Bodies.rectangle(-1,0,1,height,options);
		right = Bodies.rectangle(width, 0,1, height, options);
		top = Bodies.rectangle( 0, -1, width, 1, options);
		bottom = Bodies.rectangle(0,height, width, 1, options)

		newEntities.left = {
			type: 'bound',
			radius,
			body: left,
			height: height,
			width: 1,
			color: 'purple',
			renderer: Rect,
			offset: Vector.sub(left.bounds.min, left.position)
		}
		newEntities.top = {
			type: 'bound',
			radius,
			body: top,
			height: 1,
			width: width,
			color: '#ff4500',
			renderer: Rect,
			offset: Vector.sub(top.bounds.min, top.position)
		}
		newEntities.right = {
			type: 'bound',
			radius,
			body: right,
			height: height,
			width: 1,
			color: '#ff4500',
			renderer: Rect,
			offset: Vector.sub(right.bounds.min, right.position)
		}

		newEntities.bottom = {
			type: 'bound',
			radius,
			body: right,
			height: 1,
			width: width,
			color: '',
			renderer: Rect,
			offset: Vector.sub(bottom.bounds.min, bottom.position)
		}

		let bodies = [rect, left, right, top, bottom];

		bodies.forEach(body=>{
			let offset = Vector.sub(body.bounds.min, body.position)
			Body.setPosition(body, { x: body.position.x - offset.x - radius, y: body.position.y - offset.y-radius});
			World.add( world, body );
		})

		new Array( 2 ).fill(false).forEach((e,i)=>{
			let x = Math.random() * width - radius,
			//y = i == 0 ? .125 * height - radius : .875 * height - radius ;
			y = ( .125 * height ) + ( .75 * height * i ) - radius;

			let body = Bodies.circle( x, y, radius, {
				collisionFilter:{
					group: 1,
				},
				render:{
					lineWidth: 2
				}
			})

			bodies.push( body );
			World.add( world, body ); 

			newEntities[i] = {
				background: color,
				body: body,
				radius,
				renderer: Germ 
			}

		})

		return newEntities;
	}

}