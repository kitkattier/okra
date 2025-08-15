import React from "react";
import { Anchor, H2, Paragraph, XStack, YStack, Text, Image } from "tamagui";

export default function TabOneScreen() {
  return (
    <YStack>
      <H2
        style={{
          fontSize: 24,
          fontWeight: "bold",
          alignSelf: "center",
          marginTop: 20,
        }}
      >
        Welcome to Meowlytics!
      </H2>

      <Image
        source={require("../../assets/images/meowl.png")}
        alt="Meowlytics"
        style={{ width: 150, height: 300, alignSelf: "center", marginTop: 20 }}
      />
    </YStack>
  );
}
