import React from 'react';
import { View, Text } from 'react-native';
import constants from './constants';
const { MAUVE, SEAGREEN, ORANGE, tAlert } = constants

export default function Rect ({ body, height, width, color, start, type }){
	//const left = body.position.x - width/2,
	//top	  	   = body.position.y - height/2;
	//if (top == 283.5)console.log(type)//console.log( 'top',top,'left', left)
	return(
		<View 
		style={{
			left: body.position.x - width/2,
			top: body.position.y - height/2,
			height,
			width,
			borderColor: start ? MAUVE : type == 'staging' ? color : '',
			borderWidth: type == 'staging' ? 4 : 0,
			position: 'absolute',
			backgroundColor: type == 'staging' ? ORANGE : type == 'bound' ? SEAGREEN : '' ,
			zIndex:-1
		}}>
		</View>
	)
}