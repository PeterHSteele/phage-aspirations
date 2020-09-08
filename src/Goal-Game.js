import React, { useState, useEffect } from 'react';
import { Provider, connect } from 'react-redux';
import { ThemeProvider, ListItem, } from 'react-native-elements'; 
//import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Picker } from 'react-native';
import store from '../store.js';
import { mapStateToProps, mapDispatchToProps } from '../goalGameRedux.js';
import Input from '../Input.js';
import ErrorBoundary from '../ErrorBoundary.js';
import LogIn from '../LogIn.js';
import Goal from '../Goal.js';
import { GameEngine } from 'react-native-game-engine';
import Game from '../Game';
import Assessment from '../Assessment';
import AssessmentInput from '../AssessmentInput';
import constants from '../constants';
const { GREEN, MAUVE } = constants


function GoalGame({ difficulty, changeDifficulty, goals, addGoal, removeGoal, users, loggedIn, authenticate, game, startGame ,endGame, score, completed, markComplete, bubbleControl, entities, openBubble, startAssessment, assessment }) {
 
  let [ state, updateState ] = useState([ {id:0, name:'bernie'} ] );  

  useEffect( ()=>{

    updateState( () => store.getState() );
    
    return store.subscribe( () => {
      return updateState(()=>store.getState())
    })
  
  //console.log(store.getState())
  })

  let getDerivedStateFromError = () => {
    return (<Text>error</Text>);
  }

  let renderItem = ( { item } ) =>{
    //alert(goals.map( e => e.id ));
   //if(completed[0]){alert(completed.map(e=>e.id))}
   return <ListItem 
      //leftAvatar={{source:'../../illustrations/camera.png' && {uri:'../../illustrations/camera.png'}}} 
       buttonGroup={{
        buttons:[ 'done' ],
        buttonStyle: {backgroundColor: GREEN},
        textStyle: {color:'#fff'},
        onPress:()=>markComplete(item.id)
      }}
       containerStyle={{backgroundColor: completed.map(e=>e.id).indexOf(item.id) > -1 ? 'lightblue' : '#eee'}}
       title={item.name}/>
   return <Text>{item.name}</Text>
   return( 
      <Goal goal={item.name} />
    )
  }

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

  if ( assessment ){
    return <Assessment goals={goals} />
  }

  if ( game ){
    return(
      <Game 
      score={ Math.round( score * 10 ) }
      endGame={endGame}
      leuks={ 7 }
      germs={ 6 + difficulty }
      bubbles={3}
      bubbleControl={bubbleControl}
      entities={entities}
      openBubble={openBubble}/>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
      <ErrorBoundary>
       <Input 
          onSubmitEditing={ addGoal }
          style={styles.textInput}
          placeholder={'new goal'} />
        <FlatList
        renderItem={renderItem} 
        keyExtractor={extractKey}
        data={goals}/>

        <Text style={styles.date}>{getDate()}</Text>
        
        <TouchableOpacity 
        style={{backgroundColor:GREEN,padding: 5}}
        onPress={startGame}>
          <Text style={{color:'#fff'}}>Game</Text>
        </TouchableOpacity>

        <View style={styles.buttonPanel}>
          <TouchableOpacity style={[styles.button, styles.panelButton]} onPress={startAssessment}>
            <Text style={styles.text, styles.panelButtonText}>Assessment</Text>
          </TouchableOpacity>
        </View>

        <Picker
        selectedValue={difficulty}
        onValueChange={(itemValue, itemIndex) => changeDifficulty(itemValue)}>
          <Picker.Item label="Easy" value={1} />
          <Picker.Item label="Medium" value={2}/>
          <Picker.Item label="Hard" value={3}/>
        </Picker>
        
       </ErrorBoundary>
      </View>
    </ThemeProvider>
  );

}


export default connect(mapStateToProps, mapDispatchToProps )(GoalGame);

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    backgroundColor: '#fff',
   // alignItems: 'center',
    justifyContent: 'center',
  },
  textInput:{
    backgroundColor: '#eee',
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

const theme = {
  Card:{
    containerStyle:{
      margin: 20,
      backgroundColor: 'green'
    }
  },
  Button:{
    buttonStyle:{
      backgroundColor: 'orangered',
      margin: 20,
    }
  },
  Input:{
    containerStyle:{
      backgroundColor: '#fff',
      margin: 5
    }
  },
  ListItem:{
    containerStyle:{
      backgroundColor:'#eee',
    }
  }
}