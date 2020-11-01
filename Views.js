import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { mapDispatchToProps } from './goalGameRedux';

const Row = ({ children, style }) => <View style={[styles.row, style]}>{children}</View>;

const Control = ({ children, style }) => <View style={[styles.control, style ]}>{children}</View>

const FloatUp = ({children, style, y}) => {
    const animation = useRef(new Animated.Value(y)).current;

    useEffect(()=>{
        Animated.timing(
            animation,
            {
                useNativeDriver: true,
                toValue: y-50,
                duration: 1000,
            }
        ).start()
    }, [animation]);

    return (
        <Animated.View 
        style={[
            style, 
            {
                transform: [
                    {translateY: animation}
                ]
            }
        ]}
        >{children}</Animated.View>
    )
}

const SlideDown = ({ children, style, height, isOpen, duration }) => {
    const TRANSLATION = -1 * height / 2
    const scaleAnim = useRef(new Animated.Value( isOpen ? 1 : 0)).current;
    const translateAnim = useRef(new Animated.Value( isOpen ? 0 : TRANSLATION)).current;

    useEffect(()=>{
        slide(
            isOpen ? 1 : 0,
            isOpen ? 0 : TRANSLATION
        ); 
    }, [isOpen]);

    const slide = ( toValueScale, toValueTranslate ) => {
            Animated.parallel([
                Animated.timing(
                    scaleAnim,
                    {
                        useNativeDriver: true,
                        toValue: toValueScale,
                        duration,
                    }
                ),
                Animated.timing(
                    translateAnim,
                    {
                        useNativeDriver: true,
                        toValue: toValueTranslate,
                        duration,
                    }
                )
            ]).start()
    }

    return (
        <Animated.View 
        style={
            style,
            {
                transform: [
                    {translateY: translateAnim},
                    {scaleY: scaleAnim}
                ]
            }}
        >
            {children}
        </Animated.View>
    )
}

export { Row, Control, SlideDown, FloatUp };

const styles = StyleSheet.create({
    row:{
        margin: 5
    },
    control:{
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
})