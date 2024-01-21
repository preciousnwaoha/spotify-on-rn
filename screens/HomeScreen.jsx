import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, FlatList, ScrollView } from 'react-native'
import React, {useEffect, useReducer, useState} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import spotify from '../api/spotify'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios'
import ArtistCard from '../components/ArtistCard'
import RecentlyPlayedCard from '../components/RecentlyPlayedCard'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null)
  const [recentlyPlayed, setRecentlyPlayed] = useState([])
  const [topArtists, setTopArtists] = useState([])

  const greetingMessage = () => {
    const currentTime = new Date().getTime()
    if (currentTime < 12){
      return "Good Morning";
    } else if (currentTime < 18){
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  const message = greetingMessage()
  
  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken")
   
    try{
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await response.json();

    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

 console.log( "\n\nuserProfile", userProfile)

  const getRecentlyPlayedSongs = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken")
    try{
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=4",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      const tracks = response.data.items;
      setRecentlyPlayed(tracks)
      
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getRecentlyPlayedSongs()
    console.log("Playlists")
  }, [])

  console.log("\n\nrecentlyPlayed", recentlyPlayed)


  const renderItem = ({item}) => {
    return (
      <Pressable style={{ 
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",  
        gap: 10,
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: "#282828",
        borderRadius: 4,
        elevation: 3,
      }}>
        <Image style={{
          width: 55, height: 55,
          backgroundColor: "#353535",
        }} source={{uri: item.track.album.images[0].url}} />
          <View style={{
            flex: 1,
            marginHorizontal: 8,
            justifyContent: "center",
          }}>
            <Text numberOfLines={1} style={{
              color: "white",
              fontSize: 13,
              fontWeight: "bold",
            }} >{item.track.artists[0].name}</Text>
            <Text numberOfLines={2} style={{
              color: "white",
              fontSize: 12,
            }} >{item.track.name}</Text>
          </View>
        </Pressable>
    )
  }

  

  useEffect(() => {
    const getTopArtistsOfUser = async () => {
      try{
        
        const accessToken = await AsyncStorage.getItem("accessToken")
        if (!accessToken) return console.log("No token found");

      const type = "artists"
        const response = await axios({
          method: "GET",
          url: `https://api.spotify.com/v1/me/top/${type}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
  
        setTopArtists(response.data.items)
        
      } catch (error) {
        console.log(error.message)
      }
    }

    getTopArtistsOfUser();
  }, [])


  console.log("\n\ntopArtists", topArtists)

  return (
    <LinearGradient  colors={["#040306", "#131624"]} style={{flex: 1}}>
     
      <SafeAreaView style={{

      }}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
          
          }}>
            <Image style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              resizeMode: "cover",
              borderWidth: 1,
              borderColor: "white",
            }} source={{uri: userProfile?.images[0].url}} />

            <Text style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 10
            }}>
              {message}
            </Text>
          </View>

          <MaterialCommunityIcons name="lightning-bolt" size={24} color="white" />
        </View>

        <View style={{
          marginHorizontal: 12,
          marginVertical: 5,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,

        }}>
          <Pressable onPress={() => navigation.navigate("Search")} style={{
            backgroundColor: "#282828",
            padding: 10,
            borderRadius: 30,

          }} >
            <Text style={{
              fontSize: 15,
              color: "white",
            }}>
              Music
            </Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Search")} style={{
            backgroundColor: "#282828",
            padding: 10,
            borderRadius: 30,
          }} >
            <Text style={{
              fontSize: 15,
              color: "white",
            }}>
              Podcasts
            </Text>
          </Pressable>
        </View>

        <View style={{height: 10}}/>

        <View style={{
          flexDirection: "row",
          alignContent: "center", 
          justifyContent: "space-between",
        }}>
          <Pressable onPress={() => navigation.navigate("Liked")} style={{
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            flex: 1,
            marginHorizontal: 10,
            marginVertical: 8,
            backgroundColor: "#282828",
            borderRadius: 4,
            elevation: 3,
          }}>
            <LinearGradient colors={["#33006f", "#ffffff"]}>
              <Pressable onPress={() => navigation.navigate("Search")} style={{
                width: 55,
                height: 55,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,

              }}>
                <AntDesign name="heart" size={24} color="white" />
              </Pressable>
            </LinearGradient>

              <Text style={{
              fontSize: 13,
              color: "white",
              fontWeight: "bold",
            }}>Liked Songs</Text>

          </Pressable>

          <View style={{
          marginBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          flex: 1,
          marginHorizontal: 10,
          marginVertical: 8,
          backgroundColor: "#282828",
          borderRadius: 4,
          elevation: 3,
        }}>
          <Image style={{
            width: 55, height: 55,
          }} source={{uri: "https://i.pravatar.cc/100"}} />
            <View style={styles.randomArtist}>
              <Text style={{
                color: "white",
                fontSize: 13,
                fontWeight: "bold",
              }} >Hiphop Tamhiza</Text>
            </View>
          </View>
        </View>
        
        <FlatList 
        data={recentlyPlayed}
        keyExtractor={(item, index) => `${item.track.id}-${Math.floor(Math.random * 9999)}`}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between "
        }}
        renderItem={renderItem}
        />

        <Text style={{
          color: "white",
          fontSize: 13,
          fontWeight:"bold",
          marginHorizontal: 10,
          marginTop: 10
          }}>
          Your Top Artists
        </Text>
          
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{}} >
          {topArtists.map((artist, index) => {
            return <ArtistCard artist={artist} key={index} />
          })}
        </ScrollView>
        
        <View style={{height: 10}} />

        <Text style={{
          color: "white",
          fontSize: 10,
          fontWeight: "bold",
          marginHorizontal: 10,
          marginTop: 10
          }}>
            Recently Played
        </Text>
        <FlatList 
          data={recentlyPlayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
          <RecentlyPlayedCard item={item} key={index} />
          )}
        />

      </SafeAreaView>  
      
    </LinearGradient>
    
  )
}

export default HomeScreen

const styles = StyleSheet.create({})