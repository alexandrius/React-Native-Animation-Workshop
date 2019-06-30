import Root from './root';
import Login from './Login';
import MorphSlider from './MorphSlider';
import Curve from './Curve';
import Menu from './MenuThree'
import BalloonSlider from './BalloonSlider';

import {
    createStackNavigator,
    createAppContainer
} from "react-navigation";


export default Route = () => createAppContainer(
    createStackNavigator({
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
        })
);