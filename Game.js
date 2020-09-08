import React, { Component } from 'react';
import { AppRegistry, StyleSheet, StatusBar, Dimensions, useWindowDimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { PressGerm, MoveGerm, MoveLeuk, Fight, ToggleModal, DoubleGerms, Start, CheckContainerClose, Physics } from './systems';
import { Bubble } from './Bubble';
import DestinationControl from './DestinationControl';
import { Germ } from './Germ';
import Matter from 'matter-js';
import Controls from './Controls';
import GameOver from './GameOver';
import BubbleControl from './BubbleControl';
import constants from './constants';
import Rect from './Rect';
import InscribedOctagon from './InscribedOctagon';
import SetUpBodies from './functions/class-setup-bodies';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './goalGameRedux';
import SetUpEntities from './functions/class-setup-entities';
const { MIDNIGHTBLUE , GREEN, GERMR, GRAYGREEN, SEAGREEN , CONTROLSHEIGHT, STAGINGHEIGHT, BUBBLER, MAUVE, LIGHTBLUE, DARKPURPLE, ORANGE, PURPLE, GERM , BUBBLE, LEUK, DESTCONTROL, LEUKS, GERMS, WIN, LOSE, BUBBLEPRESS, CONTROLS } = constants;

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
const mGerms = [];

const leuks = {};
const leukY = height - 65;
const mLeuks = [];

const bubbles = {};
const mBubbles = [];

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
			
				const setup = new SetUpBodies( world, height, width, BUBBLER ),
					  mComposite = setup.matterBubble( i );

				mBubbles.push( mComposite );
				
				bubbles[e] = {
					size: 0,
					radius: BUBBLER,
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

				Matter.World.add( world, mComposite )
		})
	return bubbles;
}
	
class Game extends React.PureComponent{
	constructor(props){
		super(props);

		this.width = Dimensions.get('window').width;
		this.height = Dimensions.get('window').height;
		this.world = world;
		this.engine = engine;

		this.setUpBodies = new SetUpBodies( this.world, this.height, this.width, BUBBLER );
		this.setUpEntities = new SetUpEntities(this.width, this.height, this.engine, this.world, this.setUpBodies)
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
		//alert( mGerms[0].type);
		return (
			<GameEngine
				style={styles.container}
				systems={ [ Physics, PressGerm, MoveLeuk, MoveGerm, Fight, ToggleModal, DoubleGerms, CheckContainerClose ] }
				ref='engine'
				onEvent={this.handleEvent}
				entities={
					newLeuksAndGerms(
						this.setUpEntities.initGetEntities( 
							this.props.leuks, 
							this.props.difficulty+7 
						), 
						true
					)
				}>

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