import React from 'react';
import constants from '../constants';
import { Bubble } from '../Bubble';
import { Dimensions } from 'react-native';
import { FloatUp } from '../Views';
import { Title } from '../Texts';
const { BUBBLESCALEFACTOR, CONTROLSHEIGHT, STAGINGHEIGHT, SIZES, LIGHTBLUE, PURPLE, CONTROLS, GERM, LEUK, BUBBLECOUNT, GERMR, BUBBLE, BUBBLER, GERMS, LEUKS, DARKPURPLE, SCALEFACTORS } = constants;
import Rect from '../Rect';
import { Germ } from '../Germ';
import Controls from '../Controls';
import Matter, { Body, World, Bodies, Vector, Composite } from 'matter-js';
import StatusModal from '../Modal';
import GameOver from '../GameOver';

export default class SetUpEntities {
	constructor( width, height, setUpBodies, helpers ){
		Object.assign( this, { width, height, setUpBodies, helpers });
	}

	buildEntitiesObject( entities, leuks, germs, saveEntities ){
		if ( !entities ){
			const bubbles = this.getBubbles( BUBBLECOUNT );
			return {
				...this.getMetaEntities( 
					leuks, 
					germs,
					saveEntities,
					bubbles 
				),
				...bubbles,
				...this.newLeuksAndGerms( 
					leuks, 
					germs, 
					new Array( BUBBLECOUNT )
						.fill(false)
						.map((e,i) => i )),
			}
		} else {
			const keys = Object.keys(entities),
				  bonusIds = this.getAvailableIds(
					keys,
					BUBBLECOUNT
				  );
			//console.log('keys', keys)
			const oldBubbleData =Object.fromEntries( 
				Object
				  .keys(entities)
				  .filter( key => entities[key].type==BUBBLE )
				  .map( key => [key, entities[key]])
				  .map( pair => [pair[0], this.addMissingList(pair[1])])
			);

			//console.log('obd', oldBubbleData);
			
			const metaEntities = Object.assign(
				{},
				this.getMetaEntities( leuks, germs, saveEntities,  oldBubbleData), 
			);
			
			const oldLeuksAndGerms = this.oldLeuksAndGerms(entities);
			
			const bubbles = this.getBubbles( BUBBLECOUNT, {}, ...Object.keys(oldBubbleData).map(key=>oldBubbleData[key]) );
			//('before merge bubble', bubbles[0])

			entities = Object.assign(
				{},
				metaEntities,
				bubbles,
				oldLeuksAndGerms,
			);

			const [ bonusCells, cellArrays ] =  this.bonusCells(
				entities,
				bonusIds,
			);
			Object.assign(
				entities,
				bonusCells,
				this.newLeuksAndGerms( leuks, germs, keys.concat(bonusIds), entities.physics.world )	
			);
			Object.keys(cellArrays).forEach( bubbleKey => {
					  const type = cellArrays[bubbleKey][0],
					  id = cellArrays[bubbleKey][1]
				entities[bubbleKey][type].push(id);
			});
			entities.controls.bubbleState = this.helpers.getBubbleState( entities );
			return this.refreshMetaEntities(entities, leuks, germs);
		}
	}

	addMissingList( bubble ){
		//console.log('bubble', bubble.leuks, bubble.germs);
		if (!bubble.hasOwnProperty(LEUKS)){
			bubble.leuks=[];
		} else {
			bubble.germs=[];
		}
		return bubble;
	}

	mapLog(obj,prop){
		console.log(Object.keys(obj).map( key => obj[key][prop]));
	}

	getMetaEntities( leuks, germs, saveEntities, bubbles ){
		//const { setUpBodies} = this,
			   const physics = this.getPhysicsEntity(),
					 staging = this.getStagingEntity(),
					controls = this.getControlsEntity(leuks, germs, saveEntities, bubbles),
				  transition = this.getTransitionEntity(),
				  	   modal = this.getModalEntity( leuks );

		return {
			physics,
			staging,
			controls,
			transition,		
			modal, 
			//...setUpBodies.getWalls()		
		}
	}

	/**
	 * @method getPhysicsEntity
	 * Gets a physics entity to keep track of and update the game simulation.
	 * 
	 * @used by getMetaEntities.
	 * 
	 * @return {object} the physics entitiy
	 */

