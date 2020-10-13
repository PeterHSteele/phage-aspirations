import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux';
import { Picker } from '@react-native-community/picker';
import { Title, Subtitle } from './Texts'

const UnconnectedSettings = ({changeDifficulty, difficulty}) => (
    <View style={styles.settingsContainer}>
        <View style={[styles.setting, styles.odd]}>
            <Title>Difficulty</Title>
            <Subtitle>How strict do you want to be?</Subtitle>
            <Picker
            selectedValue={difficulty}
            onValueChange={(itemValue) => changeDifficulty(itemValue)}>
                <Picker.Item label="Easy" value={1} />
                <Picker.Item label="Medium" value={2}/>
                <Picker.Item label="Hard" value={3}/>
            </Picker>
        </View>
    </View>
);

const Settings = connect(mapStateToProps,mapDispatchToProps)(UnconnectedSettings)

export { Settings };

const styles = StyleSheet.create({
    settingsContainer:{
        backgroundColor: '#fff',
        flex: 1,
    },
    setting:{
        padding: 10,
        flex: 1,
    },
    odd:{
        backgroundColor: '#f5f5f5',
    }
});