import React from 'react';
//import DestinationControl from './DestinationControl';
import { View, StyleSheet } from 'react-native';
import constants from './constants';
const { DARKPURPLE, LIGHTORANGE, SEAGREEN, GRAYGREEN, LIGHTMAUVE, LIGHTBLUE } = constants

const RADIUS = 30;

const scalesFacts = [1,1.2,1.4];

export const Bubble = function({ body, active, radius, dest, border, start, flashFrames }){
	
	const { isAnimated, scales } = flashFrames,
	top							 = body.position.y - 1.2 * radius,
	left						 = body.position.x - 1.2 * radius,
	dimensionsBubble 			 = radius * 2.4,
	dimensionsInner  			 = radius * 2.8,
	dimensionsOuter 			 = radius * 3.2; 

	return (
		<View style={[style.container,{top,left}]}>
			<View style={[
				style.ring,
				{
					//top: body.position.y- radius, //* 1.5,
					//left: body.position.x - radius,// * 1.5,
					width: dimensionsBubble,
					height: dimensionsBubble,
					radius: dimensionsBubble,
					borderRadius: dimensionsOuter,
					transform: isAnimated ? [{scale: scalesFacts[scales[2]]}] : [],
					borderColor: isAnimated ?  LIGHTORANGE : GRAYGREEN
				}
			]}/>
			<View style={[
			style.ring,
			{
				//top: body.position.x,//.1 * radius  -2.5,
				//left: .1* radius,//.1 * radius  -2.5,
				width: dimensionsBubble,
				height: dimensionsBubble,
				radius: dimensionsBubble,
				borderRadius: dimensionsInner,
				transform: isAnimated ? [{scale: scalesFacts[scales[1]]}] : [],
				borderColor: isAnimated ? LIGHTMAUVE : GRAYGREEN
			}]}/>
			<View 
			style={[
				style.bubble,
				{
					//top: .1* radius,//.2 * radius,//m
					//left: .1 * radius,//.2 * radius,
					width: dimensionsBubble,
					height: dimensionsBubble,
					borderRadius: dimensionsBubble,
					borderColor: dest ? SEAGREEN : start ? LIGHTORANGE : border,
				}
			]} />
			
		</View>
	
	);
};

const style = StyleSheet.create({
	container:{
		position: 'absolute',
	},
	bubble:{
		position: "absolute",
		backgroundColor: '#fff',
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