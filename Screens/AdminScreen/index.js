import React from 'react';
import { StyleSheet, Text, View, Dimensions, Alert, Animated, Keyboard, SafeAreaView } from 'react-native';
import { createDrawerNavigator, createAppContainer, DrawerItems } from 'react-navigation';
import TotalOrder from './AllOrders';
import CustomerDetails from './AllCustomers';
import EditProduct from './EditProduct';
import AddNewProduct from './AddNewProduct';
import Mart from './Mart';
import Notification from './Notification';
import Spam from './Spam';
import { Button } from 'native-base';
// import * as admin from 'firebase-admin';
// var serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://thds-7dee1.firebaseio.com"
// });

export default class AdminScreen extends React.Component {

    constructor() {
        super()
        this.state = {

        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <AdminNavigation screenProps={{ signOut: this.props.signOut }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        // justifyContent: 'center'
    },

})


const DrawerNavigatorForAdmin = createDrawerNavigator({
    AllOrders: TotalOrder,
    AllCustomers: CustomerDetails,
    EditProducts: EditProduct,
    AddNewProduct: AddNewProduct,
    Mart: Mart,
    Notification: Notification,
    Spam: Spam
},
    {
        contentComponent: (props) => (
            <View style={{ flex: 1 }}>
                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                    <DrawerItems {...props} />
                    {/* <Button title="Logout" onPress={() => {

                        Alert.alert(
                            'Log Out',
                            'Are You Sure you Want To Log Out',
                            [
                                // { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
                                {
                                    text: 'Cancel',
                                    onPress: () => props.navigation.navigate('Profile'),
                                    style: 'cancel',
                                },
                                {
                                    text: 'OK', onPress: async () => {
                                        try {
                                            await AsyncStorage.setItem('IsSignIn', "false", (err) => {
                                                console.log(err)
                                                props.screenProps.login()
                                            });
                                            props.screenProps.login()
                                        } catch (error) {
                                            // Error saving data
                                        }
                                    }
                                },
                            ],
                            { cancelable: false },
                        );


                    }} /> */}
                    <Button block danger onPress={() => {

                        Alert.alert(
                            'Log Out',
                            'Are You Sure you Want To Log Out',
                            [
                                // { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
                                {
                                    text: 'Cancel',
                                    onPress: () => props.navigation.navigate('Profile'),
                                    style: 'cancel',
                                },
                                {
                                    text: 'OK', onPress: () => {
                                        props.screenProps.signOut()
                                    }
                                },
                            ],
                            { cancelable: false },
                        );


                    }} style={{ width: '90%', alignSelf: 'center' }} ><Text>Logout</Text></Button>
                </SafeAreaView>
            </View>
        ),
    })

const AdminNavigation = createAppContainer(DrawerNavigatorForAdmin)