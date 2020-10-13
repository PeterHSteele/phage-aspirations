import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { mapDispatchToProps } from './goalGameRedux';

const Title = ({ children, style }) => <Text style={[styles.title, style]}>{children}</Text>;

const Label = ({ children, style}) => <Text style={[styles.label, style]}>{children}</Text>;

const Subtitle = ({ children, style}) => <Text style={[styles.subtitle, style]}>{children}</Text>;

export { Title, Label, Subtitle };

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