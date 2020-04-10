import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, KeyboardAvoidingView } from 'react-native';
import { Icon, Button, Item, Input, Label, Accordion, List } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Avatar, ListItem, Divider } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import firebase from '../../Component/Config/Firebase'

export default class ActiveOrderOfCurrentUser extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null,
            list: [
            ]
        }
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

    render() {
        // console.log(this.props.list)
        return (
            <View style={styles.container}>
                {this.props.list && this.props.list.map((value, index) => {
                    return (
                        <View style={{ width: '100%' }} >
                            <ListItem
                                title={value.name}
                                leftAvatar={{ source: { uri: value.image }, title: value.name.substring(0, 1) }}
                                rightTitle={<Button block rounded onPress={() => this.props.openDetails(value)} ><Text>Open</Text></Button>}
                                subtitle={value.status}
                                containerStyle={{ backgroundColor: 'transparent' }}
                            />
                            <Divider style={{ width: '90%', alignSelf: 'center' }} />
                        </View>
                    )
                })}
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
