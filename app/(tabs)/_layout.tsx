import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name='index'
            options={{
                title: 'Dashboard',
                headerShown: false
            }}
        />
        <Tabs.Screen
            name='activities'
            options={{
                title: 'Activities',
                headerShown: false
            }}
        />
        <Tabs.Screen
            name='diet'
            options={{
                title: 'Diet',
                headerShown: false
            }}
        />
        <Tabs.Screen
            name='supplements'
            options={{
                title: 'Supplements',
                headerShown: false
            }}
        />
        <Tabs.Screen
            name='workouts'
            options={{
                title: 'Workouts',
                headerShown: false
            }}
        />
    </Tabs>
  )
}

export default _layout