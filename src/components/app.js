import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LogOutAction } from '../store/action/logOut';

import { Actions } from 'react-native-router-flux';
// lets play
import { BackAndroid, BackHandler, ListView, Modal, TouchableOpacity, Dimensions, View, Text, StyleSheet, TouchableHighlight, ScrollView, Image, ActivityIndicator } from "react-native";
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Polyline from '@mapbox/polyline';
import ActionSheet from 'react-native-actionsheet'
import { Drawer, Container, Footer, FooterTab, Header, Left, Body, Right, Button, Title, } from 'native-base';
import firebase from '../firebase/index'
import SideBar from './sidebar';

const { width, height } = Dimensions.get('window')
// const ratio = width / height
// const aspectRatio = width / height
// const lat_delta = 0.098
// const lon_delta = lat_delta * aspectRatio




function mapStateToProps(state) {
    return {
        isAuthenticated: state.LoginReducer.isAuthenticated,
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 38.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            allmemberLocation: []
        }

    }


    componentWillMount() {
        console.disableYellowBox = true,
            console.ignoredYellowBox = ['Setting a timer']
    }


    // // fetch directions and decode polylines
    // async getDirections(startLoc, destinationLoc) {
    //     // console.log("get direction funtion run")
    //     try {
    //         let key = 'AIzaSyCSDc8XUj2qEpzcStMWgHQVUpXel_v4kOg'
    //         let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyCSDc8XUj2qEpzcStMWgHQVUpXel_v4kOg`)
    //         // console.log(resp, "res hai get direction ka")
    //         let respJson = await resp.json();
    //         // console.log(respJson, "respJson")
    //         let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
    //         // console.log(points, "points points")
    //         let coords = points.map((point, index) => {
    //             return {
    //                 latitude: point[0],
    //                 longitude: point[1]
    //             }
    //         })
    //         // console.log(coords, "cooooooooorrrrddddd")
    //         this.setState({ coords: coords })
    //         return coords
    //     } catch (error) {
    //         return (error) => { console.log(error, 'error error error') }
    //     }
    //}



    // handleLogOut() {
    //     this.props.dispatch(LogOutAction.logout());
    //     // Actions.LogIn({ type: 'reset' })
    //     console.log("actionss")
    // }




    calcDelta = (lat, lon, accuracy) => {
        //console.log(lat, lon, accuracy, "lat, lon, accuracy lat, lon, accuracy")
        const oneDegreeLongitudeInMeters = 111.32;
        const circumference = (40075 / 360)
        const latDelta = accuracy * (1 / (Math.cos(lat) * circumference))
        const lonDelta = (accuracy / oneDegreeLongitudeInMeters)
        this.setState({
            region: {
                latitude: lat,
                longitude: lon,
                latitudeDelta: latDelta,
                longitudeDelta: lonDelta
            },
        })

        // var userId = firebase.auth().currentUser.uid;
        // firebase.database().ref(`/USER/${userId}`).child("/region").set(this.state.region)
        var rootRef = firebase.database().ref();
        const speedRef = rootRef.child("USER" + "/" + firebase.auth().currentUser.uid).update({
            latitude: lat,
            longitude: lon
        })
    }

    // directionGet() {
    //     if (this.state.region2.latitude) {
    //         const startLoc = this.state.myLocation.latitude + "," + this.state.myLocation.longitude
    //         const endLoc = this.state.region2.latitude + "," + this.state.region2.longitude
    //         // console.log(startLoc, "startLoc", endLoc, "endLoc")
    //         this.getDirections(startLoc, endLoc)
    //         this.setState({ click: this.state.click + 1 })
    //     } else {
    //         alert("please search location")
    //         this.setState({ click: this.state.click })
    //     }
    //     // console.log("directionGet work")

    // }


    componentDidMount() {

        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
            ok: "YES",
            cancel: "NO",
            enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => ONLY GPS PROVIDER
            showDialog: true // false => Opens the Location access page directly
        }).then(function (success) {
            this.setState({ loading: true })
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position)
                    this.setState({ loading: false })
                    const lat = position.coords.latitude
                    const lon = position.coords.longitude
                    const accuracy = position.coords.accuracy
                    this.calcDelta(lat, lon, accuracy)
                },
                (error) => console.log(JSON.stringify(error)),
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 },
            );
        }.bind(this))
            .catch((error) => {
                console.log(error.message);
            });
        this.watchID = navigator.geolocation.watchPosition((position) => {
            this.calcDelta(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
            // console.log(position.coords.latitude, position.coords.longitude, position.coords.accuracy,"position.coords.latitude, position.coords.longitude, position.coords.accuracy, wahtId")
        });

        // this.myFunction(this.state.region)
    }

    // myFunction(region) {
    //     setInterval(function (region) {

    //         var userId = firebase.auth().currentUser.uid;
    //         firebase.database().ref(`/USER/${userId}`).child("/region").set(region);
    //         alert("hello")
    //     }, 10000);
    // }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    onRegionChange(region) {
        console.log(region, "region region")
        this.setState({ region });

        // var userId = firebase.auth().currentUser.uid;
        // firebase.database().ref(`/USER/${userId}`).child("/region").set(this.state.region);

    }

    closeDrawer = () => {
        this.drawer._root.close()
    };
    openDrawer = () => {
        this.drawer._root.open()
    };




    render() {
        console.log(this.state.region.latitude, "this.state.latitude", this.state.region.longitude, "this.state.longitude", this.state.region.latitudeDelta, "this.state.region.latitudeDelta", this.state.region.longitudeDelta, "this.state.region.longitudeDelta")
        console.log(this.props.mapingData, 'this.props.mapingData')
        var dataaa = this.props.mapingData || [];
        return (
            <Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={<SideBar closeDrawerr={this.closeDrawer.bind(this)} navigator={this.navigator} />}
                onClose={() => this.closeDrawer()} >
                <Container>

                    <Header style={{ backgroundColor: "#2c3e50" }}>
                        <Left>
                            <Button transparent onPress={this.openDrawer.bind(this)}>
                                <Icon style={{ color: "white" }} name='menu' size={30} />
                            </Button>
                        </Left>
                        <Body>
                            <Title>GPS Tracking</Title>
                        </Body>
                        <Right>
                            <Button transparent >
                                <Text style={{ color: "white" }}></Text>
                            </Button>
                        </Right>
                    </Header>

                    <View style={styles.container}>
                        <MapView style={styles.map}
                            initialRegion={this.state.region}
                            region={this.state.region}
                            zoomEnabled={true}
                            pitchEnabled={true}
                            showsUserLocation={true}
                            followsUserLocation={true}
                            onRegionChange={this.onRegionChange.bind(this)}

                        >
                            {dataaa.map(marker => (
                                <MapView.Marker
                                    coordinate={{
                                        latitude: marker.latitude,
                                        longitude: marker.longitude,
                                    }}
                                    title={marker.name}
                                />
                            ))}

                            {/*<MapView.Marker
                                coordinate={this.state.region}
                            />*/}
                        </MapView>


                    </View>
                </Container>
            </Drawer>


        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        height: height,
        width: width,
    },
    go: {
        backgroundColor: "#3b5998",
        justifyContent: 'center',
        width: 66,
        height: 66,
        borderRadius: 66 / 2,
        alignItems: 'center',
        position: 'relative',
        marginBottom: 10,

        // borderColor: 'black',
        // borderWidth: 4,
        // color:"white",

    },
    location: {
        backgroundColor: "white",
        justifyContent: 'center',
        width: 66,
        height: 66,
        borderRadius: 66 / 2,
        alignItems: 'center',
        position: 'relative',
        marginBottom: 10,
        borderColor: "#3b5998",
        borderWidth: 1
        // borderColor: 'black',
        // borderWidth: 4,
        // color: 'white',
    },
    map: {
        // left: 0,
        // right: 0,
        // top: 0,
        // bottom: 0,
        flex: 1,
        height: height,
        width: width,
        // position: 'absolute'
    },
    mainviewStyle: {
        flex: 1,
        flexDirection: 'column',
    },
    footer: {
        flex: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#2980b6',
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        zIndex: 1,
    },
    header: {
        position: 'absolute',
        flex: 1,
        left: 0,
        right: 0,
        backgroundColor: 'green',
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
    },
    bottomButtons: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    bottomButtonsCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderColor: 'white'
    },
    footerText: {
        color: 'white',
        alignItems: 'center',
        fontSize: 16,

    },
    textStyle: {
        alignSelf: 'center',
        color: 'orange'
    },
    scrollViewStyle: {
        borderWidth: 2,
        borderColor: 'black'
    },
    radius: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,122,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0,112,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    marker: {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 20 / 2,
        overflow: 'hidden',
        backgroundColor: '#007AFF',
    }
});



export default connect(mapStateToProps)(App);