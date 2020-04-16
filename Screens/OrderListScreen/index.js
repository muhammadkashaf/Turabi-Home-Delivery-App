import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, Modal, Platform, Alert } from 'react-native';
import { Tab, Tabs, ScrollableTab, Button, Item, Input, Icon, SwipeRow } from 'native-base';
import { SearchBar, Divider, CheckBox, Avatar } from 'react-native-elements';
import NumericInput from 'react-native-numeric-input'
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import SwipeableListExample from '../../Component/Constants/ListScroll';
// import SwipeableListExample from '../../Component/Constants/ListScroll';
// import SwipeRowExample from '../../Component/Constants/ListScroll';
import { connect } from 'react-redux';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';

class OrderList extends React.Component {
    constructor() {
        super()
        this.state = {
            userActiveOrder: {},
            userActiveOrderDetails: null,
            totalDuration: '',
        }
    }

    onDoneCountdown = () => {

        Alert.alert("Countdown Finish.");

    }

    onPressCountdown = () => {

        Alert.alert("Countdown Component Press.");

    }

    componentDidMount() {
        this.props.navigation.state.params.orderDetail && this.dateTimer()
    }

    dateTimer = () => {
        var that = this;
        // console.log(moment(), new Date())
        //We are showing the coundown timer for a given expiry date-time
        //If you are making an quize type app then you need to make a simple timer
        //which can be done by using the simple like given below
        //that.setState({ totalDuration: 30 }); //which is 30 sec

        var date = moment().date(this.props.navigation.state.params.orderDetail.startDate)
            .utcOffset('+05:00')
            .format('YYYY-MM-DD hh:mm:ss');
        //Getting the current date-time with required formate and UTC   

        var expirydate = this.props.navigation.state.params.orderDetail.endDate;//You can set your own date-time
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

    UNSAFE_componentWillMount = () => {
        this.props.navigation.state.params.userActiveOrder && this.updatelist()
    }

    updatelist = () => {
        const { userActiveOrder } = this.props.navigation.state.params
        // console.log("userActiveOrder", userActiveOrder)
        this.setState({ userActiveOrder, userActiveOrderDetails: userActiveOrder.orderDetails.orderedItems })
    }

    picked = (userActiveOrder, i) => {
        const { userActiveOrderDetails } = this.state

        // console.log(userActiveOrder, i, userActiveOrderDetails)

        // let index = userActiveOrderDetails.findIndex(x => x.)
        this.setState({ userActiveOrder, userActiveOrderDetails })
    }

    render() {
        // console.log(this.state.totalDuration, "hello")
        if (!this.props.navigation.state.params.userActiveOrder) {
            // console.log(this.props.navigation.state.params.userActiveOrder)
            return (
                <View style={styles.container}>
                    <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%' }} >
                        <View style={{ width: '100%', backgroundColor: '#f5f2d0' }}>
                            <Text style={{ fontSize: 30, marginTop: 20, color: "#000", alignSelf: 'center' }} >Order List</Text>
                        </View>
                        <View >
                            <Divider style={{ height: 2 }} />
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }} >
                            <View style={{ width: '10%' }} ><Text style={{ fontSize: 15, color: '#fff', marginLeft: 10 }} >SNo.</Text></View>
                            <View style={{ width: '40%' }} ><Text style={{ fontSize: 20, color: '#fff', marginLeft: 10 }} >Item</Text></View>
                            <View style={{ width: '30%' }} ><Text style={{ fontSize: 20, color: '#fff' }} >Quantity</Text></View>
                            <View style={{ width: '20%' }} ><Text style={{ fontSize: 20, color: '#fff' }} >Weight</Text></View>
                        </View>

                        <ScrollView style={{ marginBottom: '20%' }}>
                            <View>
                                {/* {this.state.data.orderDetails.orderedItems.map((value, index) => {
                                    return (
                                        <SwipeRow
                                            style={{ backgroundColor: '#fff' }}

                                            // leftOpenValue={75}
                                            rightOpenValue={-75}
                                            
                                            // left={
                                            //     <Button success onPress={() => alert('Add')}>
                                            //         <Icon active name="add" />
                                            //     </Button>
                                            // }
                                            body={
                                                <Button transparent full>
                                                    <View style={{ display: 'flex', flexDirection: 'row', margin: 5, borderColor: 'black', borderWidth: 1, padding: 10, }} >
                                                        <View style={{ width: '20%' }} ><Text style={{ fontSize: 20, color: '#000', marginLeft: 10 }} >{index + 1}</Text></View>
                                                        <View style={{ width: '50%' }} ><Text style={{ fontSize: 20, color: '#000', marginLeft: 10 }} >{value.itemName}</Text></View>
                                                        <View style={{ width: '30%' }} ><Text style={{ fontSize: 20, color: '#000' }} >{value.quantity}</Text></View>
                                                    </View>
                                                </Button>
                                            }
                                            right={
                                                <Button danger onPress={() => alert('Trash')}>
                                                    <Icon active name="trash" />
                                                </Button>
                                            }
                                            disableRightSwipe
                                        />)
                                })} */}
                                <SwipeableListExample picked={this.picked} datas={this.props.navigation.state.params.orderDetails.orderedItems} user={this.props.screenProps.user} orderDetails={this.props.navigation.state.params.orderDetail} />
                            </View>
                        </ScrollView>

                        {/* <ScrollView style={{ marginBottom: '20%' }}>
                            <View>
                                {this.state.data.orderDetails.orderedItems.map((value, index) => {
                                    return (
                                        <TouchableOpacity>
                                            <View style={{ display: 'flex', flexDirection: 'row', margin: 5, borderColor: 'black', borderWidth: 1, padding: 10, }} >
                                                <View style={{ width: '20%' }} ><Text style={{ fontSize: 20, color: '#fff', marginLeft: 10 }} >{index + 1}</Text></View>
                                                <View style={{ width: '50%' }} ><Text style={{ fontSize: 20, color: '#fff', marginLeft: 10 }} >{value.itemName}</Text></View>
                                                <View style={{ width: '30%' }} ><Text style={{ fontSize: 20, color: '#fff' }} >{value.quantity}</Text></View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </ScrollView> */}

                        <View style={{ position: 'absolute', bottom: '15%', right: 20 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ActiveOrderDeliveryDetails', { orderDetails: this.props.navigation.state.params.orderDetails, orderDetail: this.props.navigation.state.params.orderDetail })} >
                                <Icon name="arrow-circle-right" type='FontAwesome' style={{ fontSize: 50, color: "#000" }} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ backgroundColor: '#f5f2d0', width: '100%', borderColor: 'black', borderWidth: 1, flexDirection: 'row', position: 'absolute', bottom: 0, padding: 10 }} >
                            <View style={{ width: '20%' }} >
                                <Icon onPress={() => this.props.navigation.goBack()} name='arrow-back' />
                            </View>
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
                            <View style={{ width: '20%' }} >
                                <Avatar rounded onPress={() => this.props.navigation.navigate("RiderProfileScreen")} source={{ uri: this.props.screenProps.user.photoURL }} />
                            </View>
                        </View>

                    </ImageBackground>
                </View>
            );
        } else {
            // console.log(this.props.navigation.state.params.userActiveOrder)
            return <ScrollView style={{ marginTop: '20%' }}>
                <View>
                    <SwipeableListExample picked={this.picked} datas={this.state.userActiveOrderDetails} user={this.props.screenProps.user} orderDetails={this.props.navigation.state.params.userActiveOrder} disableRight={true} disableLeft={true} />
                </View>
            </ScrollView>
        }
    }
}

function mapStateToProps(state) {
    // console.log('state =======> ', state)
    return { list: state }
}

export default connect(mapStateToProps)(OrderList);
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

