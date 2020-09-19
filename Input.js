import React, { useState } from 'react';
import { TextInput, View, Text } from 'react-native';

export default function Input( props ){
	let [value, setState] = useState('');

	const handleChangeText = ( text ) => setState(text);

	const onSubmitEditing = () => {
		console.log('onsubmit');
		const onSubmitEditing = props.onSubmitEditing;
		
		const text = value;
		if (!text){
			return;
		}
		setState('');
		onSubmitEditing(text);
		
	}
	console.log('input value', value);
	return (
		<View>
		<TextInput 
			style={props.style}
			value={value}
			onChangeText={handleChangeText}
			placeholder={props.placeholder} 
			onSubmitEditing={onSubmitEditing}/>
			<Text>{value}</Text>
		</View>
	);
}