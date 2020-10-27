import React, { useState, useRef } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, Text, TextInput, FlatList, StyleSheet, StatusBar, ScrollView, Keyboard, KeyboardAvoidingView } from 'react-native';
import {Picker} from '@react-native-community/picker';
import RadioInput from './RadioInput';
import constants from './constants';
import { connect } from 'react-redux';
import { Control, SlideDown } from './Views';
import { Subtitle, Error } from './Texts';
import { HomeButton } from './Inputs';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux.js';
import { render } from 'react-dom';
const { SEAGREEN, MAUVE } = constants;
import { firebase } from './firebase/firebaseConfig';
import { addGoal } from './firebase/index';

function GoalDetail({ route, updateGoal, navigation }){
    const detail = route.params.goal,
          isNew = route.params.isNew;
    if ( ! detail.time ){
        detail.time = {duration: '15', unit: 'minutes'}
    }
    let { description, isTimed, time, name, score, id } = detail,
        { duration, unit, spent } = time;
    let [ localName, setName] = useState(name),
        [ nameError, setNameError ] = useState(''),
        [ localDescription, setDescription ] = useState( description ),
        [ localIsTimed, setIsTimed ] = useState( isTimed ),
        [ localUnit, setUnit ] = useState( unit ),
        [ localDuration, setDuration ] = useState( duration )/*,
        [ offset, setOffset ] = useState({x:0,y:0});*/
     
    const HEIGHT = 200;   

    const handleIsTimedChange = ( val ) => {
        setIsTimed(val);
    }

   const container = useRef(null)
    
    const renderIsTimedChoices = ({item}) => {
        return (
            <RadioInput 
                background={localIsTimed === item? SEAGREEN : '#fff'}
                handlePress={handleIsTimedChange}
                containerStyle={{alignItems:'center', padding: 5}}
                label={item === true ? 'yes' : 'no' }
                value={item}
                labelStyle={styles.radioLabel}
                />
        )
    }

    const handleDurationInputFocus = () => {
        //setOffset({x:0,y:300});
        //console.log('scrollingtoEnd');
        //container.current.scrollToEnd();
    }

    const renderUnitChoices = ({item}) => {
        return (
            <RadioInput
            background={localUnit === item? SEAGREEN : '#fff'}
            handlePress={setUnit}
            containerStyle={{alignItems:'center', padding: 5}}
            label={item[0].toUpperCase()+item.slice(1)}
            value={item}
            labelStyle={styles.radioLabel}
            />
        )
    }

    const handleSave = () => {
        if ( ! localName.length ){
            setNameError('Please enter a name');
            return;
        }
        const newTime = { 
            duration: localDuration, 
            unit: localUnit, 
            spent 
        }
        const goal = { 
            id, 
            name: localName, 
            description: localDescription, 
            isTimed: localIsTimed, 
            score, 
            time: newTime 
        };
        if ( isNew ){
            addGoal(goal);
        } else {
            updateGoal(goal);
        }
        navigation.navigate('Home');
    }
    //contentContainerStyle={[styles.container, { flex: 0}]}
    /* */
    /*<KeyboardAvoidingView 
        contentContainerStyle={[/*styles.containerStyle,{height: isTimed? 'auto' : '100%' }*//*]}
        behavior='height'> <ScrollView 
        ref={container}
        contentContainerStyle={[/*{justifyContent:'center', alignItems: 'stretch',}*///]}>}
    return(
        <KeyboardAwareScrollView>
             <Control style={styles.saveControl}>
                <HomeButton 
                handlePress={handleSave} 
                style={styles.saveButton} 
                backgroundColor={SEAGREEN} 
                textStyle={styles.saveButtonText} 
                text='Save Changes' />
            </Control>
            {isNew && <Control>
                <Text style={[styles.text, styles.label]}>Name for this goal</Text>
                <TextInput 
                style={[styles.input, styles.text]}
                onBlur={()=>Keyboard.dismiss()} 
                value={localName}
                onChangeText={setName}
                onSubmitEditing={()=>Keyboard.dismiss()}
                returnKeyType={'done'}
                />
                <Error>{nameError}</Error>
            </Control>
            }
            <Control>
                <Text style={[styles.text, styles.label]}>Add a description for this goal.</Text>
                <TextInput 
                style={[styles.input, styles.text, styles.descInput]}
                onBlur={()=>Keyboard.dismiss()} 
                multiline={true} 
                numberOfLines={4} 
                value={localDescription}
                onChangeText={setDescription}
                onSubmitEditing={()=>Keyboard.dismiss()}
                returnKeyType={'done'}
                />
            </Control>
            <Control>
                <Text style={[styles.text, styles.label]}>This is a timed goal.</Text>
                <FlatList 
                data={[true, false]}
                horizontal={true}
                contentContainerStyle={styles.inputRow}
                renderItem={renderIsTimedChoices}
                keyExtractor={item=>item.toString()}
                />
            </Control>
            <SlideDown isOpen={localIsTimed} height={HEIGHT} duration={150}>
                <Control style={styles.timeControl}>
                    <Text style={[styles.text,styles.label, styles.durationLabel]}>Set duration:</Text>
                    <TextInput
                    style={[styles.input, styles.text, styles.timeValueInput]}
                    keyboardType='numeric'
                    maxLength={3}
                    value={localDuration}
                    onFocus={handleDurationInputFocus}
                    onBlur={()=>Keyboard.dismiss()}
                    onChangeText={setDuration}
                    returnKeyType={'done'}
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
            <StatusBar  />
       
        </KeyboardAwareScrollView>
    )
}

 /* </ScrollView></KeyboardAvoidingView>*/
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