import React, { Component } from 'react';
import { Text, View, goBack, StyleSheet, } from 'react-native';
import { Container, Header, Content, Button, Footer, FooterTab, Item, Input, Left, Icon, Body, Title, } from 'native-base';
import firebase from '../firebase/index';
import { Actions } from 'react-native-router-flux';

export default class GroupCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            CircleName: "",
            key: ""
        };
    }
    componentDidMount() {
        // var getData = firebase.database().ref().child("Groups/");
        // getData.on('value', snap => {
        //     var userObj = snap.val() || {};
        //     var key = Object.keys(userObj);
        //     this.setState({
        //         key
        //     })
        // })

    }



    handleOnSubmit() {
        // var i = this.state.key[0]
        // var CircleName = this.state.CircleName
        // var userId = firebase.auth().currentUser.uid;
        // firebase.database().ref().child("/Groups").push({ CircleName, userId });
        // firebase.database().ref("/Groups/" + i ).child("/members").push({ userId });
        //
        var Name = this.state.CircleName;
        var ID = Math.floor((Math.random() * 9000) + 1000);
        var rootRef = firebase.database().ref();
        var user = firebase.auth().currentUser;
        console.log(user.displayName);
        const speedRef = rootRef.child("groups").push({
            adminId: firebase.auth().currentUser.uid,
            adminName: user.displayName,
            gName: Name,
            id: ID,
        })
        speedRef.child('members').push({
            member: firebase.auth().currentUser.uid,
        })
       // console.log("check ", speedRef)
        alert('circle created')
        //
        // var user = firebase.auth().currentUser;
        // console.log(user.displayName);
        // var CircleName = this.state.CircleName
        // var userId = firebase.auth().currentUser.uid;
        // var index = this.state.key[0]
        // firebase.database().ref().child("/Groups").push({ CircleName, userId, members: "" });
        // // var data = firebase.database().ref("/Groups").orderByChild("members").equalTo("").push({ userId });
        // // console.log(data, "data")
        // console.log(this.state.CircleName, "CircleName")
        Actions.GroupList()
    }
    render() {
        console.log(this.state.key[0], "key")

        return (

            <Container>
                <Header style={{ backgroundColor: "#2c3e50" }}>
                    <Left>
                        <Button transparent onPress={() => { Actions.App() }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Create Group</Title>
                    </Body>
                </Header>


                <Content>


                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 50
                    }}>
                        <View style={styles.circle}>
                            <Text style={{
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                Create Circle
                             </Text>
                        </View>

                        <Text>
                            {"\n"}
                            Group Circle</Text>


                        <Item style={{
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Input style={{textAlign:"center"}} onChange={ev => this.setState({ CircleName: ev.nativeEvent.text })} placeholder="Enter Your Circle Name" />
                            {/*<Text>
                                {"\n"}
                            </Text>*/}


                        </Item>
                        <View>
                            <Text>
                                {"\n"}
                            </Text>
                            <Button success
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center"
                                }} onPress={this.handleOnSubmit.bind(this)} >
                                <Text>        Submit        </Text>
                            </Button>
                        </View>

                    </View>
                </Content>
            </Container>


        );
    }
}

var styles = StyleSheet.create({
    circle: {
        borderWidth: 4,
        borderColor: "black",
        borderRadius: 100,
        width: 150,
        height: 150,
        justifyContent: "center",
        alignItems: "center"
    }
})