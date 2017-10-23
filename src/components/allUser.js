import React, { Component, PropTypes } from 'react';
import { View, Text, } from "react-native";
import { Icon,Drawer, Container, Footer, FooterTab, Card, CardItem, Header, Left, Body, Right, Button, Title, Content, List, ListItem, Item, Input,} from 'native-base';
//import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../firebase/index'
import { Actions } from 'react-native-router-flux';





class AllUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data2:[],
            search: ""
        }
    }

    componentWillMount() {
        var Rootref = firebase.database().ref().child("USER")
        var currentUser = firebase.auth().currentUser.uid;
        if (Rootref != null) {
            Rootref.on("value", snap => {
                var data = snap.val();
                console.log("data", data);
                let uData = [];
                for (let key in data) {
                    if (currentUser !== key) {
                        data[key].key = key;
                        uData.push(data[key])
                    }
                }
                console.log(uData, "uData")
                this.setState({
                    data: uData
                })
            })
        }

        this.setState({
            data2: this.props.data
        })
    }

    search = (obj) => {
        // console.log(this.state.search);
        return obj.name.search(this.state.search) >= 0;
    }

    invite(value) {
        var rootRef = firebase.database().ref();
        const speedRef = rootRef.child("USER" + "/" + value.key + "/" + "requests/" + this.props.data.key).set({
            admin: this.state.data2.adminName,
            groupKey: this.state.data2.key,
            groupName: this.state.data2.gName,
            groupId: this.state.data2.id,
        })
           alert("Request send");
    }




    render() {
        console.log(this.state.data, "this.state.data")
        console.log(this.props.data)
        return (
            <Container>
                <Header style={{ backgroundColor: "#2c3e50" }}>
                    <Left>
                        <Button transparent onPress={() => { Actions.pop() }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>All Users</Title>
                    </Body>

                </Header>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onChangeText={(search) => this.setState({ search })} />
                        <Icon name="ios-people" />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>


                <Content >

                    {
                        this.state.data.filter(this.search).map((val, i) => (
                            <Card>
                                <CardItem>
                                    <Icon name='person' size={16} />

                                    <Body>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>
                                            {val.name}
                                        </Text>
                                    </Body>
                                    <Right>
                                        <Button info onPress={this.invite.bind(this,val)}><Text>  Add member  </Text></Button>
                                    </Right>
                                </CardItem>
                            </Card>

                        ))
                    }

                </Content>
            </Container>
        )
    }




}


export default AllUser;