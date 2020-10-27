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
        .on('value', snapshot=>{
            const goals = snapshot.val();
            const formatted = Object.keys(goals).map( key => goals[key] );
            //console.log('on callback \n', formatted);
            dispatch(formatted);
        })
}

export { addGoal, fetchGoals };