import React from 'react';
import { Bubble } from './Bubble';
import { Germ } from './Germ';
import SimpleRect from './SimpleRect';
import Matter from 'matter-js';
import constants from './constants';
import { View } from 'react-native';
const { PURPLE } = constants;

export default function InscribedOctagon({ composite, radius }){
	//if ( Math.random() < .001 ) console.log( Matter.Composite.get( composite, 'detector', 'body' ).bounds )//console.log( Matter.Composite.allBodies( composite )[5].id )
	return (
		<View>
		{Matter.Composite.allBodies( composite ).map((body,i)=>{
			if ( i === 0 ) return <Bubble key={i} body={body} radius={radius} active={false} border={PURPLE} dest={false} start={false} />;
			
			switch( body.label ){
				case "Circle Body":
				 return null;break;
				default:
				return <SimpleRect key={i} body={body} />
			}
		})}
		</View>
	)
};