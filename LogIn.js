import React, { Component, useState } from 'react';
import { View } from 'react-native';
import { ThemeProvider, Button, Input, Card } from 'react-native-elements';

export default Login = function({ authenticate }){
	
	let [ state, updateState ] = useState({
		focus: null,
		username: '',
		password: '',
		usernameError: '',
		passwordError:'',
	})

	let handleChangeText = i => text => { 
		updateState( {...state, [i]: text } )
	}

	let handleButtonPress = () => {
		alert('auth');
		authenticate( state.username, state.password )
	}

	return (
		<Card>
			<Input 
				onChangeText={handleChangeText('username')}
				label='Username'
				value={state.username} 
				text/>
			<Input 
				label='Password'
				value={state.password}
				onChangeText={handleChangeText('password')}
				text/>
			<Button
			title={'Log In'}
			onPress={handleButtonPress}/>
		</Card>
	)
}

