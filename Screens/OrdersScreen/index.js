import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, KeyboardAvoidingView } from 'react-native';
import { Icon, Button, Item, Input, Label, Accordion } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Avatar, ListItem, Divider } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import firebase from '../../Component/Config/Firebase';
import { connect } from 'react-redux';

class OrdersScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null,
            list: [
            ],
            activeOrderArr: [],
            completedOrdersArr: [],
        }
    }

    componentWillMount = () => {
        const { list, activeOrderArr, completedOrdersArr } = this.state
        const { user } = this.props.screenProps

        firebase.database().ref('/orders/').on('child_added', snap => {
            let values = snap.val()
            let childKey = snap.key
            // console.log(childKey)
            values.key = childKey
            if (!values.isAccepted) {
                list.push(values)
                this.setState({ list })
            }
            // let index = list.findIndex(x => )
            // console.log(index)
            if (values.isAccepted === true && values.accetedUserId === user.uid) {
                if (values.status === "completed") {
                    completedOrdersArr.push(values)
                    this.setState({ completedOrdersArr })
                } else if (values.status === 'pendding') {
                    activeOrderArr.push(values)
                    this.setState({ activeOrderArr })
                }
            }
        })
        this.updateActiveOrdersList()
    }

    updateActiveOrdersList = () => {
        const { list, activeOrderArr } = this.state

        // console.log(user)

    }

    componentDidMount() {
        this.getPermissionAsync();
        this.updateActiveOrdersList()
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

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

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
                    {" "}{item.name}
                </Text>
                {expanded
                    ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
                    : <Icon style={{ fontSize: 18 }} name="add-circle" />}
            </View>
        );
    }

    _renderContent(item) {
        return (
            <Text
                style={{
                    backgroundColor: "#e3f1f1",
                    padding: 10,
                    fontStyle: "italic",
                }}
            >
                Amount: {item.amount}
            </Text>
        );
    }

    accepted = (i) => {
        const { list, activeOrderArr } = this.state
        // list[i].isAccepted = !list[i].isAccepted
        // this.setState({ list })
        // console.log(list[i])
        firebase.database().ref(`/orders/${list[i].key}/`).update({ isAccepted: true, accetedUserId: this.props.screenProps.user.uid, status: "pendding" })
        // firebase.database().ref(`/orders/${list[i].key}/orderDetails/`).push({ accepte: true })
        list[i].isAccepted = true
        list[i].accetedUserId = this.props.screenProps.user.uid

        activeOrderArr.push(list[i])
        this.setState({ list, activeOrderArr })
        this.props.updateList(list)
        this.props.navigation.navigate('OrderList', { orderDetails: list[i].orderDetails, orderDetail: list[i] })

    }

    renderOrders = () => (
        <View>

        </View>
    )

    render() {
        // console.log("from render", this.props.list)
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >

                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottomColor: "#fff", borderBottomWidth: 1, marginTop: 20 }} >
                        <View style={{ width: '30%', borderBottomColor: '#fff', borderBottomWidth: 1 }} >
                            <Text style={{ fontSize: 25, color: '#fff', marginLeft: 5 }} >Order</Text>
                        </View>
                        <View style={{ width: '40%' }}>
                            <Text onPress={() => this.props.navigation.navigate("ActiveOrder", { list: this.state.activeOrderArr, completedOrders: this.state.completedOrdersArr })} style={{ fontSize: 25, color: '#fff' }} >Active Order</Text>
                        </View>
                        <View style={{ width: '30%' }}>
                            <Text onPress={() => this.props.navigation.navigate("CompletedOrders", { completedOrders: this.state.completedOrdersArr, list: this.state.activeOrderArr })} style={{ fontSize: 25, color: '#fff', marginLeft: 5 }} >Deliver</Text>
                        </View>
                    </View>

                    <ScrollView>
                        {
                            this.state.list ? <View style={{ width: '100%', backgroundColor: 'transparent', alignSelf: 'center', marginTop: 20, paddingBottom: 20 }} >

                                {
                                    this.state.list.map((l, i) => (
                                        <View>
                                            <ListItem
                                                key={i}
                                                leftAvatar={{ source: { uri: l.image }, title: l.image.substring(0, 1) }}
                                                title={l.name}
                                                containerStyle={{ backgroundColor: 'transparent' }}
                                                // subname={l.subname}
                                                rightTitle={l.status === 'completed' ? <Button rounded block dark ><Text style={{ color: '#fff' }} > completed </Text></Button> : l.isAccepted ? <Button rounded block style={{ backgroundColor: 'green' }} ><Text style={{ color: '#fff' }} > Accepted </Text></Button> : <Button block rounded onPress={this.accepted.bind(this, i, l.isAccepted)} style={{ backgroundColor: 'blue' }} ><Text style={{ color: '#fff' }} > Accept </Text></Button>}

                                            />
                                            <Divider style={{ width: '90%', alignSelf: 'center' }} />
                                        </View>
                                    ))
                                }


                            </View> : <Text style={{ color: '#fff', alignContent: 'center', justifyContent: 'center', alignSelf: 'center', fontSize: 30, alignItems: 'center' }} >No Orders Yet...</Text>}
                    </ScrollView>

                    <View style={{ backgroundColor: '#fff', width: '100%', borderColor: 'black', borderWidth: 1 }} >
                        {/* <TouchableOpacity style={{ alignSelf: 'center' }} > */}
                        {/* {this.props.screenProps.user && <ListItem
                            leftAvatar={{ source: { uri: this.props.screenProps.user.photoURL } }}
                            title={this.props.screenProps.user.displayName}
                            onPress={() => this.props.navigation.navigate("RiderProfileScreen")}
                            rightTitle={<Button danger block onPress={() => this.props.screenProps.signOut()} ><Text>Logout</Text></Button>}
                        />} */}
                        {/* </TouchableOpacity> */}
                        {this.props.screenProps.user && <View><Avatar onPress={() => this.props.navigation.navigate("RiderProfileScreen")} containerStyle={{ alignSelf: 'center' }} rounded source={{ uri: this.props.screenProps.user.photoURL }} /></View>}
                    </View>
                </ImageBackground>
            </View >
        );
    }
}

function mapStateToProps(state) {
    return {
        list: state.list
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateList: (list) => { dispatch({ type: 'updateList', list }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen)

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
