import React, { useRef } from 'react';
import { Dimensions, View, ScrollView, Animated, Image } from 'react-native';
import debounce from 'lodash.debounce';

const windowWidth = Dimensions.get('window').width;
const contentWidth = windowWidth - 40;

const INITIAL_BALOON_X = contentWidth - 30;

const KNOB_SIZE = 30;

export default function App() {

    const scrollView = useRef(null);
    const baloonX = new Animated.Value(INITIAL_BALOON_X);
    const baloonDragX = new Animated.Value(INITIAL_BALOON_X);

    let prevX = 0;

    const rotation = new Animated.Value(0);
    const visibleRotation = new Animated.Value(0);
    const tension = 0.8;
    const friction = 3;

    Animated.spring(baloonX, {
        toValue: baloonDragX,
        tension,
        friction,
        // useNativeDriver: true
    }).start();


    Animated.spring(visibleRotation, {
        toValue: rotation,
        tension: 1.5,
        friction: 5,
        // useNativeDriver: true
    }).start();

    const touchesEnded = () => {
        rotation.setValue(0);
    }

    const touchesEndedDelayed = debounce(touchesEnded, 50);

    const rotateZ = visibleRotation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-50deg', '0deg', '50deg'],
    })

    const translateX = visibleRotation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-40, 0, 40],
    })

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ height: 150 }}>


                <Animated.View style={{
                    transform: [
                        { translateX: baloonX }
                    ]
                }}>
                    <Animated.View style={{
                        transform: [
                            { translateX }
                        ]
                    }}>
                        <Animated.View style={{
                            height: 70,
                            width: 70,
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: [
                                { rotateZ }
                            ]
                        }}>
                            <Image
                                style={{ height: 70, width: 70 }}
                                resizeMode='contain'
                                source={require('./assets/balloon.png')} />
                        </Animated.View>
                    </Animated.View>
                </Animated.View>

                <ScrollView
                    ref={scrollView}
                    scrollEventThrottle={50}
                    decelerationRate={0}
                    showsHorizontalScrollIndicator={false}
                    onScroll={({ nativeEvent }) => {
                        baloonDragX.setValue(INITIAL_BALOON_X - nativeEvent.contentOffset.x)

                        const diff = prevX - nativeEvent.contentOffset.x;

                        if (Math.abs(diff) > 10) {
                            if (diff < 0) {
                                rotation.setValue(1);
                            } else {
                                rotation.setValue(-1);
                            }
                        }
                        prevX = nativeEvent.contentOffset.x;
                        touchesEndedDelayed();
                    }}
                    horizontal
                    bounces={false}
                    contentContainerStyle={{ alignItems: 'center', }}
                    style={{
                        marginHorizontal: 20
                    }}>

                    <View style={{
                        height: 2,
                        width: contentWidth - KNOB_SIZE,
                        backgroundColor: '#edabab'
                    }}></View>

                    <View style={{
                        height: KNOB_SIZE,
                        width: KNOB_SIZE,
                        borderRadius: KNOB_SIZE / 2,
                        backgroundColor: 'white',
                        borderColor: 'gray',
                        elevation: 3,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 6
                    }}>

                    </View>

                    <View style={{
                        height: 2,
                        width: contentWidth - KNOB_SIZE,
                        backgroundColor: '#e8e8e8'
                    }}></View>

                </ScrollView>
            </View>
        </View>
    );
}
