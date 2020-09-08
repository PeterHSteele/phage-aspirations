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
import Home from '../Home';
const { GREEN, MAUVE } = constants



function GoalGame({ assessment, game }) {

  if ( assessment ){
    return <Assessment />
  }

  if ( game ){
    return <Game />
  }

  return (
    <Home />
  );

}


export default connect(mapStateToProps, mapDispatchToProps )(GoalGame);

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