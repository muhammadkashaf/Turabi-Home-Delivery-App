import React, { Component } from 'react'
import { Text, View } from 'react-native'
import firebase from '../../../Component/Config/Firebase';
import { Header, ListItem, Divider } from 'react-native-elements';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';

export default class TotalOrder extends Component {
    constructor(props) {
        super(props)

        this.state = {
            allOrders: [],
            activeOrders: [],
            penddingOrders: [],
            ordersCompleted: []
        }
    }

    getOrders = () => {
        const { allOrders, activeOrders, penddingOrders, ordersCompleted } = this.state
        firebase.database().ref('/orders/').on('child_added', snapShot => {
            let orders = snapShot.val()
            // console.log(orders)
            allOrders.push(orders)
            this.setState({ allOrders })
            if (orders.isAccepted) {
                activeOrders.push(orders)
                this.setState({ activeOrders })
            }
            if (!orders.isAccepted) {
                penddingOrders.push(orders)
                this.setState({ penddingOrders })
            }
            if (orders.status == 'completed') {
                // console.log(orders)
                ordersCompleted.push(orders)
                this.setState({ ordersCompleted })
            }
        })
    }

    componentWillMount = () => {
        this.getOrders()
    }

    render() {
        const { allOrders, activeOrders, penddingOrders, ordersCompleted } = this.state
        return (
            <View style={{ flex: 1 }} >
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.toggleDrawer() }}
                    centerComponent={{ text: 'ALL ORDERS', style: { color: '#fff' } }}
                // rightComponent={{ icon: 'home', color: '#fff' }}
                />
                <TabNavigatorForAllOrders screenProps={{ allOrders, activeOrders, penddingOrders, ordersCompleted }} />
            </View>
        )
    }
}

class ActiveOrders extends Component {

    static navigationOptions = () => ({
        title: "Active"
    })

    render() {
        return (
            <View>
                {this.props.screenProps.activeOrders.map((value, index) => {
                    return (
                        <View style={{ width: '100%' }}>
                            <ListItem
                                title={`Order Number ${index + 1}`}
                                onPress={() => console.log('a')}
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

class PenddingOrders extends Component {
    static navigationOptions = () => ({
        title: "Pendding"
    })
    render() {
        return (
            <View>
                {this.props.screenProps.penddingOrders.map((value, index) => {
                    return (
                        <View style={{ width: '100%' }}>
                            <ListItem
                                title={`Order Number ${index + 1}`}
                                onPress={() => console.log('p')}
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

class OrdersCompleted extends Component {
    static navigationOptions = () => ({
        title: "Completed"
    })
    render() {
        return (
            <View>
                {this.props.screenProps.ordersCompleted.map((value, index) => {
                    return (
                        <View style={{ width: '100%' }}>
                            <ListItem
                                title={`Order Number ${index + 1}`}
                                subtitle={'12-08-2014'}
                                onPress={() => console.log('c')}
                            />
                            <Divider style={{ width: '90%', alignSelf: 'center' }} />
                        </View>
                    )
                })}
            </View>
        )
    }
}

const TabNavigation = createMaterialTopTabNavigator({
    ActiveOrders: ActiveOrders,
    PenddingOrders: PenddingOrders,
    OrdersCompleted: OrdersCompleted
})

const TabNavigatorForAllOrders = createAppContainer(TabNavigation)