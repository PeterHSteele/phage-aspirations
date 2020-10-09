export const types = {
	ADD: 'ADD',
	UPDATE: 'UPDATE',
	REMOVE: 'REMOVE',
	AUTHENTICATE: 'AUTHENTICATE',
	GAMEOVER: 'GAMEOVER',
	COMPLETE: 'COMPLETE',
	STARTGAME: 'STARTGAME',
	CHANGEDIFFICULTY: 'CHANGEDIFFICULTY',
	CHANGEBUBBLE:'CHANGEBUBBLE',
	STARTASSESSMENT: 'STARTASSESSMENT',
	SUBMITASSESSMENT: 'SUBMITASSESSMENT',
	SAVEENTITIES: 'SAVEENTITIES',
	COMPLETEDAY: 'COMPLETEDAY',
	SHOWDETAIL: 'SHOWDETAIL',
}

const initialState = {
	goals:[
		{ id: 0, name: 'revolution', description: 'leave home', isTimed: false, time: {unit: 'hours', value: 15 } },
		{ id: 1, name: '12 hours of programming' },
	],
	entities: null,
	completed:[],
	users:{
		Bernie: 'M4a'
	},
	detail: null,
	leuks: 0,
	loggedIn:true,
	game: false,
	gameOver: false,
	assessment: false,
	score: .6,
	difficulty: 1,
	renderGame: true
};


const actionCreators = {
	changeDifficulty: function( difficulty ){
		return {
			type: types.CHANGEDIFFICULTY,
			data: difficulty
		}
	},
	addGoal: function( goal ){
		return {
			type: types.ADD,
			data: goal
		}
	},
	showDetail: function( id ){
		console.log('called')
		return{
			type: types.SHOWDETAIL,
			data: id,
		}
	},
	updateGoal: function( goal ){
		return {
			type: types.UPDATE,
			data: goal
		}
	},
	authenticate: function( username, password ){
		return {
			type: types.AUTHENTICATE,
			data: [username, password]
		}
	},
	remove: function( id ){
		return {
			type: types.REMOVE,
			data: id
		}
	},
	gameOver: function(){
		return {
			type: types.GAMEOVER
		}
	},
	markComplete: function( id ){
		return {
			type: types.COMPLETE,
			data: id
		}
	},
	startGame: function(){
		return {
			type: types.STARTGAME
		}
	},
	startAssessment: function(){
		return {
			type: types.STARTASSESSMENT
		}
	},
	submitAssessment: function( leuks ){
		return {
			type: types.SUBMITASSESSMENT,
			data: leuks,
		}
	},
	saveEntities: function( entities ){
		return {
			type: types.SAVEENTITIES,
			data: entities
		}
	},
	completeDay: function(){
		return {
			type: types.COMPLETEDAY,
			game: false,
		}
	}
}

export const reducer = function( state = initialState, action ){
	

	switch ( action.type ){
		case types.ADD: 
			return {
				...state,
				goals:[...state.goals, {id: state.goals.length, name: action.data}]
			};
		case types.UPDATE:
			return {
				...state,
				goals: [
					...state.goals,
					state.goals.splice(
						state.goals.indexOf(
							state.goals.find( goal => goal.id == action.data.id )
						),
						1,
						action.data
					)
				]
			};
		case types.SHOWDETAIL:
			console.log(state.goals.find( goal => goal.id == action.data));
			return {
				...state,
				detail: state.goals.find( goal => goal.id == action.data ),
			};
		case types.CHANGEDIFFICULTY:
			console.log('difficulty', action.data);
			return {
				...state,
				difficulty: action.data
			}
		case types.AUTHENTICATE: 
			return {
				...state, loggedIn: state.users[action.data[0]] === action.data[1] 
			};
		case types.REMOVE: 
			return {
				...state,
				goals: [...state.goals.filter( e => e.id !== action.data )] 
			}
		case types.GAMEOVER:
			return {
				...state,
				game: false,
				gameOver: true
			}
		case types.COMPLETE:
			return {
				...state,
				completed: [...state.completed, {id: action.data, name: state.goals.filter(e=>e.id === action.data)[0].name } ]
			}
		case types.STARTGAME:
			return {
				...state,
				game: true
			}
		case types.STARTASSESSMENT:
			return {
				...state,
				assessment: true
			}
		case types.SUBMITASSESSMENT:
			return{
				...state,
				assessment: false,
				game: true,
				leuks: action.data
			}
		case types.SAVEENTITIES:
			return {
				...state,
				entities: action.data,
				renderGame: false
			}
		case types.COMPLETEDAY: {
			return {
				...state,
				game: false,
				renderGame: true,
			}
		}
		default:
			return state;
	}
}

export const mapStateToProps = function({ goals, difficulty, users, loggedIn, game, gameOver, completed, bubbleControl, entities, assessment, leuks, renderGame, detail }){
	return {
		difficulty,
		goals: goals,
		completed: completed,
		users: users,
		loggedIn: loggedIn,
		game: game,
		gameOver: gameOver,
		score: completed.length/goals.length,
		assessment,
		leuks,
		entities,
		renderGame,
		detail,
	};
}

export const mapDispatchToProps = function( dispatch ){
	return {
		startGame: () => dispatch( actionCreators.startGame() ),
		addGoal: ( goal ) => dispatch( actionCreators.addGoal(goal) ),
		changeDifficulty: ( difficulty ) => dispatch( actionCreators.changeDifficulty( difficulty) ),
		authenticate: ( username, password ) => dispatch( actionCreators.authenticate( username, password) ),
		removeGoal: ( id ) => dispatch( actionCreators.remove( id ) ),
		endGame: () => dispatch( actionCreators.gameOver() ),
		markComplete: ( id ) => dispatch( actionCreators.markComplete( id )),
		startAssessment: () => dispatch( actionCreators.startAssessment()),
		submitAssessment: ( leuks ) => dispatch( actionCreators.submitAssessment( leuks ) ),
		saveEntities: ( entities ) => dispatch( actionCreators.saveEntities( entities )),
		completeDay: () => dispatch( actionCreators.completeDay()),
		updateGoal: ( goal ) => dispatch( actionCreators.updateGoal( goal ) ),
		showDetail: ( id ) => dispatch( actionCreators.showDetail( id )),
 	}
}