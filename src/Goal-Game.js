import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../goalGameRedux.js';
import Game from '../Game';
import Assessment from '../Assessment';
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