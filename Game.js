import React, { Component } from 'react';
import { AppRegistry, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { PressGerm, MoveGerm, MoveLeuk, Fight, ToggleModal, DoubleGerms, Start, CheckContainerClose } from './systems';
import { Bubble } from './Bubble';
import DestinationControl from './DestinationControl';
import { Germ } from './Germ';
import Matter from 'matter-js';
import Controls from './Controls';
import StatusModal from './Modal';
import GameOver from './GameOver';
import BubbleControl from './BubbleControl';
import constants from './constants';
import Rect from './Rect';
import InscribedOctagon from './InscribedOctagon';
import SetUpBodies from './functions/class-setup-bodies';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './goalGameRedux';
const { MIDNIGHTBLUE , GREEN, GRAYGREEN, SEAGREEN , MAUVE, LIGHTBLUE, DARKPURPLE, ORANGE, PURPLE, GERM , BUBBLE, LEUK, DESTCONTROL, LEUKS, GERMS, WIN, LOSE, BUBBLEPRESS, CONTROLS } = constants;

//simplify allocations algorithm
	//allow for bubble - to - bubble transfers
//winner of cell at end of turn gets extra germ
//vary number of new leuks by round
//animation for when fights are taking place
//vary bubblesize ( with animation)
//instructions
//velocity varies by distance
//prevent germs from ever overflowing container ( might need to alter collision filter )
//make it easier for bubbles to reach the center

let   width = Dimensions.get('window').width,
	  height = Dimensions.get('window').height;

const matterFunctions = new SetUpBodies();

const germs = {};
const germY = 20;
const germR = 4;
const mGerms = [];

const leuks = {};
const leukY = height - 65;
const mLeuks = [];

const bubbles = {};
const bubbleR = 25;
const mBubbles = [];

const ballR = 20

const destControls = {};
const destControlR = 4;
const mDestControls = [];

const controlsHeight = 30

const stagingHeight = 25

const bubbleCount = 3,
	  germCount = 1,
	  leukCount = 1,
	  controlsId = 2 * bubbleCount + germCount + leukCount;



const engine = Matter.Engine.create( {enableSleeping:false} );
const world = engine.world;
engine.world.gravity.y = 0;

const startRealignment = (entities) => {
	let { controls, physics, draw, modal } = entities
	modal.message = 'You get ' + controls.newLeuks + ' new leuks!';
	Object.keys(entities).filter( key => entities[key].type === BUBBLE ).forEach( bubbleKey => {
		entities[bubbleKey].flashFrames = {
			time: 0,
			colors: []
		}
	})
	controls.phase = 'r';
	controls.history.push('r');
	controls.leuksAreAllocated = false;
	controls.bubbleState=getBubbleState( entities );
	controls.germAllocations={};
	modal.frames = 0;
	modal.visible = true;
	return draw.newLeuksAndGerms( entities );
}

const doubleGerms = ( radius, color, world, entities, n = 2 ) => {

	let balls = {};
	let bodies = [];

	new Array( n ).fill(false).forEach((e,i)=>{
		let { x, y } = entities[i].body.position;

		let body = Matter.Bodies.circle( x, y, radius, {
			collisionFilter:{
				group: 1,
				mask: 1
			}
		})

		let negX = Math.random() < .5,
			negY = Math.random() < .5

		let xpos = Math.random() * width * negX ? -1 : 1;
		let ypos = Math.random() * width * negY ? -1 : 1;

		Matter.Body.applyForce( body, { x:  xpos, y: ypos }, {x: .00015, y: .00015} )

		bodies.push( body )

		balls[ i +n ] = {
			background: color,
			body: body,
			radius,
			renderer: Germ 
		}

	})

	Matter.World.add( world, bodies);
	return balls;
}

const getGameOverEntities = ( gameOverFn, color = MIDNIGHTBLUE, radius = width/30 ) => {
	Matter.World.clear( world, false, true );
	let newEntities = {
		draw: {
			doubleGerms
		},
		physics:{
			engine, 
			world
		}
	}

	let options = {collisionFilter: { group: 1}, isStatic: true};

	const bounds = Matter.Bodies.rectangle(0, 0 , width, height);
	
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
		offset: Matter.Vector.sub(rect.bounds.min, rect.position)
	}

	let left, right, top, bottom;

	left = Matter.Bodies.rectangle(-1,0,1,height,options);
	right = Matter.Bodies.rectangle(width, 0,1, height, options);
	top = Matter.Bodies.rectangle( 0, -1, width, 1, options);
	bottom = Matter.Bodies.rectangle(0,height, width, 1, options)

	newEntities.left = {
		type: 'bound',
		radius,
		body: left,
		height: height,
		width: 1,
		color: 'purple',
		renderer: Rect,
		offset: Matter.Vector.sub(left.bounds.min, left.position)
	}
	newEntities.top = {
		type: 'bound',
		radius,
		body: top,
		height: 1,
		width: width,
		color: '#ff4500',
		renderer: Rect,
		offset: Matter.Vector.sub(top.bounds.min, top.position)
	}
	newEntities.right = {
		type: 'bound',
		radius,
		body: right,
		height: height,
		width: 1,
		color: '#ff4500',
		renderer: Rect,
		offset: Matter.Vector.sub(right.bounds.min, right.position)
	}

	newEntities.bottom = {
		type: 'bound',
		radius,
		body: right,
		height: 1,
		width: width,
		color: '',
		renderer: Rect,
		offset: Matter.Vector.sub(bottom.bounds.min, bottom.position)
	}

	let bodies = [rect, left, right, top, bottom];

	bodies.forEach(body=>{
		let offset = Matter.Vector.sub(body.bounds.min, body.position)
		Matter.Body.setPosition(body, { x: body.position.x - offset.x - radius, y: body.position.y - offset.y-radius});
		Matter.World.add( world, body );
	})

	new Array( 2 ).fill(false).forEach((e,i)=>{
		let x = Math.random() * width - radius,
		//y = i == 0 ? .125 * height - radius : .875 * height - radius ;
		y = ( .125 * height ) + ( .75 * height * i ) - radius;

		let body = Matter.Bodies.circle( x, y, radius, {
			collisionFilter:{
				group: 1,
			},
			render:{
				lineWidth: 2
			}
		})

		bodies.push( body );
		Matter.World.add( world, body ); 

		newEntities[i] = {
			background: color,
			body: body,
			radius,
			renderer: Germ 
		}

	})



	
	return newEntities;

}
/*
new Array( germCount ).fill(false).map((e,i)=> i + bubbleCount*2 ).forEach(( e , i )=>{
	let germX = width/2
	let mGerm = Matter.Bodies.circle( germX, germY, germR, {
		collisionFilter: {
			group: 1,
		},
		render:{
			lineWidth: 2,
			visible: true,
			strokeStyle: "#ff250f"
		}
	});
	Matter.World.add(world, mGerm);
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

new Array( leukCount ).fill(false).map((e,i)=>i+bubbleCount*2+germCount).forEach((e,i)=>{
	let leukX = width/2;
	let mLeuk = Matter.Bodies.circle( leukX, leukY, germR, {
		collisionFilter:{
			group: 1
		},
		render:{
			lineWidth:2
		}
	} );
	Matter.World.add(world, mLeuk);
	leuks[e] = {
		pos: [leukY, leukX ],
		radius: germR,
		body: mLeuk,
		active: false,
		type: LEUK,
		bubble: -1,
		staged: leukCount,
		moves: 0,
		background: LIGHTGREEN,
		freeToMove: true,
		renderer: <Germ />
	}
})
*/
getBubbleState = ( entities ) => {
	//alert('called');
	let bubbleState = {}
	let bubbleKeys = Object.keys(entities).filter(key=>entities[key].type==BUBBLE);
	bubbleKeys.forEach( e => {
		bubbleState[e] = {
			...entities[e], 
			leuks: entities[e].leuks.slice(), 
			germs: entities[e].germs.slice()
		}
	})
	/*bubbleState = {
			0:{
				germs:[],
				leuks:[]
			},
			2:{
				germs:[],
				leuks:[]
			}
		};*/
	return bubbleState;
}

