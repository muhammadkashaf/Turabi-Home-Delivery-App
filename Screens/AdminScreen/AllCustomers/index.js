import React, { Component } from 'react'
import { Text, View } from 'react-native'
import firebase from '../../../Component/Config/Firebase';
import { Header, ListItem, Divider } from 'react-native-elements';
import { createMaterialTopTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import ViewProfile from './ViewProfile';

export default class CustomerDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            customersArr: [],
            ridersArr: []
        }
    }

    getUsers = () => {
        const { customersArr, ridersArr } = this.state
        firebase.database().ref('/users/').on('child_added', snapShot => {
            let users = snapShot.val()
            // users.uid = snapShot.key
            // console.log("users", users)
            for (const i in users) {
                if (users.hasOwnProperty(i)) {
                    const allUsers = users[i];
                    allUsers.key = i
                    allUsers.uid = snapShot.key
                    // console.log(allUsers)
                    if (allUsers.userType === "Customer") {
                        customersArr.push(allUsers)
                        this.setState({ customersArr })
                    } else if (allUsers.userType === "Rider") {
                        ridersArr.push(allUsers)
                        this.setState({ ridersArr })
                    }
                }
            }

        })


    }

    UNSAFE_componentWillMount = () => {
        this.getUsers()
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.toggleDrawer() }}
                    centerComponent={{ text: 'ALL USERS', style: { color: '#fff' } }}
                // rightComponent={{ icon: 'home', color: '#fff' }}
                />
                <TabNavigatorForAllUsers screenProps={{ ridersArr: this.state.ridersArr, customersArr: this.state.customersArr }} />
            </View>
        )
    }
}

class AllCustomers extends Component {

    static navigationOptions = () => ({
        title: "Customers"
    })

    render() {
        return (
            <View>
                {this.props.screenProps.customersArr.map((value, index) => {
                    return (
                        <View style={{ width: '100%' }}>
                            <ListItem
                                title={`user ${index + 1}`}
                                onPress={() => this.props.navigation.navigate('ViewProfile', { userDetails: value })}
                                subtitle={'12-08-2014'}
                                leftAvatar={{ source: { uri: value.profilePic }, title: value.name.substring(0, 1) }}
                            />
                            <Divider style={{ width: '90%', alignSelf: 'center' }} />
                        </View>
                    )
                })}
            </View>
        )
    }
}

class AllRiders extends Component {
    static navigationOptions = () => ({
        title: "Riders"
    })
    render() {
        return (
            <View>
                {this.props.screenProps.ridersArr.map((value, index) => {
                    return (
                        <View style={{ width: '100%' }}>
                            <ListItem
                                title={`User ${index + 1}`}
                                onPress={() => this.props.navigation.navigate('ViewProfile', { userDetails: value })}
                                leftAvatar={{ source: { uri: value.profilePic }, title: value.name.substring(0, 1) }}
                                subtitle={'12-08-2014'}
                            />
                            <Divider style={{ width: '90%', alignSelf: 'center' }} />
                        </View>
                    )
                })}
            </View>
        )
    }
}

const StackForTabRider = createStackNavigator({
    AllRiders: AllRiders,
    ViewProfile: ViewProfile
},{ headerMode: 'none' })

const StackForTabCustomer = createStackNavigator({
    AllCustomers: AllCustomers,
    ViewProfile: ViewProfile
},{ headerMode: 'none' })

const TabNavigation = createMaterialTopTabNavigator({
    AllCustomers: StackForTabCustomer,
    AllRiders: StackForTabRider,
})

const TabNavigatorForAllUsers = createAppContainer(TabNavigation)