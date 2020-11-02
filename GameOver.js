import React from  'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Title, Subtitle } from './Texts';
import { HomeButton } from './Inputs';
import { removeEntities } from './firebase/index';

export default function GameOver({ heading, message, buttonColor, body, uid, width, height, gameOverFn}){
	//if (Math.random()<.005){alert(/*'x: ' + body.position.x + ' y: '+body.position.y*/body.collisionFilter.group )}
	return (
		<View
		style={[ styles.container ,{ 
			top: body.position.y - height/2, 
			left: body.position.x - width/2, 
			width: width - 5, 
			height: height - 5,
			paddingTop: height/3 - 26,
			 }]}>
			<Title style={[styles.heading, /*{textShadowColor: buttonColor}*/]}>{heading}</Title>
			<Subtitle style={styles.message}>{message}</Subtitle>
			<HomeButton 
			text="Return to Goals"
			backgroundColor={buttonColor} 
			handlePress={()=>{
				removeEntities( uid ); 
				gameOverFn();
			}}/>
		</View>
	)
}

//export default connect( mapStateToProps, mapDispatchToProps )(UnconnectedGameOver)

const styles = StyleSheet.create({
	container:{
		position: 'absolute',
		padding: 10,
		backgroundColor: "#fff",
		borderWidth: 1,
		borderRadius: 20,
		borderColor: '#fff',
		shadowColor: '#222',
		shadowOffset: {width: 5, height:5},
		shadowOpacity: 1,
		shadowRadius:0
		//borderWidth: 1,
		//borderColor: 'purple',
	},
	heading:{
		padding: 5,
		textAlign: 'center',
		fontSize: 24,
		textShadowOffset: { width: 1, height: 1},
		textShadowRadius: 0,
	},
	message:{
		padding: 5,
		textAlign: 'center'
	}
})