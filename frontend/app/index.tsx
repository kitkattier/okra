import { Text, View, Image } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome to Meowlytics!</Text>
      <Image
        source={require("../assets/images/meowl.png")}
        style={{ width: 150, height: 300, marginTop: 200 }}
      />
    </View>
  );
}
