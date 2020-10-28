import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../goalGameRedux.js';
import Game from '../Game';
import Assessment from '../Assessment';
import AssessmentInput from '../AssessmentInput';
import constants from '../constants';
import GoalDetail from '../GoalDetail.js'; 
import LogIn from '../LogIn'; 
import Registration from '../Registration';
import Home from '../Home';
import { Settings } from '../Settings';
import { Loading } from '../Loading';
import { GoalList } from '../GoalList';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTouchProcessor } from 'react-native-game-engine';
import { firebase } from '../firebase/firebaseConfig.js';
import { fetchGoals, saveEntitiesToDatabase, fetchEntities } from '../firebase/index';
const { GREEN, MAUVE } = constants

const Stack = createStackNavigator();

const headerPadding  = { paddingTop: 15 }
const darkHeaderStyle = { 
  headerStyle: {backgroundColor: MAUVE},
  headerTintColor: '#fff',
}

function GoalGame({ assessment, game, login, detail, user,fetch, saveEntities }) {
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    firebase.auth().onAuthStateChanged( data => {
      if (data){
        //console.log('oldway',data)
        const uid = data.uid;
        const user = firebase.database().ref('users/' + uid );
        //console.log('loading user',user);
       user
        .once('value')
        .then( snapshot => {
          const value  = snapshot.val();
          setLoading( false );
          if ( value ){
            //navigation.navigate('Home', {user:value})
            //console.log('loading b4 login', value);
            login( value );
            //navigation.navigate('Home')
          } else {
            //console.log('couldn\'t find data for that user');
            //navigation.navigate('Login',{login});
          }
        })
        .catch( error =>{
          console.log('db error: ' + error.message );
        })
      } else {
        setLoading(false);
        //navigation.navigate('Login',{login});
      }
    })
  },[])

  useEffect(()=>{
    if (null !== user){
      fetchGoals( user.id, fetch);
      //fetchEntities( user.id, saveEntities);//Rename saveEntities saveEntitiesToStore
    }
  },[user])

  if ( loading ) return <></>;

  if (!game){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"> 
        <Stack.Screen name={'Login'} component={LogIn} title={'Log In'} />
        <Stack.Screen name={'Register'} component={Registration} /> 
        <Stack.Screen name={'Home'} component={Home} title={'Home'} options={{/*headerStyle:headerPadding*/}}/>
        <Stack.Screen name={'Detail'} component={GoalDetail} options={({route}) => ({title: route.params.goal.name || 'New'}) }/>
        <Stack.Screen name={'Goals'}  component={GoalList} options={{title: 'Edit/Add Goals'}} />
        <Stack.Screen 
        name="Assessment" 
        component={Assessment}
        options={{
          ...darkHeaderStyle,
          /*headerStyle: darkHeaderStyle,
          headerTintColor:"#fff"*/
        }}
        />
        <Stack.Screen 
        name={'AssessmentInput'} 
        component={AssessmentInput} 
        options={
          ({route}) => (
            {
              /*...darkHeaderStyle,*/
              title: route.params.goal.name,
              /*headerStyle: darkHeaderStyle*/
            }) }/>
        <Stack.Screen name={'Settings'} component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  )
      }
  return <Game saveEntitiesToDatabase={saveEntitiesToDatabase(user.id)}/>
  
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