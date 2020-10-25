import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import {connect } from 'react-redux';
import { Row } from './Views';
import { ActionButton, HomeButton } from './Inputs';
import { ListItem } from 'react-native-elements';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux';
import { Subtitle, Title } from './Texts';
import constants from './constants';
const { SEAGREEN, MAUVE } = constants;

const UnconnectedGoalList = ({goals, removeGoal, navigation}) => {

    const newGoal = () => {
        return { 
            id: goals.length, 
            name: '', 
            score: 0, 
            description: '', 
            isTimed: false, 
            time: {
                unit: 'minutes', 
                duration: '15', 
                spent: 0 
            } 
        };
    };

    const getRouteParams = ( isNew, goal ) => {
        return {
            isNew,
            goal
        }
    }

    const listHeaderComponent = () => (
        <Row>
            <HomeButton 
            handlePress={()=>navigation.navigate( 'Detail', getRouteParams( true, newGoal() ) )} 
            backgroundColor={SEAGREEN} 
            text="Add Goal"/>
        </Row>
    );

    const renderItem = ( { item } ) =>{
        /*return(
          <ListItem pad={0} containerStyle={styles.listItem} bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={styles.title}>{item.name}</ListItem.Title>
               
                <Subtitle style={styles.description}>{item.description}</Subtitle>
            
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
        )*/
        

        return(
            <View style={styles.listItem}>
                <Title style={styles.title}>{item.name}</Title>
                <View style={styles.buttonGroup}>
                <ActionButton 
                style={{backgroundColor: SEAGREEN}} 
                handlePress={()=>navigation.navigate('Detail',getRouteParams(false,item))}>
                    Details
                </ActionButton>
                <ActionButton 
                style={{backgroundColor: MAUVE}} 
                handlePress={()=>removeGoal(item.id)}>
                    Remove
                </ActionButton>
                </View>
                <Subtitle style={styles.description}>{item.description}</Subtitle>
            </View>
        );
    }

    const extractKey = ( { id } ) => id.toString();

    return (
       <View>
            <FlatList
            ListHeaderComponent = {listHeaderComponent}
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
    listItem:{
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingHorizontal: 5,
        paddingTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    description:{
        paddingVertical: 5,
        flexBasis:'100%',
    },
})