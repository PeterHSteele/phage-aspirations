export const types = {
	ADD: 'ADD',
	REMOVE: 'REMOVE',
	AUTHENTICATE: 'AUTHENTICATE',
	GAMEOVER: 'GAMEOVER',
	COMPLETE: 'COMPLETE',
	STARTGAME: 'STARTGAME',
	CHANGEDIFFICULTY: 'CHANGEDIFFICULTY',
	CHANGEBUBBLE:'CHANGEBUBBLE',
}

const initialState = {
	goals:[
		{ id: 0, name: 'revolution' },
	],
	completed:[],
	users:{
		Bernie: 'M4a'
	},
	loggedIn:true,
	game: true,
	gameOver: false,
	score: .6,
	difficulty: 1,
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
	authenticate: function( username, password ){
		return {
			type: types.AUTHENTICATE,
			data: [username, password]
		}
	},
	remove: function( id ){
		alert(id);
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
		//alert(id);
		return {
			type: types.COMPLETE,
			data: id
		}
	},
	startGame: function(){
		return {
			type: types.STARTGAME
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
				game: true
			}
		default:
			return state;
	}
}

export const mapStateToProps = function({ goals, difficulty, users, loggedIn, game, gameOver, completed, bubbleControl, entities }){
	return {
		difficulty,
		goals: goals,
		completed: completed,
		users: users,
		loggedIn: loggedIn,
		game: game,
		gameOver: gameOver,
		score: completed.length/goals.length,
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
	}
}