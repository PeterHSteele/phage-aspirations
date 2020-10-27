import React, { Component, useState } from 'react';
import { View, Pressable, StyleSheet, StatusBar } from 'react-native';
import { Subtitle, Error } from './Texts';
import { Row } from './Views';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux.js';
import { ThemeProvider, Button, Input, Card } from 'react-native-elements';
import constants from './constants';
const { SEAGREEN } = constants;
import { firebase } from './firebase/firebaseConfig';

const UnconnectedLogin = function({ navigation, route, login }){
	
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
		const {username, password} = state;
		firebase
			.auth()
			.signInWithEmailAndPassword(username, password)
			.then( response => {
				//console.log('respo',response)
				const uid = response.user.uid;
				//console.log('uid', response.user.uid);
				const user = firebase.database().ref('users/' + uid)
				//console.log('login user beepbap', user);
				user.once('value').then( snapshot => {
					const userData = snapshot.val();
					//console.log('poopy', snapshot)
					if ( userData ){
						//console.log('login userData',userData);
						login( userData );
						navigation.navigate('Home', {user: userData});
					} else {
						updateState({...state, usernameError: 'userError: couldnt find that user'});
					}
				})
			})
			.catch( error => {
				console.log(error.message);
				updateState({...state, usernameError:'database error: no response'})
			});
	}

	return (
		<View>
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
				buttonStyle={styles.loginButton}
				onPress={handleButtonPress}/>
			</Card>
			<Row>
				<Error>{state.usernameError}</Error>
			</Row>
			<Row style={styles.registerLinkRow}>
				<Subtitle>Don't have an account yet? </Subtitle>
				<Pressable onPress={()=>navigation.navigate('Register', {login})}>
					<Subtitle style={styles.registerLink}>Create one.</Subtitle>
				</Pressable>
			</Row>
			<StatusBar style="auto" />
		</View>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedLogin);

const styles = StyleSheet.create({
	registerLink: {
		color: SEAGREEN
	},
	registerLinkRow:{
		flexDirection: 'row',
	},
	loginButton:{
		backgroundColor: SEAGREEN,
	},
})