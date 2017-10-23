import React, { Component, PropTypes } from 'react';
import { View, Text, Alert } from "react-native";
import { Drawer, Container, Footer, FooterTab, Header, Left, Body, Right, Button, Title, Content, List, ListItem, Card, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../firebase/index'
import { Actions } from 'react-native-router-flux';



class Request extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            lat: "",
            long: '',

        }
    }

    componentWillMount() {
        var Rootref = firebase.database().ref().child("USER/" + firebase.auth().currentUser.uid + "/requests");
        if (Rootref != null) {
            Rootref.on("value", snap => {
                var data = snap.val();
                let rData = [];
                for (let key in data) {
                    data[key].key = key
                    rData.push(data[key])
                    // keys.push(key)
                }
                console.log("data", rData);
                this.setState({ data: rData })
            })
        }

        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position)
            let lat = parseFloat(position.coords.latitude)
            let long = parseFloat(position.coords.longitude)
            this.setState({
                lat, long
            })
        }
            , (error) => Alert.alert('No Internet Access'),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 })
    }


    requestAccept(data) {
        console.log(data);

        firebase.database().ref('joinGroups/' + firebase.auth().currentUser.uid + "/" + data.groupKey).set({
            latitude: this.state.lat,
            longitude: this.state.long,
            name: firebase.auth().currentUser.displayName,
            gName: data.groupName,
            adminName: data.admin,
            id: data.groupId
        });

        firebase.database().ref('groups/' + data.groupKey + "/" + "members").push({
            member: firebase.auth().currentUser.uid
        });

        firebase.database().ref('USER/' + firebase.auth().currentUser.uid + "/requests/" + data.groupKey).remove();
    }

    cancel(data) {
        console.log(data.groupKey)
        firebase.database().ref('USER/' + firebase.auth().currentUser.uid + "/requests/" + data.groupKey).remove();
    }

    render() {
        console.log(this.state.data, "this.state.data")
        console.log(this.props, "this.props")
        return (
            <Container>
                <Header style={{ backgroundColor: "#2c3e50" }}>
                    <Left>
                        <Button transparent onPress={() => { Actions.pop() }}>
                            <Icon name='arrow-back' color="white" size={20} />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Request</Title>
                    </Body>

                </Header>

                {this.state.data == "" ? <Content><View><Text>No record</Text></View></Content> :
                    <Content >
                        {this.state.data.map((val, i) => (
                            <Card>
                                <CardItem>
                                    <Icon name='group' />
                                    <Body>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }} >{"   " + val.groupName}</Text>
                                    </Body>
                                    <Button info onPress={() => this.requestAccept(val)}><Text>  Accept  </Text></Button>
                                    <View>
                                        <Text>  </Text>
                                    </View>
                                    <Button info onPress={() => this.cancel(val)}><Text>  Cancel  </Text></Button>

                                </CardItem>
                            </Card>


                        ))}

                    </Content>
                }
            </Container>
        )
    }

}


export default Request;