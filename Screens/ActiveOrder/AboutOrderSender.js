import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, Alert, Linking, Platform } from 'react-native';
import { Icon, Button, Item, Input, Label, Accordion, List } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Avatar, ListItem } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import firebase from '../../Component/Config/Firebase'
import CountDown from 'react-native-countdown-component';
import moment from 'moment';

export default class ActiveOrderDeliveryDetails extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null,
            totalDuration: '',
            list: [
            ]
        }
    }

    _handleCall = () => {
        const { orderDetails } = this.props.navigation.state.params
        var phoneString = orderDetails.phoneNumber.toString()
        // console.log(phoneString);
        const url = `tel:${phoneString}`;

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url)
                        .catch(() => null);
                }
            });
    }

    openDirection = () => {
        const { orderDetails } = this.props.navigation.state.params
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${orderDetails.location.latitude},${orderDetails.location.longitude}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });


        Linking.openURL(url);
    }

    onDoneCountdown = () => {

        Alert.alert("Countdown Finish.");

    }

    onPressCountdown = () => {

        Alert.alert("Countdown Component Press.");

    }

    accepted = (i) => {
        const { list } = this.state
        // list[i].isAccepted = !list[i].isAccepted
        // this.setState({ list })
        // console.log(list[i])
        // firebase.database().ref(`/orders/${list[i].key}/`).update({ isAccepted: true, accetedUserId: this.props.screenProps.user.uid })
        // // firebase.database().ref(`/orders/${list[i].key}/orderDetails/`).push({ accepte: true })
        // list[i].isAccepted = true
        // list[i].accetedUserId = this.props.screenProps.user.uid
        // this.setState({ list })
        // this.props.navigation.navigate('OrderList', { orderDetails: list[i].orderDetails })

    }

    componentDidMount() {
        var that = this;
        // console.log(moment(), new Date())
        //We are showing the coundown timer for a given expiry date-time
        //If you are making an quize type app then you need to make a simple timer
        //which can be done by using the simple like given below
        //that.setState({ totalDuration: 30 }); //which is 30 sec

        var date = moment().date(this.props.navigation.state.params.orderDetails.startDate)
            .utcOffset('+05:00')
            .format('YYYY-MM-DD hh:mm:ss');
        //Getting the current date-time with required formate and UTC   

        var expirydate = this.props.navigation.state.params.orderDetails.endDate;//You can set your own date-time
        //Let suppose we have to show the countdown for above date-time 

        var diffr = moment.duration(moment(expirydate).diff(moment(date)));
        //difference of the expiry date-time given and current date-time

        var hours = parseInt(diffr.asHours());
        var minutes = parseInt(diffr.minutes());
        var seconds = parseInt(diffr.seconds());

        var d = hours * 60 * 60 + minutes * 60 + seconds;
        //converting in seconds

        that.setState({ totalDuration: d });
        //Settign up the duration of countdown in seconds to re-render
    }

    render() {
        const { orderDetails, orderDetail } = this.props.navigation.state.params
        // console.log(orderDetails)
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
                            <Text onPress={() => this.props.navigation.navigate("DeliverScreen")} style={{ fontSize: 25, color: '#fff', marginLeft: 5 }} >Deliver</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, marginTop: '10%' }} >

                        <View style={{ alignContent: 'center', alignItems: 'center', backgroundColor: '#fff', width: '60%', alignSelf: 'center' }} >
                            <View style={styles.MainContainer} >
                                {/* <Text style={{ alignSelf: 'center' }} >00:00</Text> */}
                                <CountDown
                                    until={this.state.totalDuration}
                                    onFinish={this.onDoneCountdown}
                                    onPress={this.onPressCountdown}
                                    size={20}
                                    timeToShow={["H", "M", "S"]}
                                />
                            </View>
                        </View>


                        <View style={{ marginTop: '10%' }} >
                            {!this.state.location ? <Button onPress={this.openDirection} iconLeft block style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} >
                                <Icon name="map-marker" color="black" style={{ color: 'black' }} type="FontAwesome" />
                                <Text style={{ marginLeft: 10 }} >Location</Text>
                            </Button>
                                :
                                <Button onPress={() => this.setState({ map: !this.state.map })} iconLeft block style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} >
                                    <Icon name="map-marker" color="black" style={{ color: 'black' }} type="FontAwesome" />
                                    <Text style={{ marginLeft: 10 }} >{`${this.state.location.coords.latitude}, ${this.state.location.coords.longitude}`}</Text>
                                </Button>}
                        </View>


                        <View style={{ marginTop: '5%', backgroundColor: '#fff', width: '70%', padding: 20, alignSelf: 'center' }} >
                            {/* <Item   style={{ backgroundColor: '#fff', width: '70%' }} > */}
                            <Label>Building or Flat No:  </Label>
                            <Text>{orderDetails.buildingAndFlatNo}</Text>
                            {/* </Item> */}
                        </View>

                        <View style={{ marginTop: '5%', backgroundColor: '#fff', width: '70%', padding: 20, alignSelf: 'center' }} >
                            {/* <Item style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} > */}
                            {/* <Icon name="building" color="black" style={{ color: 'black', marginLeft: 5 }} type="FontAwesome" /> */}
                            <Label>Name: </Label>
                            <Text>{orderDetails.orderSenderName}</Text>
                            {/* </Item> */}
                        </View>

                        <View style={{ marginTop: '5%', backgroundColor: '#fff', width: '70%', padding: 20, alignSelf: 'center', flexDirection: 'row' }} >

                            <View style={{ width: '80%' }}>
                                <Label>{orderDetails.phoneNumber}</Label>
                            </View>
                            <View>
                                <TouchableOpacity onPress={this._handleCall}>
                                    <Icon name="local-phone" type="MaterialIcons" />
                                </TouchableOpacity>
                            </View>

                        </View>

                        {this.props.navigation.state.params.orderDetail.status !== 'completed' && <View style={{ position: 'absolute', bottom: '10%', right: 20 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('DeliverScreen', { orderDetail })}>
                                <Icon name="arrow-circle-right" type='FontAwesome' style={{ fontSize: 50, color: "#fff" }} />
                            </TouchableOpacity>
                        </View>}
                    </View>
                </ImageBackground>
            </View >

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
    },
    MainContainer: {
        flex: 1,
        paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
