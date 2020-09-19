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
import SystemsHelpers from './functions/class-systems-helpers';
const { MIDNIGHTBLUE , STOP, STOPPED, GREEN, GERMR, GRAYGREEN, SEAGREEN , CONTROLSHEIGHT, STAGINGHEIGHT, BUBBLER, MAUVE, LIGHTBLUE, DARKPURPLE, ORANGE, PURPLE, GERM , BUBBLE, LEUK, DESTCONTROL, LEUKS, GERMS, WIN, LOSE, BUBBLEPRESS, CONTROLS } = constants;

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
	
class Game extends React.PureComponent{
	constructor(props){
		super(props);

		this.width = Dimensions.get('window').width;
		this.height = Dimensions.get('window').height;

		this.setUpBodies = new SetUpBodies( this.height, this.width, BUBBLER );
		this.helpers = new SystemsHelpers( this.setUpBodies )
		this.setUpEntities = new SetUpEntities(this.width, this.height, this.setUpBodies, this.helpers )
	}

	handleEvent = ( e ) => {
		//alert(this.refs['engine']);
		switch ( e.type ){
			case WIN: this.refs.engine.swap( this.setUpEntities.getGameOverEntities( this.props.endGame, LIGHTBLUE )); break;
			case LOSE: this.refs.engine.swap( this.setUpEntities.getGameOverEntities( this.props.endGame, DARKPURPLE )); break;
			case STOP: this.refs.engine.stop();
			case STOPPED: 
				/*console.log( 'game', this.props.game, 'fn', this.props.completeDay );*/ 
				this.props.completeDay();
			default: return;
		}

	}

	render(){	
		const { leuks } = this.props,
		germs = this.props.goals.length * 2 + this.props.difficulty;
		let entities = this.props.entities;
		if ( ! entities ){
			entities = this.setUpEntities.newLeuksAndGerms(
				this.setUpEntities.initGetEntities( 
					leuks, 
					germs,
					this.props.saveEntities 
				), 
				leuks, 
				germs,
				true
			)			
		} else if ( entities && this.props.renderGame ) {
			//console.log( 'entities prop names', Object.keys( entities) );
			entities = this.setUpEntities.newLeuksAndGerms(
				this.setUpEntities.refreshControls( 
					entities,
					leuks,
					germs
				),
				leuks,
				germs,
			);
		}
		
		return (
			<GameEngine
				style={styles.container}
				systems={ [ Physics, PressGerm, MoveLeuk, MoveGerm, Fight, ToggleModal, DoubleGerms, CheckContainerClose ] }
				ref='engine'
				onEvent={this.handleEvent}
				entities={entities}>

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