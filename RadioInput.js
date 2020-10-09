import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import constants from './constants';
const { SEAGREEN } = constants;

export default function RadioInput({colorTrue, colorFalse, handlePress, label, checked}){
    return (
        <View style={styles.control}> 
            <TouchableOpacity style={[
                styles.bubble, 
                { 
                    backgroundColor: checked ? colorTrue : colorFalse,
                    //borderColor: colorTrue, 
                }]} 
                onPress={()=>handlePress(!checked)}></TouchableOpacity>
            <Text style={styles.text}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bubble:{
        borderWidth: 2,
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 2
    },
    control:{
        alignItems: 'center',
    },
    text:{
        color: '#000',
        fontSize: 20
    },
})