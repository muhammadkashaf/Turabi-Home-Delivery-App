import React from 'react';
import { StyleSheet, View, ImageBackground, TouchableHighlight, FlatList, Modal, Text } from 'react-native';
import { Icon, Button, Item, Input, Label, Accordion } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Avatar, ListItem, Divider } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import { StackActions } from 'react-navigation'
import firebase from '../../Component/Config/Firebase'

export default class CompletedOrdersByRider extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null,
            code: '',
            amountRecieve: '',
            imageUrl: false,
            modalVisible: false,
            selectedOrder: null,
        }
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
        // console.log(this.state.imgName)
        const { list } = this.props.navigation.state.params
        if (!this.state.modalVisible) {
            return (
                <View style={styles.container} >
                    <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >

                        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottomColor: "#fff", borderBottomWidth: 1, marginTop: 20 }} >
                            <View style={{ width: '30%' }} >
                                <Text onPress={() => this.props.navigation.navigate("OrdersScreen")} style={{ fontSize: 25, color: '#fff', marginLeft: 5 }} >Order</Text>
                            </View>
                            <View style={{ width: '40%' }}>
                                <Text onPress={() => this.props.navigation.navigate("ActiveOrder", { list: list && list })} style={{ fontSize: 25, color: '#fff' }} >Active Order</Text>
                            </View>
                            <View style={{ width: '30%', borderBottomColor: '#fff', borderBottomWidth: 2 }}>
                                <Text style={{ fontSize: 25, color: '#fff', marginLeft: 5 }} >Deliver</Text>
                            </View>
                        </View>

                        <ScrollView>
                            {
                                this.props.navigation.state.params.completedOrders.length > 0 ? <View style={{ width: '100%', backgroundColor: 'transparent', alignSelf: 'center', marginTop: 20, paddingBottom: 20 }} >

                                    {
                                        this.props.navigation.state.params.completedOrders.map((l, i) => (
                                            <View>
                                                <ListItem
                                                    key={i}
                                                    leftAvatar={{ source: { uri: l.image }, title: l.image.substring(0, 1) }}
                                                    title={l.name}
                                                    containerStyle={{ backgroundColor: 'transparent' }}
                                                    onPress={() => this.setState({ selectedOrder: l, modalVisible: true })}
                                                    rightTitle={l.isAccepted ? <Button block rounded style={{ backgroundColor: 'green' }} ><Text style={{ color: '#fff' }} > completed </Text></Button> : <Button onPress={this.accepted.bind(this, i, l.isAccepted)} style={{ backgroundColor: 'blue' }} ><Text style={{ color: '#fff' }} > completed </Text></Button>}

                                                />
                                                <Divider style={{ width: '90%', alignSelf: 'center' }} />
                                            </View>
                                        ))
                                    }


                                </View> : <Text style={{ color: '#fff', alignContent: 'center', justifyContent: 'center', alignSelf: 'center', fontSize: 25, alignItems: 'center' }} >No Orders completed...</Text>}
                        </ScrollView>

                    </ImageBackground>
                </View >
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
