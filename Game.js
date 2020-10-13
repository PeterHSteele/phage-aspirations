import React, { Component } from 'react';
import { AppRegistry, StyleSheet, StatusBar, Dimensions, useWindowDimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { PressGerm, MoveGerm, MoveLeuk, Fight, ToggleModal, DoubleGerms, CheckContainerClose, Physics, Transition } from './systems';
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

		/*this.width = props.route.params.width;
		this.height = props.route.params.height;*/
		this.width = Dimensions.get('screen').width;
		this.height = Dimensions.get('screen').height;
		console.log('height', this.height);
		this.engine = React.createRef();
		this.setUpBodies = new SetUpBodies( this.height, this.width, BUBBLER );
		this.helpers = new SystemsHelpers( this.setUpBodies )
		this.setUpEntities = new SetUpEntities(this.width, this.height, this.setUpBodies, this.helpers )
	}

	handleEvent = ( e ) => {
		//alert(this.refs['engine']);
		switch ( e.type ){
			case WIN: this.engine.current.swap( this.setUpEntities.getGameOverEntities( this.props.endGame, LIGHTBLUE )); break;
			case LOSE: this.engine.current.swap( this.setUpEntities.getGameOverEntities( this.props.endGame, DARKPURPLE )); break;
			case STOP: this.engine.current.stop();
			case STOPPED: 
				this.props.completeDay();
				//this.props.navigation.navigate( 'Home' );
			default: return;
		}

	}

	render(){	
		const { leuks, difficulty, saveEntities } = this.props,
		germs = this.props.goals.length * 2 + this.props.difficulty;
		let entities=this.props.entities;
		if ( !this.props.dayComplete ){ 
			entities = this.setUpEntities.buildEntitiesObject( entities, leuks, germs, saveEntities );
		}

		console.log(this.engine);
		//console.log(Object.keys(entities).length);
		//console.log('staging',entities['staging'].body.position)
		return (
			<GameEngine
				style={styles.container}
				systems={ [ Physics, PressGerm, MoveLeuk, MoveGerm, Fight, ToggleModal, DoubleGerms, CheckContainerClose, Transition ] }
				ref={this.engine}
				running={true}
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