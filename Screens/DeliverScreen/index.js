import React from 'react';
import { StyleSheet, View, ImageBackground, Image, FlatList, KeyboardAvoidingView, Text } from 'react-native';
import { Icon, Button, Item, Input, Label, Accordion } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Avatar, ListItem } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import { StackActions } from 'react-navigation'
import firebase from '../../Component/Config/Firebase'

export default class DeliverScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null,
            code: '',
            amountRecieve: '',
            imageUrl: false
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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [5, 5],
        });

        // console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
        this._handleImagePicked(result)
    };

    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                uploadUrl = await this.uploadImageAsync(pickerResult.uri);
                this.setState({ img: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    }


    uploadImageAsync = async (uri) => {
        // const { image, username, email, userId } = this.state
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                // console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        var uriARR = blob.data.name
        // console.log(blob)
        this.setState({
            imgName: blob
        });

        if (uriARR != "") {
            const ref = firebase
                .storage()
                .ref()
                .child(blob.data.blobId);
            const snapshot = await ref.put(blob);

            // We're done with the blob, close and release it
            blob.close();
            const url = await snapshot.ref.getDownloadURL()
            console.log(url)
            url && this.setState({ image: url, imageUrl: true })
            return await snapshot.ref.getDownloadURL();
        }
    }

    finish = () => {
        const { code, amountRecieve, image } = this.state
        const { orderDetails, orderDetail } = this.props.navigation.state.params
        // const { } = this.props
        // console.log(orderDetail)
        if (code && amountRecieve && image) {
            if (orderDetail.token === code) {
                firebase.database().ref(`/orders/${orderDetail.key}/`).update({ status: 'completed', amountRecieve: amountRecieve, billImage: image })
                this.setState({ amountRecieve: '', code: '', image: '' })
                this.props.navigation.dispatch(StackActions.popToTop());
            } else { alert('order Not match') }
        } else {
            alert("Please fill all fields")
        }
    }

    accepted = (i) => {
        const { list } = this.state
        list[i].isAccepted = !list[i].isAccepted
        this.setState({ list })
    }

    render() {
        // console.log(this.state.imgName)
        return (
            <View style={styles.container} >
                <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >

                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottomColor: "#fff", borderBottomWidth: 1, marginTop: 20 }} >
                        <View style={{ width: '30%' }} >
                            <Text onPress={() => this.props.navigation.navigate("OrdersScreen")} style={{ fontSize: 25, color: '#fff', marginLeft: 5 }} >Order</Text>
                        </View>
                        <View style={{ width: '40%' }}>
                            <Text onPress={() => this.props.navigation.navigate("ActiveOrder")} style={{ fontSize: 25, color: '#fff' }} >Active Order</Text>
                        </View>
                        <View style={{ width: '30%', borderBottomColor: '#fff', borderBottomWidth: 2 }}>
                            <Text style={{ fontSize: 25, color: '#fff', marginLeft: 5 }} >Deliver</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: '10%' }} >
                        <Item style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} rounded >
                            {/* <Icon name="building" color="black" style={{ color: 'black', marginLeft: 5 }} type="FontAwesome" /> */}
                            {/* <Label>Name: </Label> */}
                            <Input style={{ marginLeft: 10 }} value={this.state.code} onChangeText={(code) => this.setState({ code })} placeholder="Code." />
                        </Item>
                    </View>
                    <View style={{ marginTop: '10%' }} >
                        <Item style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} rounded >
                            {/* <Icon name="building" color="black" style={{ color: 'black', marginLeft: 5 }} type="FontAwesome" /> */}
                            {/* <Label>Name: </Label> */}
                            <Input style={{ marginLeft: 10 }} value={this.state.amountRecieve} onChangeText={(amountRecieve) => this.setState({ amountRecieve })} placeholder="Amount Receive." keyboardType="number-pad" />
                        </Item>
                    </View>
                    <View style={{ marginTop: '10%' }} >
                        <TouchableOpacity onPress={this._pickImage} >
                            <Item style={{ backgroundColor: '#fff', width: '70%', alignSelf: 'center' }} rounded >
                                {/* <Icon name="building" color="black" style={{ color: 'black', marginLeft: 5 }} type="FontAwesome" /> */}
                                {/* <Label>Name: </Label> */}
                                {/* <Input style={{ marginLeft: 10 }} placeholder="complete image" disabled /> */}
                                <Button transparent ><Text note >complete image</Text></Button>
                            </Item>
                        </TouchableOpacity>
                    </View>

                    {this.state.image && <View style={{ alignSelf: 'center' }} >
                        <Image source={{ uri: this.state.image }} style={{ height: 200, width: 200 }} />
                    </View>}

                    <View style={{ alignSelf: 'center', position: 'absolute', bottom: '10%' }} >
                        <Button onPress={() => this.finish()} style={{ width: 200, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center' }} >
                            <Text style={{ color: '#fff' }} >Finish</Text>
                        </Button>
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
    }
});
