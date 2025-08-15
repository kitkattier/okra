import { View, Image, Text } from "tamagui";

export default function Example() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Example of another page.</Text>
      <Image
        source={require("../../assets/images/meowl.png")}
        style={{ width: 150, height: 300, marginTop: 200 }}
      />
    </View>
  );
}