const newLeuksAndGerms = ( entities, init = false ) => {
	const { controls, physics } = entities
	const staging = {
		//complete:false,
		germs: {
			germs:{},
			x: width/2,
			y: 20,
			r: germR,
			bodies: [],
		},
		leuks:{
			leuks:{},
			x: controls.width/2,
			r: germR,
			y: height - controlsHeight - 10 - stagingHeight/2 - 4,
			bodies: [],
		},
		bubbleCount: controls.bubbleCount,
	}
	let bubbles = {};
	if ( init ){
		bubbles = getBubbles( controls.bubbleCount );
		entities.controls.bubbleState = getBubbleState( bubbles ); 
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
		let mCell = Matter.Bodies.circle( x, y, r, {
			collisionFilter:  matterFunctions.getOuterCellFilter(),
		});
		Matter.World.add( physics.world, mCell);
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
	//staging.complete = true;
	return {...entities,...newCells,...bubbles}

}

const getBubbles = ( bubbleCount, bubbles = {} ) => {
	let mBubbles= [];
		new Array( bubbleCount ).fill(false).map((e,i)=>i).forEach((e,i)=>{
			
				const setup = new SetUpBodies( world, height, width, bubbleR ),
					  mComposite = setup.matterBubble( i );

				mBubbles.push( mComposite );
				
				bubbles[e] = {
					size: 0,
					radius: bubbleR,
					body: Matter.Composite.get( mBubbles[i], BUBBLE, 'body' ),
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
				//alert(mDestControl.position.x);
				/*bubbles[e*2+1] = {
					pos:[height/2 - destControlR * 2, width/2 - destControlR * 2 ],
					radius: destControlR,
					body: mDestControl,
					type: DESTCONTROL,
					freeToMove: false,
					renderer: <DestinationControl />
				}

				

				let group = Matter.Composite.create({
					bodies: [ mBubble, mDestControl ],
					id: e
				})*/

				Matter.World.add( world, mComposite )
		})
	return bubbles;
}

const initGetEntities = ( leuks, germs, bubbleCount, handleFinishAlignment, screenWidth, screenHeight ) => {

	const controlsBody = Matter.Bodies.rectangle( 0, height - controlsHeight, width, controlsHeight );
	
	const stagingAreaHeight = stagingHeight,
		  stagingAreaWidth = .8 * width,
		  stagingAreaY = height - controlsHeight - ( stagingAreaHeight + 10 );

	const stagingBody = Matter.Bodies.rectangle( width/2, stagingAreaY + stagingAreaHeight/2, stagingAreaWidth, stagingAreaHeight, { collisionFilter: { group: 2 } } );
	const setup = new SetUpBodies( world, height, width );

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
			        	cellRange: [ bubbleCount, bubbleCount + germCount + leukCount - 1 ],
			        	type: CONTROLS,
			        	body: controlsBody,
			        	width: width,
			        	y: height - controlsHeight,
			        	height: controlsHeight,
			        	leuks: leuks, 
			        	germs: germs,
			        	bubbleState: {},
			        	newLeuks: leuks,
			        	newGerms: germs,
			        	germAllocations:{},
			        	bubbleCount: bubbleCount,
			        	leuksAreAllocated: false,
			        	width: screenWidth,
			        	phase: 'p',
			        	history: ['p'],
			        	nextLeuks: 3,
			        	startRealignment,
			        	gameOver: false,
			        	handlePress: handleFinishAlignment,
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
			        },
			        ...setup.getWalls()
			        
	}
}
/*
const endOfGame = ( entities, outcome ) => {

	Object.keys(entities ).filter( key => entities[key].body ).forEach( key => {
		Matter.Composite.remove( entities.physics.world, entities[key].body );
		delete entities[key];
	})

	entities.controls.renderer = null;
	entities.endGame.renderer = <GameOver />;



	

	Matter.World.add( world, rect );
	entities.endGame.body = rect;
	entities.endGame.width = width/2;
	entities.endGame.height = height/2;
	
	return entities.draw.gameOverBodies( 20, outcome == 'win' ? LIGHTGREEN : MIDNIGHTBLUE, entities.physics.world );

}
*/
//Matter.World.add(world, germs);
/*
new Array( bubbleCount ).fill(false).map((e,i)=>i).forEach((e,i)=>{


	let bubbleX = Math.trunc( destControlR + Math.random() * ( width - 60 )),
		bubbleY = 100 + Math.random() * (height - 200),
		mBubble = Matter.Bodies.circle( bubbleX, bubbleY, bubbleR, {
			collisionFilter:{
				group: 2
			},
		} );

		const mDestControl = Matter.Bodies.circle( bubbleX, bubbleY, destControlR);
		mDestControls.push( mDestControl );
		
		mBubbles.push(mBubble);
		bubbles[e*2] = {
			pos:[bubbleY, bubbleX],
			radius: bubbleR,
			body: mBubbles[i],
			border: i == 1 ? '#40e0d0' : '#99d548',
			dest: false,
			germs: [],
			leuks: [],
			type:BUBBLE,
			waves: 0,
			renderer: <Bubble />
		}

		destControls[e*2+1] = {
			pos:[bubbleY - destControlR * 2, bubbleX - destControlR * 2 ],
			radius: destControlR,
			body: mDestControls[i],
			type: DESTCONTROL,
			freeToMove: false,
			renderer: <DestinationControl />
		}

		Matter.Composite.create({
			bodies: [ mBubble, mDestControl ],
			id: e
		})
})
*/

