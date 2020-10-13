import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mapDispatchToProps } from './goalGameRedux';

const Row = ({ children, style }) => <View style={[styles.row, style]}>{children}</View>;

export { Row };

const styles = StyleSheet.create({
    row:{
        margin: 5
    },
})