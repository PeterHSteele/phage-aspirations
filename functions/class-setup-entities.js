import React from 'react';
import constants from '../constants';
import { Bubble } from '../Bubble';
const { CONTROLSHEIGHT, STAGINGHEIGHT, GRAYGREEN, LIGHTBLUE, PURPLE, CONTROLS, BUBBLECOUNT, GERMR, BUBBLE, BUBBLER, GERMS, LEUKS, DARKPURPLE } = constants;
import Rect from '../Rect';
import { Germ } from '../Germ';
import Controls from '../Controls';
import Matter, { Body, World, Bodies, Vector, Composite } from 'matter-js';
import StatusModal from '../Modal';
import GameOver from '../GameOver';

export default class SetUpEntities {
	constructor( width, height, setUpBodies, helpers ){
		Object.assign( this, { width, height, setUpBodies, helpers })
	}

	initGetEntities( leuks, germs, saveEntities, entities = {} ){
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
							germAllocations:{},
							bubbleCount: BUBBLECOUNT,
							leuksAreAllocated: false,
							width,
							phase: 'p',
							history: ['p'],
							gameOver: false,
							saveEntities: ( obj ) => saveEntities(obj),
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
				x: width/2,
				r: GERMR,
				y: height - CONTROLSHEIGHT - 10 - STAGINGHEIGHT/2 - 4,
				bodies: [],
			},
			bubbleCount: BUBBLECOUNT,
		}
		let bubbles = {};
		if ( init ){
			bubbles = this.getBubbles( BUBBLECOUNT );
			entities.controls.bubbleState = this.helpers.getBubbleState( bubbles ); 
		}
		let cellsToAdd = leuks + germs;
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
		//if ( ! init ) console.log( 'availableIds', availableIds );
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

	refreshControls( entities, leuks, germs ){
		entities.controls.germs = germs;
		entities.controls.leuks = leuks;
		const bubbleState = this.helpers.getBubbleState( entities );
		entities.controls.bubbleState = bubbleState;
		entities.controls.germAllocations = this.placeGerms( germs, bubbleState );
		return entities;
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
						//active: false,
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

	getGameOverEntities( gameOverFn, color = MIDNIGHTBLUE ){
		const { width, height, setUpBodies } = this,
		{ engine, world}  = setUpBodies, 
		radius = width/30;
		
		Matter.World.clear( world, false, true );
		let newEntities = {
			physics:{
				engine, 
				world
			}
		}

		let options = {collisionFilter: { group: 1}, isStatic: true};
		
		const rect = Matter.Bodies.rectangle( width/2, height/2, width/2, height/2, options)

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
		}

		let left, right, top, bottom;

		left = Matter.Bodies.rectangle(-1,height/2,2,height,options);
		right = Matter.Bodies.rectangle(width+1, height/2,2, height, options);
		top = Matter.Bodies.rectangle( width/2, -1, width, 2, options);
		bottom = Matter.Bodies.rectangle( width/2, height + 1, width, 2, options)

		newEntities.left = {
			type: 'bound',
			radius,
			body: left,
			height: height,
			width: 1,
			color: 'purple',
			renderer: Rect,
		}
		newEntities.top = {
			type: 'bound',
			radius,
			body: top,
			height: 1,
			width: width,
			color: '#ff4500',
			renderer: Rect,
		}
		newEntities.right = {
			type: 'bound',
			radius,
			body: right,
			height: height,
			width: 1,
			color: '#ff4500',
			renderer: Rect,
		}

		newEntities.bottom = {
			type: 'bound',
			radius,
			body: right,
			height: 1,
			width: width,
			color: '',
			renderer: Rect,
		}

		let bodies = [rect, left, right, top, bottom];

		bodies.forEach(body=>{
			Matter.World.add( world, body );
		})

			

		new Array( 2 ).fill(false).forEach((e,i)=>{

			let x = Math.random() * width - radius,
			//y = i == 0 ? .125 * height - radius : .875 * height - radius ;
			y = ( .125 * height ) + ( .75 * height * i ) - radius;

			let body = Bodies.circle( x, y, radius, {
				collisionFilter:{
					group: 1,
				}
			})

			bodies.push( body );
			World.add( world, body ); 

			newEntities[i] = this.constructor.gameOverGerm( color, body, radius);

		})
		
		return newEntities;
	}

	static gameOverGerm( background, body, radius ){
		return { background, body, radius, renderer: Germ, type: 'germ' };
	}

	placeGerms ( newGerms, bubbleState ) {
		const random = ( v1, v2, v3 ) => v1 + Math.random() * ( v2 - v1 ) > v3;
		
		function getTotal( type ){
			let keys = Object.keys(bubbleState);
			//alert(bubbleState[0].germs)
			let lists = keys.map( key=>bubbleState[key][type] )
			let counts = lists.map( list => list.length)
			if ( type == LEUKS ){
				//alert(counts);
			}
			return Object.keys(bubbleState)
						.map( bubbleKey => bubbleState[bubbleKey][type].length )
						.reduce(( totalCount, nextBubbleCount )  => totalCount + nextBubbleCount, 0  );
		}
		const germsInBubbles = getTotal( GERMS )
		const totalGerms = newGerms + germsInBubbles;
		const leuksInBubbles = getTotal( LEUKS );
		const totalCells = germsInBubbles + leuksInBubbles;
		const overallDiff = germsInBubbles -leuksInBubbles;
		const germPercent = germsInBubbles / totalCells;
		const diffVsTotal = Math.abs( overallDiff / totalCells );
		const bubbleKeys = Object.keys(bubbleState);
		const baseline = Math.floor( totalGerms  / bubbleKeys.length )
		//const remainder = totalGerms % bubbleKeys.length;
		const diffs = bubbleKeys.map( key => bubbleState[key].germs.length - bubbleState[key].leuks.length );
		const best = Math.max(...diffs)
		const worst = Math.min(...diffs)
		const averageDiff = overallDiff/bubbleKeys.length;
		const adjustmentSize = Math.floor( totalGerms / 5 );
		
		let germsRemaining = totalGerms; 
		let bestKey = bubbleKeys[ diffs.indexOf( best )];
		let worstKey = bubbleKeys[ diffs.indexOf( worst )];
	
		let available = totalGerms
		let allocations = {}
		let riskyGambit;
	
		const strategicAdjust = ( key , num1 , num2 ) => {
			//if this bubble is doing better than average, ( and no risky gambit )
			if ( num1 > num2 && available >= adjustmentSize ){
				//allocate an extra germ to it,
				allocations[key]+=adjustmentSize;
				//factor in that available germs has decreased
				available-=adjustmentSize;
			} else if ( num1 < num2 ) {
				//else, take one germ away
				allocations[key]-=adjustmentSize
				available+=adjustmentSize;
			}
		}
	
		bubbleKeys.forEach( key =>{
			allocations[key] = available > baseline ? baseline : available;
			available -= allocations[key];
			let localDiff = bubbleState[key].germs - bubbleState[key].leuks
			riskyGambit = random( 0, 10, 8 );
			if ( !riskyGambit ){
				strategicAdjust( key, localDiff, averageDiff );
			} else {
				strategicAdjust( key, averageDiff, localDiff );
			}
			//strategicAdjust( key, localDiff, averageDiff );
	
		})
	
		//console.log( allocations );
	
		
	
		//decide how to allocate any germs leftover after the forEach loop 
		//console.log( 'available before', available ); 
		if ( available ){
			let allocateRemainderToBest = random( 0, 10, 4 ),
				chosen = 0;
			if ( allocateRemainderToBest ){
				chosen = bestKey;
			} else {
				let notTheBestBubbles = bubbleKeys.slice().splice( bubbleKeys.indexOf( bestKey ), 1);
				chosen = notTheBestBubbles[ Math.floor( Math.random() * notTheBestBubbles.length ) ];
			}
	
			//console.log( bubbleKeys.indexOf(chosen) > -1 ); 
			allocations[chosen] += available;
			available -= available;
		}
		//console.log( 'available after', available ); 
		//bubbleKeys.forEach( key => console.log( key, allocations[key] ) );
		/* 
		if bool makeAConsolidationPlay rolls 'true' ( 70% chance ), computer makes 
		a final adjustment that strengthens its best position at the
		expense of its most tenuous position.
		*/
	
		let makeAConsolidationPlay = random( 0, 10, 3);
		if ( makeAConsolidationPlay ){
			let worstKeyTotal = allocations[worstKey],
			bestKeyTotal = allocations[bestKey],
			worstKeyDistAbove1 = worstKeyTotal-1
	
			if ( overallDiff >= 0) {
				allocations[worstKey] = 1;
				allocations[bestKey] += worstKeyDistAbove1;
				/*add any leftover germs to best key
				allocations[bestKey] += available
				//set available to 0
				available -= available*/
			} else {
				allocations[worstKey] = 0;
				allocations[bestKey] +=  worstKeyTotal;
				/*add any leftover germs to best key
				allocations[bestKey] += available;
				//set available to 0
				available -= available;*/
			}
		}
	
		if ( available > 0){
			alert( 'failed not enough: ' + overallDiff )
			allocations[bestKey] += available;
			available -= available;
		} else if ( available < 0 ){
			alert('allocated too many germs')
		}
		//bubbleKeys.forEach( key => console.log( key, allocations[key] ) );
		return allocations;
	/*
		if ( overallDiff > 0 ){
			index = 
		} else if ( overallDiff < 0 ) {
			if ( diffVsTotal )
		}
	
	
	
	
		bubbleKeys.forEach(( key, i ) => {
			const bubble = bubbleState[key], 
				  { germs, leuks } = bubble,
				  localCells = germs + leuks,
				  localDiff = germs - leuks,
				  winning = localDiff > 0,
				  localGermPercent = germs / localCells,
				  localDiffVsTotal = localDiff / localCells,
				  relStr = localDiff/overallDiff,
				 
			let expected = .2, magnitude = .6;
	
			
		})*/
	}

}