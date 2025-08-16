import { Tabs } from "expo-router";
import { useTheme, Text } from "tamagui";
import { useEffect, useState } from "react";
import { Home, Cat, Brush } from "@tamagui/lucide-icons";

export default function TabLayout() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.red10.val,
          tabBarStyle: {
            backgroundColor: theme.background.val,
            borderTopColor: theme.borderColor.val,
          },
          headerStyle: {
            backgroundColor: theme.background.val,
            borderBottomColor: theme.borderColor.val,
          },
          headerTintColor: theme.color.val,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: () => <Home />,
          }}
        />
        <Tabs.Screen
          name="Example"
          options={{
            title: "Example",
            tabBarIcon: () => <Cat />,
          }}
        />
        <Tabs.Screen
          name="Draw"
          options={{
            title: "Draw",
            tabBarIcon: () => <Brush />,
          }}
        />
      </Tabs>
    );
  }
}
