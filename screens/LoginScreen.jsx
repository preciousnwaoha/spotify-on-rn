import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import {MaterialIcons} from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

// import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { CLIENT_ID, CLIENT_SECRET } from "../config/spotifyCredentials";
// import * as AppAuth from 'expo-auth-session/providers/appauth';

// WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

/**
  https://accounts.spotify.com/authorize?redirect_uri=exp%3A%2F%2F192.168.1.107%3A8081&client_id=d3152f8ce4b1477a9e510e5207811ea3&response_type=code&state=MfRAZMVG2C&scope=user-read-email+playlist-modify-public
 */



const LoginScreen = () => {
  const navigation = useNavigation();
    const [request, response, promptAsync] = useAuthRequest({
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      scopes: [
        "user-read-email", 
        "playlist-modify-public",
        "playlist-modify-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-library-read",
        "user-library-modify",
        "user-read-private",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-top-read",

      ],
      usePKCE: false,
      // redirectUri: makeRedirectUri({
      //     scheme: "exp",
      //     path: "exp://192.168.1.107:8081",
      //     // native: 'exp://localhost:8082/callback'
      //     // native: "exp://localhost:8082/--/spotify-auth-callback"
      // }),
      redirectUri: "exp://192.168.1.107:8081"
  }, discovery)

        
  useEffect(() => {
    const checkTokenValidity = async () => {
      const expirationTime = await AsyncStorage.getItem("expirationTime");
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log("expirationTime", expirationTime);
      console.log("accessToken", accessToken);
      if (accessToken && expirationTime) {
        const currentTime = new Date().getTime();
        if (currentTime < parseInt(expirationTime)) {
          navigation.replace("Main")
        } else {
          AsyncStorage.removeItem("accessToken");
          AsyncStorage.removeItem("expirationTime");
        }
      }
    }

    checkTokenValidity();
  }, []);


    useEffect(() => {
      if (response?.type === "success") {
        const result = response.params;
        if (result.access_token) {
          console.log("access_token", result.access_token);
          const expirationTime = new Date().getTime() + result.expires_in * 1000;
          console.log("expirationTime", expirationTime);

          AsyncStorage.setItem("accessToken", result.access_token);
          // AsyncStorage.setItem("refreshToken", result.refresh_token);
          AsyncStorage.setItem("expirationTime", expirationTime.toString());
          navigation.navigate("Main");
        }
        
      }
    }, [response]);

    

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }}></View>
          <Entypo
            style={{
              alignSelf: "center",
            }}
            name="spotify"
            size={80}
            color="white"
          />
          <Text
            style={{
                color: "white",
              textAlign: "center",
              fontSize: 40,
              fontWeight: "bold",
              marginTop: 40,
            }}
          >
            Millions of songs.{"\n"}Free on Spotify.
          </Text>
        
        <View style={{height: 80}} />
        <Pressable
        onPress={() => {
          promptAsync();
        }}
        style={{
            backgroundColor: "#1DB954",
            marginLeft: "auto",
            marginRight: "auto",
            padding: 10,
            height: 50,
            width: 300,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 10,
        }}>
            <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
            }}>Sign In with spotify</Text>
        </Pressable>

        <Pressable style={{
            backgroundColor: "#131624",
            marginLeft: "auto",
            marginRight: "auto",
            padding: 10,
            height: 50,
            width: 300,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
        }}>
            <MaterialIcons name="phone-android" size={24} color="white" />
            <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                flex: 1
            }}>Continue with phone number</Text>
        </Pressable>

        <Pressable style={{
            backgroundColor: "#131624",
            marginLeft: "auto",
            marginRight: "auto",
            padding: 10,
            height: 50,
            width: 300,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
        }}>
            <AntDesign name="google" size={24} color="red" />
            <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                flex: 1
            }}>Continue with Google</Text>
        </Pressable>

        <Pressable style={{
            backgroundColor: "#131624",
            marginLeft: "auto",
            marginRight: "auto",
            padding: 10,
            height: 50,
            width: 300,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
        }}>
            <Entypo name="facebook-with-circle" size={24} color="blue" />
            <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                flex: 1
            }}>Continue with facebook</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
