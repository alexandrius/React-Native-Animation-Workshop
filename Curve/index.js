import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import txt from './text';
import { Feather } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

const BUTTON_TOP_MARGIN = 20;

const ORIGINAL_BUTTON_WIDTH = width - 100;
const BUTTON_SIZE = 36;

const FROM_X = width / 2 - BUTTON_SIZE / 2;

const TO_X = width - 45;
const TO_Y = 25;

const END = { x: TO_X, y: TO_Y };
const CONTROL = { x: FROM_X, y: TO_Y };


export default class App extends React.Component {

  buttonAnimatedValue = new Animated.Value(1);
  ballAnimatedValue = new Animated.Value(0);
  buttonOpacity = new Animated.Value(1);


  componentDidMount() {
    this.buttonAnimatedValue.addListener(({ value }) => {
      if (value === 0) {
        this.buttonOpacity.setValue(0);

        const toValue = this.ballAnimatedValue.__getValue() > 0 ? 0 : 1;
        Animated.timing(this.ballAnimatedValue, {
          toValue,
          duration: 1000,
          useNativeDriver: true
        }).start();

      } else {
        this.buttonOpacity.setValue(1);
      }
    })

    this.ballAnimatedValue.addListener(({ value }) => {
      const translateX = this.calcBezier(value, this.START.x, CONTROL.x, END.x);
      const translateY = this.calcBezier(value, this.START.y, CONTROL.y, END.y);
      const scale = this.calcScale(value);

      this.ball.setNativeProps({
        transform: [{ translateX }, { translateY }, { scale }],
      });
    })

  }

  calcScale(value) {
    return 1 - (value * 0.7);
  }

  calcBezier(interpolatedTime, p0, p1, p2) {
    return Math.round(
      Math.pow(1 - interpolatedTime, 2) * p0 +
      2 * (1 - interpolatedTime) * interpolatedTime * p1 +
      Math.pow(interpolatedTime, 2) * p2
    );
  }

  render() {
    const buttonWidth = this.buttonAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [BUTTON_SIZE, ORIGINAL_BUTTON_WIDTH]
    });

    const ballOpacity = this.buttonOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })

    // const scale = this.ballAnimatedValue.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [1, 0.5]
    // })

    return (
      <View style={{ flex: 1 }}>

        <View
          style={{
            alignItems: 'flex-end',
            marginTop: 30,
            paddingHorizontal: 20,
            backgroundColor: 'rgba(0,0,0,0.2)',
            paddingVertical: 10
          }}>
          <Feather name='shopping-cart' size={20} />
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingVertical: 30,
            paddingHorizontal: 20
          }}>

          <Image resizeMode='contain' style={{height: 300, width:'100%'}} source={require('./assets/chair.png')}/>
          <Text>{txt.text}</Text>

          <TouchableOpacity
            ref={ref => this.button = ref}
            onPress={() => {
              this.button.measure((x, y, width, height, px, py) => {
                this._resetBallPosition(py + BUTTON_TOP_MARGIN);
                Animated.timing(this.buttonAnimatedValue, {
                  toValue: 0,
                  duration: 300
                }).start();
              })
            }}>
            <Animated.View
              style={{
                width: buttonWidth,
                backgroundColor: 'blue',
                marginTop: BUTTON_TOP_MARGIN,
                alignItems: 'center',
                borderRadius: BUTTON_SIZE / 2,
                alignSelf: 'center',
                height: BUTTON_SIZE,
                justifyContent: 'center',
                opacity: this.buttonOpacity
              }}>
              <Animated.Text style={{
                color: 'white',
                opacity: this.buttonAnimatedValue
              }}>Add to Cart</Animated.Text>
            </Animated.View>
          </TouchableOpacity>

        </ScrollView>

        <Animated.View
          ref={ref => this.ball = ref}
          style={{
            position: 'absolute',
            height: BUTTON_SIZE,
            width: BUTTON_SIZE,
            borderRadius: BUTTON_SIZE / 2,
            backgroundColor: 'blue',
            opacity: ballOpacity
          }}
        />

      </View>
    );
  }

  _resetBallPosition(y) {
    this.START = { x: FROM_X, y }
    this.ball.setNativeProps({
      transform: [{ translateX: this.START.x }, { translateY: this.START.y }],
    });
  }
}
