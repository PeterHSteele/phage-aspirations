import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, StatusBar, ScrollView, Keyboard, Animated, KeyboardAvoidingView } from 'react-native';
import {Picker} from '@react-native-community/picker';
import RadioInput from './RadioInput';
import constants from './constants';
import { connect } from 'react-redux';
import { Control, SlideDown } from './Views';
import { Subtitle } from './Texts';
import { HomeButton } from './Inputs';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux.js';
import { render } from 'react-dom';
const { SEAGREEN, MAUVE } = constants;

function GoalDetail({ route, updateGoal, navigation }){
    const detail = route.params;
    if ( ! detail.time ){
        detail.time = {duration: '15', unit: 'minutes'}
    }
    let { description, isTimed, time, name, score, id } = detail,
        { duration, unit } = time;
        [ description, setDescription ] = useState( description );
        [ isTimed, setIsTimed ] = useState( isTimed ),
        [ unit, setUnit ] = useState( unit ),
        [ duration, setDuration ] = useState( duration ) 
     
    const HEIGHT = 200;   

    const handleIsTimedChange = ( val ) => {
        setIsTimed(val);
    }
    
    const renderIsTimedChoices = ({item}) => {
        return (
            <RadioInput 
                background={isTimed === item? SEAGREEN : '#fff'}
                handlePress={handleIsTimedChange}
                containerStyle={{alignItems:'center', padding: 5}}
                label={item === true ? 'yes' : 'no' }
                value={item}
                labelStyle={styles.radioLabel}
                />
        )
    }

    const renderUnitChoices = ({item}) => {
        return (
            <RadioInput
            background={unit === item? SEAGREEN : '#fff'}
            handlePress={setUnit}
            containerStyle={{alignItems:'center', padding: 5}}
            label={item[0].toUpperCase()+item.slice(1)}
            value={item}
            labelStyle={styles.radioLabel}
            />
        )
    }

    const handleSave = () => {
        const newTime = { duration, unit }
        updateGoal({ id, name, description, isTimed, score, time: newTime });
        navigation.navigate('Home');
    }
    //contentContainerStyle={[styles.container, { flex: 0}]}
    /* */
    return(
        <KeyboardAvoidingView 
        contentContainerStyle={[/*styles.containerStyle,{height: isTimed? 'auto' : '100%' }*/]}
        behavior='position'>
        <ScrollView /*contentContainerStyle={[{flex: 1 }]}*/>
          <Control>
                <Text style={[styles.text, styles.label]}>Add a description for this goal.</Text>
                <TextInput 
                style={[styles.input, styles.text, styles.descInput]}
                onBlur={()=>Keyboard.dismiss()} 
                multiline={true} 
                numberOfLines={4} 
                value={description}
                onChangeText={setDescription}
                onSubmitEditing={()=>Keyboard.dismiss()}
                />
            </Control>
            <Text>{duration}</Text>
            <Control>
                <Text style={[styles.text, styles.label]}>{'This is a timed goal.'}</Text>
                <FlatList 
                data={[true, false]}
                horizontal={true}
                contentContainerStyle={styles.inputRow}
                renderItem={renderIsTimedChoices}
                keyExtractor={item=>item.toString()}
                />
            </Control>
            <SlideDown isOpen={isTimed} height={HEIGHT} duration={150}>
                <Control style={styles.timeControl}>
                    <Text style={[styles.text,styles.label, styles.durationLabel]}>Set duration:</Text>
                    <TextInput
                    style={[styles.input, styles.text, styles.timeValueInput]}
                    keyboardType='numeric'
                    value={duration}
                    onBlur={()=>Keyboard.dismiss()}
                    onChangeText={setDuration}
                    />
                </Control>
                <Control style={styles.timeControl}>
                    <Text style={[styles.text,styles.label, styles.unitLabel]}>Set Unit:</Text>
                    <FlatList 
                    data={['hours', 'minutes']}
                    horizontal={true}
                    contentContainerStyle={styles.inputRow}
                    keyExtractor={item=>item}
                    renderItem={renderUnitChoices}
                    />
                </Control>
                <Control>
                    <Subtitle>I will work on <Text style={styles.timeSentence}>{detail.name}</Text> for {duration} {unit} each day.</Subtitle>
                </Control>
            </SlideDown> 
            <Control style={styles.saveControl}>
                <HomeButton 
                handlePress={handleSave} 
                style={styles.saveButton} 
                backgroundColor={SEAGREEN} 
                textStyle={styles.saveButtonText} 
                text='Save Changes' />
            </Control>
            <StatusBar hidden={true} />
        </ScrollView>
        </KeyboardAvoidingView>
    )
}
export default connect(mapStateToProps, mapDispatchToProps)(GoalDetail);

const styles = StyleSheet.create({
    control:{
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    containerStyle:{
        minHeight: '100%',
    },
    text: {
        fontSize: 20
    },
    label:{
        
    },
    radioLabel:{
        color: '#666',
        fontSize: 16,
    },
    input:{
        backgroundColor: '#ddd',
        borderRadius: 5,
        padding: 5,
    },
    inputRow:{ 
        flex: 1, 
        alignItems: 'flex-start'
    },
    descInput:{
        height: 100,
    },
    timeSentence:{
        fontSize: 24,
        color: SEAGREEN,
    },
    timeControl:{
        flexDirection: 'row', 
        alignItems: 'center',
    },
    timeValueInput: {
        width: 40,
    },
    unitLabel:{
        marginRight: 40,
    },
    durationLabel:{
        marginRight: 5
    },
    saveButton:{
        backgroundColor: SEAGREEN,
        padding: 10
    },
    saveControl:{
        flex: 1,
        justifyContent: "flex-end",
    },
    saveButtonText:{
        fontWeight: '900',
        fontSize: 20,
    },
})

/*
 <Picker
                    selectedValue={unit} 
                    onValueChange={setUnit}
                    >
                        <Picker.Item label='Minutes' value='minutes'/>
                        <Picker.Item label='Hours' value='hours'/>
                    </Picker>*/