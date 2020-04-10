import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Modal, TouchableHighlight } from 'react-native';
import { Icon, Button, Item, Input, Label, Accordion } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Avatar, ListItem } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'expo';
import Constants from 'expo-constants';
import firebase from '../../Component/Config/Firebase'

export default class ProfileScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null,
            list: [

            ],
            modalVisible: false,
            selectedOrder: null,
        }
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });

        // console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    componentWillMount = () => {
        const { list } = this.state
        firebase.database().ref('/orders/').on('child_added', snapShot => {
            let allOrders = snapShot.val()
            if (allOrders.senderId === this.props.screenProps.user.uid) {
                list.push(allOrders)
                this.setState({ list })
            }
        })
    }

    _renderHeader(item, expanded) {
        return (
            <View style={{
                flexDirection: "row",
                padding: 10,
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#A9DAD6"
            }}>
                <Text style={{ fontWeight: "600" }}>
                    {" "}{item.token}
                </Text>
                {expanded
                    ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
                    : <Icon style={{ fontSize: 18 }} name="add-circle" />}
            </View>
        );
    }

    _renderContent = (item) => {
        return (
            <View style={{
                flex: 1, backgroundColor: "#e3f1f1",
                padding: 10,
            }} >
                <Text
                    style={{
                        // backgroundColor: "#e3f1f1",
                        padding: 10,
                        fontStyle: "italic",
                    }}
                >
                    Amount: {item.orderDetails.totalPrice}
                </Text>
                <Button onPress={() => this.setState({ selectedOrder: item, modalVisible: true })} primary block rounded style={{ alignSelf: 'center' }} ><Text style={{ color: '#fff' }} >View</Text></Button>
            </View>
        );
    }

    renderModal = () => {
        const { selectedOrder } = this.state
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setState({ modalVisible: !this.state.modalVisible })
                }}>
                <View style={{ marginTop: 22 }}>
                    <ScrollView>
                        <View>
                            {/* <Text style={{ fontSize: 20 }}>Your Selected Items Are</Text> */}
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black' }} >
                                <Text style={{ width: '40%', fontWeight: 'bold' }} >Name</Text>
                                <Text style={{ width: '20%', fontWeight: 'bold' }} >Quantity</Text>
                                <Text style={{ width: '20%', fontWeight: 'bold' }} >Type</Text>
                                <Text style={{ width: '20%', fontWeight: 'bold' }} >Weight</Text>
                            </View>

                            {this.state.selectedOrder.orderDetails.orderedItems.map((value, index) => {
                                return (
                                    <View style={(!value.isPicked && !value.notInStock) ? ({ display: 'flex', flexDirection: 'row', width: '100%', padding: 10, borderBottomColor: 'black', borderBottomWidth: 1 }) : (value.isPicked && { backgroundColor: 'green', opacity: 0.4, display: 'flex', flexDirection: 'row', width: '100%', padding: 10, borderBottomColor: 'black', borderBottomWidth: 1 }) || (value.notInStock && { backgroundColor: 'yellow', opacity: 0.4, display: 'flex', flexDirection: 'row', width: '100%', padding: 10, borderBottomColor: 'black', borderBottomWidth: 1 })}  >
                                        <Text style={{ width: '40%' }} >{value.mainItemName}</Text>
                                        <Text style={{ width: '20%' }} >{value.quantity}</Text>
                                        <Text style={{ width: '20%' }} >{value.quantityTitle}</Text>
                                        <Text style={{ width: '20%' }} >{value.wieght >= 1000 ? `${value.wieght / 1000} kg` : `${value.wieght} gm`}</Text>
                                    </View>
                                )
                            })}
                            {/* <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black' }} >
                                <Text style={{ width: '70%', fontWeight: 'bold' }} >Total Weight</Text>
                                <Text style={{ width: '30%' }} >{this.state.totalWeight && this.state.totalWeight}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black' }} >
                                <Text style={{ width: '70%', fontWeight: 'bold' }} >Service Charges (<Text style={{}} >A/c to Weight</Text>)</Text>
                                <Text style={{ width: '30%' }} >{this.state.serviceCharges && this.state.serviceCharges}</Text>
                            </View> */}
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black', borderBottomWidth: 2 }} >
                                <Text style={{ width: '70%', fontWeight: 'bold' }} >Total Expected Amount</Text>
                                <Text style={{ width: '30%' }} >{selectedOrder.orderDetails.totalPrice}</Text>
                            </View>
                            <TouchableHighlight
                                style={{ marginTop: 10 }}

                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}>
                                <Button danger full onPress={() => this.setState({ modalVisible: !this.state.modalVisible })} >
                                    <Text>Close</Text>
                                </Button>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    render() {
        if (!this.state.modalVisible) {
            return (
                <View style={styles.container}>
                    <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >
                        <View style={{ width: '100%', alignContent: 'center', alignItems: 'center', marginTop: "10%" }} >
                            <Image source={require('../../assets/LOGO-01.png')} style={{ width: 250, height: 150 }} />
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }} >
                            <View style={{ padding: 20, width: '30%' }}  >
                                <Avatar
                                    size="large"
                                    rounded
                                    source={{ uri: this.props.screenProps.user.photoURL }}
                                    // title={!this.state.image && "CR"}
                                    onPress={() => console.log("Works!")}
                                    activeOpacity={0.7}
                                    showEditButton
                                    editButton={{ name: 'camera-alt', color: '#000', containerStyle: { backgroundColor: '#fff', borderRadius: 10 } }}
                                    onEditPress={() => this._pickImage()}
                                />
                            </View>
                            <View style={{ marginTop: "7%", width: '70%' }} >
                                <View style={{ display: 'flex', flexDirection: 'row' }} >
                                    <Text style={{ color: '#fff', fontSize: 15 }} >Name:</Text>
                                    <Text style={{ color: '#fff', fontSize: 15, borderBottomColor: '#fff', borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }} >{this.props.screenProps.user.displayName}</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }} >
                                    <Text style={{ color: '#fff', fontSize: 15 }} >Email:</Text>
                                    <Text style={{ color: '#fff', fontSize: 15, borderBottomColor: '#fff', borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }} >{this.props.screenProps.user.email}</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }} >
                                    <Text style={{ color: '#fff', fontSize: 15 }} >Orders:</Text>
                                    <Text style={{ color: '#fff', fontSize: 15, borderBottomColor: '#fff', borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }} >{this.state.list.length}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ width: '90%', backgroundColor: '#fff', alignSelf: 'center', height: 250 }} >
                            <View style={{ borderBottomColor: '#000', borderBottomWidth: 2 }}>
                                <Text style={{ fontSize: 25, alignSelf: 'center' }} >Order List</Text>
                            </View>

                            <View style={{ flex: 1 }} >
                                <ScrollView>
                                    <View style={{ flex: 1 }} >

                                        <Accordion
                                            dataArray={this.state.list}
                                            animation={true}
                                            expanded={true}
                                            renderHeader={this._renderHeader}
                                            renderContent={this._renderContent}
                                        />

                                    </View>
                                </ScrollView>
                            </View>

                        </View>
                        <Button onPress={() => this.props.screenProps.signOut()} danger full style={{ position: 'absolute', bottom: 0, width: '100%' }} >
                            <Text style={{ color: '#fff' }} >Logout</Text>
                        </Button>
                    </ImageBackground>
                </View>
            );
        } else {
            return <View>{this.renderModal()}</View>
        }
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
