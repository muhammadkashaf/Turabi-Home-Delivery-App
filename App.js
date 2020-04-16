import React from 'react';
import { StyleSheet, Text, View, Platform, Alert, Animated, ImageBackground, TouchableWithoutFeedback, Easing } from 'react-native';
// import Home from './Screens/Home'
// import Login from './Screens/Login';
// import SignUp from './Screens/SignUp';
// import DashboardForUser from './Screens/DashboardForUser';
import SubCategory from './Screens/SubCategory';
// import OrderDataForm from './Screens/OrderSendDataForm';
// import OrderSent from './Screens/OrderSent';
// import ProfileScreen from './Screens/UserProfileScreen';
// import OrdersScreen from './Screens/OrdersScreen';
import OrderList from './Screens/OrderListScreen';
// import ActiveOrder from './Screens/ActiveOrder';
// import DeliverScreen from './Screens/DeliverScreen';
// import RiderProfileScreen from './Screens/RiderProfileScreen';
import { Navigator, NavigatorForLogin, NavigatorForRider } from './Component/Config/Navigator';
// import shortid from 'shortid'
// import BackgroundTimer from 'react-native-background-timer';
import AdminScreen from './Screens/AdminScreen';
import firebase from './Component/Config/Firebase'
import Map from './Screens/OrderSendDataForm/Map';
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location';
import { Spinner } from 'native-base';
import { Provider } from 'react-redux';
import { configureStore } from './Component/Config/Store';
import { Video } from 'expo-av';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      isAuthanticated: false,
      userType: null,
      data: [],
      location: null,
      locationAdress: null,
      x: {},
      user: null,
      userDetails: {},
      isLoading: true,
      myActiveOrders: {},
      myActiveOrdersArr: [],
      allOrders: []
    }
    this.gettingRealTime = this.gettingRealTime.bind(this)
    this.Animation = new Animated.ValueXY({ x: 10, y: 250 })
    this.spinValue = new Animated.Value(0)
  }

  _moveBall = () => {
    Animated.spring(this.Animation, {
      toValue: { x: 250, y: 10 },
      // delay: 2000,
    }).start()
  }

  login = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user)
        this.setState({ user })
      })
      .catch((err) => alert(err))
  }

  skipForLogin = () => {
    this.setState({ userType: 'Customer' })

  }

  checkSignIn = () => {
    const { myActiveOrdersArr, allOrders } = this.state
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // store.dispatch(watchPersonData(user.uid))
        this.gettingRealTime(user)

      }
    })
  }

  gettingRealTime(user) {
    const { myActiveOrdersArr, allOrders } = this.state
    // console.log(" myActiveOrdersArr, allOrders ")

    user && firebase.database().ref(`/users/${user.uid}`).on('child_added', snapShot => {
      let details = snapShot.val()
      firebase.database().ref('/orders/').on("child_added", snapShot => {
        let value = snapShot.val()
        value.key = snapShot.key
        allOrders.push(value)


        // store.dispatch(watchUserActiveList(allOrders))
        this.setState({ allOrders })
        // console.log(value.senderId === user.uid && value.status === "pendding")
        myActiveOrdersArr.push(value)
        // console.log(value)


        // store.dispatch({ type: 'updateList', myActiveOrdersArr })

        this.setState({ myActiveOrders: value, myActiveOrdersArr })
        // let objs = {myActiveOrders: value, myActiveOrdersArr}

      })
      this.setState({ isAuthanticated: true, user, userDetails: details, userType: details.userType })
    })
    // setTimeout(() => this.gettingRealTime(), 1500)
  }

  signOut = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout!",
      [{
        text: 'ok', onPress: () => {
          firebase.auth().signOut()
            .then((user) => {
              // console.log(user)
              this.setState({ isAuthanticated: false, userType: '', user: user })
            })
        }
      }, {
        text: 'cancel'
      }]
    )

  }

  componentDidMount = () => {
    //   setTimeout(() => {
    //     this.setState({ isLoading: false })
    //   }, 4000)
    //   this.spin()

    const { data } = this.state;


    firebase.database().ref('/data/').on('child_added', snap => {
      let values = snap.val()
      data.push(values)
      this.setState({ data, isLoading: false })
    })
  }

  spin() {
    this.Animation.setValue({ x: 10, y: 250 })
    Animated.timing(
      this.Animation,
      {
        toValue: { x: 250, y: 250 },
        duration: 4000,
        easing: Easing.linear
      }
    ).start(() => this.spin())
  }

  UNSAFE_componentWillMount = () => {
    // const { data } = this.state;

    this.checkSignIn()

    // firebase.database().ref('/data/').on('child_added', snap => {
    //   let values = snap.val()
    //   data.push(values)
    //   this.setState({ data })
    // })

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});

    let locationAdress = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude })
    this.setState({ location, locationAdress, x: location.coords });
  };

  render() {
    const { isAuthanticated, userType, userDetails } = this.state
    // console.log(this.state.seconds_Counter)
    if (!this.state.isLoading) {
      return (
        <Provider store={configureStore()} >
          <View style={styles.container}>
            {!isAuthanticated && (userType === 'Customer' || !userType) && <NavigatorForLogin screenProps={{ login: this.login, skipForLogin: this.skipForLogin, data: this.state.data }} />}
            {isAuthanticated && userType === 'Rider' && <NavigatorForRider screenProps={{ data: this.state.data, user: this.state.user, userDetails: userDetails, signOut: this.signOut }} />}
            {isAuthanticated && userType === 'Customer' && <Navigator
              screenProps={{
                data: this.state.data,
                user: this.state.user,
                userDetails: userDetails,
                signOut: this.signOut,
                myActiveOrders: this.state.myActiveOrders,
                myActiveOrdersArr: this.state.myActiveOrdersArr
              }}
            />}
            {/* <OrderList /> */}
          </View>
        </Provider>
      );
    } else {
      return <Spinner style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} />
      // <Video
      //   source={require('./assets/bike-animate.mp4')}
      //   rate={1.0}
      //   // volume={1.0}
      //   isMuted={true}
      //   resizeMode="stretch"
      //   shouldPlay
      //   isLooping
      //   style={{ width: '100%', height: '100%' }}
      // />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  tennisBall: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'greenyellow',
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  button: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  buttonText: {
    fontSize: 24,
    color: '#333',
  }
});
