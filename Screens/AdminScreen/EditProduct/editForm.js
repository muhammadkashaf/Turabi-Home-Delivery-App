import React from 'react';
import { StyleSheet, Text, View, Dimensions, Alert, Animated, Keyboard, UIManager, TextInput } from 'react-native';
// import firebase from '../../Component/Config/firebase'
import { Tab, Form, Tabs, Item, Icon, ScrollableTab, Button, Picker } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
// import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import firebase from '../../../Component/Config/Firebase'
import Accordion from 'react-native-collapsible/Accordion';
const { width: screenWidth } = Dimensions.get('window')
const { State: TextInputState } = TextInput;
import * as Animatable from 'react-native-animatable'
import { Header } from 'react-native-elements';

export default class EditingForm extends React.Component {

    constructor() {
        super()
        this.state = {
            categoryTitle: '',
            categoryIcon: '',
            item: '',
            subItem: '',
            prize: '',
            wieght: '',
            // feedbackType: '',
            // feedbackRelated: '',
            // feedbackText: '',
            isSelected: false,
            quantity: null,
            shift: new Animated.Value(0),
            data: null,
            error: false,
            activeSections: [],
            selectedItem: '',
            isValid: false,
            errors: false,
            allDataArr: [],
            selectedCategory: '',
            selectedDataObj: null,
            selectSub: ''
        }
    }

    sendForm1 = () => {
        const { data } = this.props
        const { selectedCategory } = this.state

        if (selectedCategory) {
            let index = data.findIndex(x => x.categoryTitle === selectedCategory)
            if (index !== -1) {
                this.setState({ selectedDataObj: data[index], error: false })
            }
        } else {
            this.setState({ error: true })
            alert("please Select")
        }
    }

    addSubCategory = () => {
        const { selectedDataObj, item, subItem, prize, wieght, isSelected, quantity, selectedItem } = this.state
        let obj = {
            mainItemName: selectedItem,
            quantityTitle: subItem,
            prize: prize,
            wieght: wieght,
            isSelected: isSelected,
            quantity: quantity
        }

        let categoryItemsArr = selectedDataObj.categoryItems
        if (subItem && prize && wieght) {
            let i = categoryItemsArr.findIndex(x => x.itemName === selectedItem)
            categoryItemsArr[i].quantityType.push(obj)
            this.setState({ selectedDataObj, prize: '', wieght: null, subItem: '' })
            // for (var i in categoryItemsArr) {
            //     if (categoryItemsArr[i].itemName === selectedItem) {
            //         categoryItemsArr[i].quantityType.push(obj)
            //         this.setState({ data, prize: '', wieght: null, subItem: '' })
            //     }
            // }
        } else { alert("please fill the fields") }

    }

    addItem = () => {
        const { data, item, selectedDataObj } = this.state
        let obj = {
            itemName: item,
            quantityType: []
        }
        if (!item) {
            alert("fields can't be empty")
        } else {
            var index = selectedDataObj.categoryItems.findIndex(x => x.itemName == item)
            if (index === -1) {
                selectedDataObj.categoryItems.push(obj);
                this.setState({ selectedDataObj, item: '' })
            }
            else alert("item already exists")
        }
    }

