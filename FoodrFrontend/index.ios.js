/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Alert
} from 'react-native';


export default class FoodrFrontend extends Component {
  // constructor(){
  //   super();
  //   this.state = {
  //     currentPage: "indexPage",
  //     prevPage: "",
  //     logged_in: false,
  //     user_id: null

  //   }
  // }


  render() {
    return (
      <View style={styles.container}>
        <IndexPage />
      </View>
    );
  }
}



class IndexPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          foodr
        </Text>
        <ScanProduct/>
        <SearchProduct/>
        <SignUp/>
        <SignIn/>

      </View>
    );
  }
}


class ScanProduct extends Component {
  _onPressButton(){
    {Alert.alert('Taking you to the camera in just a minute..')}
  }

  render() {
    return (
      <View style={styles.container}>
        <Button 
        onPress={this._onPressButton}
        title="Scan Product"
        color="blue"

        />

      </View>
    );
  }
}

class SearchProduct extends Component {
  _onPressButton(){
    {Alert.alert('Enter the product name or upc')}
  }

  render() {
    return (
      <View style={styles.container}>
        <Button 
        onPress={this._onPressButton}
        title="Search Product"
        color="green"
        />

      </View>
    );
  }
}

class SignUp extends Component {
  _onPressButton(){
    {Alert.alert('Register with your email')}
  }

  render() {
    return (
      <View style={styles.container}>
        <Button 
        onPress={this._onPressButton}
        title="Sign Up"
        color="purple"
        />

      </View>
    );
  }
}

class SignIn extends Component {
  _onPressButton(){
    {Alert.alert('You are not logged in yet')}
  }

  render() {
    return (
      <View style={styles.container}>
      <Text>
        Already have an account?  
      </Text>
      <Button 
        onPress={this._onPressButton}
        title="Sign In"
        color="green"
        />

      </View>
    );
  }
}




























const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('FoodrFrontend', () => FoodrFrontend);
