import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../goalGameRedux.js';
import Game from '../Game';
import Assessment from '../Assessment';
import AssessmentInput from '../AssessmentInput';
import constants from '../constants';
import GoalDetail from '../GoalDetail.js';  
import Home from '../Home';
import { Settings } from '../Settings';
import { GoalList } from '../GoalList';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTouchProcessor } from 'react-native-game-engine';
const { GREEN, MAUVE } = constants

const Stack = createStackNavigator();

function GoalGame({ assessment, game, detail }) {
 /* if ( assessment ){
    return <Assessment />
  }

  if ( game ){
    return <Game />
  }

  if ( detail && detail.id+1 ){
    return <GoalDetail />
  }


  <Stack.Screen
        name="Game"
        component={Game}
        options={{headerShown: false, animationEnabled: false}} />

  return (
    <Home />
  );
  */
  if (!game){

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name={'Home'} component={Home} title={'Home'}/>
        <Stack.Screen name={'Detail'} component={GoalDetail} options={({route}) => ({title: route.params.name}) }/>
        <Stack.Screen name={'Goals'}  component={GoalList} options={{title: 'Edit/Add Goals'}} />
        <Stack.Screen 
        name="Assessment" 
        component={Assessment}
        options={{
          headerStyle:{backgroundColor: MAUVE},
          headerTintColor:"#fff"
        }}
        />
        <Stack.Screen name={'AssessmentInput'} component={AssessmentInput} options={({route}) => ({title: route.params.goal.name}) }/>
        <Stack.Screen name={'Settings'} component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  )
      }
  return <Game />
  
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