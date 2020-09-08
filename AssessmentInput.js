import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import constants from './constants';
const { SEAGREEN, GRAYGREEN } = constants;


export default function AssessmentInput({ goal, updateScore }){

    const ratings = new Array(5).fill(false).map( (e,i) => {
       return i + 1; 
    });
    
    const renderItem = ({item}) => {

        return (
            <View style={styles.control}> 
                <TouchableOpacity style={[styles.bubble, { backgroundColor: item == goal.score ? SEAGREEN : '#fff' }]} onPress={()=>updateScore( goal.id, item )}></TouchableOpacity>
                <Text style={styles.text}>{item}</Text>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.row}>
                <Text style={[ styles.text, styles.goalName ]}>{goal.name}</Text>
            </View>
            <View style={styles.row}>
                <FlatList
                    data={ratings}
                    horizontal={true}
                    renderItem={renderItem}
                    contentContainerStyle={styles.inputRow}
                    keyExtractor={item=>item.toString()}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row:{
        marginVertical: 5
    },
    text:{
        color: '#000',
        fontSize: 20
    },
    goalName:{
        marginLeft: 5
    },
    bubble:{
        borderWidth: 2,
        height: 50,
        width: 50,
        borderColor: SEAGREEN,
        borderRadius: 25
    },
    control:{
        alignItems: 'center',
    },
    inputRow:{
        justifyContent: 'space-around', 
        flex: 1, 
        alignItems: 'flex-start'
    }
})