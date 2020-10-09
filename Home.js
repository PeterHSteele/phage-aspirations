import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Picker, StatusBar } from 'react-native';
import{ ListItem, Title, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './goalGameRedux';
import constants from './constants';
import GoalDetail from './GoalDetail';
import Button from './Button';
const { MAUVE, GRAYGREEN, SEAGREEN, GREEN, LIGHTBLUE, LIGHTGRAY } = constants;

const Home = function({ difficulty, changeDifficulty, addGoal, goals, loggedIn, startAssessment, removeGoal, showDetail }){

    let [ addGoalInputVal, updateInputVal ] = useState('');

    const getDate = () => {
        const today = new Date();
        const month = constants.MONTHS[today.getMonth()],
        date = today.getDate(),
        day = constants.DAYS[today.getDay()];
        return "Today is " + day + ", " + month + ' ' + date + '.';
      }
      
      let extractKey = ( { id } ) => id.toString();
      if ( !loggedIn ){
        return (
          <ThemeProvider theme={theme}>
            <LogIn authenticate={authenticate}/>
          </ThemeProvider>
        )
      }

    const updateState = ( id ) => {
      setState({
        ...state,
        detailId: id
      })
    }

    const renderItem = ( { item } ) =>{
        /*return <ListItem 
            buttonGroup={{
             buttons:['remove', 'view'],
             buttonStyle: {backgroundColor: MAUVE},
             textStyle: {color:'#fff'},
             onPress:()=>removeGoal(item.id)
           }}
           onPress={()=>alert('press')}
           containerStyle={[styles.listItem]}
           content={{
             children: <Button 
              style={styles.panelButton}
              text={'Remove'}
              handlePress={removeGoal} 
              />
           }}
           title={{
             children:item.name,
             style: [styles.text, styles.goalText]
            }} />*/
      return(
        <View style={styles.listItem}>
          <Text style={[styles.text,styles.goalText]}>{item.name}</Text>
          <TouchableOpacity style={[styles.panelButton, styles.editButton]} onPress={()=>showDetail(item.id)}>
            <Text style={[styles.text, styles.panelButtonText]}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.panelButton, styles.removeButton]} onPress={()=>removeGoal(item.id)}>
            <Text style={[styles.text,styles.panelButtonText]}>Remove</Text>
          </TouchableOpacity>
        </View>
      )
    }

    const handleSubmitAddGoal = ({nativeEvent}) =>{
      addGoal(addGoalInputVal)
      updateInputVal('')
    }

    const handleAddGoalInputChange = ( text ) => {
      updateInputVal( text );
    }

    return (
    <View style={styles.container}>
      
      <View>
       <Input 
          onSubmitEditing={handleSubmitAddGoal}
          onChangeText={handleAddGoalInputChange}
          inputStyle={[styles.text,styles.textInput]}
          value={addGoalInputVal}
          placeholder={'new goal'} />
      </View> 
      
      <View style={[styles.row, styles.listItemWrap]}>
        <FlatList
        renderItem={renderItem} 
        keyExtractor={extractKey}
        data={goals}/>
      </View>
       
        <View style={[styles.row, styles.dateRow]}>
          <Text style={[styles.text,styles.date]}>{getDate()}</Text>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.panelButton]} onPress={startAssessment}>
            <Text style={[styles.text, styles.panelButtonText]}>Start Assessment</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.row]}>
          <Picker
          selectedValue={difficulty}
          onValueChange={(itemValue, itemIndex) => changeDifficulty(itemValue)}>
            <Picker.Item label="Easy" value={1} />
            <Picker.Item label="Medium" value={2}/>
            <Picker.Item label="Hard" value={3}/>
          </Picker>
        </View>

        <StatusBar hidden={true} />
      </View>
    )
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );


const styles = StyleSheet.create({
    container: {
      marginHorizontal: 5,
      marginVertical: 20,
      flex: 1,
      backgroundColor: '#fff',
     // alignItems: 'center',
      justifyContent: 'center',
    },
    row:{
      paddingHorizontal: 10,
      margin: 5
    },
    textInput:{
      backgroundColor: '#ddd',
      padding: 10
    },
    text:{
      fontSize: 18,
    },
    button:{
      padding: 10,
    },
    panelButton: {
      backgroundColor: SEAGREEN,
      padding: 10
    },
    listItemWrap:{
      marginBottom: 40,
    },
    listItem:{
      paddingVertical: 1,
      flexDirection:'row',
      alignItems: 'center',
      //backgroundColor: GRAYGREEN,
      //borderBottomWidth: 2,
      //borderBottomColor: LIGHTGRAY,
    },
    removeButton:{
      backgroundColor: MAUVE
    },
    editButton: {
      backgroundColor: SEAGREEN,
    },
    goalText:{
      flex: 1,
      color: LIGHTGRAY,
    },
    panelButtonText: {
      color: '#fff',
      textAlign: 'center'
    },
    date:{
    },
    buttonPanel:{
      marginHorizontal: 15
    },
  });