import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import Login from "./Login";
import MorphSlider from "./MorphSlider";
import Curve from "./Curve";
import Menu from "./MenuThree";
import BalloonSlider from "./BalloonSlider";
import { useState } from "react";

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
  return (
    <View style={styles.container}>
      {selectedScreen === -1 &&
        screens.map(({ name }, i) => (
          <>
            <Button title={name} onPress={() => setSelectedScreen(i)} />
            {divider}
          </>
        ))}
      {selectedScreen >= 0 && screens.map(({ Component }) => <Component />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
