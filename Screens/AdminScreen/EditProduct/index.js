import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Header, SearchBar, Divider, Icon, CheckBox } from 'react-native-elements';
import NumericInput from 'react-native-numeric-input'
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable'
import firebase from '../../../Component/Config/Firebase'
import { Tab, Tabs, ScrollableTab, Button, Item, Input, Right, TabHeading } from 'native-base';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import EditingForm from './editForm';

export default class EditProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            activeSections: [],
            editIndex: null,
            mainEditIndex: null,
            subIndex: null
        }
    }

    componentWillMount = () => {
        const { data } = this.state
        firebase.database().ref('/data/').on('child_added', snap => {
            let values = snap.val()
            values.key = snap.key
            data.push(values)
            this.setState({ data })
        })
    }

    _renderHeader = (section, index, isActive, sections) => {
        return (
            <Animatable.View
                duration={300}
                transition="backgroundColor"
                style={{
                    backgroundColor: (isActive ? 'rgba(255,255,255,1)' : 'rgba(245,252,255,1)'),
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
                style={{ borderColor: 'black', borderWidth: 1, margin: 10, padding: 10 }}>
                {/* <View> */}
                <Animatable.View style={{ width: '100%', display: "flex", flexDirection: "row" }}>
                    <Animatable.Text style={{ width: "60%", fontWeight: 'bold' }} easing="ease-out" >Item</Animatable.Text>
                    <Animatable.Text style={{ width: '20%', fontWeight: 'bold' }} easing="ease-out" >Price</Animatable.Text>
                    <Animatable.Text style={{ width: '20%', marginLeft: 5, fontWeight: 'bold' }} easing="ease-out" >Weight</Animatable.Text>
                </Animatable.View>
                {section.quantityType && section.quantityType.map((value, index) => {
                    return <Animatable.View style={{ width: '100%', display: "flex", flexDirection: "row", marginTop: 5 }} >
                        <Animatable.View style={{ width: "60%" }} >
                            <Animatable.Text style={{ marginLeft: 10 }} >{value.quantityTitle}</Animatable.Text>
                        </Animatable.View>

                        <Animatable.View style={{ width: "20%" }} >
                            <Animatable.Text style={{ marginLeft: 10 }} >{value.prize}</Animatable.Text>
                        </Animatable.View>

                        <Animatable.View style={{ width: "20%" }} >
                            <Animatable.Text style={{ marginLeft: 10 }} >{value.wieght > 999 ? (value.wieght / 1000) + "kg" : value.wieght + 'gm' }</Animatable.Text>
                        </Animatable.View>
                        {/* {!this.state.editIndex && } */}
                        {/* {(this.state.editIndex === i && this.state.mainEditIndex === mainIndex && this.state.subIndex === index) ? <Animatable.View style={{ width: "20%" }} >
                            <TouchableOpacity onPress={() => this.setState({ editIndex: index, mainEditIndex: mainIndex })} >
                                <Icon name="done" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ editIndex: null, mainEditIndex: null })} >
                                <Icon name="cancel" />
                            </TouchableOpacity>
                        </Animatable.View> : <Animatable.View style={{ width: "20%" }} >
                                <TouchableOpacity onPress={() => this.setState({ editIndex: index, mainEditIndex: mainIndex, subIndex: index })} >
                                    <Icon name="edit" />
                                </TouchableOpacity>
                            </Animatable.View>} */}
                    </Animatable.View>
                })}
                {/* </View> */}
            </Animatable.View>
        );
    }

    _updateSections = activeSections => {
        this.setState({ activeSections });

    };

    render() {
        const { data, selectedItem } = this.state
        // var sections = data && data.categoryItems
        if (!this.state.editing) {
            return (
                <View style={{ flex: 1 }} >
                    <Header
                        leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.toggleDrawer() }}
                        centerComponent={{ text: 'EDIT PRODUCTS', style: { color: '#fff' } }}
                        rightComponent={{ icon: 'edit', color: '#fff', onPress: () => this.setState({ editing: true }) }}
                    />

                    <View style={{ flex: 1 }} >
                        <Tabs renderTabBar={() => <ScrollableTab />}>
                            {data.map((value, index) => {
                                var sections = value.categoryItems
                                return (
                                    <Tab heading={value.categoryTitle}>
                                        <View style={{ width: '100%' }}>
                                            {sections ? <Accordion
                                                sections={sections}
                                                activeSections={this.state.activeSections}
                                                renderSectionTitle={this._renderSectionTitle}
                                                renderHeader={this._renderHeader}
                                                renderContent={this._renderContent.bind(this, index)}
                                                onChange={this._updateSections}

                                            /> : <Text style={{ alignSelf: 'center', fontSize: 15, color: '#fff' }} >No Data Found</Text>}
                                        </View>
                                    </Tab>
                                )
                            })}
                        </Tabs>
                    </View>

                </View>
            )
        } else { return <EditingForm goBack={() => this.setState({ editing: false })} data={this.state.data} /> }
    }
}

