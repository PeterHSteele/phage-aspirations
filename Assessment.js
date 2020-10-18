import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import AssessmentInput from "./AssessmentInput";
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './goalGameRedux';
import constants from './constants';
import { ListItem, ListItemChevron } from 'react-native-elements';
const { MAUVE } = constants;
import store from './store';

function Assessment({ goals, submitAssessment, navigation, dayComplete }){
    //const initScores = Object.fromEntries( goals.map( e => [ e.name, 0 ] ));
    
    /* if we've updated a score, update the store*/
    /*const scoreData = route.params,
        id = scoreData?.id,
        score = scoreData?.score;

    if (  id > -1 ){
        let goal = goals.find( goal  => goal.id == id );
        let updated = Object.assign({}, goal, { score });
        updateGoal( updated );
    }*/
    /*
    let [ scores, setScore ] = useState( initScores );

    const updateScore = ( id, score ) => {
        const goal = scores.find( e => e.id === id );
        const index = scores.indexOf( goal );
        let newScores = [...scores];
        newScores.splice( index, 1, {
            id,
            score,
            name: goal.name,
            isTimed: goal.isTimed
        })
        setScore( newScores );
    } 
*/
    //const renderItem = ({ item }) => <AssessmentInput updateScore={updateScore} goal={item}/>
    const renderItem = ({ item }) => (
        <ListItem bottomDivider onPress={()=>navigation.navigate('AssessmentInput', {goal: item})}>
            <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content>
                <ListItem.Title>Score: {item.score}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color='#444'/>
        </ListItem>
    );

    const submit = () => {
        const leuks = goals.reduce((a,b) => a + b.score, 0 );
        submitAssessment( leuks );
       //navigation.navigate("Game", {width, height});
    }
      
    const disableSubmit = goals.find( e => e.score === 0) || dayComplete;
    return(
        <View style={styles.container}>
            <FlatList 
                data={ goals }
                renderItem={renderItem}
                keyExtractor={item=>item.id.toString()}
            />
            <View style={styles.buttonRow}>
                <TouchableOpacity 
                disabled={ disableSubmit } 
                style={[
                    styles.button, 
                    { backgroundColor: disableSubmit ? '#aaa' : MAUVE} 
                ]} 
                onPress={submit} >
                    <Text style={[styles.text, styles.buttonText]}>Submit Assessment</Text>
                </TouchableOpacity>
            </View>
            <StatusBar hidden={true} />
        </View>
    )
}

export default connect( mapStateToProps, mapDispatchToProps )(Assessment);

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-end',
        justifyContent: 'space-around',
    },
    text: {
        fontSize: 20,
        color: '#000'
    },
    button:{
        padding: 5,
    },
    buttonText: {
        color: "#fff"
    },
    buttonRow: {
        padding: 10
    }
})

/*<ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />*/ 