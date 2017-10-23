import React, { Component } from 'react';
import { View, Image, TouchableHighlight } from 'react-native';
import { Container, Header, Content, List, Thumbnail, StyleSheet, ListItem, Text, Left, Right, Button, Title, Icon, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';
import firebase from '../firebase'
import { connect } from 'react-redux';
import { LogOutAction } from '../store/action/logOut'


class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {} || ""
        };
    }

    componentWillMount() {
        var currentUser = firebase.auth().currentUser.uid;
        var Rootref = firebase.database().ref().child("USER/" + currentUser)
        if (Rootref != null) {
            Rootref.on("value", snap => {
                var data = snap.val();
                console.log("data", data);

                // var obj = snapshot.val();
                // var arrr = [];
                // for (var key in obj) {
                //     arrr.push(obj[key]);
                // }

                // let uData = [];
                // for (let key in data) {
                //     uData.push(data[key])
                // }
                // console.log(uData, "uData")
                this.setState({
                    data: data
                })
            })
        }

        // length of Request
        var Rootref = firebase.database().ref().child("USER/" + firebase.auth().currentUser.uid + "/requests");
        if (Rootref != null) {
            Rootref.on("value", snap => {
                var data = snap.val();
                let Data = [];
                for (let key in data) {
                    data[key].key = key
                    Data.push(data[key])
                    // keys.push(key)
                }
                var length = Data.length;
                console.log(length, "length")
                this.setState({
                    length
                })
            })
        }


    }



    logout() {
        // this.props.dispatch(LogOutAction.logout())
        firebase.auth().signOut().then(function () {
            console.log("logut succes")
            Actions.LogIn()
        })
    }


    render() {

        console.log(this.state.data, "this.state.data")
        return (
            <Container>
                <Header style={{ backgroundColor: "#2c3e50" }}>
                    <Left>
                        <Button transparent onPress={this.props.closeDrawerr}>
                            <Icon style={{ color: "white" }} name='arrow-back' size={30} />
                        </Button>
                    </Left>
                    <Body>
                        <Title>GPS Tracking</Title>
                    </Body>
                </Header>
                <Image resizeMode="contain" style={{ borderWidth: 0, borderColor: "black", width: 290, height: 170, marginLeft: 0, padding: 0 }} source={require('../images/head.png')} />



                <Content style={{ backgroundColor: 'white' }}>

                    <List>
                        <ListItem itemDivider>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{"Welcome  " + this.state.data.name}</Text>
                        </ListItem>
                        <ListItem itemDivider onPress={() => Actions.GroupCreate()}>
                            <Text>Create Circle</Text>
                        </ListItem>
                        <ListItem itemDivider onPress={() => Actions.GroupList()}>
                            <Text>Groups</Text>
                        </ListItem>
                        <ListItem itemDivider onPress={() => Actions.Request()}>
                            <Text>All Request                                    {this.state.length}</Text>
                        </ListItem>
                        <ListItem itemDivider onPress={this.logout.bind(this)}>
                            <Text>Log Out</Text>
                        </ListItem>
                    </List>
                </Content>
            </Container>

        );
    }
}

export default connect()(SideBar);