    removeItem = (index) => {
        const { selectedDataObj } = this.state
        Alert.alert(
            'Delete',
            'Are you sure you want to remove item!',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
                {
                    text: 'OK', onPress: () => {
                        selectedDataObj.categoryItems.splice(index, 1)
                        this.setState({ selectedDataObj })
                    }
                },

            ],
            { cancelable: false }
        )
    }

    send = () => {
        const { categoryTitle, categoryIcon, item, subItem, prize, isSelected, quantity, selectedDataObj } = this.state
        
        firebase.database().ref(`/data/${selectedDataObj.key}/`).update(selectedDataObj)
        this.setState({ selectedDataObj: null })
        this.props.goBack()
    }

    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }

    onNextStep = () => {
        if (this.state.selectedDataObj.categoryItems.length === 0) {
            this.setState({ errors: true });
        } else {
            this.setState({ errors: false, selectedItem: this.state.selectedDataObj.categoryItems[0].itemName });
        }
    };


    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    updateTitle = (index, title) => {
        // console.log(title, index)
        const { selectedDataObj, selectedItem } = this.state
        let mainIndex = selectedDataObj.categoryItems.findIndex(x => x.itemName === selectedItem)
        selectedDataObj.categoryItems[mainIndex].quantityType[index].quantityTitle = title
        this.setState({ selectedDataObj })
    }

    updateWieght = (index, wieght) => {
        // console.log(title, index)
        const { selectedDataObj, selectedItem } = this.state
        let mainIndex = selectedDataObj.categoryItems.findIndex(x => x.itemName === selectedItem)
        selectedDataObj.categoryItems[mainIndex].quantityType[index].wieght = wieght
        this.setState({ selectedDataObj })
    }

    updatePrize = (index, prize) => {
        // console.log(title, index)
        const { selectedDataObj, selectedItem } = this.state
        let mainIndex = selectedDataObj.categoryItems.findIndex(x => x.itemName === selectedItem)
        selectedDataObj.categoryItems[mainIndex].quantityType[index].prize = prize
        this.setState({ selectedDataObj })
    }

    deleteItem = (index) => {
        const { selectedDataObj, selectedItem } = this.state
        let mainIndex = selectedDataObj.categoryItems.findIndex(x => x.itemName === selectedItem)
        selectedDataObj.categoryItems[mainIndex].quantityType.splice(index, 1)
        this.setState({ selectedDataObj })
    }

    renderFirstForm = () => {
        return (
            <Form style={styles.container}>
                <Animated.View style={[styles.container, { transform: [{ translateY: this.state.shift }] }]}>
                    <Item picker regular style={{ borderColor: '#60CDF2', margin: 5, width: "80%" }}>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{ width: undefined }}
                            placeholder="Select Feedback Type"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.selectedCategory}
                            onValueChange={(selectedCategory) => this.setState({ selectedCategory })}
                        >
                            <Picker.Item label={"Select Category"} value={""} />
                            {this.props.data && this.props.data.map((value, index) => {
                                return <Picker.Item label={value.categoryTitle} value={value.categoryTitle} />
                            })}
                        </Picker>
                    </Item>
                </Animated.View>
            </Form>
        )
    }

    renderSecontForm = () => {
        return (
            <Form style={styles.container}>
                <Animated.View style={[styles.container, { transform: [{ translateY: this.state.shift }] }]}>
                    {/* <Animated.Text style={{ fontSize: 30, alignSelf: 'center', marginTop: '10%' }}>About Item</Animated.Text> */}
                    <Item regular style={{ borderColor: '#60CDF2', margin: 5, width: "80%" }}  >
                        <TextInput style={{ width: "100%", padding: 10 }} placeholder="Item Name" value={this.state.item} onChangeText={(item) => this.setState({ item })} />
                    </Item>

                    {/* <Item regular style={{ borderColor: '#60CDF2', margin: 5, width: "80%" }}>
                        <TextInput style={{ width: "100%", padding: 10 }} placeholder="Sub Item" onChangeText={(subItem) => this.setState({ subItem })} />
                    </Item>

                    <Item regular style={{ borderColor: '#60CDF2', margin: 5, width: "80%" }}>
                        <TextInput style={{ width: "100%", padding: 10 }} placeholder="Sub Item Prize " onChangeText={(prize) => this.setState({ prize })} />
                    </Item> */}
                    <Item>
                        <Button block onPress={this.addItem} style={{ backgroundColor: '#60CDF2', alignItems: 'center', justifyContent: 'center' }} ><Text style={{ color: '#fff' }} > ADD </Text></Button>
                    </Item>
                </Animated.View>
            </Form>
        )
    }

    renderThirdForm = () => {
        const { selectedDataObj, selectedItem, selectSub } = this.state
        if (!this.state.updatePrize) {
            return (
                // <ScrollView contentContainerStyle={styles.container}>
                <Form style={styles.container}>
                    <Animated.View style={[styles.container, { transform: [{ translateY: this.state.shift }] }]}>
                        {/* <Animated.Text style={{ fontSize: 30, alignSelf: 'center', marginTop: '10%' }}>About Item</Animated.Text> */}

                        <Item picker regular style={{ borderColor: '#60CDF2', margin: 5, width: "80%" }}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder="Select Feedback Type"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selectedItem}
                                onValueChange={(selectedItem) => this.setState({ selectedItem })}
                            >
                                {this.state.selectedDataObj && this.state.selectedDataObj.categoryItems.map((value, index) => {
                                    return <Picker.Item label={value.itemName} value={value.itemName} />
                                })}
                            </Picker>
                        </Item>

                        <Item regular style={{ borderColor: '#60CDF2', margin: 5, width: "80%" }}>
                            <TextInput style={{ width: "100%", padding: 10 }} placeholder="Sub Item" value={this.state.subItem} onChangeText={(subItem) => this.setState({ subItem })} />
                        </Item>

                        <Item regular style={{ borderColor: '#60CDF2', margin: 5, width: "80%" }}>
                            <TextInput style={{ width: "100%", padding: 10 }} placeholder="Sub Item Prize " value={this.state.prize} onChangeText={(prize) => this.setState({ prize })} />
                        </Item>
                        <Item regular style={{ borderColor: '#60CDF2', margin: 5, width: "80%" }}  >
                            <TextInput style={{ width: "100%", padding: 10 }} placeholder="Item Wieght" value={this.state.wieght} onChangeText={(wieght) => this.setState({ wieght })} />
                        </Item>
                        <Item style={{}}  >
                            <Button block onPress={this.addSubCategory} style={{ backgroundColor: '#60CDF2', alignItems: 'center', justifyContent: 'center' }} ><Text style={{ color: '#fff' }} > ADD </Text></Button>
                        </Item>
                        {/* <Item>
                            <Button block onPress={() => this.setState({ updatePrize: true })} style={{ backgroundColor: '#60CDF2', alignItems: 'center', justifyContent: 'center' }} ><Text style={{ color: '#fff' }} > Update Existing Prize </Text></Button>
                        </Item> */}
                    </Animated.View>
                </Form>
                // </ScrollView>
            )
        } else {
            return (
                <Form style={styles.container} >
                    <Animated.View style={[styles.container, { transform: [{ translateY: this.state.shift }] }]}>
                        <Item picker regular style={{ borderColor: '#60CDF2', margin: 5, width: "80%" }}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder="Select Feedback Type"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selectedItem}
                                onValueChange={(selectedItem) => this.setState({ selectedItem })}
                            >
                                {this.state.selectedDataObj && this.state.selectedDataObj.categoryItems.map((value, index) => {
                                    return <Picker.Item label={value.itemName} value={value.itemName} />
                                })}
                            </Picker>
                        </Item>
                        <Animatable.View>
                            <Button success full style={{ width: 80 }} onPress={() => this.setState({ updatePrize: false })} >
                                <Text style={{ alignSelf: 'center' }} >Done</Text>
                            </Button>
                            {/* <Button warning block style={{ width: "50%" }} >
                                <Text>Cancel</Text>
                            </Button> */}
                        </Animatable.View>
                    </Animated.View>
                </Form>

            )
        }
    }

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };


    _renderHeader = (section, index, isActive, sections) => {
        // console.log(section)
        if (section.itemName === this.state.selectedItem) {
            return (
                <Animatable.View
                    duration={300}
                    transition="backgroundColor"
                    style={{
                        // backgroundColor: (isActive ? 'transparent' : 'transparent'),
                        borderColor: 'black',
                        borderWidth: 1,
                        margin: 10,
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                    <Animatable.Text style={{ fontWeight: 'bold', fontSize: 20, padding: 10 }}>{section.itemName}</Animatable.Text>
                    <Animatable.View duration={200} style={{ marginLeft: "50%", marginTop: '4%' }} >{isActive ? <Icon name="keyboard-arrow-up" type="MaterialIcons" /> : <Icon name="keyboard-arrow-down" type="MaterialIcons" />}</Animatable.View>
                    {/* <Animatable.View duration={200} style={{ marginTop: '4%' }} ><Icon name="times-circle" style={{ color: 'red' }} type="FontAwesome" /></Animatable.View> */}
                </Animatable.View>
            );
        } else { return <View /> }
    }

    _renderContent = (section) => {
        // console.log(mainIndex, section, i, isActive, sections)
        if (section.itemName === this.state.selectedItem) {
            return (
                <Animatable.View
                    duration={300}
                    transition="backgroundColor"
                    style={{ borderColor: 'black', borderWidth: 1, margin: 10, padding: 10 }}>
                    {/* <View> */}
                    <Animatable.View style={{ width: '100%', display: "flex", flexDirection: "row" }}>
                        <Animatable.Text style={{ width: "50%" }} ></Animatable.Text>
                        <Animatable.Text style={{ width: '20%', fontWeight: 'bold' }} >Wieght</Animatable.Text>
                        <Animatable.Text style={{ width: '20%', marginLeft: 5, fontWeight: 'bold' }}>Prize</Animatable.Text>
                    </Animatable.View>
                    {section.quantityType && section.quantityType.map((value, index) => {
                        return <Animatable.View style={{ width: '100%', display: "flex", flexDirection: "row", marginTop: 5 }} >
                            <Animatable.View style={{ width: "50%" }} >
                                {/* <Animatable.Text style={{ marginLeft: 10 }} >{value.quantityTitle}</Animatable.Text> */}
                                <TextInput onChangeText={this.updateTitle.bind(this, index)} value={value.quantityTitle} />
                            </Animatable.View>
                            <Animatable.View style={{ width: "20%" }} >
                                {/* <Animatable.Text style={{ marginLeft: 10 }} >{value.wieght}</Animatable.Text> */}
                                <TextInput onChangeText={this.updateWieght.bind(this, index)} value={value.wieght} />
                            </Animatable.View>
                            <Animatable.View style={{ width: "20%" }} >
                                {/* <Animatable.Text style={{ marginLeft: 10 }} >{value.prize}</Animatable.Text> */}
                                <TextInput onChangeText={this.updatePrize.bind(this, index)} value={value.prize} />
                            </Animatable.View>
                            <Animatable.View style={{ width: "10%" }} >
                                {/* <Animatable.Text style={{ marginLeft: 10 }} >{value.prize}</Animatable.Text> */}
                                <TouchableOpacity onPress={this.deleteItem.bind(this, index)} >
                                    <Icon name="delete" style={{ color: "red" }} color="red" type="MaterialIcons" />
                                </TouchableOpacity>
                            </Animatable.View>
                        </Animatable.View>
                    })}
                    {/* </View> */}
                </Animatable.View>
            );
        }
    }


    render() {
        const { data, selectedItem, selectedDataObj } = this.state
        var sections = selectedDataObj && selectedDataObj.categoryItems
        // console.log(selectedDataObj)
        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.props.goBack() }}
                    centerComponent={{ text: 'EDITING', style: { color: '#fff' } }}
                // rightComponent={{ icon: 'home', color: '#fff' }}
                />
                <ProgressSteps >
                    <ProgressStep label="Select Category" onNext={this.sendForm1} errors={this.state.error} >
                        <View style={{ alignItems: 'center' }}>
                            {this.renderFirstForm()}
                        </View>
                    </ProgressStep>
                    <ProgressStep label="Add Category Items" onNext={this.onNextStep} errors={this.state.errors} >
                        <View style={{ alignItems: 'center' }}>
                            {this.renderSecontForm()}
                            {selectedDataObj ? <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Tabs renderTabBar={() => <ScrollableTab />} >
                                    {/* {this.state.data.map((value, index) => {
                                        var sections = value.categoryItems
                                        return ( */}
                                    <Tab heading={this.state.selectedDataObj.categoryTitle} style={{ width: '100%' }}>
                                        <View style={{ width: '100%' }}>
                                            {sections ? sections.map((value, index) => {
                                                return (
                                                    <Animatable.View
                                                        duration={300}
                                                        transition="backgroundColor"
                                                        style={{
                                                            // backgroundColor: (isActive ? 'transparent' : 'transparent'),
                                                            borderColor: 'black',
                                                            borderWidth: 1,
                                                            margin: 10,
                                                            display: 'flex',
                                                            flexDirection: 'row'
                                                        }}>
                                                        <Animatable.Text style={{ fontWeight: 'bold', fontSize: 20, padding: 10 }}>{value.itemName}</Animatable.Text>
                                                        {/* <Animatable.View duration={200} style={{ marginLeft: "50%", marginTop: '4%' }} >{isActive ? <Icon name="keyboard-arrow-up" type="MaterialIcons" /> : <Icon name="keyboard-arrow-down" type="MaterialIcons" />}</Animatable.View> */}
                                                        <Animatable.View duration={200} style={{ marginTop: '4%', right: 20, position: 'absolute' }} ><TouchableOpacity onPress={() => this.removeItem(index)} ><Icon name="times-circle" style={{ color: 'red' }} type="FontAwesome" /></TouchableOpacity></Animatable.View>
                                                    </Animatable.View>
                                                )
                                            })


                                                // <Accordion
                                                //     sections={sections}
                                                //     activeSections={this.state.activeSections}
                                                //     renderSectionTitle={this._renderSectionTitle}
                                                //     renderHeader={this._renderHeader}
                                                //     renderContent={this._renderContent.bind(this)}
                                                //     onChange={this._updateSections}

                                                // /> 
                                                : <Text style={{ alignSelf: 'center', fontSize: 15 }} >No Data Found</Text>}
                                        </View>
                                    </Tab>
                                    {/* )
                                    })} */}

                                </Tabs>
                            </View> : <View />}
                        </View>
                    </ProgressStep>
                    <ProgressStep label="Add Sub-Category" onSubmit={this.send}>
                        <Animated.View style={[styles.container, { transform: [{ translateY: this.state.shift }] }]}>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderThirdForm()}
                                {selectedDataObj ? <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Tabs renderTabBar={() => <ScrollableTab />} >
                                        {/* {this.state.data.map((value, index) => {
                                        var sections = value.categoryItems
                                        return ( */}
                                        <Tab heading={this.state.selectedDataObj.categoryTitle} style={{ width: '100%' }}>
                                            <View style={{ width: '100%' }}>
                                                {sections && selectedItem ? <Accordion
                                                    sections={sections}
                                                    activeSections={this.state.activeSections}
                                                    renderSectionTitle={this._renderSectionTitle}
                                                    renderHeader={this._renderHeader}
                                                    renderContent={this._renderContent.bind(this)}
                                                    onChange={this._updateSections}

                                                />
                                                    : <Text style={{ alignSelf: 'center', fontSize: 15 }} >No Data Selected</Text>}
                                            </View>
                                        </Tab>
                                        {/* )
                                    })} */}

                                    </Tabs>
                                </View> : <View />}
                            </View>
                        </Animated.View>
                    </ProgressStep>
                </ProgressSteps>
            </View>
        );
    }

    handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
            const fieldHeight = height;
            const fieldTop = pageY;
            const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
            if (gap >= 0) {
                return;
            }
            Animated.timing(
                this.state.shift,
                {
                    toValue: gap,
                    duration: 1000,
                    useNativeDriver: true,
                }
            ).start();
        });
    }

    handleKeyboardDidHide = () => {
        Animated.timing(
            this.state.shift,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        // justifyContent: 'center'
    },

})