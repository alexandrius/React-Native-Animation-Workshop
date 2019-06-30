import React from 'react';
import { View, Button } from 'react-native';

export default function Root({ navigation }) {
    return (
        <View style={{
            justifyContent: 'center',
            flex: 1
        }}>
            <Button title='Morph Slider' onPress={() => {
                navigation.navigate('MorphSlider')
            }} />
            <Button title='Login' onPress={() => {
                navigation.navigate('Login')
            }} />
            <Button title='Curve' onPress={() => {
                navigation.navigate('Curve')
            }} />
            <Button title='3D Menu' onPress={() => {
                navigation.navigate('Menu')
            }} />
            <Button title='Ballon Slider' onPress={() => {
                navigation.navigate('BalloonSlider')
            }} />
        </View>
    )
}