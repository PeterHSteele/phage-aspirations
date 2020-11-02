import React from 'react';
import { StyleSheet, StatusBar, Dimensions, TouchableHighlightBase } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { PressGerm, MoveGerm, MoveLeuk, Fight, ToggleModal, DoubleGerms, CheckContainerClose, Physics, Transition } from './systems';
import constants from './constants';
import SetUpBodies from './functions/class-setup-bodies';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './goalGameRedux';
import SetUpEntities from './functions/class-setup-entities';
import SystemsHelpers from './functions/class-systems-helpers';
const { STOP, STOPPED, GRAYGREEN, BUBBLER, LIGHTBLUE, DARKPURPLE, WIN, LOSE, } = constants;

//simplify allocations algorithm
//instructions
//velocity varies by distance
//prevent germs from ever overflowing container ( might need to alter collision filter )
//make it easier for bubbles to reach the center
	
class Game extends React.PureComponent{
	constructor(props){
		super(props);

		this.width = Dimensions.get('screen').width;
		this.height = Dimensions.get('screen').height;
		this.engine = React.createRef();
		this.setUpBodies = new SetUpBodies( this.height, this.width, BUBBLER );
		this.helpers = new SystemsHelpers( this.setUpBodies )
		this.setUpEntities = new SetUpEntities(this.width, this.height, this.setUpBodies, this.helpers )
	}

	handleEvent = ( e ) => {
		switch ( e.type ){
			case WIN: this.engine.current.swap( this.setUpEntities.getGameOverEntities( this.props.endGame, WIN, this.props.user.id )); break;
			case LOSE: this.engine.current.swap( this.setUpEntities.getGameOverEntities( this.props.endGame, LOSE, this.props.user.id )); break;
			case STOP: this.engine.current.stop();
			case STOPPED: this.props.completeDay();
			default: return;
		}
	}

	componentWillUnmount(){
		this.setUpBodies.clearEngine();
		this.props.newDay();
	}

	render(){	
		const { leuks, difficulty, saveEntitiesToDatabase, saveEntities } = this.props,
		germs = this.props.goals.length * 2  + this.props.difficulty * 3;
		let entities=this.props.entities;
		if ( !this.props.dayComplete ){
			entities = this.setUpEntities.buildEntitiesObject( entities, leuks, germs, saveEntitiesToDatabase );
		}
		
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