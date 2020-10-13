import React, { useRef, useEffect } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { mapDispatchToProps } from './goalGameRedux';

const Title = ({ children, style }) => <Text style={[styles.title, style]}>{children}</Text>;

const Label = ({ children, style}) => <Text style={[styles.label, style]}>{children}</Text>;

const Subtitle = ({ children, style}) => <Text style={[styles.subtitle, style]}>{children}</Text>;

/*const AnimatedTitle = ({y, style, children}) => {
    const translateUp = useRef( Animated.Value(y)).current;

    useEffect(()=>{
        Animated.timing(
            translateUp,
            {
                toValue: y-50,
                duration: 3000
            },
        ).start();
    },[translateUp])
    
    return (
        <Animated.Text
        style={[styles.title, style, {top: translateUp}]} 
        >
        +1
        </Animated.Text>
    )
}*/

const AnimatedTitle = (props) => {
    const translateUp= useRef(new Animated.Value(props.y)).current  // Initial value for opacity: 0
  
    React.useEffect(() => {
      Animated.timing(
        translateUp,
        {
          useNativeDriver: true,
          toValue: props.y-50,
          duration: 3000,
        }
      ).start();
    }, [translateUp])
  
    return (
      <Animated.Text                 // Special animatable View
        style={[
        styles.title,
        {
          ...props.style,
          transform: [{
              translateY: translateUp         // Bind opacity to animated value
        }]}]}
      >
        +1
      </Animated.Text>
    );
  }

export { Title, Label, Subtitle, AnimatedTitle };

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        color: "#000",
        fontWeight: "600",
    },
    subtitle:{
        fontSize: 18,
        color: "#404040",
        fontWeight: "300"
    },
    label:{
        color: '#666',
        fontSize: 16,
    },
})