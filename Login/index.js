import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextField } from 'react-native-material-textfield';
import Ripple from './components/ripple';

const { width } = Dimensions.get('window');

const EXPANDED_BUTTON_WIDTH = width - 100;
const COLLAPSED_BUTTON_WIDTH = 40;

const AnimatedRipple = Animated.createAnimatedComponent(Ripple)

export default class App extends React.Component {


  state = {
    buttonWidth: new Animated.Value(EXPANDED_BUTTON_WIDTH),
    opacity: new Animated.Value(1),
    loaderOpacity: new Animated.Value(0),
    buttonOpacity: new Animated.Value(1),
    rotation: new Animated.Value(0),
    circleY: 0,
    scale: new Animated.Value(0),
    circleOpacity: new Animated.Value(0),
    inputAnimation: new Animated.Value(1)
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)

    this.state.buttonWidth.addListener(({ value }) => {
      if (value === COLLAPSED_BUTTON_WIDTH) {
        Animated.parallel([
          Animated.timing(this.state.buttonOpacity, {
            toValue: 0,
            duration: 150
          }),
          Animated.timing(this.state.loaderOpacity, {
            toValue: 1,
            duration: 250
          }),
          Animated.loop(Animated.timing(this.state.rotation, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear
          }))
        ]).start();

        //Animate white circle
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(this.state.circleOpacity, {
              toValue: 1,
              duration: 200
            }),
            Animated.timing(this.state.scale, {
              toValue: 1,
              duration: 1100,
              easing: Easing.linear
            })
          ]).start();
        }, 1000)
      }
    });

  }


  _onSignInPress() {
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 150
      }),
      Animated.timing(this.state.buttonWidth, {
        toValue: COLLAPSED_BUTTON_WIDTH,
        duration: 300
      }),
      Animated.timing(this.state.inputAnimation, {
        toValue: 0,
        duration: 300,
        delay: 100
      })
    ]).start();
  }


  render() {

    const inputProps = {
      textColor: 'white',
      baseColor: 'rgba(255,255,255,0.8)',
      tintColor: 'rgba(255,255,255,0.8)'
    }

    const spin = this.state.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    const borderColor = this.state.buttonOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(0,0,0,0)', 'white']
    })

    const scale = this.state.scale.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100]
    })

    const translateY = this.state.inputAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-60, 0]
    })

    return (
      <View style={styles.container}>
        <Image style={styles.background}
          source={require('./assets/background.png')} />
        <LinearGradient
          colors={['transparent', '#ab3f8f']}
          style={styles.gradient} />

        <Text style={styles.titleStyle}>CLOVER</Text>

        <Animated.View
          style={{
            marginTop: 110,
            marginHorizontal: 50,
            opacity: this.state.inputAnimation,
            transform: [{ translateY }]
          }}>
          <TextField
            {...inputProps}
            label='Username'
            style={styles.inputStyle} />
                    <TextField
            {...inputProps}
            label='Password'
            secureTextEntry={true}
            style={styles.inputStyle} />
        </Animated.View>

        <View style={{ flex: 1, }} />

        <View style={styles.bottomContainer}
          onLayout={({ nativeEvent }) => {
            const { y } = nativeEvent.layout;
            if (this.state.circleY === 0)
              this.setState({
                circleY: y
              })
          }}>

          <AnimatedRipple
            rippleContainerBorderRadius={20}
            rippleOpacity={0.5}
            onPress={this._onSignInPress.bind(this)}
            rippleColor={'white'}
            style={{
              alignSelf: 'center',
              width: this.state.buttonWidth,
            }}>

            <Animated.View style={[styles.loginButtonStyle, { borderColor: borderColor }]}>
              <Animated.Text style={[styles.loginTextStyle, { opacity: this.state.opacity }]}>SIGN IN</Animated.Text>
              <Animated.Image style={[
                styles.loaderStyle,
                {
                  opacity: this.state.loaderOpacity,
                  transform: [{ rotate: spin }]
                }]} source={require('./assets/spinner.png')} />

            </Animated.View>
          </AnimatedRipple>
          <Text style={styles.bottomTextStyle}>Don't have account yet?<Text style={{ fontWeight: 'bold' }}> Sign Up</Text></Text>
        </View>
        {/* Circle View */}
        <Animated.View style={[styles.authCircleStyle, {
          left: width / 2 - 20,
          top: this.state.circleY,
          transform: [{ scale }],
          opacity: this.state.circleOpacity,
          position: 'absolute'
        }]} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: 0.9
  },
  gradient: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: 35,
    color: 'white',
    marginTop: 80,
    letterSpacing: 2,
    alignSelf: 'center'
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 50,
  },
  inputStyle: {
    backgroundColor: 'transparent',
    color: 'white'
  },
  loginButtonStyle: {
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    height: 40,
    width: '100%'
  },
  loginTextStyle: {
    color: 'white',
    padding: 10
  },
  bottomTextStyle: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
    marginTop: 80,
    alignSelf: 'center',
    fontSize: 12
  },
  loaderStyle: {
    position: 'absolute',
    width: 40,
    height: 39
  },
  authCircleStyle: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 20
  }
});
