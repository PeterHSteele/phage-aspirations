import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Picker, StatusBar, ScrollView } from 'react-native';
import{ ListItem, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './goalGameRedux';
import { HomeButton } from './Inputs';
import { Title, Subtitle } from './Texts';
import { Row } from './Views';
import constants from './constants';
const { MAUVE, GRAYGREEN, SEAGREEN, DARKPURPLE, LIGHTMAUVE, LIGHTGRAY, ORANGE } = constants;

const Home = function({ difficulty, changeDifficulty, addGoal, goals, loggedIn, startAssessment, removeGoal, dayComplete, navigation, newDay, user }){

    let [ addGoalInputVal, updateInputVal ] = useState('');
    
    const getDate = () => {
        const today = new Date();
        const month = constants.MONTHS[today.getMonth()],
        date = today.getDate(),
        day = constants.DAYS[today.getDay()];
        return "Today is " + day + ", " + month + ' ' + date + '.';
      }
      if ( !loggedIn ){
        return (
          <ThemeProvider theme={theme}>
            <LogIn authenticate={authenticate}/>
          </ThemeProvider>
        )
      }

    const handleSubmitAddGoal = ({nativeEvent}) =>{
      addGoal(addGoalInputVal)
      updateInputVal('')
    }

    const handleAddGoalInputChange = ( text ) => {
      updateInputVal( text );
    }

    const listHeaderComponent = () => (
      <View>
       <Input 
          onSubmitEditing={handleSubmitAddGoal}
          onChangeText={handleAddGoalInputChange}
          inputStyle={[styles.text,styles.textInput]}
          value={addGoalInputVal}
          placeholder={'new goal'} />
      </View> 
    )

    const listFooterComponent = () => (
      <View>
        <View style={[styles.row, styles.dateRow]}>
            <Text style={[styles.text,styles.date]}>{getDate()}</Text>
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
      </View>
    );
    return (
    <View style={styles.container}>
      <Row>
        <Title style={[styles.date]}>Welcome, {user}.{/*</Text><Text style={[styles.text,styles.userText]}>{user}</Text><Text>.*/}</Title>
      </Row>
      <Row>
        <Subtitle style={styles.date}>{getDate()} You { dayComplete ? 'have already': 'haven\'t' } played the game today.</Subtitle>
      </Row>
      <Row>
      <HomeButton 
      text="Edit/Add Goals" 
      backgroundColor={SEAGREEN} 
      handlePress={()=>navigation.navigate('Goals')}
      />
      </Row>
      <Row>
      <HomeButton 
      text="Start Assessment" 
      backgroundColor={dayComplete ? '#aaa' : MAUVE} 
      disabled={dayComplete}
      handlePress={()=>navigation.navigate('Assessment')}
      />
      </Row>
      <Row>
      <HomeButton 
      text="New Day" 
      backgroundColor={DARKPURPLE} 
      handlePress={newDay}
      /> 
      </Row>
      <Row>
      <HomeButton 
      text="Game Settings" 
      backgroundColor={LIGHTMAUVE} 
      handlePress={()=>navigation.navigate("Settings")}
      /> 
      </Row> 
      <StatusBar hidden={true} />
    </View>
    )
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );


const styles = StyleSheet.create({
    container: {
      marginHorizontal: 5,
      flex: 1,
      backgroundColor: '#fff',
     // alignItems: 'center',
    },
    greetingRow:{
      flexDirection: 'row',
      alignItems: "flex-end"
    },
    userText:{
      color: SEAGREEN,
    },
    row:{
      /*paddingHorizontal: 10,*/
      margin: 5
    },
    textInput:{
      backgroundColor: '#ddd',
      padding: 10
    },
    text:{
      fontSize: 18,
      color: "#404040",
      fontWeight: "300"
    },
    button:{
      padding: 10,
    },
    panelButton: {
      backgroundColor: SEAGREEN,
      padding: 10
    },
    disabled:{
      backgroundColor: '#aaa',
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