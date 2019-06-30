// @flow
import { PropTypes } from 'prop-types';
import React from 'react';
import { PanResponder, View } from 'react-native';

/* global Alert */

class TouchableView extends React.Component {
  static propTypes = {
    onTouchesBegan: PropTypes.func.isRequired,
    onTouchesMoved: PropTypes.func.isRequired,
    onTouchesEnded: PropTypes.func.isRequired,
    onTouchesCancelled: PropTypes.func.isRequired,
    onStartShouldSetPanResponderCapture: PropTypes.func.isRequired,
  };
  static defaultProps = {
    onTouchesBegan: () => { },
    onTouchesMoved: () => { },
    onTouchesEnded: () => { },
    onTouchesCancelled: () => { },
    onStartShouldSetPanResponderCapture: () => true,
  };

  buildGestures = () =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: ({ nativeEvent }, gestureState) => {
        const event = this._transformEvent({ ...nativeEvent, gestureState });
        this.props.onTouchesBegan(event);
      },
      onPanResponderMove: ({ nativeEvent }, gestureState) => {
        const event = this._transformEvent({ ...nativeEvent, gestureState });
        this.props.onTouchesMoved(event);
      },
      onPanResponderRelease: ({ nativeEvent }, gestureState) => {
        const event = this._transformEvent({ ...nativeEvent, gestureState });
        this.props.onTouchesEnded(event);
      },
      onPanResponderTerminate: ({ nativeEvent }, gestureState) => {
        const event = this._transformEvent({ ...nativeEvent, gestureState });
        this.props.onTouchesCancelled
          ? this.props.onTouchesCancelled(event)
          : this.props.onTouchesEnded(event);
      },
    });
  _panResponder = null;
  constructor(props) {
    super(props);
    this._panResponder = this.buildGestures();
  }

  _transformEvent = event => {
    event.preventDefault = event.preventDefault || (_ => { });
    event.stopPropagation = event.stopPropagation || (_ => { });
    return event;
  };

  render() {
    const { children, id, style, ...props } = this.props;
    return (
      <View collapsable={false} {...props} style={[style]} {...this._panResponder.panHandlers}>
        {children}
      </View>
    );
  }
}
export default TouchableView;