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
	
class Game extends React.PureComponent{
	constructor(props){
		super(props);

		this.width = Dimensions.get('window').width;
		this.height = Dimensions.get('window').height;

		this.setUpBodies = new SetUpBodies( this.height, this.width, BUBBLER );
		this.setUpEntities = new SetUpEntities(this.width, this.height, this.setUpBodies)
	}

	handleEvent = ( e ) => {
		//alert(this.refs['engine']);
		switch ( e.type ){
			case WIN: this.refs.engine.swap( this.setUpEntities.getGameOverEntities( this.props.endGame, LIGHTBLUE )); break;
			case LOSE: this.refs.engine.swap( this.setUpEntities.getGameOverEntities( this.props.endGame, DARKPURPLE )); break;
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
					this.setUpEntities.newLeuksAndGerms(
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
})

/*animationIn={this.state.bubbleControl.location === 'bottom' ? 'slideInBottom' : 'slideInLeft' }>
				animationOut={this.state.bubbleControl.location === 'bottom' ? 'slideOutBottom' : 'slideOutLeft' }*/