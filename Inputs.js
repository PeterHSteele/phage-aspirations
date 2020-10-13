import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const HomeButton = ({text, backgroundColor, handlePress, disabled}) => (
    <View style={styles.row}>
        <TouchableOpacity 
        style={[styles.panelButton, {backgroundColor}]} 
        disabled={disabled}
        onPress={handlePress}>
            <Text style={[styles.panelButtonText]}>{text}</Text>
        </TouchableOpacity>
    </View> 
);

const ActionButton = ({ style, children, handlePress }) => (
    <TouchableOpacity style={[styles.panelButton, style]} onPress={handlePress}>
        <Text style={[styles.panelButtonText]}>{children}</Text>
    </TouchableOpacity>
)

export { HomeButton, ActionButton };

const styles = StyleSheet.create({
    row:{
        /*paddingHorizontal: 10,*/
        margin: 5
    },
    panelButton: {
        padding: 10
    },
    panelButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },

})

