import React, { Component } from 'react';
import { ListView } from 'react-native';
import { Container, Header, Content, Button, Icon, List, ListItem, Text, View } from 'native-base';
import firebase from '../Config/Firebase';
import { connect } from 'react-redux';

const datas = [
    'Simon Mignolet',
    'Nathaniel Clyne',
    'Dejan Lovren',
    'Mama Sakho',
    'Alberto Moreno',
    'Emre Can',
    'Joe Allen',
    'Phil Coutinho',
];

function mapStateToProps(state) {
    return { list: state.list }
}

function mapDispatchToProps(dispatch) {
    return {
        updateList: (value) => dispatch({ type: 'updateList', value })
    }
}

class SwipeableListExample extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            basic: true,
            listViewData: datas,
            selected: [],
            updatedList: []
        };
    }

    componentWillMount = () => {
        this.updateActiveOrdersList()
    }

    // componentWillReceiveProps = (a, b) => {
    //     console.log('a', a)
    // }

    updateActiveOrdersList = () => {
        const { datas } = this.props
        // console.log('data from willMount', datas)
        this.setState({ datas })
        // const { user } = this.props.screenProps
        // const { activeOrderArr } = this.state
        // // console.log(user)
        // let index = list.findIndex(x => x.isAccepted === true && x.accetedUserId === user.uid)
        // console.log(index)
        // if (index !== -1) {
        //     activeOrderArr.push(list[index])
        //     this.setState({ activeOrderArr })
        // }
    }

    pickData(data, secId, rowId, rowMap) {
        const { datas, updatedList } = this.state
        const { orderDetails } = this.props
        // console.log('secId', this.props)
        rowMap[`${secId}${rowId}`].props.closeRow();
        firebase.database().ref(`/orders/${orderDetails.key}/orderDetails/orderedItems/${rowId}/`).update({ isPicked: data.isPicked === true ? false : true, notInStock: false })
        datas[rowId].isPicked = !data.isPicked
        datas[rowId].notInStock = false

        // let index = list.findIndex(x => x.accetedUserId === this.props.user.uid)
        //     console.log(list[index])
        firebase.database().ref('/orders/').on('child_added', snapShot => {
            let orders = snapShot.val()
            updatedList.push(orders)
            // console.log(updatedList)
            this.props.updateList(updatedList)
        })

        this.setState({ datas })
    }

    dataNotInStock = (data, secId, rowId, rowMap) => {
        const { datas } = this.state
        const { orderDetails, list } = this.props
        // console.log(secId, rowId)
        rowMap[`${secId}${rowId}`].props.closeRow();
        firebase.database().ref(`/orders/${orderDetails.key}/orderDetails/orderedItems/${rowId}/`).update({ notInStock: data.notInStock === true ? false : true, isPicked: false })
        datas[rowId].notInStock = !data.notInStock
        datas[rowId].isPicked = false

        // console.log(list)


        this.setState({ datas })
    }

    render() {
        const { selected } = this.state
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        // console.log(this.props.list, 'from List')
        if (this.props.datas) {
            return (
                <List
                    leftOpenValue={75}
                    rightOpenValue={-75}
                    dataSource={this.ds.cloneWithRows(this.state.datas)}
                    // disableRightSwipe
                    disableLeftSwipe={this.props.disableLeft}
                    disableRightSwipe={this.props.disableRight}
                    renderRow={(data, index, i, rowMap, h) => {
                        // console.log(data)
                        return <ListItem onLongPress={!this.props.disableRight && (_ => this.pickData(data, index, i, rowMap))} onPress={!this.props.disableRight && (() => rowMap[`${index}${i}`].props.openRightRow())} style={(data.isPicked && { backgroundColor: 'green', opacity: 0.4 }) || (data.notInStock && { backgroundColor: 'yellow', opacity: 0.4 })} >
                            <View style={{ display: 'flex', flexDirection: 'row', margin: 5, borderColor: 'black', borderWidth: 1, padding: 10, }} >
                                <View style={{ width: '10%' }} ><Text style={{ fontSize: 15, color: '#000', marginLeft: 10 }} >{Number(i) + 1}.</Text></View>
                                <View style={{ width: '40%' }} ><Text style={{ fontSize: 15, color: '#000', marginLeft: 10 }} >{data.mainItemName}</Text></View>
                                <View style={{ width: '30%' }} ><Text style={{ fontSize: 15, color: '#000' }} >{data.quantityTitle}</Text></View>
                                <View style={{ width: '20%' }} ><Text style={{ fontSize: 15, color: '#000' }} >{data.wieght}gm</Text></View>
                            </View>
                        </ListItem>
                    }}
                    renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                        <Button full success={!data.isPicked} danger={data.isPicked} onPress={_ => this.pickData(data, secId, rowId, rowMap)}>
                            {data.isPicked ? <Icon name="times" type="FontAwesome" /> : <Icon active name="check" type="FontAwesome" />}
                        </Button>}

                    renderLeftHiddenRow={(data, secId, rowId, rowMap) =>
                        <Button full warning={!data.notInStock} danger={data.notInStock} onPress={_ => this.dataNotInStock(data, secId, rowId, rowMap)}>
                            {data.notInStock ? <Icon name="times" type="FontAwesome" /> : <Icon active name="exclamation-triangle" type="FontAwesome" />}
                        </Button>}

                />
            );
        } else { return <View /> }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipeableListExample)