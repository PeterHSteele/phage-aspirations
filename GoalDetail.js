import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, StatusBar, ScrollView, Keyboard, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-community/picker';
import RadioInput from './RadioInput';
import constants from './constants';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux.js';
import { render } from 'react-dom';
const { SEAGREEN, MAUVE } = constants;

function GoalDetail({ route, updateGoal, navigation }){
    const detail = route.params;
    if ( ! detail.time ){
        detail.time = {duration: '15', unit: 'minutes'}
    }
    let { description, isTimed, time, name, id } = detail,
        { duration, unit } = time;
        [ description, setDescription ] = useState( description );
        [ isTimed, setIsTimed ] = useState( isTimed ),
        [ unit, setUnit ] = useState( unit ),
        [ duration, setDuration ] = useState( duration )  
          
    const renderIsTimedChoices = ({item}) => {
        return (
            <RadioInput 
                background={isTimed === item? SEAGREEN : '#fff'}
                handlePress={setIsTimed}
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
        updateGoal({ id, name, description, isTimed, time });
        navigation.navigate('Home');
    }

    return(
        <ScrollView contentContainerStyle={[styles.container, { flex: isTimed ? 0 : 1}]}>
            <View style={styles.control}>
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
            </View>

            <View style={styles.control}>
                <Text style={[styles.text, styles.label]}>{'This is a timed goal.'}</Text>
                <FlatList 
                data={[true, false]}
                horizontal={true}
                contentContainerStyle={styles.inputRow}
                renderItem={renderIsTimedChoices}
                keyExtractor={item=>item.toString()}
                />
            </View>
            {isTimed && 
            <View>
                <View style={styles.control}>
                    <Text style={styles.text}>I will work on <Text style={styles.timeSentence}>{detail.name}</Text> for {duration} {unit} each day.</Text>
                </View>
                <View style={[styles.control, styles.timeControl]}>
                    <Text style={[styles.text,styles.label, styles.durationLabel]}>Set duration:</Text>
                    <TextInput
                    style={[styles.input, styles.text, styles.timeValueInput]}
                    keyboardType='numeric'
                    value={duration}
                    onBlur={()=>Keyboard.dismiss()}
                    onChangeText={setDuration}
                    />
                </View>
                <View style={[styles.control, styles.timeControl]}>
                <Text style={[styles.text,styles.label, styles.unitLabel]}>Set Unit:</Text>
                <FlatList 
                data={['hours', 'minutes']}
                horizontal={true}
                contentContainerStyle={styles.inputRow}
                keyExtractor={item=>item}
                renderItem={renderUnitChoices}
                />
                </View>
            </View> }
            <View style={[styles.control, styles.saveControl]}>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={[styles.text, styles.saveButtonText]}>Save Changes</Text>
                </TouchableOpacity>
            </View>
            <StatusBar hidden={true} />
        </ScrollView>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(GoalDetail);

const styles = StyleSheet.create({
    control:{
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    container:{
        paddingVertical: 10,
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
        color: '#fff',
        textAlign: 'center',
        fontWeight: '900',
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