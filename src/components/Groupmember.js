import React, { Component, PropTypes } from 'react';
import { View, Text, } from "react-native";
import { Drawer, Container, Footer, FooterTab, Header, Left, Body, Right, Button, Title, Content, List, ListItem, Card, CardItem } from 'native-base';
//import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../firebase/index'
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';




class GroupMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: []
        }
    }

    componentDidMount() {
        // var userId = firebase.auth().currentUser.uid
        // const speedRef = firebase.database().ref().child(`/USER`);
        // speedRef.on("value", (snapshot) => {
        //     var obj = snapshot.val();
        //     var arrr = [];
        //     for (var key in obj) {
        //         arrr.push(obj[key]);
        //     }
        //     this.setState({ allUser: arrr })
        // })

        data = this.props.data
        var Rootref = firebase.database().ref().child("groups/" + data.key + "/" + "members");
        if (Rootref != null) {
            Rootref.on("value", snap => {
                var data = snap.val();
                console.log("data", data);
                // console.log("uid",firebase.auth().currentUser.uid);
                let memberData = [];
                for (let key in data) {
                    data[key].key = key
                    memberData.push(data[key])
                    // keys.push(key)
                }
                console.log(memberData, 'memberData');
                var membersInfo = [];

                for (var i = 0; i < memberData.length; i++) {
                    var info = firebase.database().ref().child("USER/" + memberData[i].member);
                    info.on("value", snap => {
                        var userInfo = snap.val();
                        membersInfo.push(userInfo)
                        console.log("membersInfo ", membersInfo)
                        this.setState({
                            members: membersInfo
                        })
                    })
                }
            })
        }
    }
    // deleteGroup() {
    //     console.log(this.props.data);
    //     var groupKey = this.props.data.key;
    //     firebase.database().ref('joinGroups/' + firebase.auth().currentUser.uid + "/" + groupKey).remove();
    //     var Rootref = firebase.database().ref().child("groups/" + groupKey + "/members").orderByChild('member').equalTo(firebase.auth().currentUser.uid);
    //     if (Rootref != null) {
    //         Rootref.on("value", snap => {
    //             var data = snap.val();
    //             console.log("data", data);
    //             for (let key in data) {
    //                 firebase.database().ref().child("groups/" + groupKey + "/members/" + key).remove();
    //             }
    //         })
    //     }
    //     Actions.pop();

    // }

    requestsend() {
        Actions.AllUser({ data: this.props.data })
    }

    render() {
        console.log(this.state.members, "this.state.members")
        console.log(this.props.data, "this.props")
        return (
            <Container>
                <Header style={{ backgroundColor: "#2c3e50" }}>
                    <Left>
                        <Button transparent onPress={() => { Actions.pop() }}>
                            <Icon name='arrow-back' color="white" size={20} />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Members</Title>
                    </Body>
                    <Button primary onPress={() => { Actions.App({ mapingData: this.state.members }) }}>
                        <Text>Track</Text>
                    </Button>

                </Header>

                <Content >
                    <Card>
                        <CardItem>
                            <Icon name='person' size={30} />
                            <Body style={{ justifyContent: 'center', alignItems: "center", }}>
                                <Text style={{ color: "black", fontSize: 22 }}>Admin</Text>
                                <Text style={{ color: "black" }}>{this.props.data.adminName}</Text>
                            </Body>
                            <Button info onPress={this.requestsend.bind(this)}><Text style={{ fontSize: 14 }}>  Add Member  </Text></Button>
                            <View>
                                <Text>  </Text>
                            </View>
                            {/*<Button info onPress={this.deleteGroup.bind(this)}><Text style={{ fontSize: 14 }}>  Leave Group  </Text></Button>*/}
                        </CardItem>
                    </Card>

                    {this.state.members.map((val, i) => (
                        <Card key={i}>
                            <CardItem>
                                <Icon name='person' size={16} />
                                <Body>

                                    <Text style={{ fontSize: 16, fontWeight: 'bold', }} >{"  " + val.name}</Text>
                                </Body>

                            </CardItem>
                        </Card>
                    ))}

                </Content>
            </Container>
        )
    }




}


export default GroupMember;