//Matter.World.add(world, mGerms);
const Physics = (entities, { time }) => {
    let engine = entities["physics"].engine;
    Matter.Engine.update(engine, time.delta);
    return entities;
}

//alert(Object.keys({...bubbles,...leuks,...germs}))


	
class Game extends React.PureComponent{
	constructor(props){
		super(props);
		this.state = {
			phase: 'p',
			modal: true,
		}


		this.handleFinishAlignment = this.handleFinishAlignment.bind(this);
		this.handleModalDismiss    = this.handleModalDismiss.bind(this);
	}

	 phaseChanges = ( entities ) => {
		if ( this.state.phase == 'b' && entities.controls.phase != 'b'){
			entities.controls.phase = 'b'
			entities.controls.history.push( 'b' );
			this.setState({
				phase: 'r'
			})
		}
		
		return entities;
	}

	modalDismiss = ( entities ) => {
		if (! this.state.modal && entities.modal.visible ){
			
			entities.modal.visible = false;
		}
		
		return {...entities}
	}

	handleFinishAlignment(){
		this.setState({
			phase: 'b'
		})
	}

	handleModalDismiss(){
		this.setState({
			modal: false
		})
	}

	handleEvent = ( e ) => {
		//alert(this.refs['engine']);
		switch ( e.type ){
			case WIN: this.refs.engine.swap( getGameOverEntities( this.props.endGame, LIGHTBLUE )); break;
			case LOSE: this.refs.engine.swap( getGameOverEntities( this.props.endGame, DARKPURPLE )); break;
			default: return;
		}

	}

