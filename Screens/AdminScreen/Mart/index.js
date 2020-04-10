import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Header, ListItem, Divider } from 'react-native-elements';
import firebase from '../../../Component/Config/Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { Badge } from 'native-base';

export default class Mart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            allOrders: [],
            allMartsArr: []
        }
    }

    getOrders = () => {
        const { allOrders, activeOrders, penddingOrders, ordersCompleted } = this.state
        firebase.database().ref('/orders/').on('child_added', snapShot => {
            let orders = snapShot.val()
            // console.log(orders)
            allOrders.push(orders)
            this.setState({ allOrders })


            //grouping by name:
            //first creating a map by name for that
            let dataByNamaCategory = {};
            //iterating over the input array and using object destructuring to seperate the name from the other props
            allOrders.forEach(({ martToBuy, ...otherProps }) => {
                //if there's already an entry by this name in the map
                if (martToBuy in dataByNamaCategory) {
                    //just push the new value
                    dataByNamaCategory[martToBuy].value.push(otherProps)
                } else {
                    //otherwise create a new entry on the map
                    dataByNamaCategory[martToBuy] = { martToBuy, value: [otherProps] };
                }
            });

            //get just the values from the map
            let groupedData = Object.values(dataByNamaCategory);
            // console.log(groupedData);

            this.setState({ allMartsArr: groupedData })
        })
    }

    componentWillMount = () => {
        this.getOrders()
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.toggleDrawer() }}
                    centerComponent={{ text: 'Marts', style: { color: '#fff' } }}
                // rightComponent={{ icon: 'home', color: '#fff' }}
                />
                <ScrollView>
                    {this.state.allMartsArr.map((value, index) => {
                        return (
                            <View style={{ width: '100%' }} >
                                <ListItem
                                    title={value.martToBuy}
                                    // rightTitle={<Badge>{value.value.length}</Badge>}
                                    badge={{ value: value.value.length, badgeStyle: { padding: 10 } }}
                                />
                                <Divider style={{ width: '90%', alignSelf: 'center' }} />
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }
}

