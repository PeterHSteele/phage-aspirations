import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { mapDispatchToProps } from './goalGameRedux';

const Row = ({ children, style }) => <View style={[styles.row, style]}>{children}</View>;

const Control = ({ children, style }) => <View style={[styles.control, style ]}>{children}</View>

const SlideDown = ({ chidren, initial }) => {
    const slideDownAnim = useRef(new Animated.Value(initial)).current;

    const slideDown = () => {
        Animated.timing(
            slideDownAnim,
            {
                toValue: 1,
                duration: 1000
            }
        ).start();
    }

    const slideUp = () => {
        Animated.timing(
            slideDownAnim,
            {
                toValue:0,
                duration: 1000
            }
        ).start();
    }

    return (
        <Animated.View style={{ transform: [{scaleY: slideDownAnim}] }}>{children}</Animated.View>
    )
}

export { Row, Control, SlideDown};

const styles = StyleSheet.create({
    row:{
        margin: 5
    },
    control:{
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
})