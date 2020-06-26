import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Button from './Button'
import constants from './constants'
const { ORANGERED, MAUVE, LIGHTMAUVE } = constants

export default function Controls({ leuks, width, phase, handlePress, children, nextLeuks, leuksAreAllocated }){		
	
	return( 
		phase == 'p' || phase == 'r' ? (
			<View style={[ styles.containerStyle, { width: width }]} >
				<TouchableOpacity  
				activeOpacity={.5}
				disabled={!leuksAreAllocated}
				style={[
					styles.buttonStyle,
					{
						backgroundColor: leuksAreAllocated ? MAUVE : '#383838',
					}
				]}>
					<Text style={{textAlign: 'center', color: '#fff' }}>Done</Text>
				</TouchableOpacity>
			</View>
		) : 
		phase == 'r' ? (
			<View style={[ styles.containerStyle, { width: width }]}>
				<Button 
			        handlePress = { handlePress }
			        text = 'Done'/>
			</View> 
		) : null
	);
}

const styles = StyleSheet.create({
	buttonStyle:{
		backgroundColor: MAUVE,
		padding: 2,
		color: '#fff',
		flex: 1,
	},
	textStyle:{
		color: '#fff',
		flex: 2,
		fontSize: 20,
		marginLeft: 'auto',
		marginTop: 0,
		marginRight: 'auto',
		marginBottom: 0
	},
	containerStyle:{
		display: 'flex',
		justifyContent: 'flex-start',
		flexDirection: 'row',
		position: 'absolute',
		padding: 5,
		bottom: 0,
		left: 0,
		backgroundColor: ORANGERED,
		
	}
})