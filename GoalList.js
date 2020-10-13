import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import {connect } from 'react-redux';
import { Row } from './Views';
import { ActionButton } from './Inputs';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux';
import { Title } from './Texts';
import constants from './constants';
const { SEAGREEN, MAUVE } = constants;

const UnconnectedGoalList = ({goals, removeGoal, navigation}) => {
    const renderItem = ( { item } ) =>{
        return(
          <View style={styles.listItem}>
            <Title style={styles.title}>{item.name}</Title>
            <ActionButton 
            style={{backgroundColor: SEAGREEN}} 
            handlePress={()=>navigation.navigate('Detail',item)}>
                Details
            </ActionButton>
            <ActionButton 
            style={{backgroundColor: MAUVE}} 
            handlePress={()=>removeGoal(item.id)}>
                Remove
            </ActionButton>
          </View>
        )
    }

    const extractKey = ( { id } ) => id.toString();

    return (
       <Row>
            <FlatList
            //ListHeaderComponent = {listHeaderComponent}
            renderItem={renderItem} 
            keyExtractor={extractKey}
            //ListFooterComponent={listFooterComponent}
            data={goals}/>
       </Row>
    )
};

const GoalList = connect(mapStateToProps, mapDispatchToProps)(UnconnectedGoalList);

export { GoalList };

const styles = StyleSheet.create({
    text:{
        fontSize: 18,
    },
    title:{
        flex: 1,
    },
    listItem:{
        paddingVertical: 1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
})