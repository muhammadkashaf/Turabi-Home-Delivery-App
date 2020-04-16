import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TextInput, KeyboardAvoidingView, Animated, Keyboard, UIManager, Dimensions } from 'react-native';
import { Icon, Button, Item, Input, Label } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Map from './Map';
import shortid from 'shortid';
import firebase from '../../Component/Config/Firebase'
import moment from 'moment'
import OrderSent from '../OrderSent';
import { StackActions } from 'react-navigation';

const { width: screenWidth } = Dimensions.get('window')
const { State: TextInputState } = TextInput;

export default class OrderDataForm extends React.Component {
    constructor() {
        super()
        this.state = {
            map: false,
            coords: null,
            name: '',
            contactNo: null,
            flatOrBuildingNo: '',
            shift: new Animated.Value(0),
            mart: '',
            orderSent: false,
            token: '',
            orderObj: {}
        }
    }

    setLocation = (coords) => {
        // console.log('location ===>', location)
        this.setState({ coords, map: false })
    }

    sendData = () => {
        const { name, contactNo, coords, flatOrBuildingNo } = this.state
        if (name && contactNo && coords && flatOrBuildingNo) {
            alert('successfully')
            var token = shortid.generate()

            const orderObj = {
                name: name,
                martToBuy: this.state.mart,
                image: this.props.screenProps.user ? this.props.screenProps.user.photoURL : name,
                isAccepted: false,
                orderDetails: {
                    orderedItems: this.props.navigation.state.params.selectedData,
                    location: coords,
                    phoneNumber: contactNo,
                    orderSenderName: name,
                    buildingAndFlatNo: flatOrBuildingNo,
                    totalPrice: this.props.navigation.state.params.totalAmount,
                    startDate: moment().utcOffset('+05:00').format('YYYY-MM-DD hh:mm:ss'),
                    endDate: moment().add(36, 'hour').utcOffset('+05:00').format('YYYY-MM-DD hh:mm:ss')
                },
                token: token,
                senderId: this.props.screenProps.user ? this.props.screenProps.user.uid : null,
                status: "pendding",
                startDate: moment().utcOffset('+05:00').format('YYYY-MM-DD hh:mm:ss'),
                endDate: moment().add(36, 'hour').utcOffset('+05:00').format('YYYY-MM-DD hh:mm:ss')
            }
            firebase.database().ref('/orders/').push(orderObj)
            // this.props.navigation.navigate('OrderSent', { token, orderObj })
            // console.log(orderObj)
            this.setState({ orderSent: true, token, orderObj })
        } else {
            alert('fill all the fields')
        }
    }

    UNSAFE_componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }

    render() {
        if (!this.state.orderSent) {
            if (!this.state.map) {
                return (
                    <View style={styles.container}>
                        <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >
                            {/* <KeyboardAvoidingView enabled behavior="position" > */}
                            <Animated.View style={[styles.container, { transform: [{ translateY: this.state.shift }] }]}>
                                <View style={{ width: '100%', alignContent: 'center', alignItems: 'center', marginTop: "5%" }} >
                                    <Image source={require('../../assets/LOGO-01.png')} style={{ width: 180, height: 100 }} />
                                </View>

                                <View style={{ marginTop: '10%' }} >
                                    <Item style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} rounded >
                                        {/* <Icon name="building" color="black" style={{ color: 'black', marginLeft: 5 }} type="FontAwesome" /> */}
                                        {/* <Label>Name: </Label> */}
                                        <Input style={{ marginLeft: 10 }} value={this.state.mart} onChangeText={(mart) => this.setState({ mart })} placeholder="Any Mart from where you want to buy" />
                                    </Item>
                                </View>

                                <View style={{ marginTop: '10%' }} >
                                    {!this.state.coords ? <Button rounded onPress={() => this.setState({ map: !this.state.map })} iconLeft block style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} >
                                        <Icon name="map-marker" color="black" style={{ color: 'black' }} type="FontAwesome" />
                                        <Text style={{ marginLeft: 10 }} >Location</Text>
                                    </Button>
                                        :
                                        <Button onPress={() => this.setState({ map: !this.state.map })} iconLeft block style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} >
                                            <Icon name="map-marker" color="black" style={{ color: 'black' }} type="FontAwesome" />
                                            <Text style={{ marginLeft: 10 }} >{`${this.state.coords.latitude}, ${this.state.coords.longitude}`}</Text>
                                        </Button>}
                                </View>


                                <View style={{ marginTop: '10%' }} >
                                    <Item iconLeft block style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} rounded >
                                        <Icon name="building" color="black" style={{ color: 'black', marginLeft: 5 }} type="FontAwesome" />
                                        <Input style={{ marginLeft: 10 }} onChangeText={(flatOrBuildingNo) => this.setState({ flatOrBuildingNo })} placeholder="Bulding Or Flat Number" />
                                    </Item>
                                </View>

                                <View style={{ marginTop: '10%' }} >
                                    <Item style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} rounded >
                                        {/* <Icon name="building" color="black" style={{ color: 'black', marginLeft: 5 }} type="FontAwesome" /> */}
                                        {/* <Label>Name: </Label> */}
                                        <Input style={{ marginLeft: 10 }} onChangeText={(name) => this.setState({ name })} placeholder="Enter Your Name" />
                                    </Item>
                                </View>

                                <View style={{ marginTop: '10%' }} >
                                    <Item style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} rounded >
                                        {/* <Icon name="building" color="black" style={{ color: 'black', marginLeft: 5 }} type="FontAwesome" /> */}
                                        {/* <Label>Contact Number: </Label> */}
                                        <Input style={{ marginLeft: 10 }} onChangeText={(contactNo) => this.setState({ contactNo })} placeholder="Enter Contact Number" keyboardType="number-pad" />
                                    </Item>
                                </View>

                                <Button transparent light style={{ alignSelf: 'center' }} onPress={() => this.sendData()} >
                                    <Text style={{ color: '#fff', fontWeight: 'bold', alignSelf: 'center' }} >DONE</Text>
                                </Button>
                            </Animated.View>
                            {/* </KeyboardAvoidingView> */}
                        </ImageBackground>
                    </View>
                );
            } else {
                return <Map setLocation={this.setLocation} />
            }
        } else { return <OrderSent token={this.state.token} orderObj={this.state.orderObj} goToTop={() => this.props.navigation.dispatch(StackActions.popToTop())} /> }
    }
    handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
            const fieldHeight = height;
            const fieldTop = pageY;
            const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
            if (gap >= 0) {
                return;
            }
            Animated.timing(
                this.state.shift,
                {
                    toValue: gap,
                    duration: 1000,
                    useNativeDriver: true,
                }
            ).start();
        });
    }

    handleKeyboardDidHide = () => {
        Animated.timing(
            this.state.shift,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
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
