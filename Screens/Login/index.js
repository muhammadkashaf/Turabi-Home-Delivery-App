import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, KeyboardAvoidingView, Alert } from 'react-native';
import { Icon, Item, Input, Label, Button } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import { connect } from 'react-redux'
import AdminScreen from '../AdminScreen';
import axios from 'axios';



class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            email: 'kashafahmed98@gmail.com',
            password: 'kashaf123',
            adminScreen: false,


            userTypeErr: false,

            emailErr: false,
            passwordErr: false,
        }
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




    login = () => {
        const { email, password } = this.state

        // const { email, password } = this.state
        // if (email === 'admin@domain.com' && password === 'admin123') {
        //     this.setState({ adminScreen: true })
        // } else {
        //     this.props.screenProps.login(email, password)
        // }

        if (!email) {
            return this.setState({ emailErr: true, loader: false })
        }
        if (password.length < 6) {
            return this.setState({ passwordErr: true, loader: false })
        }

        console.log("SIGN UP jksdajkfajkshjghj")
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email && password) {
            if (reg.test(email) === false) {
                this.setState({ loader: false })
                Alert.alert("Alert", "Please Enter Valid Email Address")
            } else {
                let obj = {
                    "roll_id": 2,
                    "email": email,
                    "password": password,


                }



                console.log("********************************", obj);


                var formdata = new FormData();

                formdata.append("roll_id", 2),
                    formdata.append("email", email.toLowerCase()),
                    formdata.append("password", password),



                    axios.post("http://hnh11.xyz/Turabi/login.php", formdata)
                        .then(res => {

                      
                            console.log('api status', res.data[0]);

                            console.log('api res data', res.data);

                         
                            if (!res.status) {
                                this.setState({ loader: false })
                                Alert.alert('Error', res.message)
                            }

                            else if (res.data.roll_id == 2) {

                                this.setState({ loader: true })
                                this.props.navigation.navigate('RiderProfileScreen')
                                // Alert.alert("Alert", "Rider Registered successfully")
                            }
                            else if (res.data.roll_id == '3') {
                                this.setState({ loader: true })
                                this.props.navigation.navigate('DashboardForUser')
                                // Alert.alert("Alert", "User Registered successfully")
                            }


                        })
                        .catch(err => console.log("*-*-*-*", err))


            }
        }
    }

    render() {

        const { emailErr, passwordErr, loader } = this.state
        // console.log(this.props)
        if (!this.state.adminScreen) {
            return (
                <View style={styles.container}>
                    <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >
                        <View style={{ width: '100%', alignContent: 'center', alignItems: 'center', marginTop: "20%" }} >
                            <Image source={require('../../assets/LOGO-01.png')} style={{ width: 250, height: 150 }} />
                        </View>
                        <KeyboardAvoidingView enabled behavior="position" contentContainerStyle={{ marginTop: '10%', padding: 10 }} >
                            <View style={{ alignItems: 'center', alignContent: 'center', justifyContent: 'center', width: '100%' }} >
                                <View>
                                    <Text style={styles.text} >E-mail</Text>
                                    <Item error={emailErr} regular style={{ width: '80%', marginTop: '2%' }} >
                                        <Input value={this.state.email} onBlur={() => this.checkField("email")} onChangeText={(email) => this.setState({ email })} placeholder='example. hnhsolution...' />
                                    </Item>
                                    {emailErr && <Text style={{ color: 'red', fontSize: 12, alignSelf: 'flex-end', marginRight: '10%' }} >Email address is required</Text>}

                                </View>
                                <View style={{ marginTop: '5%' }} >
                                    <Text style={styles.text} >Password</Text>
                                    <Item error={passwordErr} regular style={{ width: '80%', marginTop: '2%' }}>
                                        <Input value={this.state.password} placeholder='*********' onBlur={() => this.checkField("password")} secureTextEntry onChangeText={(password) => this.setState({ password })} />
                                    </Item>
                                    {passwordErr && <Text style={{ color: 'red', fontSize: 9 }} >Password length must be greater than 6 digits</Text>}

                                </View>
                            </View>
                        </KeyboardAvoidingView>
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: '5%' }} >


                            {!loader ?
                                <Button transparent iconLeft light style={{ marginLeft: '30%' }} onPress={this.login} >
                                    <TouchableOpacity style={{ display: 'flex', flexDirection: 'row' }} >
                                        <Icon name="sign-out" type="FontAwesome" />
                                        <Text style={{ color: "#fff", fontSize: 20, borderBottomColor: "#ffff", borderBottomWidth: 1 }} >Log In</Text>
                                    </TouchableOpacity>
                                </Button>
                                :
                                <Spinner color="#fc8b8c" />

                            }


                            <Button transparent iconLeft light style={{ marginLeft: '20%' }} >
                                <TouchableOpacity style={{ display: 'flex', flexDirection: 'row' }} onPress={() => { this.props.screenProps.skipForLogin(), this.props.navigation.navigate('DashboardForUser') }}>
                                    <Text style={{ color: "#fff", fontSize: 15 }} >Skip</Text>
                                    <Icon name="angle-double-right" type="FontAwesome" />
                                </TouchableOpacity>
                            </Button>


                        </View>

                        <View style={{ bottom: 5, position: 'absolute', alignSelf: 'center' }} >
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                                <Text style={{ color: '#ffff' }} >If you don't have an accout! Sign Up?</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            );
        }
        else {
            return <AdminScreen signOut={() => this.setState({ adminScreen: false })} />
        }
    }
}

// function mapStateToProps(state) {
//     return { list: state }
// }

// function mapDispatchToProps(dispatch) {
//     return {
//         // updateList: (value) => dispatch({ type: 'updateList', value })
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Login)
export default Login

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
