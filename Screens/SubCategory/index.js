import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, Modal, TouchableHighlight, Alert } from 'react-native';
import { Tab, Tabs, ScrollableTab, Button, Item, Input, Right, TabHeading, Spinner } from 'native-base';
import { SearchBar, Divider, Icon, CheckBox, ListItem } from 'react-native-elements';
import NumericInput from 'react-native-numeric-input'
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable'
import firebase from '../../Component/Config/Firebase'
import { ScrollView } from 'react-native-gesture-handler';

export default class SubCategory extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [

            ],
            search: false,
            checked: false,
            selectedArr: [],
            activeSections: [],
            totalAmount: '',
            modalVisible: false,
            amount: 0,
            initialPage: 1, activeTab: 1,
            allDataForFilter: [],
            result: [],
            searchText: '',
            addModalVisible: false,
            unknownItemQuantity: '',
            wieght: 0,
            unknownItemWieght: '',
            Loading: true
        }
        this._tabs = null;
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    addsetModalVisible(visible) {
        this.setState({ addModalVisible: visible });
    }

    updateSearch = search => {
        this.setState({ search });
    };

    search = (value) => {
        // console.log(value)
        this.setState({ searchText: value })
        const { data, search, allDataForFilter } = this.state

        data.map((allData) => {
            let filterData = allData.categoryItems
            filterData.map(d => {
                let index = allDataForFilter.findIndex(x => x.itemName === d.itemName)
                if (index === -1) {
                    allDataForFilter.push(d)
                    this.setState({ allDataForFilter })
                }

                const result = allDataForFilter.filter(val => {
                    // console.log('value from val', val)
                    const lowerItem = val.itemName.toLowerCase();
                    const lowerText = value.toLowerCase();
                    return lowerItem.substring(0, lowerText.length).indexOf(lowerText) !== -1
                })
                // console.log(result)
                value !== '' ?
                    this.setState({
                        // searchText: text,
                        result,
                        search: true
                    }) :
                    this.setState({ result: [], search: false })
            })

        })
    }

    UNSAFE_componentWillMount = () => {
        // this.getData()
        this.setState({ data: this.props.screenProps.data })

        setTimeout(() => {
            this.setState({ Loading: false })
        }, 2000);
    }

    // getData = () => {
    //     // const { data } = this.state
    //     let data = []
    //     firebase.database().ref('/data/').on('child_added', snap => {
    //         let values = snap.val()
    //         data.push(values)
    //         this.setState({ data })
    //     })
    // }

    valueSelected = (value, index, mainIndex, middle) => {
        const { data, selectedArr, result, amount } = this.state;

        // if (data[mainIndex].categoryItems[middle].quantityType[index].quantity) {
        data[mainIndex].categoryItems[middle].quantityType[index].isSelected = !value.isSelected
        data[mainIndex].categoryItems[middle].quantityType[index].isPicked = false
        data[mainIndex].categoryItems[middle].quantityType[index].quantity = 1

        var ind = selectedArr.findIndex((x) => x.quantityTitle === data[mainIndex].categoryItems[middle].quantityType[index].quantityTitle && x.mainItemName === data[mainIndex].categoryItems[middle].quantityType[index].mainItemName && x.wieght === data[mainIndex].categoryItems[middle].quantityType[index].wieght)

        if (ind === -1) {
            selectedArr.push(data[mainIndex].categoryItems[middle].quantityType[index])
            // console.log(selectedArr)
            this.setState({ selectedArr })

            var wieght1 = 0
            var result1 = 0;
            let quantityArr = []
            let prizesArr = []
            let weightsArr = []
            for (var i = 0; i < selectedArr.length; i++) {
                if (selectedArr[i].prize !== "unknown") {
                    quantityArr.push(selectedArr[i].quantity)
                    prizesArr.push(selectedArr[i].prize)
                    weightsArr.push(selectedArr[i].wieght)
                }
            }

            for (var i = 0; i < quantityArr.length; i++) {
                result1 += quantityArr[i] * prizesArr[i];
            }

            for (var i = 0; i < quantityArr.length; i++) {
                wieght1 += quantityArr[i] * weightsArr[i];
            }
            // console.log(wieght)

            if (0 <= wieght1 && wieght1 <= 10000) {
                this.setState({ serviceCharges: 150 })
            }

            if (10000 <= wieght1 && wieght1 <= 30000) {
                this.setState({ serviceCharges: 250 })
            }

            if (30000 <= wieght1 && wieght1 <= 50000) {
                this.setState({ serviceCharges: 350 })
            }

            if (50000 <= wieght1 && wieght1 <= 80000) {
                this.setState({ serviceCharges: 400 })
            }

            if (80000 <= wieght1 && wieght1 <= 100000) {
                this.setState({ serviceCharges: 450 })
            }

            if (100000 <= wieght1 && wieght1 <= 150000) {
                this.setState({ serviceCharges: 550 })
            }

            if (150000 <= wieght1 && wieght1 <= 200000) {
                this.setState({ serviceCharges: 850 })
            }


            if (wieght1 >= 1000) {
                let totalWeight = wieght1 / 1000
                this.setState({ totalWeight: `${totalWeight} Kg` })
            } else {
                this.setState({ totalWeight: `${wieght1} grams` })
            }
            // console.log('result in change', result)
            if (result1 > 0) {
                var min = 100;
                var famount = result1;
                // console.log(amount)
                var x = famount / 100
                var xInt = Math.trunc(x)
                var max = (xInt * 100) + 100
                // console.log("from first console", xInt * min + '-' + max)
                this.setState({ totalAmount: `${xInt * min + '-' + max}`, amount: famount })
                // alert(result)
            } else { this.setState({ totalAmount: '' }) }

            this.setState({ wieght1 })
        } else {

            if (selectedArr.length > 1) {
                const newAmount = selectedArr[ind].quantity * selectedArr[ind].prize
                var min = 100;
                var updatedAmount = amount - newAmount;
                // console.log(amount)
                var x = updatedAmount / 100
                var xInt = Math.trunc(x)
                var max = (xInt * 100) + 100
                // console.log("from first console", xInt * min + '-' + max)
                this.setState({ totalAmount: `${xInt * min + '-' + max}`, amount: updatedAmount })

                const newWeight = selectedArr[ind].quantity * selectedArr[ind].wieght
                const updatedWeight = this.state.wieght - newWeight;

                if (updatedWeight >= 1000) {
                    let totalWeight = updatedWeight / 1000
                    this.setState({ totalWeight: `${totalWeight} Kg` })
                } else {
                    this.setState({ totalWeight: `${updatedWeight} grams` })
                }

                if (0 <= updatedWeight && updatedWeight <= 10000) {
                    this.setState({ serviceCharges: 150 })
                }

                if (10000 <= updatedWeight && updatedWeight <= 30000) {
                    this.setState({ serviceCharges: 250 })
                }

                if (30000 <= updatedWeight && updatedWeight <= 50000) {
                    this.setState({ serviceCharges: 350 })
                }

                if (50000 <= updatedWeight && updatedWeight <= 80000) {
                    this.setState({ serviceCharges: 400 })
                }

                if (80000 <= updatedWeight && updatedWeight <= 100000) {
                    this.setState({ serviceCharges: 450 })
                }

                if (100000 <= updatedWeight && updatedWeight <= 150000) {
                    this.setState({ serviceCharges: 550 })
                }

                if (150000 <= updatedWeight && updatedWeight <= 200000) {
                    this.setState({ serviceCharges: 850 })
                }

            } else { this.setState({ totalAmount: '', serviceCharges: '', totalWeight: '' }) }

            data[mainIndex].categoryItems[middle].quantityType[index].quantity = 0
            selectedArr.splice(ind, 1)
            this.setState({ selectedArr })

        }

        if (result.length > 0) {
            this.setState({ result })
        }

        this.setState({ data })
        // if (data[mainIndex].categoryItems[middle].quantityType[index].isSelected) {
        //     selectedArr.push(value)
        //     this.setState({ selectedArr })
        // for (var i in selectedArr) {
        //     if (totalAmount !== 0) {
        //         var min = 100;
        //         var amount = 34590;
        //         var x = amount / 100
        //         var xInt = Math.trunc(x)
        //         var max = (xInt * 100) + 100
        //         console.log(xInt * min + '-' + max)
        //         this.setState({ totalAmount: totalAmount + (selectedArr[i].prize * selectedArr[i].quantity) })
        //     } else {
        //         this.setState({ totalAmount: selectedArr[i].prize * selectedArr[i].quantity })
        //     }
        //     // console.log(selectedArr[i].prize * selectedArr[i].quantity)
        // }
        //     } else if (!data[mainIndex].categoryItems[middle].quantityType[index].isSelected) {
        //         for (var i in selectedArr) {
        //             if (selectedArr[i].isSelected == false) {
        //                 this.setState({ totalAmount: totalAmount - (selectedArr[i].prize * selectedArr[i].quantity) })
        //                 selectedArr.splice(i, 1);
        //                 // break;
        //                 this.setState({ selectedArr })
        //             }
        //         }
        //     }
        // } else {
        //     Alert.alert('Please Select Quantity')
        // }



    }

    valueChange = (middle, mainIndex, index, value) => {
        const { data, selectedArr, totalAmount } = this.state
        data[mainIndex].categoryItems[middle].quantityType[index].quantity = value
        this.setState({ data })
        // console.log()
        var ind = selectedArr.findIndex((x) => x.quantityTitle === data[mainIndex].categoryItems[middle].quantityType[index].quantityTitle && x.mainItemName === data[mainIndex].categoryItems[middle].quantityType[index].mainItemName)

        var wieght = 0
        var result = 0;
        let quantityArr = []
        let prizesArr = []
        let weightsArr = []
        for (var i = 0; i < selectedArr.length; i++) {
            if (selectedArr[i].prize !== "unknown") {
                quantityArr.push(selectedArr[i].quantity)
                prizesArr.push(selectedArr[i].prize)
                weightsArr.push(selectedArr[i].wieght)
            }
        }

        for (var i = 0; i < quantityArr.length; i++) {
            result += quantityArr[i] * prizesArr[i];
        }

        for (var i = 0; i < quantityArr.length; i++) {
            wieght += quantityArr[i] * weightsArr[i];
        }
        // console.log(wieght)

        if (0 <= wieght && wieght <= 10000) {
            this.setState({ serviceCharges: 150 })
        }

        if (10000 <= wieght && wieght <= 30000) {
            this.setState({ serviceCharges: 250 })
        }

        if (30000 <= wieght && wieght <= 50000) {
            this.setState({ serviceCharges: 350 })
        }

        if (50000 <= wieght && wieght <= 80000) {
            this.setState({ serviceCharges: 400 })
        }

        if (80000 <= wieght && wieght <= 100000) {
            this.setState({ serviceCharges: 450 })
        }

        if (100000 <= wieght && wieght <= 150000) {
            this.setState({ serviceCharges: 550 })
        }

        if (150000 <= wieght && wieght <= 200000) {
            this.setState({ serviceCharges: 850 })
        }


        if (wieght >= 1000) {
            let totalWeight = wieght / 1000
            this.setState({ totalWeight: `${totalWeight} Kg` })
        } else {
            this.setState({ totalWeight: `${wieght} grams` })
        }
        // console.log('result in change', result)
        if (result > 0) {
            var min = 100;
            var amount = result;
            // console.log(amount)
            var x = amount / 100
            var xInt = Math.trunc(x)
            var max = (xInt * 100) + 100
            // console.log("from first console", xInt * min + '-' + max)
            this.setState({ totalAmount: `${xInt * min + '-' + max}`, amount })
            // alert(result)
        } else { this.setState({ totalAmount: '' }) }

        this.setState({ wieght })
    }

    // _renderSectionTitle = section => {
    //     return (
    //         <View style={styles.content}>
    //             <Text>{section.content}</Text>
    //         </View>
    //     );
    // };

    addUnknownitem = () => {
        const { selectedArr, unknownItemQuantity, searchText, unknownItemWieght } = this.state
        let obj = {
            isPicked: false,
            isSelected: true,
            mainItemName: searchText,
            prize: "unknown",
            quantityTitle: searchText,
            wieght: unknownItemWieght,
            quantity: unknownItemQuantity
        }

        if (unknownItemQuantity && searchText && unknownItemWieght) {
            var ind = selectedArr.findIndex((x) => x.quantityTitle === unknownItemQuantity && x.mainItemName === searchText)
            if (ind === -1) {
                selectedArr.push(obj)
                firebase.database().ref('/requestToAddItams/').push(obj)
                this.setState({ selectedArr, searchText: '', unknownItemQuantity: '', addModalVisible: false, search: false })
            } else { alert("item already exsists") }
        } else { alert("please fill the fields") }
    }

    _renderHeader = (section, index, isActive, sections) => {
        return (
            <Animatable.View
                duration={300}
                transition="backgroundColor"
                style={{
                    backgroundColor: (isActive ? 'transparent' : 'transparent'),
                    borderColor: 'black',
                    borderWidth: 1,
                    margin: 10,
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                <Animatable.Text style={{ fontWeight: 'bold', fontSize: 20, padding: 10 }}>{section.itemName}</Animatable.Text>
                <Right>
                    <Animatable.View duration={200} style={{ marginTop: '4%' }} >{isActive ? <Icon name="keyboard-arrow-up" /> : <Icon name="keyboard-arrow-down" />}</Animatable.View>
                </Right>
            </Animatable.View>
        );
    }

    _renderContent = (mainIndex, section, i, isActive, sections) => {
        // console.log(mainIndex, section, i, isActive, sections)
        return (
            <Animatable.View
                duration={300}
                transition="backgroundColor"
                style={{ backgroundColor: "transparent", borderColor: 'black', borderWidth: 1, margin: 10, padding: 10 }}>
                {/* <View> */}
                <Animatable.View style={{ width: '100%', display: "flex", flexDirection: "row" }}>
                    <Animatable.Text style={{ width: "60%" }} ></Animatable.Text>
                    <Animatable.Text style={{ width: '20%', fontWeight: 'bold', color: '#fff' }} >Quantity</Animatable.Text>
                    <Animatable.Text style={{ width: '20%', marginLeft: 5, fontWeight: 'bold', color: '#fff' }}>Select</Animatable.Text>
                </Animatable.View>
                {section.quantityType && section.quantityType.map((value, index) => {
                    return <Animatable.View style={{ width: '100%', display: "flex", flexDirection: "row", marginTop: 5, borderBottomColor: 'rgba(255,255,255, 0.3)', borderBottomWidth: 1, paddingVertical: 5 }} >
                        <Animatable.View style={{ width: "50%" }} >
                            <Animatable.Text style={{ marginLeft: 10 }} >{value.quantityTitle}</Animatable.Text>
                        </Animatable.View>
                        <Animatable.View style={{ width: "30%", alignItems: 'center' }} >
                            {value.isSelected ? <NumericInput
                                value={value.quantity}
                                onChange={this.valueChange.bind(this, i, mainIndex, index)}
                                onLimitReached={(isMax, msg) => alert(msg)}
                                totalWidth={70}
                                minValue={1}
                                valueType='real'
                                // maxValue={5}
                                rounded
                                textColor='#B0228C'
                                iconStyle={{ color: 'white' }}
                                rightButtonBackgroundColor='#EA3788'
                                leftButtonBackgroundColor='#E56B70' /> : <Text>{value.wieght > 999 ? (value.wieght / 1000) + "kg" : value.wieght + 'gm'}</Text>}
                        </Animatable.View>
                        <Animatable.View style={{ width: "20%" }} >
                            <CheckBox
                                // title='Click Here'
                                checked={value.isSelected}
                                containerStyle={{ padding: 0, margin: 0 }}
                                onPress={this.valueSelected.bind(this, value, index, mainIndex, i)}
                                checkedColor="green"
                            />
                        </Animatable.View>
                    </Animatable.View>
                })}
                {/* </View> */}
            </Animatable.View>
        );
    }

    _updateSections = activeSections => {
        // console.log('active', activeSections)
        this.setState({ activeSections });

    };



    renderModal = () => {
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
                            <Text style={{ fontSize: 20 }}>Your Selected Items Are</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black' }} >
                                <Text style={{ width: '40%', fontWeight: 'bold' }} >Name</Text>
                                <Text style={{ width: '20%', fontWeight: 'bold' }} >Weight</Text>
                                <Text style={{ width: '20%', fontWeight: 'bold' }} >Quantity</Text>
                                <Text style={{ width: '20%', fontWeight: 'bold' }} >Prize</Text>
                            </View>

                            {this.state.selectedArr.map((value, index) => {
                                return (
                                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', padding: 10, borderBottomColor: 'black', borderBottomWidth: 1 }} >
                                        <Text style={{ width: '40%' }} >{value.quantityTitle}</Text>
                                        <Text style={{ width: '20%' }} >{value.wieght >= 1000 ? `${value.wieght / 1000} kg` : `${value.wieght} gm`}</Text>
                                        <Text style={{ width: '20%' }} >{value.quantity}</Text>
                                        <Text style={{ width: '20%' }} >{value.prize}</Text>
                                    </View>
                                )
                            })}
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black' }} >
                                {/* <Text style={{ width: '70%', fontWeight: 'bold' }} >Total Weight</Text>
                                <Text style={{ width: '30%' }} >{this.state.totalWeight && this.state.totalWeight}</Text> */}
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black' }} >
                                <Text style={{ width: '50%', fontWeight: 'bold' }} >Total Weight</Text>
                                <Text style={{ width: '20%' }} ></Text>
                                <Text style={{ width: '30%' }} >{this.state.totalWeight && this.state.totalWeight}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black' }} >
                                <Text style={{ width: '50%', fontWeight: 'bold' }} >Service Charges (<Text style={{}} >A/c to Weight</Text>)</Text>
                                <Text style={{ width: '20%' }} ></Text>
                                <Text style={{ width: '30%' }} >{this.state.serviceCharges && this.state.serviceCharges}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', borderTopColor: 'black', borderWidth: 1, padding: 10, borderRightColor: 'black', borderBottomWidth: 2 }} >
                                <Text style={{ width: '50%', fontWeight: 'bold' }} >Total Expected Amount</Text>
                                <Text style={{ width: '20%' }} ></Text>
                                <Text style={{ width: '30%' }} >{this.state.totalAmount}</Text>
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
        const { result } = this.state
        // console.log("Render", this.state.amount)
        if (!this.state.modalVisible) {
            return (
                <View style={styles.container}>
                    <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >
                        <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                            <View style={{ left: 2, marginTop: 25, width: '20%' }} >
                                <Image source={require('../../assets/LOGO-01.png')} style={{ width: 80, height: 50 }} />
                            </View>
                            <View style={{ marginTop: 30, left: 10, width: '60%' }}>
                                <SearchBar
                                    placeholder="Search Here..."
                                    onChangeText={this.search}
                                    value={this.state.searchText}
                                    placeholderTextColor="#fff"
                                    searchIcon={{ color: '#fff' }}
                                    cancelIcon={{ color: '#fff' }}
                                    inputStyle={{ color: '#fff' }}
                                    onFocus={() => this.setState({ search: true })}
                                    onBlur={() => { if (this.state.allDataForFilter.length === 0) { this.setState({ search: false }) } }}
                                    onClear={() => this.setState({ search: false })}
                                    // cancelButtonProps={{ color: '#fff', buttonDisabledTextStyle: {color: '#fff' } }}
                                    inputContainerStyle={{ backgroundColor: "transparent", }}
                                    containerStyle={{ backgroundColor: 'transparent', width: '80%', borderBottomWidth: null, borderTopWidth: null }}
                                />
                            </View>
                            <View style={{ marginTop: 30, left: -40, width: '20%' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }} >Price</Text>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }} >{this.state.totalAmount && this.state.totalAmount}</Text>
                            </View>
                        </View>
                        <View>
                            <Divider />
                        </View>



                        {!this.state.search ? <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Tabs page={this.state.currentPage} renderTabBar={() => <ScrollableTab goToPage={this.props.navigation.state.params.initialPage} />} onChangeTab={({ i }) => this.setState({ currentPage: i })} tabBarBackgroundColor='transparent' >
                                {this.state.data.map((value, index) => {
                                    var sections = value.categoryItems
                                    return (
                                        <Tab heading={value.categoryTitle} activeTabStyle={{ backgroundColor: 'transparent' }} tabStyle={{ backgroundColor: 'transparent' }} style={{ backgroundColor: 'transparent', width: '100%' }}>
                                            <ScrollView>
                                                <View style={{ width: '100%' }}>
                                                    {this.state.Loading ? <Spinner /> : (sections ? <Accordion
                                                        sections={sections}
                                                        activeSections={this.state.activeSections}
                                                        renderSectionTitle={this._renderSectionTitle}
                                                        renderHeader={this._renderHeader}
                                                        renderContent={this._renderContent.bind(this, index)}
                                                        onChange={this._updateSections}

                                                    /> : <Text style={{ alignSelf: 'center', fontSize: 15, color: '#fff' }} >No Data Found</Text>)}
                                                </View>
                                            </ScrollView>
                                        </Tab>
                                    )
                                })}

                            </Tabs>

                        </View> : <View style={{ flex: 1 }} >
                                {result.length > 0 ? result.map((value, index) => {
                                    return (
                                        <Accordion
                                            sections={[value]}
                                            activeSections={this.state.activeSections}
                                            renderSectionTitle={this._renderSectionTitle}
                                            renderHeader={this._renderHeader}
                                            renderContent={this._renderContent.bind(this, index)}
                                            onChange={this._updateSections}

                                        />
                                    )
                                }) : (this.state.searchText !== '' && <View>
                                    <ListItem title={this.state.searchText} containerStyle={{ opacity: 0.6 }} rightTitle={<Button rounded onPress={() => this.addsetModalVisible(true)} block success ><Text>Add</Text></Button>} />
                                </View>
                                    )}
                            </View>}


                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.addModalVisible}

                            onRequestClose={() => {
                                // Alert.alert('Modal has been closed.');
                                this.setState({ addModalVisible: false })
                            }}>
                            <View style={{ marginTop: 22 }}>
                                <View>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setModalVisible(!this.state.addModalVisible);
                                            this.setState({ addModalVisible: false })
                                        }} style={{ position: 'absolute', left: 20 }} >
                                        <Icon name="arrow-back" />
                                    </TouchableHighlight>
                                </View>
                                <View style={{ marginTop: 25 }} ><Text style={{ fontSize: 25 }} >Item Name: {this.state.searchText}</Text></View>
                                <View style={{ marginTop: 20, justifyContent: 'space-between' }} >
                                    <Item bordered rounded >
                                        <Input onChangeText={(unknownItemWieght) => this.setState({ unknownItemWieght })} placeholder="Wieght only in gram" keyboardType="number-pad" />
                                    </Item>
                                    <Item bordered rounded style={{ marginTop: 10 }} >
                                        <Input onChangeText={(unknownItemQuantity) => this.setState({ unknownItemQuantity })} placeholder="quantity required" keyboardType="number-pad" />
                                    </Item>
                                </View>
                                <View style={{ marginTop: 20 }} >
                                    <Button onPress={this.addUnknownitem} block success><Text>Done</Text></Button>
                                </View>
                            </View>
                        </Modal>

                        <View>

                            {this.state.selectedArr.length > 0 && <Button full light onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }} >
                                <Text>{this.state.selectedArr.length !== 0 && "You Selected Some Items You can Check Or Edit Here"}</Text>
                            </Button>}
                        </View>
                        {
                            this.state.selectedArr.length > 0 && <Button transparent light style={{ width: '100%', alignItems: 'center', justifyContent: 'center', borderTopColor: '#ffff', borderWidth: 2 }} onPress={() => { this.props.navigation.navigate('OrderDataForm', { selectedData: this.state.selectedArr, totalAmount: this.state.totalAmount }); this.setState({ selectedArr: [], totalAmount: '', wieght: 0, amount: 0, activeSections: [] }), this.getData() }} >
                                <Text style={{ color: '#ffff', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }} >Done</Text>
                            </Button>
                        }
                    </ImageBackground >
                </View >
            );
        } else {
            return <View>{this.renderModal()}</View>
        }
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
    }
});
