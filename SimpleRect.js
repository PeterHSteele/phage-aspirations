import React from 'react';
import { View } from 'react-native';

export default function SimpleRect({ body }){
	const { max, min } = body.bounds;
	//if ( Math.random() < .0002 ) console.log( body.bounds );
	return (
		<View style={{
			position: 'absolute',
			top: min.y,
			left: min.x,
			width: max.x - min.x,
			height: max.y - min.y,
			backgroundColor: '#ffff00'/*body.render.fillStyle*/,
			//transform: [{ rotate: body.angle + 'rads' }]
		}}>
		</View>
	)
}