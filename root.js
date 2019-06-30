import React from 'react';
import { View, Button } from 'react-native';

export default function Root({ navigation }) {

    const divider = <View style={{ height: 10 }} />;

    return (
        <View style={{
            justifyContent: 'center',
            flex: 1
        }}>
            <Button title='Morph Slider' onPress={() => {
                navigation.navigate('MorphSlider')
            }} />
            {divider}
            <Button title='Login' onPress={() => {
                navigation.navigate('Login')
            }} />
            {divider}
            <Button title='Curve' onPress={() => {
                navigation.navigate('Curve')
            }} />
            {divider}
            <Button title='3D Menu' onPress={() => {
                navigation.navigate('Menu')
            }} />
            {divider}
            <Button title='Ballon Slider' onPress={() => {
                navigation.navigate('BalloonSlider')
            }} />
        </View>
    )
}