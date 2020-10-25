import React from 'react';
import { View, Text } from 'react-native';
import constants from './constants';
const { MAUVE, GREEN, ORANGE, tAlert } = constants

export default function Rect ({ body, height, width, color, start, type }){
	
	return(
		<View 
		style={{
			left: body.position.x - width/2,
			top: body.position.y - height/2,
			height: height,
			width: width,
			borderColor: start ? MAUVE : type == 'staging' ? color : '',
			borderWidth: type == 'staging' ? 4 : 0,
			position: 'absolute',
			backgroundColor: type == 'staging' ? ORANGE : type == 'bound' ? GREEN : '' ,
			zIndex:-1
		}}>
		</View>
	)
}