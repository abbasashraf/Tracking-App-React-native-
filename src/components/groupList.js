import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Spinner, Card, CardItem, Container, Header, Content, Button, Footer, FooterTab, Item, Right, Input, List, ListItem, Left, Body, Title } from 'native-base';
import firebase from '../firebase/index';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
export default class GroupList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Groups: [],
            key: [],
            Data: []
        };
    }

    componentWillMount() {
        // var userId = firebase.auth().currentUser.uid
        // const speedRef = firebase.database().ref().child("/Groups");
        // speedRef.on("value", (snapshot) => {
        //     var obj = snapshot.val();
        //     var key = Object.keys(obj);
        //     this.setState({
        //         key
        //     })
        //     var arrr = [];
        //     for (var key in obj) {
        //         arrr.push(obj[key]);
        //     }
        //     this.setState({ Groups: arrr })
        // })

        var Rootref = firebase.database().ref().child("groups").orderByChild('adminId').equalTo(firebase.auth().currentUser.uid);
        if (Rootref != null) {
            Rootref.on("value", snap => {
                var data = snap.val();
                // console.log("data",data);
                let gruopData = [];
                for (let key in data) {
                    data[key].key = key
                    gruopData.push(data[key])
                    // keys.push(key)
                }
                console.log(gruopData, "gruopData")
                var memberRef = firebase.database().ref('joinGroups/' + firebase.auth().currentUser.uid);
                if (memberRef != null) {
                    memberRef.on("value", snap => {
                        var data1 = snap.val();
                        //console.log("data1", data1);
                        let memeberData = [];
                        for (let key1 in data1) {
                            data1[key1].key = key1
                            memeberData.push(data1[key1])
                            // keys.push(key)
                        }

                        console.log(memeberData, "memeberData")
                        var newData = gruopData.concat(memeberData)
                        console.log("newData ", newData);

                        this.setState({ Data: newData })
                    })
                }
            })
        }
    }


    sendValue(data) {
        Actions.GroupMember({ data: data })
    }
    render() {

        // console.log(this.state.Groups, "this.state.Groups")
        // console.log(this.state.key, "this.state.key")
        console.log(this.state.Data, "this.state.Data")
        return (

            <Container>
                <Header style={{ backgroundColor: "#2c3e50" }}>
                    <Left>
                        <Button transparent onPress={() => { Actions.pop() }}>
                            <Icon name='arrow-back' color="white" size={20} />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Groups</Title>
                    </Body>

                </Header>
                {this.state.Data[0] ?
                    <Content >
                        {this.state.Data.map((val, i) => (
                            <Card key={i}>
                                <CardItem>
                                    <Icon name='group' size={16} />
                                    <Body>

                                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}> {"  " + val.gName}</Text>
                                    </Body>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                    }}>
                                        <Button style={{
                                        }} info onPress={this.sendValue.bind(this, val)}>
                                            <Text>  View Member  </Text>
                                        </Button>

                                    </View>
                                </CardItem>
                            </Card>


                        ))}



                    </Content> :
                    <Content>
                        <Spinner />
                    </Content>}


                <Footer >
                    <FooterTab style={{ backgroundColor: "#2c3e50" }}>
                        <Button onPress={() => Actions.GroupCreate()}>
                            <Icon name='group-add' size={16} color="white" />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 0, color: "white" }}>Create Group</Text>
                        </Button>



                    </FooterTab>
                </Footer>
            </Container>


        );
    }
}