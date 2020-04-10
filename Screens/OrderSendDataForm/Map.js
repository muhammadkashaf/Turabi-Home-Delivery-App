import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Platform, Dimensions, Text, Image } from 'react-native'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location';
import { Button, View, Icon, Toast, Spinner } from 'native-base';
import { SearchBar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

export default class Map extends React.Component {
    constructor() {
        super();
        this.state = {
            origin: { latitude: 40.7050758, longitude: -74.0091604 },
            location: null,
            locationAdress: null,
            coordinate: {},
            searchText: '',
        }
    }

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

   

    searchText = (e) => {
        var text = e
        this.setState({ searchText: e })
        // console.log(e.target.value)
        fetch(`https://api.foursquare.com/v2/venues/search?client_id=OTF2RU1F2SMSGAORW5OCFHGTQOEVSJ4L5KDX4PZUQHECGXQK&client_secret=QBLSXQ0UO1IJGXRVZXKENHGRGD0GYSUUZUHAT1S3LNBAL3QI&v=20181022&ll=${this.state.location.coords.latitude},${this.state.location.coords.longitude}&query=${text}`)
            .then(res => res.json())
            .then(result => {
                // console.log(result)
                text !== '' ?
                    this.setState({
                        // searchText: text,
                        newItems: result.response.venues
                    }) :
                    this.setState({ newItems: null })
            })
            .catch(err => console.log(err))

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
        
        this.setState({ location, locationAdress, coordinate: location.coords });
    };

    selectedLocation = (location) => {
        const loc = {
            coords: {
                latitude: location.location.lat,
                longitude: location.location.lng
            }
        }
        // console.log(loc)
        this.setState({ searchText: '', coordinate: loc.coords, newItems: null })
    }

    render() {
        // console.log(this.state.locationAdress)
        if (this.state.location) {
            return (
                <View style={{ flex: 1 }} >
                    {/* <MapView
                        style={{ flex: 1, height: height, width: width }}
                        provider="google"
                        region={{
                            latitude: this.state.location.coords.latitude,
                            longitude: this.state.location.coords.longitude,
                            latitudeDelta: 0.0100,
                            longitudeDelta: 0.0100,
                        }}

                    >
                        <Marker
                            coordinate={this.state.location.coords}
                            title={this.state.locationAdress[0].name}
                            description={`${this.state.locationAdress[0].city}  ${this.state.locationAdress[0].country}`}

                        />
                    </MapView> */}
                    {/* <MapView 
                    style={{ flex: 1, height: height, width: width }}
                    initialRegion={{
                        latitude: this.state.location.coords.latitude,
                        longitude: this.state.location.coords.longitude,
                        latitudeDelta: 0.0100,
                        longitudeDelta: 0.0100,
                    }}>
                        <Marker draggable
                            coordinate={this.state.x}
                            onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
                        />
                    </MapView> */}
                    <SearchBar placeholder="Search Location" lightTheme containerStyle={{ marginTop: 20 }} onChangeText={this.searchText} value={this.state.searchText} />
                    {this.state.newItems && this.state.newItems.map((value, index) => {
                        return <View>
                            {/* {value.categories[0].icon && <Image source={{ uri: `${value.categories[0].icon.prefix}${value.categories[0].icon.suffix}` }} style={{ height: 40, width: 40 }} />}  */}
                            <Button transparent full onPress={() => this.selectedLocation(value)} iconLeft ><Text>{value.name}</Text></Button>
                        </View>
                    })}
                    <MapView
                        onPress={(e) => this.setState({ coordinate: e.nativeEvent.coordinate })}
                        // onPoiClick={(e) => console.log(e)}
                        style={{ flex: 1, height: height, width: width }}
                        // onMarkerDrag={(e) => console.log(e)}
                        showsMyLocationButton
                        region={{
                            latitude: this.state.coordinate.latitude,
                            longitude: this.state.coordinate.longitude,
                            latitudeDelta: 0.0100,
                            longitudeDelta: 0.0100,
                        }}
                        initialRegion={{
                            latitude: this.state.coordinate.latitude,
                            longitude: this.state.coordinate.longitude,
                            latitudeDelta: 0.0100,
                            longitudeDelta: 0.0100,
                        }}>
                        <Marker.Animated
                            ref={marker => { this.marker = marker }}
                            coordinate={this.state.coordinate}
                            draggable
                            onDragEnd={(e) => this.setState({ coordinate: e.nativeEvent.coordinate, location: { coords: e.nativeEvent.coordinate } })}
                        />
                    </MapView>
                    <View
                        style={
                            { bottom: 50, position: 'absolute', right: 10 }
                        }

                    >
                        <TouchableOpacity onPress={() => this.setState({ coordinate: this.state.location.coords })} >
                            <Icon name="my-location" type="MaterialIcons" onPress={this._getLocationAsync} style={{ fontSize: 50 }} />
                        </TouchableOpacity>
                    </View>

                    <Button full onPress={() => this.props.setLocation(this.state.coordinate)} >
                        <Text>Pin Location</Text>
                    </Button>
                </View >
            );
        } else {
            return <Spinner style={{ alignContent: 'center', justifyContent: 'center' }} color='blue' />
        }
    }
}
