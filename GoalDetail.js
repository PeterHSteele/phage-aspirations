import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, StatusBar } from 'react-native';
import {Picker} from '@react-native-community/picker';
import RadioInput from './RadioInput';
import constants from './constants';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux.js';
const { SEAGREEN } = constants;

function GoalDetail({ detail, updateGoal }){
    let { description, isTimed, time } = detail,
        { unit, value } = time;
        [ description, setDescription ] = useState( description ),
        [ isTimed, setIsTimed ] = useState( isTimed ),
        [ unit, setUnit ] = useState( unit ),
        [ value, setValue ] = useState( value)
/*
    const setUnit = ( unit ) => {
        return updateDetails({
            ...details,
            time:{
                ...details.time,
                unit,
            }
        });
    }*/

    /*const setTime = ( time ) => {
        return updateDetails({
            ...details,
            time: {
                ...details.time,
                time
            }
        });
    }*/
/*
    const update = (...properties ) => {
        if ( properties.length > 2 ){
            ele = properties.shift();
            let sub = update( 
                ...properties
            );
            
            return obj =  { [ele]: sub }
           
        } else{
            let base = {[properties[0]]: properties[1] }
            //console.log('base', base);
            return base;
        } 
    }

    const setState = ( ...properties ) => updateState(Object.assign({...state},update(...properties)));

    /*const makeUpdater = ( prop ) => (val) => {
        return { [prop]: val };
    }
    const makeInnerUpdater = ( prop1 ) => ( prop2 ) => {}
   const callUpdater = ( obj ) => updateState(Object.assign({...state}, obj ));
    const updateDetail = (...properties) => {
        let current = {...state}, 
        index=0;
        while ( properties[index+2] ){
            current = current[index];
            index++;
        }
        current[properties[index]]=properties[index+1];
        updateState(current);
    }

   function uuu(prop1){
       return function(prop2){
           return function (prop3){
               return {
                   [prop1]: {
                       [prop2]: prop3
                   }
               }
           }
       }
   }

   uuu = prop1 => prop2 => prop3 =>{
       return {
           ...state,
           [prop1]:{
               ...state[prop1],
               [prop2]: prop3
           }
       }
   }

    const uu = uuu('time')
    console.log(uuu('time')('unit')('minutes'));
    
    let callUpdater = ( obj ) => updateState(Object.assign({...state}, obj ));

    let updateTwo = prop => prop1 => val => updateOne(prop,updateOne(prop1)(val));

    const updateOne = prop => val => {
        return {[prop]: val};
    }

    console.log('u1', updateOne())
/*
    const [setOne,setTwo] = [updateOne,updateTwo].map(fn=>(val)=>val1=>callUpdater(fn(val)(val1)))
*/
    const makeUpdater = ( prop ) => (val) => { return { [prop]: val }},
          //callUpdater = ( obj ) => updateState(Object.assign({...state}, obj )),
          setDesc = makeUpdater( 'description' ),
          setTime = makeUpdater( 'time' ),
          //setUnit = makeUpdater( 'unit' ),
          //setValue = makeUpdater( 'value' ),
          setTimed = makeUpdater( 'isTimed'),
          updateDesc = (text) => callUpdater(setDesc(text)),
          updateTimed = ( bool ) => callUpdater(setTimed(bool)),
          [updateUnit, updateValue] = [setUnit, setValue].map( fn => (value) => callUpdater(setTime(fn(value))));
          

    return(
        <View style={styles.container}>
            <View style={styles.control}>
                <Text>Add a description.</Text>
                <TextInput 
                style={[styles.input]} 
                multiline 
                numberOfLines={4} 
                value={description}
                onChangeText={setDescription}
                onSubmitEditing={()=>alert('subdescField')}
                />
            </View>

            <Text>{description}</Text>
            <View>
                <RadioInput 
                label={'Add time information'}
                colorTrue={SEAGREEN} 
                colorFalse={'#fff'}
                checked={isTimed}
                handlePress={setIsTimed}
                />
            </View>

            <View style={styles.control}>
                <Text>Choose a Unit of Time</Text>
                <Picker
                selectedValue={unit} 
                onValueChange={setUnit}
                >
                    <Picker.Item label='Min.' value='minutes'/>
                    <Picker.Item label='Hours' value='hours'/>
                </Picker>
            </View>
            <Text>{time.unit}</Text>
            <View style={styles.control}>
                <Text>Time each day</Text>
                <TextInput
                style={styles.input}
                //keyboardType='numeric'
                onChangeText={updateValue}
                />
            </View>
            
            <StatusBar hidden={true} />
        </View>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(GoalDetail);

const styles = StyleSheet.create({
    container:{
        paddingVertical: 10,
    },
    input:{
        backgroundColor: '#ccc',
        lineHeight: 20,
    }
})