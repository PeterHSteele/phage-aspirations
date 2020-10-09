import React from 'react';
//import DestinationControl from './DestinationControl';
import { View, StyleSheet } from 'react-native';
import constants from './constants';
const { MAUVE, ORANGE, SEAGREEN, GRAYGREEN, BLUE } = constants

const RADIUS = 30;
export const Bubble = function({ body, active, radius, dest, border, start, flashFrames, germs, leuks }){
	//if ( flashFrames.colors.length ) console.log( flashFrames.colors[0] );
	const dimensionsBubble = radius * 2.4,
		  dimensionsInner  = radius * 2.8,
		  dimensionsOuter  = radius * 3.2; 
	return (

		<View style={[
			style.ring,
			{
				top: body.position.y - radius * 1.5,
				left: body.position.x - radius * 1.5,
				width: dimensionsOuter,
				height: dimensionsOuter,
				radius: dimensionsOuter,
				borderRadius: dimensionsOuter,
				borderColor: flashFrames.colors[1] || GRAYGREEN
			}
		]}>
			<View style={[
			style.ring,
			{
				top: .2* radius -5,//.1 * radius  -2.5,
				left: .2* radius -5,//.1 * radius  -2.5,
				width: dimensionsInner,
				height: dimensionsInner,
				radius: dimensionsInner,
				borderRadius: dimensionsInner,
				borderColor: flashFrames.colors[0] || GRAYGREEN
			}]}>
				<View 
				style={[
					style.bubble,
					{
						top: .2* radius -5,//.2 * radius,//m
						left: .2 * radius -5,//.2 * radius,
						width: dimensionsBubble,
						height: dimensionsBubble,
						borderRadius: dimensionsBubble,
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