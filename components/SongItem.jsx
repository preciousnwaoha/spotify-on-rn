import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, {useContext} from "react";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { PlayerContext } from "../context/PlayerContext";

const SongItem = ({ item, onPress, isPlaying }) => {
    const {currentTrack, setCurrentTrack} = useContext(PlayerContext)

    const handlePress = () => {
        setCurrentTrack(item)
        onPress(item)
    }

  return (
    <Pressable
    onPress={handlePress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        margin: 10,
      }}
    >
      <Image
        style={{
          width: 50,
          height: 50,
          marginRight: 10,
          backgroundColor: "#42275a",
          borderRadius : 3,
        }}
        source={{ uri: item?.track?.album?.images[0].url }}
      />
      <View style={{flex: 1}}>
        <Text
        numberOfLines={1}
          style={isPlaying?{
            fontWeight: "bold",
            fontSize: 14,
            color: "#3FFF00",
          }: {
            fontWeight: "bold",
            fontSize: 14,
            color: "white",
          }}
        >
          {item?.track?.name}
        </Text>
        <Text style={{
            marginTop: 4,
            color: "#989898"
        }}>{item?.track?.artists[0].name}</Text>
      </View>

      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginHorizontal: 10,
      }}>
            <AntDesign name="heart" size={24} color="#1D8954" />
            <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
      </View>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({});
