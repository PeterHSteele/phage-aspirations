import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

export default function BubbleControl({ style, visible, animationIn, animationOut, handleSubmitPress }){
	let [value, update] = useState(0)
	let handleChange= val => update(val)

	let handlePress = () => handleSubmitPress(value);
	return (
		<Modal
		style={[ style, styles.modal ]}
		isVisible={visible}
		animationIn={animationIn}
		animationOut={animationOut}
		backdropOpacity={.2}>
			<TextInput style={styles.input} onChangeText={handleChange} 
			value={value.toString()}/>
			<TouchableOpacity style={styles.button} onPress={handlePress}>
				<Text style={styles.buttonText}>Close</Text>
			</TouchableOpacity>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container: {
		position:'absolute',
		bottom: 0,
		left: 0
	},
	destControl: {
		position: 'absolute',
		backgroundColor: 'pink',
	},
	input: {
		backgroundColor: '#eee',
		fontSize: 20,
		padding: 2
	},
	modal:{
		position:'absolute',
		zIndex: 1,
		height: 80
	},
	button:{
		backgroundColor: 'aliceblue',
		fontSize: 20,
		padding: 4
	},
	buttonText:{
		fontSize: 20,
		textAlign: 'center'
	}
})