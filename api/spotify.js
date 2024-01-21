import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default axios.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: {
        Authorization: `Bearer ${async () => {
            return await AsyncStorage.getItem("accessToken")
        }}`
    }
});