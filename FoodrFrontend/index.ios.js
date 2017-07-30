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
    this.updateCurrentPage = this.updateCurrentPage.bind(this)
  }


  updateCurrentPage = function(pageName){
    console.log("Pagename" + pageName)
    this.setState({currentPage: pageName})

  }


  render() {

      switch (this.state.currentPage) {

        case 'indexPage': return (
          <IndexPage 
          updateCurrentPage = {this.updateCurrentPage}
          currentPage = {this.state.currentPage}
        />)

       case 'searchPage': return (
          <SearchPage
        updateCurrentPage = {this.updateCurrentPage}
        currentPage = {this.state.currentPage}
        />)

        default: return (
          <UserPage/>)

      }

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
    this.props.updateCurrentPage("searchPage")
  }

  _onPressScanButton(){
    this.props.updateCurrentPage("cameraPage")
  }

  _onPressSignUpButton(){
    this.props.updateCurrentPage("indexPage")
  }

  _onPressSignInButton(){
    this.props.updateCurrentPage("indexPage")
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          foodr
        </Text>
        <Button 
          title="Scan Product"
          onPress={this._onPressScanButton}
          color="blue"
          />
          <Button 
          title="Search Product"
          onPress={this._onPressSearchButton}
          color="green"
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



class SearchPage extends Component {
  constructor(props){
    super(props)
    this._onPressSearchButton = this._onPressSearchButton(this)
  }

  _onPressSearchButton(){
    this.props.updateCurrentPage("noResultsPage")
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          {this.props.currentPage}
          Search Product
        </Text>
      </View>
    );
  }
}


class UserPage extends Component {
  

  render() {
    return (
      <View style={styles.container}>
        <Text>
          User Profile Page
        </Text>
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
