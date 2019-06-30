import React from 'react';
import { Animated, View, Text } from 'react-native';
import {
    VALUE_ITEM_WIDTH,
    DOT_WIDTH
} from '../consts'

export default class ValueItem extends React.Component{
    render(){
        const { range, animatedValue, title } = this.props;

        const translateY = animatedValue.interpolate({
            inputRange: range,
            outputRange: [0, -30, 0],
            extrapolate: 'clamp'
        });
        const opacity = animatedValue.interpolate({
            inputRange: range,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View style={{
                width: VALUE_ITEM_WIDTH,
                alignItems: 'center',
                opacity,
                transform: [
                    {
                        translateY
                    }
                ]
            }}
                key={title}>
                <Text style={{ color: 'white' }}>
                    {title}
                </Text>
                <View style={{
                    height: 6,
                    width: DOT_WIDTH,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    marginTop: 20
                }} />
            </Animated.View>
        )
    }
}
