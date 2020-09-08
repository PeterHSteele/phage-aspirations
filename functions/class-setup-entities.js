import React from 'react';
import constants from '../constants';
import { Bubble } from '../Bubble';
const { CONTROLSHEIGHT, STAGINGHEIGHT, LIGHTBLUE, PURPLE, CONTROLS, BUBBLECOUNT, GERMR, BUBBLE, BUBBLER, GERMS, LEUKS, DARKPURPLE } = constants;
import Rect from '../Rect';
import { Germ } from '../Germ';
import Controls from '../Controls';
import { Body, World, Bodies, Vector, Composite } from 'matter-js';
import StatusModal from '../Modal';

export default class SetUpEntities {
	constructor( width, height, setUpBodies, helpers ){
		Object.assign( this, { width, height, setUpBodies, helpers })
	}

	initGetEntities = ( leuks, germs, entities = {} ) => {
		const { width, height, setUpBodies } = this,
		{ engine, world } 					 = setUpBodies,
		controlsBody 						 = Bodies.rectangle( 0, height - CONTROLSHEIGHT, width, CONTROLSHEIGHT ),
		stagingAreaWidth 					 = .8 * width,
		stagingAreaY 						 = height - CONTROLSHEIGHT - ( STAGINGHEIGHT + 10 );

		const stagingBody = Bodies.rectangle( 
			width/2, 
			stagingAreaY + STAGINGHEIGHT/2, 
			stagingAreaWidth, 
			STAGINGHEIGHT, 
			{ 
				collisionFilter: { 
					group: 2 
				} 
			} 
		);

		return {
						physics: {
							engine,
							world
						},
						draw:{
							newLeuksAndGerms: this.newLeuksAndGerms.bind(this),
						},
						staging:{
							type: 'staging',
							body: stagingBody,
							height: STAGINGHEIGHT,
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
							leuks, 
							germs,
							newLeuks: leuks,
							newGerms: germs,
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

	newLeuksAndGerms( entities, leuks, germs, init = false ){
		const { controls, physics } = entities;
		const { width, height, setUpBodies } = this;
		const staging = {
			//complete:false,
			germs: {
				germs:{},
				x: width/2,
				y: 20,
				r: GERMR,
				bodies: [],
			},
			leuks:{
				leuks:{},
				x: controls.width/2,
				r: GERMR,
				y: height - CONTROLSHEIGHT - 10 - STAGINGHEIGHT/2 - 4,
				bodies: [],
			},
			bubbleCount: controls.bubbleCount,
		}
		let bubbles = {};
		if ( init ){
			bubbles = this.getBubbles( controls.bubbleCount );
			entities.controls.bubbleState = this.helpers.getBubbleState( bubbles ); 
		}
		let cellsToAdd = controls.newLeuks + controls.newGerms;
		let availableIds = [];
		let highestCellId = controls.cellRange[1],
			lowestCellId = controls.cellRange[0];
	
		for ( let i = lowestCellId; i <= highestCellId; i++ ){
			if ( ! entities[i] ){
				availableIds.push(i);
				cellsToAdd--;
			}
			if ( ! cellsToAdd ){
				break;
			}
		}
	
		if ( cellsToAdd ){
			while ( cellsToAdd ){
				highestCellId++;
				availableIds.push( highestCellId );
				cellsToAdd--;
			}
		}
	
		let newCells = {};
	
		availableIds.forEach( ( e, i ) => {
			let type = i < controls.newGerms ? GERMS : LEUKS;
			let { x, y, r, bodies } = staging[type]; 
			let mCell = Bodies.circle( x, y, r, {
				collisionFilter: setUpBodies.getOuterCellFilter(),
			});
			World.add( physics.world, mCell);
			newCells[e] = { 
				pos: [y, x],
				radius: r,
				body: mCell,
				active: false,
				destination: [],
				type: type.slice(0,4),
				bubble: -1,
				background: type == GERMS ? DARKPURPLE : LIGHTBLUE,
				flag: true,
				moves: 0,
				freeToMove: true,
				renderer: <Germ />
			}
		});
		controls.cellRange[1] = highestCellId;
		return {...entities,...newCells,...bubbles}
	
	}

	getBubbles( bubbleCount, bubbles = {} ){
		let mBubbles= [];
			new Array( bubbleCount ).fill(false).map((e,i)=>i).forEach((e,i)=>{
					const setup = this.setUpBodies,
						  mComposite = setup.matterBubble( i );
	
					mBubbles.push( mComposite );
					
					bubbles[e] = {
						size: 0,
						radius: BUBBLER,
						body: Composite.get( mBubbles[i], BUBBLE, 'body' ),
						composite: mBubbles[i],
						flashFrames: {
							time: 0,
							colors:[],
						},
						border: PURPLE,
						dest: false,
						start: false,
						germs: [],
						leuks: [],
						type:BUBBLE,
						renderer: <Bubble />
					}
	
					World.add( this.setUpBodies.world, mComposite )
			})
		return bubbles;
	}

	getGameOverEntities( gameOverFn, color = MIDNIGHTBLUE, radius = width/30, engine, world ){
		World.clear( world, false, true );
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