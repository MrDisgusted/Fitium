import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import '../global.css';

const index = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text>Hello World</Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})