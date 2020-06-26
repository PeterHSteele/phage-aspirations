import React from 'react';
//import DestinationControl from './DestinationControl';
import { View, StyleSheet } from 'react-native';
import constants from './constants';
const { MAUVE, ORANGE, SEAGREEN, GRAYGREEN, BLUE } = constants

const RADIUS = 30;
export const Bubble = function({ body, active, radius, dest, border, start, flashFrames }){
	//if ( flashFrames.colors.length ) console.log( flashFrames.colors[0] );
	return (

		<View style={[
			style.ring,
			{
				top: body.position.y - radius * 1.5,
				left: body.position.x - radius * 1.5,
				width: radius * 3,
				height: radius * 3,
				radius: radius * 3,
				borderRadius: radius * 3,
				borderColor: flashFrames.colors[0] || GRAYGREEN
			}
		]}>
			<View style={[
			style.ring,
			{
				top: .2* radius -5,//.1 * radius  -2.5,
				left: .2* radius -5,//.1 * radius  -2.5,
				width: radius * 2.6,
				height: radius * 2.6,
				radius: radius * 2.6,
				borderRadius: radius * 2.6,
				borderColor: flashFrames.colors[1] || GRAYGREEN
			}]}>
				<View 
				style={[
					style.bubble,
					{
						top: .2* radius -5,//.2 * radius,//m
						left: .2 * radius -5,//.2 * radius,
						width: radius * 2.2,
						height: radius * 2.2,
						borderRadius: radius * 2.2,
						borderColor: dest ? SEAGREEN : start ? MAUVE : border,
					}
				]} />
			</View>
		</View>
	
	);
};

const style = StyleSheet.create({
	bubble:{
		position: "absolute",
		backgroundColor: ORANGE,
		borderWidth: 5,
		borderColor: '#40e0d0'
	},
	ring:{
		position: "absolute",
		backgroundColor:'transparent',
		borderColor: GRAYGREEN,
		borderWidth: 5
	}
})