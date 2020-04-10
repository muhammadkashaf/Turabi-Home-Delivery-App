import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, Platform, CameraRoll } from 'react-native';
import { Icon, Button, Item, Input, Label } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import { takeSnapshotAsync, captureScreen } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import * as Permissions from 'expo-permissions';
import { NavigationActions } from 'react-navigation';

export default class OrderSent extends React.Component {
    constructor() {
        super()
        this.state = {
            map: false
        }
    }

    takeShot = async () => {
        let photo = await captureScreen()
        // console.log(photo)

        this.setState({ photo })
        CameraRoll.saveToCameraRoll(photo, 'photo')
            .then((i) => console.log(i))
            .catch((err) => console.log(err))
    }

    async componentDidMount() {
        this.props.orderObj && this.dateTimer()

        const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            // return Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        } else {
            throw new Error('CAMERA_ROLL permission not granted');
        }
    }

    dateTimer = () => {
        var that = this;
        console.log(moment(), new Date())
        //We are showing the coundown timer for a given expiry date-time
        //If you are making an quize type app then you need to make a simple timer
        //which can be done by using the simple like given below
        //that.setState({ totalDuration: 30 }); //which is 30 sec

        var date = moment().date(this.props.orderObj.startDate)
            .utcOffset('+05:00')
            .format('YYYY-MM-DD hh:mm:ss');
        //Getting the current date-time with required formate and UTC   

        var expirydate = this.props.orderObj.endDate;//You can set your own date-time
        //Let suppose we have to show the countdown for above date-time 

        var diffr = moment.duration(moment(expirydate).diff(moment(date)));
        //difference of the expiry date-time given and current date-time

        var hours = parseInt(diffr.asHours());
        var minutes = parseInt(diffr.minutes());
        var seconds = parseInt(diffr.seconds());

        var d = hours * 60 * 60 + minutes * 60 + seconds;
        //converting in seconds

        that.setState({ totalDuration: d });
        //Settign up the duration of countdown in seconds to re-render
    }

    render() {

        return (
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >
                    <View style={{ width: '100%', alignContent: 'center', alignItems: 'center', marginTop: "5%" }} >
                        <Image source={require('../../assets/LOGO-01.png')} style={{ width: 180, height: 100 }} />
                        <Divider />
                    </View>

                    <View style={{ marginTop: 20 }} >
                        <View style={{ alignSelf: 'center', marginTop: 20 }}>
                            <Text style={{ color: '#fff', fontSize: 30 }} >Order will be deliver in</Text>
                        </View>
                        <View style={styles.MainContainer} >
                            {/* <Text style={{ alignSelf: 'center' }} >00:00</Text> */}
                            <CountDown
                                until={this.state.totalDuration}
                                onFinish={this.onDoneCountdown}
                                onPress={this.onPressCountdown}
                                size={20}
                                timeToShow={["H", "M", "S"]}
                            />
                        </View>
                        <View style={{ alignSelf: 'center', marginTop: '20%', borderColor: '#000', borderWidth: 1 }}>
                            <Text style={{ fontSize: 30 }} >Your Code: <Text style={{ fontSize: 25, fontWeight: 'bold', alignSelf: 'center' }} >{this.props.token}</Text></Text>
                            {/* <Text style={{ fontSize: 30, fontWeight: 'bold', alignSelf: 'center' }} >{this.props.navigation.state.params.token}</Text> */}
                        </View>
                    </View>
                    <Button rounded style={{ alignSelf: 'center', marginTop: 30, padding: 10 }}  onPress={this.takeShot} ><Text style={{ color: '#fff' }}>Take a Screen shot</Text></Button>
                    <Button rounded style={{ alignSelf: 'center', marginTop: 30, padding: 10 }}  onPress={() => this.props.goToTop()} ><Text style={{ color: '#fff' }}>Another Order</Text></Button>
                    <Button rounded style={{ alignSelf: 'center', marginTop: 30, padding: 10 }}  onPress={() => this.props.goToTop()} ><Text style={{ color: '#fff' }}>Order Completed</Text></Button>

                    <View style={{ position: 'absolute', bottom: 5, alignSelf: 'center' }} >
                        <Text style={{ color: '#fff', fontSize: 30, fontWeight: 'bold', alignSelf: 'center' }} >Thank You</Text>
                    </View>

                    {this.state.photo && <View style={{ position: 'absolute', right: 0, bottom: 0 }} >
                        <ScrollView horizontal scrollEnabled onMomentumScrollBegin={() => this.setState({ photo: null })} onMomentumScrollEnd={() => this.setState({ photo: null })} >
                            <Image source={{ uri: this.state.photo }} style={{ height: 200, width: 100 }} />
                        </ScrollView>
                    </View>}
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
    },
    MainContainer: {
        flex: 1,
        paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%'
    }
});
