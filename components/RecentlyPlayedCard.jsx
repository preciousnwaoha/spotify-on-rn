import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const RecentlyPlayedCard = ({item}) => {
  const navigation = useNavigation();

  return (
    <Pressable 
    onPress={() => navigation.navigate("Info", {
      item: item
    })}
    style={{
      margin: 10
    }}>
      <Text>RecentlyPalyedCard</Text>
      <Image style={{
        width: 130, height: 130, borderRadius: 3
        }} source={{uri: item.track.album.images[0].url}} />
        <Text
          numberOfLines={1}
        style={{
          fontSize: 13,
          color: "white",
          fontWeight: "500",
          marginTop: 10
        }}>{item?.track?.name}</Text>
    </Pressable>
  )
}

export default RecentlyPlayedCard

const styles = StyleSheet.create({})