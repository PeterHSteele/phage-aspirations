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
improve physics animations
  -palpitations during fights
Bonuses for capturing certain bubbles overnight
Stop game and start again the following day

improve physics animations
  -bubble
  -Make germ movement more idosyncratic

New Germ/leuk introductions
Fix germs not in straight line after game over
Instructions
  Make it clear you can realign
Come up with singular version of new leuks message
Zoom in on parts of battlefield?
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