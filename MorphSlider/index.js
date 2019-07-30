import React from 'react';
import { StyleSheet, View, Animated, TextInput } from 'react-native';
import { GradientHelper, ValueItem } from './components';
import { TouchableView } from '../components';
import Svg, { Path } from 'react-native-svg';
import debounce from 'lodash.debounce';

import {
  BALL_SIZE,
  BAR_HEIGHT,
  BAR_WIDTH,
  COLORS,
  GRADIENT_HEIGHT,
  MAX_BAR_VALUE,
  MIN_BAR_VALUE,
  P1_DIFF_CURVE,
  P1_MAX_CURVE,
  P2_DIFF_CURVE,
  P2_MAX_CURVE,
  RANGE_VALUE,
  VALUE_LEFT_MARGIN,
  VALUE_PADDING,
  VISIBLE_HOURS,
  width,
  VALUE_ITEM_WIDTH
} from './consts';

const AnimatedGradientHelper = Animated.createAnimatedComponent(GradientHelper);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

export default class App extends React.Component {

  _ballTranslateX = new Animated.Value(MIN_BAR_VALUE);
  _absoluteTranslateX = new Animated.Value(0);
  _nonNativeX = new Animated.Value(0);
  _curve = new Animated.Value(0);
  _color1Range = this._buildColor1Range();
  _color2Range = this._buildColor2Range();
  _positionRange = this._buildPositionRange();
  _textOpacity = new Animated.Value(1);
  _animateTextOpacityDelayed = debounce(this._animateTextOpacity.bind(this), 20);

  _buildColor1Range() {
    const range = [];
    for (let i = 0; i < COLORS.length - 1; i++) {
      range.push(COLORS[i]);
    }
    return range;
  }

  _buildColor2Range() {
    const range = [];
    for (let i = 1; i < COLORS.length; i++) {
      range.push(COLORS[i]);
    }
    return range;
  }

  _buildPositionRange() {
    const range = [];
    for (let i = 0; i < VISIBLE_HOURS.length; i++) {
      range.push(this._getMidRange(i));
    }
    return range;
  }

  _animateTextOpacity() {
    // this._textOpacity.setValue(1)
    Animated.timing(this._textOpacity, {
      toValue: 1,
      duration: 100
    }).start();
  }

  _getOptimizedX(x) {
    let translateX = x - BAR_WIDTH / 2;
    if (translateX < MIN_BAR_VALUE) {
      return MIN_BAR_VALUE;
    } else if (translateX > MAX_BAR_VALUE) {
      return MAX_BAR_VALUE;
    }
    return translateX;
  }

  _getOptimizedAbsoluteX(x) {
    return x;
  }

  componentDidMount() {
    this._curve.addListener(({ value }) => {
      this.path.setNativeProps({ d: this._getPath(value) });
    });

    this._absoluteTranslateX.addListener(({ value }) => {
      let showValue = (value * 24) / (width - 2 * VALUE_PADDING);
      this.mainText.setNativeProps({
        text: Math.floor(showValue).toString()
      });
      this._textOpacity.setValue(0.5);
      this._animateTextOpacityDelayed(1);
    })
  }

  _getPath(value) {
    const p1 = P1_MAX_CURVE - value * P1_DIFF_CURVE;
    const p2 = P2_MAX_CURVE - value * P2_DIFF_CURVE;
    return `M 0 50 Q 20 50 40 ${p1} Q 80 ${p2} 120 ${p1} Q 140 50 160 50`;
  }

