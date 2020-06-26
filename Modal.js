import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import Button from './Button';
import constants from './constants';
const { MAUVE } = constants;

export default function StatusModal({ message, visible, dismiss, style }){
	return(
		
		<Modal
		style={styles.modal}
		isVisible={visible}
		animationIn='slideInLeft'
		animationOut='slideOutRight'
		backdropOpacity={.2}>
			<View style={[
				styles.container,
				style,
				{
				    width: 'auto',
				    height: 'auto',
				    borderRadius: 5,
				}
			]}>
				<Text style = { styles.text }>{ message }</Text>
			</View>
		</Modal>
		
	)
}

const styles = StyleSheet.create({
	modal:{
		margin: 0
	},
	container: {
		margin: 15,
		borderRadius: 5,
		backgroundColor: MAUVE,
		padding: 15, 
		position: 'relative'
		//background: linearGradient('#ff4500','#ffcc00')
	},
	text:{
		fontSize: 25,
		color: '#fff'
	}
})