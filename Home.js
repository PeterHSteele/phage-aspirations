import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Picker } from 'react-native';
import{ ListItem, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './goalGameRedux';
import constants from './constants';
const { MAUVE, GRAYGREEN } = constants;

const Home = function({ difficulty, changeDifficulty, addGoal, goals, loggedIn, startAssessment }){

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

    const renderItem = ( { item } ) =>{
        return <ListItem 
            /*buttonGroup={{
             buttons:[ 'done' ],
             buttonStyle: {backgroundColor: MAUVE},
             textStyle: {color:'#fff'},
             onPress:()=>markComplete(item.id)
           }}*/
            title={item.name}/>
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
       <Input 
          onSubmitEditing={handleSubmitAddGoal}
          onChangeText={handleAddGoalInputChange}
          inputStyle={styles.textInput}
          value={addGoalInputVal}
          placeholder={'new goal'} />
        <FlatList
        renderItem={renderItem} 
        keyExtractor={extractKey}
        data={goals}/>

        <Text style={styles.date}>{getDate()}</Text>

        <View style={styles.buttonPanel}>
          <TouchableOpacity style={[styles.button, styles.panelButton]} onPress={startAssessment}>
            <Text style={styles.text, styles.panelButtonText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>

        <Picker
        selectedValue={difficulty}
        onValueChange={(itemValue, itemIndex) => changeDifficulty(itemValue)}>
          <Picker.Item label="Easy" value={1} />
          <Picker.Item label="Medium" value={2}/>
          <Picker.Item label="Hard" value={3}/>
        </Picker>
        
      </View>
    )
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );

const styles = StyleSheet.create({
    container: {
      margin: 20,
      flex: 1,
      backgroundColor: '#fff',
     // alignItems: 'center',
      justifyContent: 'center',
    },
    textInput:{
      backgroundColor: '#ddd',
      fontSize:18,
      padding: 10
    },
    text:{
      fontSize: 18,
    },
    button:{
      padding: 10,
    },
    panelButton: {
      backgroundColor: MAUVE,
      margin: 5,
      padding: 10
    },
    panelButtonText: {
      color: '#fff',
    },
    date:{
      fontSize: 18,
    },
    buttonPanel:{
  
    },
  });