  _animateCurve(toValue) {
    Animated.spring(this._curve, {
      toValue,
      duration: 200,
      useNativeDriver: true
    }).start();
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderGradient()}
        {this._renderValueRow()}
        {this._renderSlider()}
      </View>
    );
  }


  _renderGradient() {
    const color1 = this._nonNativeX.interpolate({
      inputRange: this._positionRange,
      outputRange: this._color1Range,
      extrapolate: 'clamp'
    })
    const color2 = this._nonNativeX.interpolate({
      inputRange: this._positionRange,
      outputRange: this._color2Range,
      extrapolate: 'clamp'
    })

    return (
      <AnimatedGradientHelper
        color1={color1}
        color2={color2}
        style={{ height: GRADIENT_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>

        {this._renderMainValue()}

      </AnimatedGradientHelper>
    )
  }

  _renderMainValue() {
    return (
      <AnimatedTextInput
        ref={ref => this.mainText = ref}
        pointerEvents='none'
        defaultValue='0'
        underlineColorAndroid='transparent'
        style={{ color: 'white', fontSize: 150, opacity: this._textOpacity }} />
    )
  }

  _renderValueRow() {
    return (
      <View style={{
        height: 50,
        marginTop: -50,
        flexDirection: 'row'
      }}>

        {VISIBLE_HOURS.map((item, index) => {
          return this._renderValue(item, index)
        })}

      </View>
    )
  }

  _getMidRange(index) {
    return VALUE_PADDING + (index * RANGE_VALUE) + VALUE_ITEM_WIDTH / 2
  }

  _renderValue(value, index) {
    let leftRange;
    if (index - 1 >= 0) {
      leftRange = this._positionRange[index - 1];
    } else {
      leftRange = 0;
    }
    const midRange = this._positionRange[index];
    let rightRange;
    if (index + 1 < VISIBLE_HOURS.length) {
      rightRange = this._positionRange[index + 1];
    } else {
      rightRange = width;
    }

    return (
      <View key={value.toString()}
        style={{
          marginLeft: index === 0 ? VALUE_PADDING : VALUE_LEFT_MARGIN,
        }} >
        <ValueItem
          title={value.toString()}
          range={[leftRange, midRange, rightRange]}
          animatedValue={this._absoluteTranslateX} />
      </View >
    )
  }

  _touchesBegan(x) {
    this.animating = true;
    this.touchesEnded = false;
    Animated.spring(this._absoluteTranslateX, {
      toValue: this._getOptimizedAbsoluteX(x),
      duration: 200,
      // useNativeDriver: true
    }).start();
    Animated.spring(this._nonNativeX, {
      toValue: this._getOptimizedAbsoluteX(x),
      duration: 1000
    }).start();
    Animated.spring(this._ballTranslateX, {
      toValue: this._getOptimizedX(x),
      duration: 200,
      useNativeDriver: true
    }).start();
    this._animateCurve(1);
    setTimeout(() => {
      this.animating = false;
      if (this.touchesEnded) {
        this._touchesEnded();
      }
    }, 200)
  }

  _updateColors() {

  }

  _getIndex(x) {
    let index = 0;
    for (let i = this._positionRange.length - 1; i >= 0; i--) {
      if (x > this._positionRange[i]) {
        index = i;
        break;
      }
    }
    return index;
  }

  _touchesEnded() {
    this.touchesEnded = true;
    this.touchesGranted = false;
    if (!this.animating) {
      this._animateCurve(0);
    }
  }

  _renderSlider() {
    const translateY = this._curve.interpolate({
      inputRange: [0, 1],
      outputRange: [-BALL_SIZE / 2, -10],
      extrapolate: 'clamp'
    })

    return (
      <View style={{
        height: BAR_HEIGHT * 2,
        position: 'absolute',
        width: '100%',
        top: GRADIENT_HEIGHT - BAR_HEIGHT,
      }}>
        <TouchableView
          style={{ flex: 1 }}
          onTouchesBegan={({ gestureState }) => {
            this._touchesBegan(gestureState.x0)
          }}
          onTouchesEnded={() => {
            this._touchesEnded();
          }}
          onTouchesMoved={({ gestureState }) => {
            if (Math.abs(gestureState.dx) > 0 || this.touchesGranted) { //workaround android invoking move
              this.touchesGranted = true;
              this._absoluteTranslateX.setValue(this._getOptimizedAbsoluteX(gestureState.moveX));
              this._nonNativeX.setValue(this._getOptimizedAbsoluteX(gestureState.moveX));
              this._ballTranslateX.setValue(this._getOptimizedX(gestureState.moveX));
            }
          }}>

          <View style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent' }} />

          <Animated.View
            style={{
              alignItems: 'center',
              width: BAR_WIDTH,
              transform: [
                {
                  translateX: this._ballTranslateX
                }
              ]
            }}>

            <Svg style={{ height: BAR_HEIGHT, width: BAR_WIDTH }}>
              <Path ref={ref => this.path = ref}
                d={this._getPath(0)}
                fill='white'>
              </Path>
            </Svg>

            <Animated.View style={{
              transform: [
                {
                  translateY
                }
              ]
            }}>
              <View style={{
                height: BALL_SIZE,
                width: BALL_SIZE,
                borderRadius: BALL_SIZE / 2,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 6
              }}>
              </View>
            </Animated.View>
          </Animated.View>

        </TouchableView>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});
