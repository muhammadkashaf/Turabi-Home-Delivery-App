import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, KeyboardAvoidingView } from 'react-native';
import { Icon, Button, Item, Input, Label, Accordion } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Avatar, ListItem } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'expo';
import Constants from 'expo-constants';
import firebase from '../../Component/Config/Firebase'

export default class RiderProfileScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null,
            list: [
               
            ]


        }
    }

    UNSAFE_componentWillMount() {
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

    UNSAFE_componentWillMount = () => {
        const { list } = this.state
        firebase.database().ref('/orders/').on('child_added', snapShot => {
            let allOrders = snapShot.val()
            if (allOrders.accetedUserId === this.props.screenProps.user.uid && allOrders.status === "completed") {
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
                    {" "}{item.title}
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

    render() {

        return (
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >
                    <View style={{ width: '100%', alignContent: 'center', alignItems: 'center', marginTop: "10%" }} >
                        <Image source={require('../../assets/LOGO-01.png')} style={{ width: 250, height: 150 }} />
                    </View>

                    <View style={{ alignSelf: 'center' }} >
                        <View style={{ padding: 20, alignSelf: 'center' }} >
                            <Avatar
                                size="xlarge"
                                rounded
                                source={{ uri: this.props.screenProps.user.photoURL }}
                                // title={!this.state.image && "MH"}
                                onPress={() => console.log("Works!")}
                                activeOpacity={0.7}
                                showEditButton
                                editButton={{ name: 'camera-alt', color: '#000', containerStyle: { backgroundColor: '#fff', borderRadius: 10 } }}
                                onEditPress={() => this._pickImage()}
                            />
                        </View>
                        <View style={{ marginTop: "5%" }} >
                            <View style={{ display: 'flex', flexDirection: 'row' }} >
                                <Text style={{ color: '#fff', fontSize: 20 }} >Name:</Text>
                                <Text style={{ color: '#fff', fontSize: 20, borderBottomColor: '#fff', borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }}>  {this.props.screenProps.user.displayName}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }} >
                                <Text style={{ color: '#fff', fontSize: 20 }} >Email:</Text>
                                <Text style={{ color: '#fff', fontSize: 20, borderBottomColor: '#fff', borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }} >  {this.props.screenProps.user.email}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }} >
                                <Text style={{ color: '#fff', fontSize: 20 }} >Order Completed:</Text>
                                <Text style={{ color: '#fff', fontSize: 20, borderBottomColor: '#fff', borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }} >  {this.state.list.length}</Text>
                            </View>
                        </View>
                    </View>

                    <Button primary rounded block style={{ alignSelf: 'center', marginTop: 10,  }} onPress={() => this.props.screenProps.signOut()} >
                        <Text style={{ color: '#fff'  }} >Logout</Text>
                    </Button>

                    <View style={{ position: 'absolute', bottom: 10, left: 10 }} >
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                            <Image source={{ uri: 'https://www.shareicon.net/download/2015/12/02/190711_blue_720x720.png' }} style={{ height: 50, width: 50 }} />
                        </TouchableOpacity>
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
