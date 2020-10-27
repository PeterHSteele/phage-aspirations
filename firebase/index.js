import {firebase} from './firebaseConfig';

const FETCH = 'FETCH';

const database = firebase.database();

const addGoal = ( uid, goal ) => {
    const key = database.ref().child('goals').push().key;
    const updates = {}
    updates['userGoals/'+uid+'/'+key]=goal;
    updates['goals/'+key]=goal;
    return database.ref().update(updates);
}

const fetchGoals = ( uid, dispatch ) => {
    database
        .ref('userGoals/'+uid)
        .on('value')
        .then(goals=>{
            dispatch({
                type: FETCH,
                data: goals
            })
        })
        .catch(error=>{
            console.log('fetch goal error: ' + error.message)
        })
}

export { addGoal, fetchGoals };