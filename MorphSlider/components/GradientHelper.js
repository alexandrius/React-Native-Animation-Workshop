import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default class GradientHelper extends React.Component {
    render() {
        const {
            style,
            color1,
            color2,
            children
        } = this.props;
        return (
            <LinearGradient
                colors={[color1, color2]}
                style={style}>
                {children}
            </LinearGradient>
        );
    }
}
