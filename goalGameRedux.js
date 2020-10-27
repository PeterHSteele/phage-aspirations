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
	EXITDETAIL: 'EXITDETAIL',
	NEWDAY: 'NEWDAY',
	LOGIN: 'LOGIN',
	LOGOUT: 'LOGOUT',
}

const initialState = {
	goals:[
		{ id: 0, name: 'revolution', score: 0, description: 'leave home', isTimed: true, time: {unit: 'minutes', duration: '30', spent: 0 } },
		{ id: 1, name: 'programming', score: 0, description: 'do it', isTimed: true, time:{unit: 'hours', duration: '8', spent: 0 }},
	],
	entities: null,
	completed:[],
	users:{
		Bernie: 'M4a'
	},
	user: null,
	detail: null,
	leuks: 0,
	loggedIn:true,
	game: false,
	gameOver: false,
	assessment: false,
	score: .6,
	difficulty: 1,
	dayComplete: false,
};


const actionCreators = {
	changeDifficulty: function( difficulty ){
		return {
			type: types.CHANGEDIFFICULTY,
			data: difficulty
		}
	},
	login: function( user ){
		return {
			type: types.LOGIN,
			data: user
		}
	},
	logout: function(){
		return {
			type: types.LOGOUT
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
	},
	exitDetail: function( ){
		return {
			type: types.EXITDETAIL,
		}
	},
	newDay: function(){
		return {
			type: types.NEWDAY
		}
	}
}

export const reducer = function( state = initialState, action ){
	switch ( action.type ){
		case types.ADD: 
			return {
				...state,
				goals:[...state.goals, action.data]
			};
		case types.LOGIN:
			return {
				...state,
				user: action.data,
			};
		case types.LOGOUT:
			return {
				...state,
				user: null,
			}
		case types.UPDATE:
			const goalToReplace = state.goals.find( goal => goal.id == action.data.id );
			const indexOfGoalToReplace = state.goals.indexOf(goalToReplace);
			const goals = [...state.goals]
			goals.splice( indexOfGoalToReplace, 1, action.data)
			
			return {
				...state,
				goals,
			};
		case types.SHOWDETAIL:
			return {
				...state,
				detail: state.goals.find( goal => goal.id == action.data ),
			};
		case types.CHANGEDIFFICULTY:
			
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
				game: true,
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
				dayComplete: true
			}
		case types.COMPLETEDAY: {
			const goals = [...state.goals];
			goals.forEach( e => {
				e.score = 0;
				e.time.spent=0; 
			});
			return {
				...state,
				goals,
				game: false,
			}
		}
		case types.NEWDAY: {
			return {
				...state,
				dayComplete: false
			}
		}
		case types.EXITDETAIL: {
			return {
				...state,
				detail: null,
			}
		}
		default:
			return state;
	}
}

export const mapStateToProps = function({ goals, difficulty, users, loggedIn, game, gameOver, completed, entities, assessment, leuks, detail, dayComplete, user}){
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
		dayComplete,
		detail,
		user,
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
		exitDetail: () => dispatch( actionCreators.exitDetail()),
		newDay: () => dispatch( actionCreators.newDay()),
		login: ( user ) => dispatch( actionCreators.login( user )),
		logout: () => dispatch( actionCreators.logout()),
 	}
}