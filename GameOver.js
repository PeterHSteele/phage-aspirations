import React, { Component } from  'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function GameOver({ message, gameOver, body, radius, width, height, handlePress}){
	//if (Math.random()<.005){alert(/*'x: ' + body.position.x + ' y: '+body.position.y*/body.collisionFilter.group )}
	return (
		<View
		style={[ styles.container ,{ 
			top: body.position.y - height/2, 
			left: body.position.x - width/2, 
			width: width, 
			height: height,
			paddingTop: height/3 - 26,
			 }]}>
			<Text style={styles.text}>{message}</Text>
			<TouchableOpacity
			style={{backgroundColor:'#ff4500'}}
			onPress={handlePress}>
				<Text style={{color:'#fff'}}>Return to Goals</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container:{
		position: 'absolute',
		textAlign: 'center',
		padding: 10
		//borderWidth: 1,
		//borderColor: 'purple',
	},
	text:{
		 width: '100%', 
		 textAlign: 'center',
		 fontSize: 26
	}
})