import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import Login from "./Login";
import MorphSlider from "./MorphSlider";
import Curve from "./Curve";
import Menu from "./MenuThree";
import BalloonSlider from "./BalloonSlider";
import { useState, Fragment } from "react";
import { getTopInset } from "rn-iphone-helper";

const divider = <View style={{ height: 10 }} />;

const screens = [
  {
    name: "Temperature Control",
    Component: MorphSlider,
  },
  {
    name: "Login page",
    Component: Login,
  },
  {
    name: "Curved add to cart",
    Component: Curve,
  },
  {
    name: "3D Burger Menu",
    Component: Menu,
  },
  {
    name: "Balloon Slider",
    Component: BalloonSlider,
  },
];

export default function App() {
  const [selectedScreen, setSelectedScreen] = useState(-1);
  let Screen;
  if (selectedScreen >= 0) {
    Screen = screens[selectedScreen].Component;
  }

  return (
    <View style={styles.container}>
      {selectedScreen === -1 && (
        <View style={{ paddingTop: getTopInset() + 20 }}>
          {screens.map(({ name }, i) => (
            <Fragment key={name}>
              <Button title={name} onPress={() => setSelectedScreen(i)} />
              {divider}
            </Fragment>
          ))}
        </View>
      )}
      {Screen && <Screen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