	getPhysicsEntity(){
		const { engine, world } = this.setUpBodies;

		return {
			type: 'physics',
			engine,
			world
		}
	}

	/**
	 * @method getStagingEntity
	 * gets an entity that defines an area of the screen where the players pieces (leuks)
	 * will initially display and where touch events will select those pieces for movement.
	 * 
	 * @used by getMetaEntities.
	 * 
	 * @return {object} the staging entitiy
	 */

	getStagingEntity(){
		const { height, width } = this,
		stagingAreaWidth  		= .8 * width,
		stagingAreaY 		    = height - CONTROLSHEIGHT - ( STAGINGHEIGHT + 10 ) + STAGINGHEIGHT/2,
		stagingAreaX 			= width/2,
		options 				= { collisionFilter: {group: 2 }},
		stagingBody 			= Bodies.rectangle( stagingAreaX, stagingAreaY, stagingAreaWidth, STAGINGHEIGHT, options );
								
		return {
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
		}
	}

	/**
	 * @method getTransitionEntity
	 * gets an entity that defines the duration of a transition between two phases of
	 * the game, timings for function calls during those transitions, and a callback 
	 * to handle setup of the next phase.
	 * 
	 * @used by getMetaEntities.
	 * 
	 * @return {object} the transition entitiy
	 */

	getTransitionEntity(){
		return {
			type:"transition",
			transitionFrames: 0,
			transitionHooks:{},
			transitionCallback: this.helpers.stopGame,
		}

	}

	getModalEntity( leuks ){
		return {
			type: 'modal',
			message: 'You get ' + leuks + ' leuks!' ,
			visible: false,
			frames: 0,
			renderer: <StatusModal />
		}
	}

	getControlsEntity( leuks, germs, saveEntities, bubbles ){
		const { width,  height, helpers } = this;
		controlsBody = Bodies.rectangle( 0, height - CONTROLSHEIGHT, width, CONTROLSHEIGHT );

		return { 
			pauseThreshold: this.getPauseThreshold( leuks ),
			type: CONTROLS,
			body: controlsBody,
			y: height - CONTROLSHEIGHT,
			height: CONTROLSHEIGHT,
			leuks, 
			germs,
			newLeuks: leuks,
			newGerms: germs,
			bubbleState: this.helpers.getBubbleState( bubbles ),
			germAllocations:{},
			bubbleCount: BUBBLECOUNT,
			leuksAreAllocated: false,
			newLeuksAndGerms: this.newLeuksAndGerms.bind(this),
			phase: 'p',
			gameOver: false,
			saveEntities: ( obj ) => saveEntities(obj),
			renderer: <Controls /> 
		}
	}

	/**
	 * @method oldLeuksAndGerms
	 * The physics engine bodies are not saved in firebase because they exceed max nesting 
	 * depth. Remake them using their former position and type (leuk or germ).
	 * 
	 * @param {object} savedEntities collection of data about pre-existing leuks/germs, keyed by their entity keys
	 * 
	 * @return {object} the reconstituted entities from the previous day
	 */

	oldLeuksAndGerms( savedEntities ){
		const { setUpBodies } = this; 
		const oldCells = {};
		const newCell = this.newCell;
		Object.keys(savedEntities).forEach((key)=>{
			const entity = savedEntities[key];
			if ( entity.type != LEUK && entity.type!=GERM ){
				return;
			}
			const { x, y } = entity.position;
			const mCell=setUpBodies.matterCell( x, y, false );
			oldCells[key]=newCell(GERMR, mCell, entity.type, entity.bubble );
		})

		return oldCells;
	}

	newLeuksAndGerms( leuks, germs, keys, world = this.setUpBodies.world ){
		const { width, height, setUpBodies } = this,
			  yS = {
				germs: 20,
				leuks: height - CONTROLSHEIGHT - 10 - STAGINGHEIGHT/2 - 4,
			  }
		
		let cellsToAdd = leuks + germs,
			availableIds = this.getAvailableIds(
				keys,
				cellsToAdd
			),
			newCells = {};
		
		availableIds.forEach( ( e, i ) => {
			let type = i < germs ? GERMS : LEUKS;
			let x = width/2,
			y = yS[type]; 
			/*
			let mCell = Bodies.circle( x, y, GERMR, {
				collisionFilter: setUpBodies.getOuterCellFilter(),
			});
			World.add( world, mCell);*/
			const mCell = setUpBodies.matterCell( x, y, true );
			newCells[e] = this.newCell( GERMR, mCell, type.slice(0,4), -1);
		});
		
		return newCells;
	
	}

