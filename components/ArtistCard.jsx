import { StyleSheet, Text, View, Card, Image } from 'react-native'
import React from 'react'

const ArtistCard = ({artist}) => {
  return (
    <View style={{margin: 10}}>
      <Image style={{
        width: 130,
        height: 130,
        borderRadius: 5,
      }} source={{uri: artist.images[0].url}} />

      <Text 
      numberOfLines={1}
      style={{
        fontSize: 13,
        color: "white",
        fontWeight: "500",
        marginTop: 10
      }}>{artist.name}</Text>
    </View>
  )
}

export default ArtistCard

const styles = StyleSheet.create({})