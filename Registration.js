import React, { useState } from 'react'
import { Text, TextInput, StatusBar, View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Row } from './Views';
import { Subtitle, Label, Error } from './Texts';
import { HomeButton } from './Inputs';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './goalGameRedux.js';
import constants from './constants';
import { firebase } from './firebase/firebaseConfig';
const { SEAGREEN } = constants;

function UnconnectedRegistration({navigation, route}) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [matchError, setMatchError] = useState('');
    const [saveError, setSaveError] = useState('');

    const {login} = route.params;

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const database=firebase.database();

    const onRegisterPress = () => {
        if (password != confirmPassword){
            setMatchError( 'password mismatch' );
            return;
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword( email, password )
            .then( response => {
                const uid = response.user.uid;
                const data = {
                    id: uid,
                    email,
                    username,
                    goals: [],
                    entities: {},
                }
                const user = database.ref('users/' + uid);
                user.set(data, function(error){
                    if (error){
                        //console.log('user error', error.message)
                        setSaveError('user error:' + error.message);
                    } else {
                        //navigation.navigate('Home', {user: data});
                        login( data );
                    }
                });
            }).catch( error => {
                
                setSaveError('connection error:' + error.message);
            });
            

    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={styles.scrollViewStyle}
                keyboardShouldPersistTaps="always">
                <Row style={styles.inputRow}>
                    <Label>Username</Label>
                    <TextInput
                        style={styles.input}
                        placeholder="johndoe"
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setUsername(text)}
                        value={username}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                </Row>
                <Row style={styles.inputRow}>
                    <Label>Email</Label>
                    <TextInput
                        style={styles.input}
                        placeholder='jdoe@example.com'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                </Row>
                <Row style={styles.inputRow}>
                    <Label>Password</Label>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder='Password'
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                </Row>
                <Row style={styles.inputRow}>
                    <Label>Confirm Password</Label>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder='Confirm Password'
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <Error>{matchError}</Error>
                </Row>
                <Row style={styles.inputRow}>
                    <HomeButton
                    backgroundColor={SEAGREEN}
                    handlePress={()=>onRegisterPress()}
                    text="Create Account" />
                    <Error>{saveError}</Error>
                </Row>
                <Row style={styles.inputRow}>
                    <Subtitle style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Subtitle>
                </Row>
            </KeyboardAwareScrollView>
            <StatusBar style="auto" />
        </View>
    )
}

export default connect( mapStateToProps, mapDispatchToProps)(UnconnectedRegistration);

const styles = StyleSheet.create({
    footerText:{},
    footerView:{},
    footerLink:{
        color: SEAGREEN,
    },
    buttonTitle:{},
    button:{},
    input:{
        height: 40,
        fontSize: 20,
        backgroundColor: '#ddd',
        borderRadius: 5,
        padding: 5,
    },
    inputRow:{
        paddingHorizontal: 10,
    },
    scrollViewStyle:{},
    container:{},
})