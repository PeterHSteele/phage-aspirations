import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import constants from './constants';
import RadioInput from './RadioInput';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux';
import { ListItem } from 'react-native-elements';
import NumericInput from 'react-native-numeric-input'
const { SEAGREEN, GRAYGREEN, MAUVE } = constants;

const convertTimeToScore = ( time, duration ) => Math.floor(time/duration * 5);

function AssessmentInput({ navigation, route, updateGoal, goals }){
    const { goal } = route.params,
          { isTimed, time, id } = goal;
    
    let initTimeSpent = 0, initScore = 0;
    if ( isTimed ){
        /*get initial time spent value*/
        initTimeSpent = time.duration * 1;//convert string to number
        initTimeSpent = initTimeSpent/2;
        if ( time.unit == 'minutes' ){
            initTimeSpent = Math.floor( initTimeSpent/15 ) * 15//round down to nearest multiple of 15
        }
        /*get initial score value*/
        initScore = convertTimeToScore( initTimeSpent, time.duration );
    }
    
    let [ timeSpent, updateTimeSpent ] = useState( initTimeSpent ),
        [score, updateScore ] = useState( initScore ),
        [scoreSyncedToTime, updateScoreSyncedToTime] = useState( true );

    const ratings = new Array(5).fill(false).map( (e,i) => {
       return i + 1; 
    });

    const handleTimeSpentChange = ( val ) => {
        updateTimeSpent( val );
        updateScore( convertTimeToScore( val, time.duration ));
        updateScoreSyncedToTime(true);
    }

    const handleScoreChange = (score) => {
        updateScore(score);
        updateScoreSyncedToTime(false);
    }

    const handleSubmit = () =>{
        let goalToUpdate = goals.find( goal  => goal.id == id );
        let updated = Object.assign({}, goalToUpdate, { score });
        updateGoal( updated );
        navigation.navigate('Assessment');
    }
    
    const renderItem = ({item}) => {
        
        /*return (
            <View style={styles.control}> 
                <TouchableOpacity style={[styles.bubble, { backgroundColor: item == goal.score ? SEAGREEN : '#fff' }]} onPress={()=>updateScore( goal.id, item )}></TouchableOpacity>
                <Text style={styles.text}>{item}</Text>
            </View>
        );*/

        return (
            <RadioInput
            background={item > score? '#fff' : scoreSyncedToTime ? GRAYGREEN : SEAGREEN}
            containerStyle={{alignItems:'center', padding: 5}}
            checked={item==score}
            handlePress={()=>handleScoreChange(item)}
            label={item}
            value={item}
            labelStyle={styles.radioLabel}
            />
        )
    }
    return (
        <View>
            <View style={[styles.row]}>
                <Text style={[ styles.text, styles.goalName ]}>{goal.name}</Text>
            </View>
            {goal.isTimed && <View style={[styles.row, styles.goalActual]}>
                <View style={[styles.box]}>
                    <Text style={[styles.text, styles.boxLabel]}>Goal:</Text>
                    <Text style={[styles.boxLabel]}>{goal.time.duration} {goal.time.unit}</Text>
                </View>
                <View style={[styles.box]}>
                    <Text style={[styles.text, styles.boxLabel]}>Actual:</Text>
                    <NumericInput 
                    value={timeSpent} 
                    totalWidth={140}
                    totalHeight={70}
                    valueType='real' 
                    onChange={handleTimeSpentChange} 
                    step={ goal.time.unit === 'minutes' ? 15 : 1}
                    rounded/>
                    <Text style={[styles.numericInputText, styles.boxLabel]}>{goal.time.unit}</Text>
                </View>
            </View>}
            <View style={[styles.row]}>
                <Text style={[styles.text]}>Score {scoreSyncedToTime ? '(suggested)' : ''}</Text>
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
            <View style={[styles.row]}>
                <TouchableOpacity style={[styles.submitButton]} onPress={handleSubmit}>
                    <Text style={[styles.text, styles.submitButtonText]}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default connect( mapStateToProps, mapDispatchToProps)(AssessmentInput);

const styles = StyleSheet.create({
    row:{
        marginVertical: 5,
        paddingHorizontal: 5,
    },
    timeInputRow:{
        /*flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',*/
    },
    timeInputUnitWrap:{
        flexDirection: 'row',
        alignSelf: 'center',
    },
    unitLabel: {
        marginLeft: 2,
    },
    text:{
        color: '#000',
        fontSize: 20
    },
    numericInputText:{
        fontSize: 18,
        color: '#444',
    },
    goalActual:{
        flexDirection: 'row',
    },
    box:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ccc',
        borderRadius: 5,
    },
    boxLabel:{
        marginVertical: 5,
    },
    goalName:{
        marginLeft: 0,
        textAlign: 'center',
        color: SEAGREEN,
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
    },
    radioLabel:{
        color: '#666',
        fontSize: 16,
    },
    submitButton:{
        padding: 10,
        alignSelf: 'center',
        backgroundColor: MAUVE,
    },
    submitButtonText: {
        color: '#fff',
    }
})