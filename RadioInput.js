import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import constants from './constants';
const { SEAGREEN } = constants;

export default function RadioInput({background, handlePress, value, label, containerStyle, labelStyle}){
    return (
        <View style={containerStyle}>
            <TouchableOpacity 
            style={[styles.bubble, {backgroundColor: background}]} 
            onPress={()=>handlePress(value)} 
            />
            <Text style={[styles.text, labelStyle]}>{label}</Text>
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
        fontSize: 20,
    },
})