import React, { Component } from 'react';
import Text from 'react-native';

export default class ErrorBoundary extends Component {
	constructor(props){
		super(props);
		this.state={error:false};
	}

	static getDerivedStateFromError(error){
		return {error:true};
	}

	componentDidCatch(error, errorInfo) {
   		console.log(errorInfo)
	 }

	render(){
		if (this.state.error){
			return (<Text>Error!</Text>)
		} else {
			return this.props.children;
		}
	}
}