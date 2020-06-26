import React from 'react';
import { View, Text, StyleSheet } from 'react-native';



export default function DestinationControl({ pos, body, radius }){
	return(
		<View style={[
			style.destControl,
			{
				top: body.position.y,
				left: body.position.x,
				borderRadius: radius,
				width: radius * 2,
				height: radius * 2,
			}
		]}></View>
	)
}

const style = StyleSheet.create({
	destControl:{
		position: 'absolute',
		backgroundColor: 'gold',
	}
})