import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
//import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import store from './store.js';
import { mapStateToProps } from './goalGameRedux.js';
import Input from './Input.js';
import ErrorBoundary from './ErrorBoundary.js';
import GoalGame from './src/Goal-Game.js';

/*
Todo: 
Bonuses for capturing certain bubbles overnight
  * +1 animation for bonus bubbles
Transitions Between Screens
Remove goals
improve physics animations
  -bubble
  -Make germ movement more idosyncratic

New Germ/leuk introductions
Instructions
  Make it clear you can realign
Come up with singular version of new leuks message
Zoom in on parts of battlefield?

BUGS TO FIX:
computer realignments sometimes fly in the wrong direction
*/

export default function App( props ) {

  return (
    <Provider store={store}>
      <GoalGame />
    </Provider>
  );

}

const styles = StyleSheet.create({
  container:{
    margin: 20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput:{
    backgroundColor: '#eee',
    fontSize:18,
    padding: 10
  }
});
