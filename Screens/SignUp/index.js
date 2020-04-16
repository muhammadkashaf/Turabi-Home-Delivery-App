import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, KeyboardAvoidingView } from 'react-native';
import { Icon, Item, Input, Picker, Button } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import firebase from '../../Component/Config/Firebase';

export default class SignUp extends React.Component {
    constructor() {
        super()
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            userType: '',
            currentUser: null
        }
    }

    UNSAFE_componentWillMount = () => {
        firebase.auth().onAuthStateChanged(user => {
            // console.log(user)
        })
    }

    signUp = () => {
        const { email, password, firstName, lastName, userType } = this.state

        // console.log(email, password)
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {

                user.user.updateProfile({
                    displayName: `${firstName} ${lastName}`,
                    photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }).then(function () {
                    const userObj = {
                        name: `${firstName} ${lastName}`,
                        email: user.user.email,
                        userType: userType,
                        profilePic: user.user.photoURL
                    }
                    firebase.database().ref(`/users/${user.user.uid}/`).push(userObj)
                    // userType === "Rider" && this.props.navigation.navigate('OrdersScreen')
                }, function (err) {
                    console.log(err)
                })

                this.setState({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    userType: '', currentUser: user.user
                })
            })
            .then((user) => console.log('user', user))
            .catch((err) => alert(err))
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >
                    <KeyboardAvoidingView enabled behavior="position"  >

                        <View style={{ width: '100%', alignContent: 'center', alignItems: 'center', marginTop: "10%" }} >
                            <Image source={require('../../assets/LOGO-01.png')} style={{ width: 250, height: 150 }} />
                        </View>

                        <View style={{ alignItems: 'center', alignContent: 'center', justifyContent: 'center', width: '100%', marginTop: '10%' }} >

                            <Item picker regular style={{ borderColor: '#fff', margin: 5, width: "80%" }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Select Feedback Type"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.userType}
                                    onValueChange={(userType) => this.setState({ userType })}
                                >
                                    <Picker.Item label="Select User Type" value="key0" />
                                    <Picker.Item label="Rider" value="Rider" />
                                    <Picker.Item label="Customer" value="Customer" />
                                </Picker>
                            </Item>

                            <View style={{ display: 'flex', flexDirection: 'row' }} >
                                <View>
                                    <Text style={styles.text} >First Name</Text>
                                    <Item regular style={{}} >
                                        <Input placeholder='First Name' value={this.state.firstName} onChangeText={(firstName) => this.setState({ firstName })} />
                                    </Item>
                                </View>
                                <View style={{ marginLeft: '10%' }} >
                                    <Text style={styles.text} >Last Name</Text>
                                    <Item regular style={{}}>
                                        <Input placeholder='Last Name' value={this.state.lastName} onChangeText={(lastName) => this.setState({ lastName })} />
                                    </Item>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.text} >E-mail</Text>
                                <Item regular style={{ width: '80%', marginTop: '2%' }} >
                                    <Input placeholder='example. hnhsolution...' value={this.state.email} onChangeText={(email) => this.setState({ email })} />
                                </Item>
                            </View>

                            <View style={{ marginTop: '5%' }} >
                                <Text style={styles.text} >Password</Text>
                                <Item regular style={{ width: '80%', marginTop: '2%' }}>
                                    <Input onChangeText={(password) => this.setState({ password })} placeholder='*********' value={this.state.password} secureTextEntry />
                                </Item>
                            </View>

                        </View>
                    </KeyboardAvoidingView>

                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: '5%' }} >
                        <Button transparent iconLeft light style={{ marginLeft: '30%' }} onPress={this.signUp} >
                            <TouchableOpacity style={{ display: 'flex', flexDirection: 'row' }} >
                                <Icon name="sign-out" type="FontAwesome" />
                                <Text style={{ color: "#fff", fontSize: 20, borderBottomColor: "#ffff", borderBottomWidth: 1 }} >Signup</Text>
                            </TouchableOpacity>
                        </Button>
                    </View>

                    <View style={{ bottom: 5, position: 'absolute', alignSelf: 'center' }} >
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Text style={{ color: '#ffff' }} >If you have already an accout! Login?</Text>
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
    text: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});