	newCell( radius, body, type, bubble ){
		return {
			radius,
			body,
			active: false,
			destination: [],
			type,
			bubble,
			background: type == GERM ? DARKPURPLE : LIGHTBLUE,
			renderer: <Germ />
		}
	}

	/**
	getAvailableIds

	Finds lowest `count` integers with no game entity assigned to them.

	@param keys 	Array		game entity keys
	@param count 	Number 		number of new ids needed

	@return ids 	Array		the lowest ids available for assignment
	*/

	getAvailableIds( keys, count ){
		keys=keys
				/*attempt to convert keys to numbers*/
				.map(e=>e-0)
				/*remove non-numeric keys by filtering those that couldn't be converted*/
				.filter(e=>e)
				/*sort ascending*/
				.sort((a,b)=>a-b);
		let ids = [], 
			id = BUBBLECOUNT; 
		while ( count ){
			if ( keys.indexOf(id) < 0 ){
				ids.push(id);
				count--;;
			}
			id++;
		}
		return ids;
	}

	bonusCells( entities, ids ){
		const bonusCells = {},
			  bubbleState = this.helpers.getBubbleState(entities),
			  bubbleIds = Object.keys(bubbleState),
			  cellArrays = Object.fromEntries(bubbleIds.map(e=>[e,null])),
			  collisionFilter = this.setUpBodies.getInnerCellFilter(),
			  options = { collisionFilter };
		Object.keys(bubbleState).forEach( (key, index) => {
			const bubble = entities[key],
			{ x, y } = bubble.body.position,
			mCell = Bodies.circle( x -GERMR, y -GERMR, GERMR, options ),
			id = ids[index],
			type = bubble.germs.length > bubble.leuks.length ? GERM : LEUK;
			//console.log('germ length', bubble.germs, 'leuk length', bubble.leuks, 'type', type)
			bonusCells[id] = this.newCell( GERMR, mCell, type, key );
			World.add( entities.physics.world, mCell );
			//console.log('bubbleprops', Object.keys(bubble));
			//ie, cellArrays[0]=[germs,9]
			cellArrays[key]=[type+'s',id]
		});
		return [
			bonusCells,
			cellArrays
		]
	}

	/**
	* Calculates the bounds below which or above which the game will be 
	* paused for the day. 
	
	* The bounds represent a 40% increase or decrease in leuks
	* compared to start of the day.


	@param leuks 	Number 		Total leuks in game at beginning of day
	@return a length three array representing the lower threshold, starting 
			number of leuks, and upper threshold.
	*/

	getPauseThreshold( leuks ){
		return [ 
			Math.floor( .6 * leuks ),
			leuks,
			Math.ceil( 1.4 * leuks )
		];
	}

	/** 
	* Restores the inital values of some meta entities
	* at the beginning of a new day's session.

	@param entities		Object		the game entities
	@param leuks		Number		amount of new leuks for the day
	@param germs		Number		amount of new germs for the day

	@return entities	Object		the updated game entities
	*/

	refreshMetaEntities( entities, leuks, germs ){
		const clearBonusCellAlerts = this.clearBonusCellAlerts.bind(this),
			  bonusCellAlerts = this.bonusCellAlerts.bind(this);
		//console.log('refreshing', Object.keys(bubbleState).map(key=>bubbleState[key].leuks))
		const controls = {
			germs,
			leuks,
			newGerms: germs,
			newLeuks: leuks,
			phase: 't',
			pauseThreshold: this.getPauseThreshold( leuks + this.helpers.totalLeuksInGame(entities.controls.bubbleState)),
			leuksAreAllocated: false,
			germAllocations: {}
		};

		const transition = {
			transitionFrames: 180,
			transitionHooks: {90: bonusCellAlerts },
			transitionCallback: clearBonusCellAlerts,
		}

		const modal = {
			visible: true,
			message: "Bonuses awarded for holding a bubble overnight",
			frames: 90
		};

		Object.assign(entities.modal, modal);
		Object.assign( entities.controls, controls);
		Object.assign( entities.transition, transition)
		
		//Object.assign( entities, { controls, transition, modal })
	
		//console.log(Object.keys(entities).map(key=>entities[key].body && entities[key].body.position));
		
		return entities;
	}

