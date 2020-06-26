import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Button({ text, handlePress }){
	return(
		<TouchableOpacity
			style = { styles.buttonStyle }
			onPress ={ handlePress }>
			<Text style={ styles.textStyle }>{ text }</Text>
		</TouchableOpacity>	
	)
}

const styles = StyleSheet.create({
	buttonStyle:{
		backgroundColor: '#06d3d6',
		padding: 2,
		color: '#fff',
		flex: 1,
		textAlign: 'center'
	},
	textStyle:{
		color: '#fff',
		flex: 2,
		fontSize: 20,
		marginLeft: 'auto',
		marginTop: 0,
		marginRight: 'auto',
		marginBottom: 0
	}
})