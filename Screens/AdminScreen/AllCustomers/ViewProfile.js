import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, KeyboardAvoidingView } from 'react-native';
import { Icon, Button, Item, Input, Label, Accordion } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Avatar, ListItem } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import firebase from '../../../Component/Config/Firebase'

export default class ViewProfile extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null,
            list: [
                {
                    title: 'ABCDEF',
                    icon: 'av-timer',
                    amount: 300
                },
                {
                    title: 'ABCDEF',
                    icon: 'flight-takeoff',
                    amount: 300
                },
                {
                    title: 'ABCDEF',
                    icon: 'av-timer',
                    amount: 300
                },
                {
                    title: 'ABCDEF',
                    icon: 'flight-takeoff',
                    amount: 300
                },
                {
                    title: 'ABCDEF',
                    icon: 'av-timer',
                    amount: 300
                },
                {
                    title: 'ABCDEF',
                    icon: 'flight-takeoff',
                    amount: 300
                },
                {
                    title: 'ABCDEF',
                    icon: 'av-timer',
                    amount: 300
                },
                {
                    title: 'ABCDEF',
                    icon: 'flight-takeoff',
                    amount: 300
                },
            ],
            allOrders: []


        }
    }

    getOrders = () => {
        const { allOrders } = this.state
        const { userDetails } = this.props.navigation.state.params
        // console.log(userDetails)
        firebase.database().ref('/orders/').on('child_added', snapShot => {
            let orders = snapShot.val()
            if(userDetails.userType === 'Rider'){
                if(userDetails.uid === orders.accetedUserId && orders.status === 'completed') {
                    allOrders.push(orders)
                    this.setState({ allOrders })
                } 
            }
            if(userDetails.userType === 'Customer'){
                if(userDetails.uid === orders.senderId) {
                    allOrders.push(orders)
                    this.setState({ allOrders })
                } 
            }
            // console.log(orders)
            // allOrders.push(orders)
            // this.setState({ allOrders })
            // if (orders.isAccepted) {
            //     activeOrders.push(orders)
            //     this.setState({ activeOrders })
            // }

        })
    }

    componentWillMount = () => {
        this.getOrders()
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
            alignItems: "center" ,
            backgroundColor: "#A9DAD6" }}>
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
               
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }} >
                        <View style={{ padding: 20, width: '30%' }}  >
                            <Avatar
                                size="large"
                                rounded
                                source={{ uri: this.props.navigation.state.params.userDetails.profilePic }}
                                // title={!this.state.image && "CR"}
                                onPress={() => console.log("Works!")}
                                activeOpacity={0.7}
                                // showEditButton
                                // editButton={{ name: 'camera-alt', color: '#000', containerStyle: { backgroundColor: '#000', borderRadius: 10 } }}
                                // onEditPress={() => this._pickImage()}
                            />
                        </View>
                        <View style={{ marginTop: "7%", width: '70%' }} >
                            <View style={{ display: 'flex', flexDirection: 'row' }} >
                                <Text style={{ color: '#000', fontSize: 15 }} >Name:</Text>
                                <Text style={{ color: '#000', fontSize: 15, borderBottomColor: '#000', borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }} >{this.props.navigation.state.params.userDetails.name}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }} >
                                <Text style={{ color: '#000', fontSize: 15 }} >Email:</Text>
                                <Text style={{ color: '#000', fontSize: 15, borderBottomColor: '#000', borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }} >{this.props.navigation.state.params.userDetails.email}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }} >
                                <Text style={{ color: '#000', fontSize: 15 }} >Orders:</Text>
                                <Text style={{ color: '#000', fontSize: 15, borderBottomColor: '#000', borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }} >{this.state.allOrders.length}</Text>
                            </View>
                        </View>
                    </View>

                    {this.props.navigation.state.params.userDetails.orders && <View style={{ width: '90%', backgroundColor: '#000', alignSelf: 'center', height: 250 }} >
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

                    </View>}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
        // flex: 1,
        // backgroundColor: '#000',
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
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20
    }
});
