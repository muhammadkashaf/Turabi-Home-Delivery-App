import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, Modal, TouchableHighlight } from 'react-native';
import { Icon, Button } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import firebase from '../../Component/Config/Firebase';
import { ListItem, Avatar } from 'react-native-elements';
import { Video } from 'expo-av';
import { connect } from 'react-redux'
import { watchUserActiveList } from '../../Component/Config/Store';
import { fetchAllStudents } from '../../Component/Config/actions/getAllProducts'
import CountDown from 'react-native-countdown-component';
import moment from 'moment';

const mapStateToProps = (state) => {
    return {
        personData: state.personData,
        list: state.list
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        // watchActiveOrder: () => dispatch(watchUserActiveList())
    };
}

class DashboardForUser extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [

            ],
            myActiveOrders: null
        }
        // this.picked = pi
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    componentDidMount = () => {
        fetchAllStudents()
        this.state.myActiveOrders && this.dateTimer()
        firebase.database().ref('/orders/').on('child_added', snapShot => {
            let allOrders = snapShot.val()
            if (this.props.screenProps.user) {
                if (allOrders.senderId === this.props.screenProps.user.uid && allOrders.status === 'pendding') {
                    this.setState({ myActiveOrders: allOrders })
                }
            }
        })
    }

    componentWillMount = () => {
        fetchAllStudents()
        // const { myActiveOrders } = this.state
        // this.props.screenProps.user && this.updateList()
        this.setState({ data: this.props.screenProps.data })

        firebase.database().ref('/orders/').on('child_added', snapShot => {
            let allOrders = snapShot.val()
            if (this.props.screenProps.user) {
                if (allOrders.senderId === this.props.screenProps.user.uid && allOrders.status === 'pendding') {
                    this.setState({ myActiveOrders: allOrders })
                }
            }
        })

        firebase.database().ref('/orders/').on('child_changed', snapShot => {
            let allOrders = snapShot.val()
            if (this.props.screenProps.user) {
                if (allOrders.senderId === this.props.screenProps.user.uid && allOrders.status === 'pendding') {
                    this.setState({ myActiveOrders: allOrders })
                }
            }
        })

    }

    // componentDidUpdate = () => {
    //     firebase.database().ref('/orders/').on('child_added', snapShot => {
    //         let allOrders = snapShot.val()
    //         if (this.state.myActiveOrders) {
    //             if (allOrders.senderId === this.props.screenProps.user.uid && allOrders.status === 'pendding') {
    //                 let ind = allOrders.orderDetails.orderedItems.findIndex(x => x.isPicked === this.state.myActiveOrders.isPicked || x.notInStock === this.state.myActiveOrders.notInStock)
    //                 if (ind !== -1) {
    //                     this.setState({ myActiveOrders: allOrders })
    //                 }
    //             }
    //         }
    //     })
    // }

    updateList = () => {

    }

    dateTimer = () => {
        var that = this;
        console.log(moment(), new Date())
        //We are showing the coundown timer for a given expiry date-time
        //If you are making an quize type app then you need to make a simple timer
        //which can be done by using the simple like given below
        //that.setState({ totalDuration: 30 }); //which is 30 sec

        var date = moment().date(this.state.myActiveOrders.startDate)
            .utcOffset('+05:00')
            .format('YYYY-MM-DD hh:mm:ss');
        //Getting the current date-time with required formate and UTC   

        var expirydate = this.state.myActiveOrders.endDate;//You can set your own date-time
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

    renderModal = () => {
        const { myActiveOrders } = this.state
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setState({ modalVisible: !this.state.modalVisible })
                }}>
                <View style={{ marginTop: 22 }}>
                    <ScrollView>
                        <View>
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
                            {/* <Text style={{ fontSize: 20 }}>Your Selected Items Are</Text> */}
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black' }} >
                                <Text style={{ width: '40%', fontWeight: 'bold' }} >Name</Text>
                                <Text style={{ width: '20%', fontWeight: 'bold' }} >Weight</Text>
                                <Text style={{ width: '20%', fontWeight: 'bold' }} >Quantity</Text>
                                <Text style={{ width: '20%', fontWeight: 'bold' }} >Prize</Text>
                            </View>

                            {this.state.myActiveOrders.orderDetails.orderedItems.map((value, index) => {
                                return (
                                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', padding: 10, borderBottomColor: 'black', borderBottomWidth: 1 }} >
                                        <Text style={{ width: '40%' }} >{value.quantityTitle}</Text>
                                        <Text style={{ width: '20%' }} >{value.wieght >= 1000 ? `${value.wieght / 1000} kg` : `${value.wieght} gm`}</Text>
                                        <Text style={{ width: '20%' }} >{value.quantity}</Text>
                                        <Text style={{ width: '20%' }} >{value.prize}</Text>
                                    </View>
                                )
                            })}
                            {/* <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black' }} >
                                <Text style={{ width: '70%', fontWeight: 'bold' }} >Total Weight</Text>
                                <Text style={{ width: '30%' }} >{this.state.totalWeight && this.state.totalWeight}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black' }} >
                                <Text style={{ width: '70%', fontWeight: 'bold' }} >Service Charges (<Text style={{}} >A/c to Weight</Text>)</Text>
                                <Text style={{ width: '30%' }} >{this.state.serviceCharges && this.state.serviceCharges}</Text>
                            </View> */}
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black', borderBottomWidth: 2 }} >
                                <Text style={{ width: '70%', fontWeight: 'bold' }} >Total Expected Amount</Text>
                                <Text style={{ width: '30%' }} >{myActiveOrders.orderDetails.totalPrice}</Text>
                            </View>
                            <View style={{ alignSelf: 'center', marginTop: '20%', borderColor: '#000', borderWidth: 1 }}>
                                <Text style={{ fontSize: 30 }} >Your Code: <Text style={{ fontSize: 25, fontWeight: 'bold', alignSelf: 'center' }} >{this.state.myActiveOrders.token}</Text></Text>
                                {/* <Text style={{ fontSize: 30, fontWeight: 'bold', alignSelf: 'center' }} >{this.props.navigation.state.params.token}</Text> */}
                            </View>
                            <TouchableHighlight
                                style={{ marginTop: 10 }}

                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}>
                                <Button danger full onPress={() => this.setModalVisible(!this.state.modalVisible)} >
                                    <Text>Close</Text>
                                </Button>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    render() {
        let length = this.state.data.length
        // console.log(this.state.myActiveOrders, "hhg")
        if (!this.state.modalVisible) {
            return (
                <View style={styles.container}>
                    <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >
                        <View style={{ width: '100%' }} >
                            <Video
                                source={require('../../assets/video-home.mp4')}
                                rate={0.8}
                                // volume={1.0}
                                isMuted={true}
                                resizeMode="cover"
                                shouldPlay
                                isLooping
                                style={{ width: '100%', height: 200 }}
                            />
                        </View>
                        {length > 0 ? <ScrollView>
                            <View style={{
                                marginTop: "10%",
                                height: '100%'
                            }} >
                                <FlatList
                                    data={this.state.data}
                                    renderItem={({ item, index }) => (
                                        <View style={{ flex: 1, flexDirection: 'column', margin: 1, alignItems: 'center', marginTop: 10 }}>
                                            <TouchableOpacity style={{ margin: 1, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('SubCategory', { data: this.state.data })}>
                                                <Image style={styles.imageThumbnail} source={{ uri: item.categoryIcon }} />
                                                <Text style={styles.text} >{item.categoryTitle}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    numColumns={2}
                                    keyExtractor={(item, index) => index}

                                />
                            </View>
                        </ScrollView> : <Text style={{ fontSize: 30, alignSelf: 'center' }} >Loading...</Text>}

                        {this.state.myActiveOrders && <View style={{ position: 'absolute', right: 10, bottom: '15%', backgroundColor: '#fff', padding: 10, borderRadius: 100, shadowColor: '#000', shadowOffset: { height: 4, width: 4 }, shadowOpacity: .5, shadowRadius: 10 }} >
                            <Icon onPress={() => this.setModalVisible(!this.state.modalVisible)} name="history" type="FontAwesome" style={{ fontSize: 30 }} />
                        </View>}

                        {this.props.screenProps.user && <View style={{ backgroundColor: '#fff', width: '100%', borderColor: 'black', borderWidth: 1 }} >
                            {/* <TouchableOpacity style={{ alignSelf: 'center' }} > */}
                            {this.props.screenProps.user && <View><Avatar onPress={() => this.props.navigation.navigate("ProfileScreen")} containerStyle={{ alignSelf: 'center' }} rounded source={{ uri: this.props.screenProps.user.photoURL }} /></View>
                                // <ListItem
                                //     leftAvatar={{ source: { uri: this.props.screenProps.user.photoURL } }}
                                //     title={this.props.screenProps.user.displayName}
                                //     onPress={() => this.props.navigation.navigate("ProfileScreen")}
                                //     rightTitle={<Button danger block onPress={() => this.props.screenProps.signOut()} ><Text>Logout</Text></Button>}
                                // />
                            }
                            {/* </TouchableOpacity> */}
                        </View>}
                    </ImageBackground>
                </View>
            );
        } else {
            return <View>{this.renderModal()}</View>
        }
    }
}

export default DashboardForUser
// export default connect(mapStateToProps, mapDispatchToProps)(DashboardForUser)

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
        height: 150,
        width: 150,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { height: 4, width: 4 },
        // elevation: 4,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        // margin: 15,
        padding: 15
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        textShadowColor: '#000',
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 2,
        shadowOpacity: 0.5,
        // margin: 10,
        padding: 5
        // textShadowOpacity: 2
    }
});