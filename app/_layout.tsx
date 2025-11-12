import { Stack } from "expo-router";
import './global.css';

export default function RootLayout() {
    return <Stack>
        //anytime you add a new folder make sure to put copy paste stack screen and put the name and hide its header in there
        <Stack.Screen
            name="(tabs)"
            options={{headerShown: false}}
        />
    </Stack>;
}