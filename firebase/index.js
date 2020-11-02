import {firebase} from './firebaseConfig';
import { Composite } from 'matter-js';
import constants from '../constants';
const { LEUK, GERM, CONTROLS, BUBBLE } = constants;

const database = firebase.database();

const addGoal = ( uid, goal, key = null ) => {
    if (!key){
        key = database.ref().child('goals').push().key;
    }
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
            const formatted = Object.keys(goals).map( key => Object.assign(goals[key], { key }));
            dispatch(formatted);
        })
}

const saveEntitiesToDatabase = uid => entities => {
    const updates = {}
    const dataToSave = {}
    const keys = Object.keys(entities);
    keys.forEach(key=>{
        const position = null == entities[key].body ? null : entities[key].body.position;
        dataToSave[key]={};
        const type = entities[key].type;
        if ( CONTROLS == key){
            dataToSave[key].bubbleState = entities[key].bubbleState;
        }
        if ( LEUK == type || GERM == type ){
            dataToSave[key].bubble = entities[key].bubble
        }
        if (BUBBLE == type){
            dataToSave[key].leuks=entities[key].leuks;
            dataToSave[key].germs=entities[key].germs;
            dataToSave[key].size =entities[key].size;
        }
        dataToSave[key].type = type;
        dataToSave[key].position = position;
    })
    updates['entities/' + uid]=dataToSave;
    database.ref().update(updates);
}

const removeEntities = ( uid, dispatch ) => {
    database
        .ref('entities/'+uid)
        .set({});
}

const fetchEntities =  (uid , dispatch) => {
    database
        .ref('entities/' + uid)
        .on('value', snapshot => {
            const entities = snapshot.val();
            if ( entities ){
                dispatch( entities );
            }
        })
}

export { addGoal, fetchGoals, saveEntitiesToDatabase, fetchEntities, removeEntities };