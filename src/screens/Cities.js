import React from 'react';
import {
    View, 
    SafeAreaView, 
    Text, 
    FlatList,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet} from 'react-native';
import { Icon } from "react-native-elements";
import cities from '../model/cities';

const {width, height} = Dimensions.get('screen');

const Cities = ({navigation}) => {

    const City = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={()=>{navigation.navigate('WeatherCity', {city: item.name})}}
            >
                <View style={styles.city}>
                    <Image
                        source={item.photo}
                        style={{ height: 100, width: 120, resizeMode: 'stretch', }}
                    />
                    <View style={styles.cityText}>
                        <Text style={styles.cityName}>{item.name}</Text>
                    </View>
                    <View style={{
                                justifyContent: 'center',
                                alignItems: 'center'
                    }}>
                        <Icon
                            name="chevron-right"
                            type="material-community"
                            size={50}
                            style={{ width: 35, }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : null}
        > 
            <SafeAreaView>
                <View style={styles.header}>
                    <Text style={styles.textHeader}>Selecione uma cidade</Text>
                </View>
                <FlatList
                    style={styles.flatlist}
                    showsVerticalScrollIndicator={false}
                    data={cities}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                    <City item={item} index={index} />
                    )}
                />
                <TouchableOpacity
                    style={styles.footer}
                    onPress={()=>{navigation.navigate('WeatherCity', {city: 'current'})}}
                >
                    <Text style={styles.textHeader}>Localização atual</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAvoidingView>    
    ) 
};

export default Cities;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    flatlist: {
        height: '80%'
    },
    header: {
        backgroundColor: '#5d8aa8',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        backgroundColor: '#5d8aa8',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    },
    textHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    city: {
        flexDirection: 'row',
        height: 100,
        borderWidth: 1
    },
    cityText: {
        width: width - 175,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cityName: {
        fontSize: 30
    },
});
  