	render(){	
		width = Dimensions.get('window').width;
		height = Dimensions.get('window').height;	
		//alert( mGerms[0].type);
		return (
			<GameEngine
				style={styles.container}
				systems={ [ Physics, PressGerm, MoveLeuk, MoveGerm, Fight, this.phaseChanges, ToggleModal, DoubleGerms, CheckContainerClose ] }
				ref='engine'
				onEvent={this.handleEvent}
				entities={newLeuksAndGerms(initGetEntities( this.props.leuks, this.props.difficulty+7, 3, this.handleFinishAlignment, width, height ), true)} >

				<StatusBar hidden={true} />
				
			</GameEngine>
		);
	}
}

export default connect( mapStateToProps, mapDispatchToProps )( Game );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GRAYGREEN,
  }, 
  modalStyle:{
  	width: width,
  	height: height
  },
  bubbleControl:{
  	width: width*.8,
  	marginLeft: width*.1,
  	backgroundColor: '#fff',
  	borderRadius: 5,
  	padding: 5,
  	top: .4 * height
  }
});

/*animationIn={this.state.bubbleControl.location === 'bottom' ? 'slideInBottom' : 'slideInLeft' }>
				animationOut={this.state.bubbleControl.location === 'bottom' ? 'slideOutBottom' : 'slideOutLeft' }*/