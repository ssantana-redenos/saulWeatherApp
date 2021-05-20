import React, {useEffect, useState, Component } from 'react';
import {
    View, 
    SafeAreaView, 
    Text, 
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Image,
    Dimensions,
    PermissionsAndroid,
    ActivityIndicator,
    StyleSheet} from 'react-native';
import moment from "moment";
import { Icon } from "react-native-elements";
import Geolocation from '@react-native-community/geolocation';
import api from '../services/api'

const {width, height} = Dimensions.get('screen');

const WeatherCity = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
    const [currentPosition, setCurrentPosition] = useState({
        lat: 0,
        lon: 0
    })
    const [locationStatus, setLocationStatus] = useState('');
    
    const getWeatherCityInfo = async (city, lat, lon) => {
        try{
            if (city != "") {
                const response = await api.get('weather?q=' + route.params.city + '&appid=1a229290c12935dc2d446d374a1bddc5', {});
                const response1 = await api.get('onecall?lat=' + response.data.coord.lat + '&lon=' + response.data.coord.lon + '&exclude=current,hourly,minutely&units=metric&appid=1a229290c12935dc2d446d374a1bddc5', {});
                setData(response1.data.daily);
                setIsLoading(false);
            } else {
                const response1 = await api.get('onecall?lat=' + lat + '&lon=' + lon + '&exclude=current,hourly,minutely&units=metric&appid=1a229290c12935dc2d446d374a1bddc5', {});
                setData(response1.data.daily);
                setIsLoading(false);
            }
        } catch (e) {

        }
    }

    const getOneTimeLocation = () => {
        setLocationStatus('Getting Location ...');
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {
            setLocationStatus('You are Here');
            setCurrentPosition({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            });
            getWeatherCityInfo("", position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            setLocationStatus(error.message);
            setCurrentPosition({
                lat: 0,
                lon: 0
            });
          },
          {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 1000
          },
        );
    };
    
    useEffect(() => {
        if (route.params.city == 'current') {
            const requestLocationPermission = async () => {
                if (Platform.OS === 'ios') {
                  getOneTimeLocation();
                } else {
                  try {
                    const granted = await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                      {
                        title: 'Requerimento de acesso a sua localização',
                        message: 'Este Aplicativo precisa da sua localização',
                      },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                      //To Check, If Permission is granted
                      getOneTimeLocation();
                    } else {
                      setLocationStatus('Permission Denied');
                    }
                  } catch (err) {
                    console.warn(err);
                  }
                }
              };
              requestLocationPermission();
        } else {
            getWeatherCityInfo(route.params.city, 0, 0);
        }
      }, []);
    
      const CityWeather = ({ item, index }) => {
        return (
            <View style={styles.weather}>
                <View style={styles.weatherLeft}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 50}}>{parseInt(item.temp.day).toString()}</Text>
                        <Text style={{fontSize: 20}}>o</Text>
                    </View>
                    <Text style={{fontSize: 20}}>{item.weather[0].main}</Text>
                </View>
                <View style={styles.weatherImage}>
                    <Image
                        source={{uri: 'http://openweathermap.org/img/wn/' + item.weather[0].icon + '.png'}}
                        style={{height: 100, 
                                width: 100, 
                                resizeMode: 'stretch',
                        }}
                    />
                </View>
                <View style={styles.weatherRight}>
                    <View style={styles.weatherHumidity}>
                        <Icon
                            name="water"
                            type="material-community"
                            size={15}
                            color="#fff"
                            style={{ marginLeft: 5, width: 20, }}
                        />
                        <Text style={{fontSize: 15, color: '#fff'}}>{item.humidity}</Text>
                    </View>
                    <Text style={{fontSize: 50, }}>{moment(item.dt*1000).format("DD")}</Text>
                    <Text style={{fontSize: 25, }}>{moment(item.dt*1000).format("dddd").substr(0, 3)}</Text>
                </View>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : null}
        > 
            {isLoading ? (
                <ActivityIndicator
                color="#5d8aa8"
                size="large"
              />
             ) : (
            <SafeAreaView>
                <View style={styles.header}>
                    <Text style={styles.textHeader}>{route.params.city == 'current' ? 'posição atual' : route.params.city}</Text>
                    <Text style={styles.textHeader}>{route.params.city == 'current' ? '(' + currentPosition.lat.toFixed(2) + ',' + currentPosition.lon.toFixed(2) + ')': ""}</Text>
                </View>
                <FlatList
                    style={styles.flatlist}
                    showsVerticalScrollIndicator={false}
                    data={data}
                    keyExtractor={(item) => item.dt.toString()}
                    renderItem={({ item, index }) => (
                    <CityWeather item={item} index={index} />
                    )}
                />
            </SafeAreaView>
            )}
        </KeyboardAvoidingView>    
    ) 
};

export default WeatherCity;


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green'
    },
    flatlist: {
        height: '90%'
    },
   weather: {
        flexDirection: 'row',
        height: 150,
        borderTopWidth: 1
    },
    weatherLeft: {
        width: width*.35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherRight: {
        width: width*.35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherImage: {
        width: width*.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherHumidity: {
        flexDirection: 'row',
        height: 20,
        width: width*.15,
        backgroundColor: '#ff033e',
        borderRadius: 15,
        alignItems: 'center',
    },
});
  