import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, StatusBar, ViewBase } from 'react-native';
import { Row } from './Views';
import { Subtitle } from './Texts';
import { TextInput } from 'react-native-gesture-handler';
import constants from './constants';
import RadioInput from './RadioInput';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux';
import { ListItem } from 'react-native-elements';
import NumericInput from 'react-native-numeric-input'
const { SEAGREEN, GRAYGREEN, MAUVE } = constants;

const convertTimeToScore = ( time, duration ) => Math.min(Math.max(Math.floor(time/duration * 5),1), 5);

const sanitizeTimeValue = (time, unit) => {
    return (
        time < 0 ? 0 : 
        time > 180 && unit == 'minutes' ? 180 : 
        time > 24 && unit === 'hours' ? 24 : 
        time
    )
}

function AssessmentInput({ navigation, route, updateGoal, goals }){
    const { goal } = route.params,
          { isTimed, time, id, score } = goal;
    
    let initTimeSpent = time.spent;

    let [ timeSpent, updateTimeSpent ] = useState( initTimeSpent ),
        [currentScore, updateScore ] = useState( convertTimeToScore(time.spent, time.duration)),
        [scoreSyncedToTime, updateScoreSyncedToTime] = useState( true );

    const ratings = new Array(5).fill(false).map( (e,i) => {
       return i + 1; 
    });

    const handleTimeSpentChange = ( val ) => {
        const sanitizedTime = sanitizeTimeValue( val, time.unit );
        updateTimeSpent( sanitizedTime );
        updateScore( convertTimeToScore( sanitizedTime, time.duration ));
        updateScoreSyncedToTime(true);
    }

    const handleScoreChange = (score) => {
        updateScore(score);
        updateScoreSyncedToTime(false);
    }

    const handleSubmit = () =>{
        let goalToUpdate = goals.find( goal  => goal.id == id );
        const newTimeObj = Object.assign(time, {spent: timeSpent})
        let updated = Object.assign(
            {}, 
            goalToUpdate, 
            { 
                score: currentScore,    
                time: newTimeObj
            },
        )
        updateGoal( updated );
        navigation.navigate('Assessment');
    }
    
    const renderItem = ({item}) => {
        return (
            <RadioInput
            background={item > currentScore? '#fff' : scoreSyncedToTime ? GRAYGREEN : SEAGREEN}
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
            <Row>
                <Text style={[ styles.text, styles.goalName ]}>{goal.name}</Text>
            </Row>
            {goal.isTimed && <Row style={styles.goalActual}>
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
                    step={ time.unit === 'minutes' ? 15 : 1}
                    minValue={0}
                    maxValue={ time.unit === 'minutes' ? 180 : 24 }
                    rounded/>
                    <Text style={[styles.numericInputText, styles.boxLabel]}>{goal.time.unit}</Text>
                </View>
            </Row>}
            <Row>
                <Text style={[styles.text]}>Score {scoreSyncedToTime ? '(suggested)' : ''}</Text>
            </Row>
            <Row>
                <FlatList
                    data={ratings}
                    horizontal={true}
                    renderItem={renderItem}
                    contentContainerStyle={styles.inputRow}
                    keyExtractor={item=>item.toString()}
                />
           </Row>
            <Row>
                <TouchableOpacity style={[styles.submitButton]} onPress={handleSubmit}>
                    <Text style={[styles.text, styles.submitButtonText]}>Submit</Text>
                </TouchableOpacity>
            </Row>
            <StatusBar barStyle="dark-content"/>
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