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
  constructor(){
    super();
    this.state = {
      currentPage: "indexPage",
      prevPage: "",
      nextPage: "",
      searchTerm: "",
      loggedIn: false,
      userId: false

    }
    this.handleButtonPress = this.handleButtonPress.bind(this)
  }


  handleButtonPress = function(pageName){
    this.setState({currentPage: pageName})
  }


  render() {

    return (
      <View style={styles.container}>
        <IndexPage 
        handleButtonPress = {this.handleButtonPress}
        currentPage = {this.state.currentPage}
        />
      </View>
    );
  }
}



class IndexPage extends Component {
  constructor(props){
    super(props)
    this._onPressSearchButton = this._onPressSearchButton.bind(this)
    this._onPressScanButton = this._onPressScanButton.bind(this)
    this._onPressSignUpButton = this._onPressSignUpButton.bind(this)
    this._onPressSignInButton = this._onPressSignInButton.bind(this)
  }
  
  _onPressSearchButton(){
    this.props.handleButtonPress("searchPage")
  }

  _onPressScanButton(){
    this.props.handleButtonPress("cameraPage")
  }

  _onPressSignUpButton(){
    this.props.handleButtonPress("indexPage")
  }

  _onPressSignInButton(){
    this.props.handleButtonPress("indexPage")
  }







  render() {
    return (
      <View style={styles.container}>
        <Text>
          foodr
        </Text>
        <Button 
          title="Search Product"
          onPress={this._onPressSearchButton}
          color="green"
        />
        <Button 
          title="Scan Product"
          onPress={this._onPressScanButton}
          color="blue"
          />
        <Button 
        onPress={this._onPressSignUpButton}
        title="Sign Up"
        color="purple"
        />
        <Button 
        onPress={this._onPressSignInButton}
        title="Sign In"
        color="brown"
        /> 

      </View>
    );
  }
}


// class SearchProduct extends Component {
//   _onPressButton(){
//     this.props.currentPage = "searchPage"
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <Button 
//         onPress={this._onPressButton}
//         title="Search Product"
//         color="green"
//         />

//       </View>
//     );
//   }
// }









// class ScanProduct extends Component {
//   _onPressButton(){
//     this.props.currentPage = "cameraPage"
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <Button 
//         onPress={this._onPressButton}
//         title="Scan Product"
//         color="blue"

//         />

//       </View>
//     );
//   }
// }




// class SignUp extends Component {
//   _onPressButton(){
//     this.props.currentPage = "signupPage"
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <Button 
//         onPress={this._onPressButton}
//         title="Sign Up"
//         color="purple"
//         />

//       </View>
//     );
//   }
// }

// class SignIn extends Component {
//   _onPressButton(){
//     this.props.currentPage = "signinPage"
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//       <Text>
//         Already have an account?  
//       </Text>
//       <Button 
//         onPress={this._onPressButton}
//         title="Sign In"
//         color="green"
//         />

//       </View>
//     );
//   }
// }




























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
