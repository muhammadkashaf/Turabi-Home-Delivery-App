import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, KeyboardAvoidingView, Alert } from 'react-native';
import { Icon, Item, Input, Picker, Button, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import firebase from '../../Component/Config/Firebase';
import axios from 'axios';

export default class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            firstName: 'rider',
            lastName: 'khan',
            email: 'rider1@gmail.com',
            password: 'rider123',

            loader: false,
            userType: '',
            currentUser: null,

            userTypeErr: false,
            firstNameErr: false,
            lastNameErr: false,
            emailErr: false,
            passwordErr: false,

        }
    }

    UNSAFE_componentWillMount = () => {
        firebase.auth().onAuthStateChanged(user => {
            // console.log(user)
        })
    }


    checkField = (key) => {
        if (key == "password") {
            if (this.state.password.length > 5) {
                this.setState({ passwordErr: false })
            }
            else {
                this.setState({ passwordErr: true })
            }
        } else {
            if (!this.state[key]) {
                this.setState({
                    [`${key}Err`]: true
                })
            } else {
                this.setState({
                    [`${key}Err`]: false
                })
            }
        }
    }




    signUp = () => {

        const { userType, email, password, firstName, lastName } = this.state

        if (!userType) {
            return this.setState({ userTypeErr: true, loader: false })
        } if (!email) {
            return this.setState({ emailErr: true, loader: false })
        } if (!firstName) {
            return this.setState({ firstNameErr: true, loader: false })
        } if (!lastName) {
            return this.setState({ lastNameErr: true, loader: false })
        }
        if (password.length < 6) {
            return this.setState({ passwordErr: true, loader: false })
        }

        console.log("SIGN UP jksdajkfajkshjghj")
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email && password && firstName && lastName) {
            if (reg.test(email) === false) {
                this.setState({ loader: false })
                Alert.alert("Alert", "Please Enter Valid Email Address")
            } else {
                let obj = {
                    "roll_id": this.state.userType,
                    "email": email,
                    "password": password,
                    "fname": firstName,
                    "lname": lastName,

                }



                console.log("********************************", obj);


                var formdata = new FormData();

                formdata.append("roll_id", userType),
                    formdata.append("email", email.toLowerCase()),
                    formdata.append("password", password),
                    formdata.append("fname", firstName),
                    formdata.append("lname", lastName),


                    axios.post("http://hnh11.xyz/Turabi/signup.php", formdata)
                        .then(res => {

                            // console.log('api response', res);
                            // console.log('api data', res.data);
                        
                            console.log('api config', res.config);
                            console.log('api config1', res.config.data);
                            console.log('api config12', res.config.data._parts[0][1]);
                            // console.log('api status', res.data.status);
                            // console.log('api message', res.data.message)

                            if (!res.data.status) {
                                this.setState({ loader: false })
                                Alert.alert('Error', res.data.message.Record)
                            }

                            if (res.config.data._parts[0][1] == '2') {
                                console.log(res.data.roll_id);
                                
                                this.setState({ loader: true })
                                this.props.navigation.navigate('ProfileScreen')
                                Alert.alert("Alert", "Rider Registered successfully")
                            }
                            else if (res.config.data._parts[0][1] == '3') {
                                this.setState({ loader: true })
                                this.props.navigation.navigate('RiderProfileScreen')
                                Alert.alert("Alert", "User Registered successfully")
                            }

                        })
                        .catch(err => console.log("*-*-*-*", err))


            }
        }
    }

    render() {
        const { userTypeErr, firstNameErr, lastNameErr, emailErr, passwordErr, loader } = this.state

        return (
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >
                    <KeyboardAvoidingView enabled behavior="position"  >

                        <View style={{ width: '100%', alignContent: 'center', alignItems: 'center', marginTop: "10%" }} >
                            <Image source={require('../../assets/LOGO-01.png')} style={{ width: 250, height: 150 }} />
                        </View>

                        <View style={{ alignItems: 'center', alignContent: 'center', justifyContent: 'center', width: '100%', marginTop: '10%' }} >

                            <Item error={userTypeErr} picker regular style={[{ width: '80%' }, this.state.userTypeErr && { borderColor: 'red', borderWidth: .1 }]} >
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Select Feedback Type"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.userType}
                                    onValueChange={(userType) => this.setState({ userType, userTypeErr: false })}
                                >
                                    <Picker.Item label="Select User Type" value="" />
                                    <Picker.Item label="Rider" value="2" />
                                    <Picker.Item label="Customer" value="3" />
                                </Picker>
                            </Item>
                            {/* {userTypeErr && <Text style={{ color: 'red', fontSize: 9 }} ></Text>} */}




                            <View style={{ marginTop: '2%', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} >

                                <View>
                                    <Text style={styles.text}>First Name</Text>
                                    <Item error={firstNameErr} regular style={{}}  >
                                        <Input onBlur={() => this.checkField("firstName")} placeholder='First Name' value={this.state.firstName} onChangeText={(firstName) => this.setState({ firstName })} />
                                    </Item>
                                    {firstNameErr && <Text style={{ color: 'red', fontSize: 9 }} >firstName is required</Text>}

                                </View>

                                <View style={{ marginRight: '10%' }}>
                                    <Text style={styles.text}>Last Name</Text>
                                    <Item error={lastNameErr} regular style={{}} >
                                        <Input onBlur={() => this.checkField("lastName")} placeholder='Last Name' value={this.state.lastName} onChangeText={(lastName) => this.setState({ lastName })} />
                                    </Item>
                                    {lastNameErr && <Text style={{ color: 'red', fontSize: 9 }} >LastName is required</Text>}

                                </View>
                            </View>

                            <View style={{ marginTop: '2%' }}>
                                <Text style={styles.text}>E-mail</Text>
                                <Item error={emailErr} regular style={{ width: '80%' }} >
                                    <Input onBlur={() => this.checkField("email")} placeholder='example. hnhsolution...' value={this.state.email} onChangeText={(email) => this.setState({ email })} />
                                </Item>
                                {emailErr && <Text style={{ color: 'red', fontSize: 9 }} >Email address is required</Text>}

                            </View>

                            <View style={{ marginTop: '5%' }} >
                                <Text style={styles.text}>Password</Text>
                                <Item error={passwordErr} regular style={{ width: '80%' }}>
                                    <Input onBlur={() => this.checkField("password")} onChangeText={(password) => this.setState({ password })} placeholder='*********' value={this.state.password} secureTextEntry />
                                </Item>
                                {passwordErr && <Text style={{ color: 'red', fontSize: 9 }} >Password length must be greater than 6 digits</Text>}

                            </View>

                        </View>
                    </KeyboardAvoidingView>


                    {!loader ?
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: '5%' }} >
                            <Button transparent iconLeft light style={{ marginLeft: '30%' }} onPress={this.signUp} >
                                <TouchableOpacity style={{ display: 'flex', flexDirection: 'row' }} >
                                    <Icon name="sign-out" type="FontAwesome" />
                                    <Text style={{ color: "#fff", fontSize: 20, borderBottomColor: "#ffff", borderBottomWidth: 1 }} >Signup</Text>
                                </TouchableOpacity>
                            </Button>
                        </View>

                        :

                        <Spinner color="#fc8b8c" />
                    }



                    <View style={{ bottom: 5, position: 'absolute', alignSelf: 'center' }} >
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Text style={{ color: '#ffff' }} >If you have already an accout! Login?</Text>
                        </TouchableOpacity>
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
    text: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});
