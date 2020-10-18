import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import {connect } from 'react-redux';
import { Row } from './Views';
import { ActionButton } from './Inputs';
import { ListItem } from 'react-native-elements';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux';
import { Title } from './Texts';
import constants from './constants';
const { SEAGREEN, MAUVE } = constants;

const UnconnectedGoalList = ({goals, removeGoal, navigation}) => {
    const renderItem = ( { item } ) =>{
        return(
          <ListItem pad={0} containerStyle={styles.listItem} bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={styles.title}>{item.name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content style={[styles.buttonGroup]}>
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
            </ListItem.Content>
          </ListItem>
        )
    }

    const extractKey = ( { id } ) => id.toString();

    return (
       <View>
            <FlatList
            //ListHeaderComponent = {listHeaderComponent}
            renderItem={renderItem} 
            keyExtractor={extractKey}
            //ListFooterComponent={listFooterComponent}
            data={goals}/>
       </View>
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
        fontSize: 18,
    },
    buttonGroup:{
        flexDirection: 'row',
    },
    listItem:{/*
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingLeft: 5,*/
        padding: 5,
        //paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
})