import Root from './root';
import Login from './Login';
import MorphSlider from './MorphSlider';
import Curve from './Curve';
import Menu from './MenuThree'
import BalloonSlider from './BalloonSlider';

import { Platform } from 'react-native';

import {
    createStackNavigator,
    createAppContainer
} from "react-navigation";

import { createBrowserApp } from "@react-navigation/web";

const createApp = Platform.select({
    web: createBrowserApp,
    default: createAppContainer
});


export default createApp(
    createStackNavigator(
        {
            Root,
            Login,
            Curve,
            MorphSlider,
            Menu,
            BalloonSlider
        },
        {
            headerMode: 'none',
            navigationOptions: {
                headerVisible: false,
            }
        }),
    // { history: 'hash'}
);