import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useContext, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import SongItem from "../components/SongItem";
import { BottomModal, ModalContent } from "react-native-modals";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlayerContext } from "../context/PlayerContext";
import { Audio } from "expo-av";
import { debounce } from "lodash";

const LikedSongsScreen = () => {
  const { currentTrack, setCurrentTrack } = useContext(PlayerContext);

  const navigation = useNavigation();
  const value = useRef(0)
  const [savedTracks, setSavedTracks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTracks, setSearchTracks] = useState([]);
  const [modalVisisble, setModalVisible] = useState(false);
  const [currentSound, setCurrentSound] = useState(null)
  const [progress, setProgress] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)


  const getSavedTracks = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const response = await fetch(
      "https://api.spotify.com/v1/me/tracks?offset=0&limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 50,
        },
      }
    );

    if (!response.ok) {
      throw new Error("failed to fetch the tracks");
    }
    const data = await response.json();
    setSavedTracks(data.items);
  };

  useEffect(() => {
    getSavedTracks();
  }, []);

  // console.log("\nsavedTracks", savedTracks);

  async function playTrack(){
    if (savedTracks.length > 0) {
      setCurrentTrack(savedTracks[0]);
    }
    await play(savedTracks[0]);
  };

  async function play(nextTrack) {
    const preview_url = nextTrack?.track?.preview_url;

    try {
      if (currentSound) {
        await currentSound.stopAsync();
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      })

      const {sound, status} = await Audio.Sound.createAsync(
        {
          uri: preview_url,
        }, 
        {
          shouldPlay: true, isLooping: false
        },
        onPlaybackStatusUpdate,
      )
      // console.log("sound", sound)
      onPlaybackStatusUpdate(status)
      setCurrentSound(sound)
      setIsPlaying(status.isLoaded)
      await sound.playAsync()
    } catch(err) {
      console.log(err.message)
    }
  };

  const onPlaybackStatusUpdate = async (status) => {
    console.log("\n\nstatus", status)
    if (status.isLoaded && status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis
      console.log("\nprogress", progress)
      setProgress(progress)
      setCurrentTime(status.positionMillis)
      setTotalDuration(status.durationMillis)
    }

    if (status.didJustFinish === true) {
      setCurrentSound(null);
      playNextTrack();
    }
  }

  const progressBarCircleSize = 12

  const formatTime = (millis) => {
    let minutes = Math.floor(millis / 60000);
    let seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  const handlePlayPause = async () => {
    if (currentSound) {
      if (isPlaying) {
        await currentSound.pauseAsync()
      }else {
        await currentSound.playAsync()
      }
      setIsPlaying(!isPlaying) 
    }
  }

  const playNextTrack = async () => {
    if (currentSound){
      await currentSound.stopAsync();
      setCurrentSound(null)
    }

    value.current = value.current === savedTracks.length - 1 ? 0 : value.current + 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      await play(nextTrack);
    } else {
      console.log("end of playlist")
    }
  }

  const playPreviousTrack = async () => {
    if (currentSound){
      await currentSound.stopAsync();
      setCurrentSound(null)
    }

    value.current = value.current === 0 ? savedTracks.length - 1 : value.current - 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      await play(nextTrack);
    } else {
      console.log("end of playlist")
    }  
  }

  useEffect(() => {
    if(savedTracks.length > 0) {
      handleSearch(searchInput) 
    }
  }, [savedTracks])

  const handleSearch = async (text) => {
    const filteredTracks = savedTracks.filter((item) => {
      const trackName = item.track.name.toLowerCase();
      const searchedText = text.toLowerCase();
      return trackName.includes(searchedText);
    })

    setSearchTracks(filteredTracks);
  }

  const debouncedSearch = debounce(handleSearch, 800)

  const handleInputChange = (text) => {
    setSearchInput(text);
    debouncedSearch(text);
  };

  return (
    <>
      <LinearGradient colors={["#614085", "#516095"]} style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            marginTop: 50,
          }}
        >
          <Pressable
            style={{
              marginHorizontal: 10,
            }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Pressable
            style={{
              marginHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 9,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#42275a",
                gap: 10,
                flex: 1,
                padding: 9,
                borderRadius: 3,
                height: 38,
              }}
            >
              <AntDesign name="search1" size={20} color="white" />
              <TextInput
                value={searchInput}
                placeholder="Find in Liked songs"
                onChangeText={(text) => handleInputChange(text)}
                placeholderTextColor={"white"}
                style={{
                  color: "white",
                  fontWeight: "500",
                }}
              />
            </Pressable>

            <Pressable
              style={{
                marginHorizontal: 10,
                backgroundColor: "#42275a",
                padding: 10,
                borderRadius: 3,
                height: 38,
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Sort
              </Text>
            </Pressable>
          </Pressable>

          <View style={{ height: 50 }} />
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Liked Songs
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 13,
                fontWeight: "500",
                marginTop: 5,
              }}
            >
              430 songs
            </Text>
          </View>

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 10,
            }}
          >
            <Pressable
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#1D8954",
              }}
            >
              <AntDesign name="arrowdown" size={20} color="white" />
            </Pressable>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <MaterialCommunityIcons
                name="cross-bolnisi"
                size={24}
                color="#1D8954"
              />
              <Pressable
                onPress={playTrack}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 35,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#1D8954",
                }}
              >
                <Entypo name="controller-play" size={24} color="white" />
              </Pressable>
            </View>
          </Pressable>

          
          {searchTracks.length === 0 ? <ActivityIndicator size="large" color="white" /> : <>
          {/* <FlatList
            data={searchTracks}
            // keyExtractor={(item) => item.track.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <SongItem item={item} onPress={play} isPlaying={item === currentTrack} />}
          /> */}
          {searchTracks.map((item) => (
            <SongItem key={item.track.id} item={item} onPress={play} isPlaying={item === currentTrack} />
          ))}
          </>}
          
        </ScrollView>
      </LinearGradient>

      {currentTrack && (
        <Pressable
          onPress={() => setModalVisible(!modalVisisble)}
          style={{
            backgroundColor: "#5072A7",
            width: "90%",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 15,
            position: "absolute",
            borderRadius: 6,
            left: 20,
            bottom: 10,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Image
              style={{
                width: 40,
                height: 40,
              }}
              source={{ uri: currentTrack?.track?.album?.images[0].url }}
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                width: 220,
                color: "white",
                fontWeight: "bold",
              }}
            >
              {currentTrack?.track?.name} *{" "}
              {currentTrack?.track?.artists[0].name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <AntDesign name="heart" size={24} color="#1D8954" />
            <Pressable>
              <AntDesign name="pausecircle" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>
      )}

      <BottomModal
        visible={modalVisisble}
        onHardwareBackPress={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
      >
        <ModalContent
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#5072A7",
          }}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              marginTop: 40,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AntDesign onPress={() => setModalVisible(!modalVisisble)} name="down" size={24} color="white" />

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {currentTrack?.track?.name}
              </Text>

              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>

            <View style={{ height: 70 }} />

            <View style={{ padding: 10 }}>
              <Image
                style={{
                  width: "100%", height: 330, borderRadius: 4,
                }}
                source={{ uri: currentTrack?.track?.album?.images[0].url }}
              />

              <View
                style={{marginTop: 20, flexDirection: "row", justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{color: "white", fontSize: 18, fontWeight: "bold",}}
                  >
                    {currentTrack?.track?.name}
                  </Text>
                  <Text
                    style={{ color: "#D3D3D3", marginTop: 4,
                    }}
                  >
                    {currentTrack?.track?.artists[0].name}
                  </Text>
                </View>

                <AntDesign name="heart" size={24} color="#1D8954" />
              </View>
            </View>

            <View style={{marginTop: 10}}>
              <View style={{
                width: "100%",
                marginTop: 10,
                height: 3,
                backgroundColor: "gray",
                borderRadius: 3,
              }}>
                <View style={[styles.progressBar, {width: `${progress * 100}%`}]} />
                <View style={{
                  position: "absolute",
                  width: progressBarCircleSize,
                  height: progressBarCircleSize,
                  borderRadius: progressBarCircleSize / 2,
                  backgroundColor: "white",
                  left: `${progress * 100}%`,
                  top: -5,
                  marginLeft: -progressBarCircleSize / 2,
                }} />
              </View>

              <View style={{
              marginTop: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center", 
              }}>
                <Text style={{color: "white", fontSize: 15, color: "#D3D3D3"}}>{formatTime(currentTime)}</Text>
                <Text style={{color: "white", fontSize: 15, color: "#D3D3D3"}}>{formatTime(totalDuration)}</Text>
              </View> 
            </View>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 17,
            }}>
              <Pressable>
                <FontAwesome name="arrows" size={30} color="#03C03C" />
              </Pressable>
              <Pressable onPress={playPreviousTrack}>
                <Ionicons name="play-skip-back" size={30} color="white" />
              </Pressable>
              <Pressable onPress={handlePlayPause}>
                  {isPlaying ? (
                    <AntDesign name="pausecircle" size={60} color="white" />
                  ) : (
                    <Pressable
                      onPress={handlePlayPause}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Entypo name="controller-play" size={26} color="black" />
                    </Pressable>
                  )}
                </Pressable>
              <Pressable onPress={playNextTrack}>
                <Ionicons name="play-skip-forward" size={30} color="white" />
              </Pressable>
              <Pressable>
                <Feather name="repeat" size={30} color="#03C03C" />
              </Pressable>
            </View>

          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default LikedSongsScreen;

const styles = StyleSheet.create({
  progressBar: {
    height: "100%",
    backgroundColor: "white", 
  }
});
