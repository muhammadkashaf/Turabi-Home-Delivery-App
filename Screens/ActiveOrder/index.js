import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, KeyboardAvoidingView, Linking, Platform } from 'react-native';
import { Icon, Button, Item, Input, Label } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import ActiveOrderOfCurrentUser from './ListOfActiveOrders';
import { Avatar } from 'react-native-elements';

export default class ActiveOrder extends React.Component {
    constructor() {
        super()
        this.state = {
            map: false,
            timer: null,
            minutes_Counter: '00',
            seconds_Counter: '00',
            startDisable: false,
            activeOrderArr: [],
            completedOrdersArr: []
        }
    }

    setLocation = (location) => {
        console.log('location ===>', location)
        this.setState({ location, map: false })
    }

    // _handleCall = () => {
    //     var phoneString = "1234567890"
    //     console.log(phoneString);
    //     const url = `tel:${phoneString}`;

    //     Linking.canOpenURL(url)
    //         .then((supported) => {
    //             if (supported) {
    //                 return Linking.openURL(url)
    //                     .catch(() => null);
    //             }
    //         });
    // }

    // openDirection = () => {
    //     const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    //     const latLng = `${24.963753},${66.973110}`;
    //     const label = 'Custom Label';
    //     const url = Platform.select({
    //         ios: `${scheme}${label}@${latLng}`,
    //         android: `${scheme}${latLng}(${label})`
    //     });


    //     Linking.openURL(url);
    // }

    componentWillMount = () => {
        this.updateActiveOrdersList()
    }

    // componentDidMount = () => {

    //     let timer = setInterval(() => {

    //         var num = (Number(this.state.seconds_Counter) + 1).toString(),
    //             count = this.state.minutes_Counter;

    //         if (Number(this.state.seconds_Counter) == 59) {
    //             count = (Number(this.state.minutes_Counter) + 1).toString();
    //             num = '00';
    //         }

    //         this.setState({
    //             minutes_Counter: count.length == 1 ? '0' + count : count,
    //             seconds_Counter: num.length == 1 ? '0' + num : num
    //         });
    //     }, 1000);
    //     this.setState({ timer });

    //     this.setState({ startDisable: true })
    //     // console.log(timer)

    // }

    updateActiveOrdersList = () => {
        const { completedOrdersArr } = this.state
        const { list, completedOrders } = this.props.navigation.state.params
        let i = list && list.findIndex(x => x.status === 'completed')
        if (i !== -1) {
            completedOrdersArr.push(list[i])
            this.setState({ completedOrdersArr })
        }
        else if (completedOrders) {
            this.setState({ completedOrdersArr: completedOrders })
        }
        this.setState({ activeOrderArr: list, })
        // const { user } = this.props.screenProps
        // const { activeOrderArr } = this.state
        // // console.log(user)
        // let index = list.findIndex(x => x.isAccepted === true && x.accetedUserId === user.uid)
        // console.log(index)
        // if (index !== -1) {
        //     activeOrderArr.push(list[index])
        //     this.setState({ activeOrderArr })
        // }
    }

    openOrder = (value) => {
        // console.log(value)
        this.props.navigation.navigate("OrderList", { orderDetails: value.orderDetails, orderDetail: value })
    }


    render() {
        // console.log(this.props.list, 'from activeorder component')
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >

                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottomColor: "#fff", borderBottomWidth: 1, marginTop: 20 }} >
                        <View style={{ width: '30%' }} >
                            <Text onPress={() => this.props.navigation.navigate("OrdersScreen")} style={{ fontSize: 25, color: '#fff', marginLeft: 5 }} >Order</Text>
                        </View>
                        <View style={{ width: '40%', borderBottomColor: '#fff', borderBottomWidth: 1 }}>
                            <Text style={{ fontSize: 25, color: '#fff' }} >Active Order</Text>
                        </View>
                        <View style={{ width: '30%' }}>
                            <Text onPress={() => this.props.navigation.navigate("CompletedOrders", { completedOrders: this.state.completedOrdersArr, activeOrderArr: this.state.activeOrderArr })} style={{ fontSize: 25, color: '#fff', marginLeft: 5 }} >Deliver</Text>
                        </View>
                    </View>

                    {this.state.activeOrderArr.length > 0 ? <ActiveOrderOfCurrentUser openDetails={this.openOrder} list={this.state.activeOrderArr} /> : <Text style={{ color: '#fff', alignContent: 'center', justifyContent: 'center', alignSelf: 'center', fontSize: 30, alignItems: 'center' }} >No Active Orders </Text>}

                    <View style={{ backgroundColor: 'transparent', width: '100%', borderColor: 'black', borderWidth: 1, flexDirection: 'row', position: 'absolute', bottom: 0, padding: 10, justifyContent: 'flex-end' }} >
                        <View style={{ position: 'absolute', left: 10 }} >
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                                <Image source={{ uri: 'https://www.shareicon.net/download/2015/12/02/190711_blue_720x720.png' }} style={{ height: 50, width: 50 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '20%' }} >
                            <Avatar rounded onPress={() => this.props.navigation.navigate("RiderProfileScreen")} source={{ uri: this.props.screenProps.user.photoURL }} />
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
        // flex: 1,
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 100
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20
    }
});