	bonusCellAlerts( entities ){
		const alerts = {};
		const bubbleKeys = this.helpers.getBubbleKeys( entities );
		bubbleKeys.forEach((e,i)=>{
			const bubble = entities[e],
				  {x,y} = bubble.body.position;
			
			/*const style = {
				position: 'absolute',
				top: 0, 
				padding: 5,
				color: '#fff',
				
			}*/

			const textStyle={ color: '#fff' };

			const containerStyle = {
				position: 'absolute',
				top: 0,
				padding: 5,
				borderRadius: 8,
				borderWidth: 1,
				borderColor: bubble[LEUKS].length ? LIGHTBLUE : DARKPURPLE,	
				left: x + BUBBLER,
				backgroundColor: bubble[LEUKS].length ? LIGHTBLUE : DARKPURPLE
			};

			alerts['alerts'+i]={
				y: y - 2 * BUBBLER,
				//renderer: () => <AnimatedTitle y={y} style={style}>{'+1'}</AnimatedTitle>
				renderer: ()=><FloatUp y={y} style={containerStyle}><Title style={textStyle}>+1</Title></FloatUp>
			}
		})
		return Object.assign(entities, alerts);
	}
/*
	getBonusCellAlerts( entities ){
		return Object.assign(entities, this.bonusCellAlerts(entities));
	}
*/
	clearBonusCellAlerts( entities ){
		Object.keys(entities)
			.filter( key => key.match(/alert/g))
			.forEach( alertKey => delete entities[alertKey]);
		
		const transitionCallback = this.helpers.stopGame.bind(this);
		console.log('clearing');
		const controls = {
			phase: 'r',
		}

		const transition = {
			transitionCallback,
			transitionHooks: {},
		}

		Object.assign(entities.controls, controls );
		Object.assign(entities.transition, transition)
		return entities;
	}

	getBubbles( bubbleCount, bubbles = {}, ...args ){
		/*
		const getBubbleSizeFromContents = ( cellsInside ) => {
			let current = 0;
			while ( cellsInside > SIZES[current]){
				current++;
			}
			return current;
		}
		*/

		const getScale = (size) => {
			let scale = 1;
			for ( let i=0; i < size; i++ ){
				scale*=SCALEFACTORS[i]
			}
			return scale;
		}

		const oldBubbleData = args,
			  isNewGame 	= oldBubbleData.length == 0;
			  //console.log( 'oBD', oldBubbleData );
		let mBubbles= [];
			new Array( bubbleCount ).fill(false).forEach((e,i)=>{
					const setup = this.setUpBodies;
				
					let mComposite, size=0, radius = BUBBLER, key;
					if (!isNewGame){
						const {position} = oldBubbleData[i],
						{x,y}			 = position,
						//cellsInside=oldBubbleData[i].leuks.length + oldBubbleData[i].germs.length;	
						//console.log('position', position);
						key = 
						size = oldBubbleData[i].size;
						const scale = getScale(size);
						radius 			  = BUBBLER * scale,
						mComposite = setup.matterBubble( i, radius, {x, y});
						//console.log('size',size)
					} else {
						mComposite = setup.matterBubble( i );
					}
	
					mBubbles.push( mComposite );
					
					bubbles[i] = {
						size,
						radius,
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
						germs: isNewGame ? [] : oldBubbleData[i].germs,
						leuks: isNewGame ? [] : oldBubbleData[i].leuks,
						type: BUBBLE,
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
			},
			controls: {
				phase: 'g'
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

class EntityMaker {
	constructor( value ){
		this.value = value;
	}

	iterate( fn ){
		new Array(this.val).map((e,i)=>i).forEach(e=>fn(e));
	}
}