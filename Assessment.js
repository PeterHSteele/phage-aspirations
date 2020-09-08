import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AssessmentInput from "./AssessmentInput";
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './goalGameRedux';
import constants from './constants';
const { MAUVE } = constants;
import store from './store';

function Assessment({ goals, submitAssessment }){
    //const initScores = Object.fromEntries( goals.map( e => [ e.name, 0 ] ));
    const initScores = goals.map( e => {
        return { id: e.id, name: e.name, score: 0 }
    });

    let [ scores, setScore ] = useState( initScores );

    const updateScore = ( id, score ) => {
        const goal = scores.find( e => e.id === id );
        const index = scores.indexOf( goal );
        let newScores = [...scores];
        newScores.splice( index, 1, {
            id,
            score,
            name: goal.name
        })
        setScore( newScores );
    } 

    const renderItem = ({ item }) => <AssessmentInput updateScore={updateScore} goal={item}/>

    const submit = () => {
        const leuks = scores.reduce((a,b) => a + b.score, 0 );
        submitAssessment( leuks );
    }
      
    const disableSubmit = scores.find( e => e.score === 0) ? true : false;
    return(
        <View>
            <FlatList 
                data={scores}
                renderItem={renderItem}
                keyExtractor={item=>item.id.toString()}
            />
            <View style={styles.buttonRow}>
                <TouchableOpacity 
                disabled={ disableSubmit } 
                style={[
                    styles.button, 
                    { backgroundColor: disableSubmit ? '#ddd' : MAUVE} 
                ]} 
                onPress={submit} >
                    <Text style={[styles.text, styles.buttonText]}>Submit Assessment</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default connect( mapStateToProps, mapDispatchToProps )(Assessment);

const styles = StyleSheet.create({
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