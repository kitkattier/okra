import {
  createTamagui,
  TamaguiProvider,
  View,
  Image,
  Text,
  Button,
} from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";

const config = createTamagui(defaultConfig);

export default function Index() {
  return (
    <TamaguiProvider config={config}>
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
    </TamaguiProvider>
  );
}
