import React, { Component } from 'react'
import { Text, View } from 'react-native'
import firebase from '../../../Component/Config/Firebase'
import { Header, ListItem, Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'native-base';

export default class Notification extends Component {
    constructor(props) {
        super(props)

        this.state = {
            requests: []
        }
    }

    componentWillMount() {
        const { requests } = this.state
        firebase.database().ref('/requestToAddItams/').on('child_added', snapShot => {
            let request = snapShot.val();
            request.key = snapShot.key
            requests.push(request)
            this.setState({ requests })
        })
    }

    added = (value, index) => {
        const { requests } = this.state
        requests.splice(index, 1)
        this.setState({ requests })
        firebase.database().ref(`/requestToAddItams/${value.key}/`).remove()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.toggleDrawer() }}
                    centerComponent={{ text: 'Notifications', style: { color: '#fff' } }}
                // rightComponent={{ icon: 'home', color: '#fff' }}
                />
                <ScrollView>
                    {this.state.requests.length > 0 ? <View>{this.state.requests.map((value, index) => {
                        return (
                            <View style={{ width: '100%' }}>
                                <ListItem
                                    title={value.mainItemName}
                                    rightTitle={<Button rounded block success onPress={() => this.added(value, index)} ><Text>Added</Text></Button>}
                                />
                                <Divider style={{ width: '90%', alignSelf: 'center' }} />
                            </View>
                        )
                    })}</View> : <Text style={{ alignSelf: 'center' }} >No Requests</Text>}
                </ScrollView>
            </View>
        )
    }
}
