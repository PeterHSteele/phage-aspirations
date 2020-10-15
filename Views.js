import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mapDispatchToProps } from './goalGameRedux';

const Row = ({ children, style }) => <View style={[styles.row, style]}>{children}</View>;

const Control = ({ children, style }) => <View style={[styles.control, style ]}>{children}</View>

export { Row, Control};

const styles = StyleSheet.create({
    row:{
        margin: 5
    },
    control:{
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
})