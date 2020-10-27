import {firebase} from './firebaseConfig';

const FETCH = 'FETCH';

const database = firebase.database();

const addGoal = ( uid, goal ) => {
    console.log('add goal', uid, goal );
    const key = database.ref().child('goals').push().key;
    const updates = {}
    updates['userGoals/'+uid+'/'+key]=goal;
    updates['goals/'+key]=goal;
    return database.ref().update(updates);
}

const fetchGoals = ( uid, dispatch ) => {
    database
        .ref('userGoals/'+uid)
        .on('value', goals=>{
            console.log('on callback',goals)
            //dispatch(goals)
        })
}

export { addGoal, fetchGoals };