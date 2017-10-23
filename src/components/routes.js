import React, { Component } from 'react'

import { Actions } from 'react-native-router-flux';
import { Router, Scene } from 'react-native-router-flux';
import LogIn from './login';
import SignUp from './signup';
import App from './app';
import GroupCreate from './groupCreate';
import GroupList from './groupList';
import AllUser from './allUser';
import GroupMember from "./Groupmember";
import Request from './requests'




export default class Route extends Component {

    render() {
        return (
            <Router>
                <Scene key='root'>
                    <Scene key='LogIn' component={LogIn}  initial='true' hideNavBar='true' />
                    <Scene key='App' component={App} hideNavBar='true' />
                    <Scene key='SignUp' component={SignUp} hideNavBar='true' />
                    <Scene key='GroupCreate' component={GroupCreate} hideNavBar='true' />
                    <Scene key='GroupList' component={GroupList} hideNavBar='true' />
                    <Scene key='AllUser' component={AllUser} hideNavBar='true' />
                    <Scene key='GroupMember' component={GroupMember} hideNavBar='true' />
                    <Scene key='Request' component={Request} hideNavBar='true' />         
                </Scene>
            </Router>
        );
    }

}
