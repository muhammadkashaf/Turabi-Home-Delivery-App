import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

export default class Home extends React.Component {
  constructor() {
    super();

    console.ignoredYellowBox = [
      'Setting a timer'
    ];
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../assets/BACKground-01.jpg')} style={{ width: '100%', height: '100%', opacity: 0.9 }} >
          <View style={{ width: '100%', alignContent: 'center', alignItems: 'center', marginTop: "20%" }} >
            <Image source={require('../../assets/LOGO-01.png')} style={{ width: 250, height: 150 }} />
          </View>

          <View style={{ width: '100%', alignContent: 'center', alignItems: 'center', marginTop: "20%" }}>
            <Text style={{ fontSize: 40, fontWeight: 'bold' }} >Welcome To</Text>
            <Text style={{ fontSize: 40 }}>THDS</Text>

            <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#fff', marginTop: '10%' }} >STATEMENT</Text>
          </View>
          <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} >
              <Icon name="arrow-circle-right" type='FontAwesome' style={{ fontSize: 50, color: "#fff" }} />
            </TouchableOpacity>
          </View>
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
});
