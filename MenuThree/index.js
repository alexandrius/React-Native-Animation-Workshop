import React from 'react';
import { View, Animated, Dimensions, Platform, Easing, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import ExpoTHREE, { THREE } from 'expo-three';
import { View as GraphicsView } from 'expo-graphics';
import MatrixMath from './MatrixMath';
import { TouchableView } from '../components';
import { Feather } from '@expo/vector-icons';
import { guitarObj, guitarTexture, guitarShadow } from './assets';

const { width } = Dimensions.get('window');
const ROTATION_MAX = width - 100;

const MAIN_COLOR = 'rgb(237,231,219)';


export default class App extends React.Component {

    rotationValue = 0;
    rotation = new Animated.Value(0)
    lastDx = 0;
    dx = 0;

    componentDidMount() {
        StatusBar.setBarStyle('dark-content');
        THREE.suppressExpoWarnings();
        this.rotation.addListener(({ value }) => {

            const mainAngle = this._getAngle(value);
            const origin = { x: 0, y: 0, z: -ROTATION_MAX / 2 };
            let matrix = this._rotateXY(mainAngle);
            this._transformOrigin(matrix, origin);
            this.main.setNativeProps({
                style: {
                    transform: [
                        { perspective: 1000 },
                        { matrix: matrix }]
                }
            });
            matrix = this._rotateXY(mainAngle - 90);
            this._transformOrigin(matrix, origin);
            this.menu.setNativeProps({
                style: {
                    transform: [
                        { perspective: 1000 },
                        { matrix: matrix }]
                }
            });

            this.updateGuitar();

            this.rotationValue = value;
        })
    }

    onShouldReloadContext = () => {
        return Platform.OS === 'android';
    };

    _rotateXY(dx, dy = 0) {
        const radX = (Math.PI / 180) * dy;
        const cosX = Math.cos(radX);
        const sinX = Math.sin(radX);

        const radY = (Math.PI / 180) * -dx;
        const cosY = Math.cos(radY);
        const sinY = Math.sin(radY);

        return [
            cosY, sinX * sinY, cosX * sinY, 0,
            0, cosX, -sinX, 0,
            -sinY, cosY * sinX, cosX * cosY, 0,
            0, 0, 0, 1
        ];
    }

    _transformOrigin(matrix, origin) {
        const { x, y, z } = origin;

        const translate = MatrixMath.createIdentityMatrix();
        MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
        MatrixMath.multiplyInto(matrix, translate, matrix);

        const untranslate = MatrixMath.createIdentityMatrix();
        MatrixMath.reuseTranslate3dCommand(untranslate, -x, -y, -z);
        MatrixMath.multiplyInto(matrix, matrix, untranslate);
    }

    _animateToValue(value) {
        Animated.timing(this.rotation, {
            toValue: value,
            duration: 200,
            easing: Easing.in,
            useNativeDriver: true
        }).start();
    }

    render() {

        this.objPosition = this.rotation.interpolate({
            inputRange: [0, ROTATION_MAX],
            outputRange: [0, 0.33],
            extrapolate: 'clamp'
        });

        this.objScale = this.rotation.interpolate({
            inputRange: [0, ROTATION_MAX],
            outputRange: [0, -0.15],
            extrapolate: 'clamp'
        });

        const shadowScale = this.rotation.interpolate({
            inputRange: [0, ROTATION_MAX],
            outputRange: [1, 0.85],
            extrapolate: 'clamp'
        });

        this.objRotation = this.rotation.interpolate({
            inputRange: [0, ROTATION_MAX],
            outputRange: [0, 75],
            extrapolate: 'clamp'
        });


        const shadow = this.rotation.interpolate({
            inputRange: [0, ROTATION_MAX],
            outputRange: [0, -100],
            extrapolate: 'clamp'
        });

        const opacity = this.rotation.interpolate({
            inputRange: [0, ROTATION_MAX],
            outputRange: [0, 0.6],
            extrapolate: 'clamp'
        });

        const textOpacity = this.rotation.interpolate({
            inputRange: [0, ROTATION_MAX],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        const menuOpacity = this.rotation.interpolate({
            inputRange: [0, ROTATION_MAX],
            outputRange: [0.7, 0],
            extrapolate: 'clamp'
        });


        const opacityMain = this.rotation.interpolate({
            inputRange: [0, ROTATION_MAX],
            outputRange: [0, 0.4],
            extrapolate: 'clamp'
        });

        const angleOpacity = this.rotation.interpolate({
            inputRange: [0, ROTATION_MAX / 2, ROTATION_MAX],
            outputRange: [0, 0.85, 0],
            extrapolate: 'clamp'
        });


        return (
            <Animated.View style={{ flex: 1, justifyContent: 'center', backgroundColor: MAIN_COLOR }}>

                <Animated.View style={{
                    backgroundColor: 'black',
                    position: 'absolute',
                    opacity,
                    height: '100%',
                    width: '100%'
                }} />
                <Animated.View
                    ref={ref => this.menu = ref}
                    style={{
                        position: 'absolute',
                        width: ROTATION_MAX,
                        height: '100%',
                        backgroundColor: MAIN_COLOR,
                        justifyContent: 'center',
                        zIndex: 200
                        // alignItems: 'center'
                    }}>

                    <Animated.View style={{
                        backgroundColor: 'gray',
                        position: 'absolute',
                        opacity: menuOpacity,
                        height: '100%', width: '100%'
                    }} />

                    <Animated.View style={{
                        position: 'absolute',
                        opacity: menuOpacity,
                        backgroundColor: 'black',
                        height: '100%',
                        width: "100%"
                    }} />

                    <Animated.View style={{
                        position: 'absolute',
                        color: 'white',
                        backgroundColor: '#d8d4cb',
                        height: '100%',
                        width: 30,
                        right: -15,
                        opacity: angleOpacity
                    }} />

                    <Text style={[styles.menuText, {
                        color: '#93402c',
                    }]}>GUITARS</Text>

                    <Text style={styles.menuText}>BASSES</Text>
                    <Text style={styles.menuText}>AMPS</Text>
                    <Text style={styles.menuText}>PEDALS</Text>
                    <Text style={styles.menuText}>OTHERS</Text>


                </Animated.View>

                <Animated.View
                    ref={ref => this.main = ref}
                    style={{
                        position: 'absolute',
                        width: ROTATION_MAX,
                        height: '100%',
                        backgroundColor: MAIN_COLOR,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 201
                    }}>

                    <Text style={{
                        position: 'absolute',
                        top: 300,
                        color: 'rgb(206,199,189)',
                        fontSize: 90,
                        left: -180,
                        width: 500,
                        fontWeight: '900',
                        transform: [{ rotate: '90deg' }]
                    }}>GIBSON</Text>


                    <Animated.Image style={{
                        height: 900,
                        width: 400,
                        left: 5,
                        top: -60,
                        opacity: 0.5,
                        position: 'absolute',
                        transform: [{
                            translateX: shadow
                        }, {
                            scale: shadowScale
                        }]
                    }}
                        resizeMode='contain'
                        source={guitarShadow} />

                </Animated.View>

                <View style={{ position: 'absolute', zIndex: 300, width: '100%', height: '100%' }}>

                    <TouchableView style={{ flex: 1 }}
                        onTouchesEnded={() => {
                            if (this.dx > 20 || this.dx < -20) {
                                this.lastDx = this.dx > 20 ? ROTATION_MAX : 0;
                                this._animateToValue(this.lastDx);
                            }
                        }}
                        onTouchesBegan={() => {
                            this.prev = 0;
                        }}
                        onTouchesMoved={(event) => {
                            let correctedDx = this.lastDx + event.gestureState.dx - this.prev;
                            if (correctedDx > ROTATION_MAX) {
                                correctedDx = ROTATION_MAX;
                            } else if (correctedDx < 0) {
                                correctedDx = 0;
                            }
                            this.rotation.setValue(correctedDx);
                            this.lastDx = correctedDx;
                            this.prev = event.gestureState.dx;
                            this.dx = event.gestureState.dx;
                        }}>
                        <GraphicsView
                            onContextCreate={this.onContextCreate}
                            onRender={this.onRender}
                            onResize={this.onResize}
                            onShouldReloadContext={this.onShouldReloadContext} />
                    </TouchableView>

                    <Animated.View style={{
                        position: 'absolute',
                        top: 47,
                        width: '100%',
                        opacity: textOpacity,
                        transform: [{
                            translateX: this.rotation
                        }]
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '800',
                            color: 'rgb(10,8,7)',
                            alignSelf: 'center'
                        }}>PRODUCT DETAIL</Text>
                    </Animated.View>

                </View>

                <Animated.View style={{
                    left: 20,
                    position: 'absolute',
                    top: 40,
                    zIndex: 300,
                    transform: [{
                        translateX: this.rotation
                    }]
                }}>
                    <TouchableOpacity onPress={() => {
                        this.lastDx = this.rotationValue === 0 ? ROTATION_MAX : 0;
                        this._animateToValue(this.lastDx);
                    }}>
                        <Feather name='menu' size={40} color='rgb(10,8,7)' />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        );
    }

    _getAngle(correctedDx) {
        return correctedDx * 90 / ROTATION_MAX;
    }


    toRadians(degrees) {
        if (!degrees) return 0;
        return degrees * (Math.PI / 180);
    }


    onContextCreate = async ({
        gl,
        canvas,
        width,
        height,
        scale: pixelRatio,
    }) => {
        this.renderer = new ExpoTHREE.Renderer({
            gl,
            canvas,
            width,
            height,
            pixelRatio,
        });
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0x404040));
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.z = 1;
        this.scene.add(pointLight);
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));

        this.camera.position.z = 1;


        /// ====== OBJ HERE ======
        const mesh = await ExpoTHREE.loadObjAsync({
            asset: guitarObj,
        });

        const texture = await ExpoTHREE.loadTextureAsync({
            asset: guitarTexture,
        })


        var objMaterial = new THREE.MeshLambertMaterial({
            map: texture
        });

        objMaterial.transparent = true;
        objMaterial.side = THREE.DoubleSide;
        objMaterial.alphaTest = 0.0;

        mesh.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.material = objMaterial
            }
        });

        ExpoTHREE.utils.scaleLongestSideToSize(mesh, 0.9)
        ExpoTHREE.utils.alignMesh(mesh, { y: 1 })
        this.scene.add(mesh)
        this.guitar = mesh
        this.guitar.rotation.x = this.toRadians(90);
    };


    onResize = ({ width, height, scale }) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(scale);
        this.renderer.setSize(width, height);
    };

    updateGuitar() {
        if (this.guitar) {
            this.guitar.rotation.z = this.toRadians(-this.objRotation.__getValue());
            this.guitar.position.x = this.objPosition ? this.objPosition.__getValue() : 0;
            this.guitar.position.z = this.objScale ? this.objScale.__getValue() : 0;
        }
    }

    onRender = delta => {
        this.renderer.render(this.scene, this.camera);
    };
}

const styles = StyleSheet.create({
    menuText: {
        marginTop: 20,
        fontWeight: '900',
        color: 'rgb(10,8,7)',
        fontSize: 35,
        marginLeft: 40
    }
})