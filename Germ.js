import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Bubble } from './Bubble'

export const Germ = function({ background, active, radius, body, freeToMove, type }){
	//if (Math.random()<.0005){alert('germ '+body.collisionFilter.group)}
	let backgroundColor = background;
	if ( type == 'germ' & freeToMove ){
		backgroundColor = 'purple';
	} else if (type = "leuk" && freeToMove ){
		backgroundColor = 'pink';
	}
	
	return(
		<View 
			style={[
				style.germ, 
				{
					backgroundColor: background,
					top: body.position.y - radius,
					left: body.position.x - radius,
					width: radius * 2,
					height: radius * 2,
					borderRadius: radius
				}
			]}/>
	);
}

const style = StyleSheet.create({
	germ:{
		position: 'absolute',
	}
})