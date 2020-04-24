import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert
} from 'react-native';

import {
  Header,
  Left,
  Body,
  Title,
  Icon,
  Button,
  Spinner
} from 'native-base';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import { orange } from '../../ColorTheme/color';

export default class Login extends Component {




  static navigationOptions = {
    drawerLabel: () => null,
  };

  constructor(props) {
    super(props);
    this.state = {

      email: '',
      password: '',
      loader: false,
      hidePassword: true,
      emailErr: false,
      passwordErr: false,

    };
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





  setPasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }






  login = async (props) => {
    this.setState({ loader: true })
    const { email, password } = this.state
    console.log("FIKHSDJKDFJSN")

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(email) === false) {
      this.setState({ loader: false })

      Alert.alert("Alert", "Please Enter Valid Email Address")
    }

    else if (password == '') {
      this.setState({ loader: false })
      Alert.alert("Alert", "Password is required")
    } else {

      let obj = {
        "action": "login",
        "role_id": 2,
        "email": email,
        "password": password,
      }


      const formData = new FormData();


      formData.append("email", email),
        formData.append("password", password),
        formData.append("action", "login"),
        formData.append("role_id", 2)



      console.log("********************************", obj);


      axios.post("http://www.hnh5.xyz/delish/api/login.php", formData)
        .then(async response => {


          if (response.data.status) {
            // console.log("IF--------------------------------")
            await AsyncStorage.setItem('uid', response.data.data[0].id);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('name', response.data.data[0].first_name + ' ' + response.data.data[0].last_name);
            await AsyncStorage.setItem("contact", response.data.data[0].contact_no)

            this.setState({ loader: true })
            this.props.navigation.navigate("AuthLoading")


          } else {
            // console.log("else--------------------------------",response.data.message)
            this.setState({ loader: false })
            Alert.alert(response.data.message)

          }
        })
        .catch(err =>
          console.log("*-*-*-*", err)
        )
    }

    if (!email) {
      this.setState({ emailErr: true, loader: false })
    }
    if (password.length < 6) {
      this.setState({ passwordErr: true, loader: false })
    }
  }







  render() {

    const { email, password, emailErr, passwordErr, loader } = this.state
    console.log(email, password)

    return (


      <View style={styles.container}>




        {/* Start Header View*/}

        <Header style={{ backgroundColor: orange }} noShadow>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')} transparent>
              <Icon style={{ color: 'white', left: '5%' }} type="Entypo" name="cross" />
            </TouchableOpacity>
          </Left>

          <Body>
            <Title style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Log in</Title>
          </Body>


        </Header>

        {/* End Header  View*/}




        <ScrollView>





          {/* Start Button View*/}


          <View style={styles.facebookbtnView}>

            <Button block>
              <View style={{ marginLeft: "4%" }} >
                <Icon type="MaterialCommunityIcons" name="facebook" />
              </View>

              <View style={{ marginRight: 30 }}>
                <Text style={{ color: 'white' }}>LOG IN WITH FACEBOOK</Text>
              </View>

            </Button>

          </View>
          {/* End Button View*/}










          {/* Start Stroke and OrBox View*/}

          <View style={styles.orView}>


            <View style={styles.stroke}></View>

            <View style={styles.orbox}>
              <Text style={styles.orText}>OR</Text>
            </View>

            <View style={styles.stroke}></View>


          </View>

          {/* End Stroke and OrBox View*/}








          {/* Start TextInput and Button View*/}

          <View style={styles.textinputView}>




            <View style={{ marginTop: '5%' }}>
              <TextInput onBlur={() => this.checkField("email")} value={this.state.email} placeholder="Email address" onChangeText={(e) => {
                if (e.includes(' ')) {
                  let text = e.replace(" ", "")
                  this.setState({ email: text })
                  Alert.alert("Alert!", "Please don't type space in email")
                } else {
                  this.setState({ email: e })
                }
              }} />
              {emailErr && <Text style={{ color: 'red', fontSize: 12, alignSelf: 'flex-end', marginRight: '10%' }} >Email address is required</Text>}

            </View>



            <View style={{ marginTop: '5%' }}>
              <TextInput onBlur={() => this.checkField("password")} value={this.state.password} placeholder="Password" secureTextEntry={this.state.hidePassword} onChangeText={(e) => { this.setState({ password: e }) }} style={styles.textBox} />
              <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={this.setPasswordVisibility}>
                <Image source={(this.state.hidePassword) ? require('../../../../Assets/Images/hide.png') : require('../../../../Assets/Images/view.png')} style={styles.buttonImage} />
              </TouchableOpacity>
              {passwordErr && <Text style={{ color: 'red', fontSize: 12, alignSelf: 'flex-end', marginRight: '10%' }} >Password is required</Text>}

            </View>






            {!loader ?
              <View style={{ marginTop: '5%', alignItems: 'center' }}>
                <Button onPress={this.login} style={{ backgroundColor: orange, width: '30%' }}><Text style={{ color: 'white', marginLeft: '12%' }}> LOG IN </Text></Button>
              </View>
              :
              <Spinner color='#fc8b8c' />
            }
          </View>

          {/* End TextInput and Button View*/}





          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={styles.subText}>New user? Create an account</Text>
          </TouchableOpacity>



          {/* End Main View*/}

        </ScrollView >


      </View >
    );
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F3F3F3',
  },
  facebookbtnView: {
    marginTop: '10%',
    width: '70%',
    alignSelf: 'center',
  },
  stroke: {
    width: 100,
    borderColor: 'grey',
    borderWidth: 1,
  },
  orView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8%',
  },
  orbox: {
    width: 50,
    height: 21,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'

  },
  orText: {
    color: "rgba(18,18,18,1)",
    fontSize: 10,
    fontFamily: "roboto-700",
    textAlign: 'center',
  },
  textinputView: {
    display: 'flex',
    marginTop: '1%',
    marginLeft: 30,
    width: '80%',


  },
  forgotPasswordText: {
    color: orange,
    fontSize: 17,
    fontFamily: "roboto-regular",
    paddingTop: '5%',
    textAlign: 'center'
  },
  subText: {
    color: orange,
    fontSize: 17,
    fontFamily: "roboto-regular",
    paddingTop: '5%',
    textAlign: 'center'
  },
  touachableButton: {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    padding: 2
  },
  buttonImage: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
});