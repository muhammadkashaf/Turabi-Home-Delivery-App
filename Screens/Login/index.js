import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, KeyboardAvoidingView } from 'react-native';
import { Icon, Item, Input, Label, Button } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import { connect } from 'react-redux'
import AdminScreen from '../AdminScreen';




class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            adminScreen: false
        }
    }



    login = () => {
        const { email, password } = this.state
        if (email === 'admin@domain.com' && password === 'admin123') {
            this.setState({ adminScreen: true })
        } else {
            this.props.screenProps.login(email, password)
        }
    }

    render() {
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
                                    <Item regular style={{ width: '80%', marginTop: '2%' }} >
                                        <Input onChangeText={(email) => this.setState({ email })} placeholder='example. hnhsolution...' />
                                    </Item>
                                </View>
                                <View style={{ marginTop: '5%' }} >
                                    <Text style={styles.text} >Password</Text>
                                    <Item regular style={{ width: '80%', marginTop: '2%' }}>
                                        <Input placeholder='*********' secureTextEntry onChangeText={(password) => this.setState({ password })} />
                                    </Item>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: '5%' }} >

                            <Button transparent iconLeft light style={{ marginLeft: '30%' }} onPress={() => this.login()} >
                                <TouchableOpacity style={{ display: 'flex', flexDirection: 'row' }} >
                                    <Icon name="sign-out" type="FontAwesome" />
                                    <Text style={{ color: "#fff", fontSize: 20, borderBottomColor: "#ffff", borderBottomWidth: 1 }} >Log In</Text>
                                </TouchableOpacity>
                            </Button>

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
