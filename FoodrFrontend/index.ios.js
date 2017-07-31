import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from 'react-native';
// import Camera from 'react-native-camera';

// PARENT

export default class FoodrFrontend extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: 'IndexPage',
      previousPage: 'DefaultPage',
      foundProduct: {},
      searchTerm: "",
      userId: false,
    }
    this.updateCurrentPage = this.updateCurrentPage.bind(this)
    this.searchProduct = this.searchProduct.bind(this)
    this.updateSearchTerm = this.updateSearchTerm.bind(this)
  }


  updateCurrentPage(pageName) {
    this.setState({currentPage: pageName})
  }

  updateSearchTerm(searchTerm) {
    this.setState({searchTerm: searchTerm})
  }

  searchProduct(upc) {
    this.updateCurrentPage('SearchingPage')

    fetch('https://dbc-foodr-api.herokuapp.com/products/' + upc + "?user_id=" + this.state.userId)
    // fetch('http://localhost:3000/products/' + upc + "?user_id=" + this.state.userId)
    .then((data) => data.json())
    .then((jsonData) => {
      this.setState({ foundProduct: jsonData })
      if (this.state.foundProduct.found) {
        this.updateCurrentPage('ProductPage')
      } else {
        this.updateCurrentPage('NoResultsPage')
      }
    });
  }

  render() {
    switch(this.state.currentPage) {
      case 'IndexPage':
        return(
          <IndexPage 
          updateCurrentPage = {this.updateCurrentPage} />
        )
      case 'SearchPage':
        return(
          <SearchPage
          searchProduct = {this.searchProduct}
          updateSearchTerm = {this.updateSearchTerm}/>
        )
      case 'CameraPage':
        return(
          <CameraPage
            searchProduct = {this.searchProduct}
          />
        )
      case 'ProductPage':
        return(
          <ProductPage
            foundProduct = {this.state.foundProduct}
            updateCurrentPage = {this.updateCurrentPage}
          />
        )
      case 'IngredientPage':
        return(
          <IngredientPage />
        )
      case 'NoResultsPage':
        return(
          <NoResultsPage
            updateCurrentPage = {this.updateCurrentPage}
            searchTerm = {this.state.searchTerm}
            />
        )
      case 'SearchingPage':
        return(
          <SearchingPage />
        )
      default:
        return(
          <DefaultPage />
        )
    }
  }

}

// CHILDREN

// XANDER

// class LayoutPage extends Component {
//   render() {
//     return(
//       <View style={styles.container}>
//         <Text>Layout Page</Text>
//       </View>
//     )
//   }
// }


// VICTORIA

class CameraPage extends Component {
  constructor() {
    super()
    this.onBarCodeRead = this.onBarCodeRead.bind(this)
    this.existingItem = this.existingItem.bind(this)
    this.nonExistingItem = this.nonExistingItem.bind(this)
  }

  onBarCodeRead(e) {
    this.props.searchProduct(e.data)
  }

  // for testing
  existingItem() {
    this.props.searchProduct('03077504')
  }

  nonExistingItem() {
    this.props.searchProduct('asdf')
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>Place Barcode in View</Text>
        <Text style={styles.instructions}>The camera will automatically detect when a barcode is present</Text>
        <Text style={styles.capture} onPress={this.existingItem}>[EXISTING ITEM]</Text>
        <Text style={styles.capture} onPress={this.nonExistingItem}>[NONEXISTING ITEM]</Text>
      </View>
    );
  }
}


// TIFF

class ProductPage extends Component {
  constructor() {
    super()
    this.goToCamera = this.goToCamera.bind(this)
    this.goToSearch = this.goToSearch.bind(this)
  }

  goToCamera () {
    this.props.updateCurrentPage('CameraPage')
  }

  goToSearch() {
    this.props .updateCurrentPage('SearchPage')
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.welcome} >Product Page</Text>
        <Text>{this.props.foundProduct.product.name}</Text>
        <Button
          onPress={this.goToCamera}
          title="Scan Another Item"
        />
      </View>
    )
  }
}

// KANAN

class NoResultsPage extends Component {
  constructor(){
    super()
    this.searchAgain = this.searchAgain.bind(this)
    this.scanAgain = this.scanAgain.bind(this)
  }

  searchAgain(){
    this.props.updateCurrentPage("SearchPage")
  }

  scanAgain(){
    this.props.updateCurrentPage("CameraPage")
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{this.props.searchTerm} was not found</Text>
        <Text> Would you like to try another product?</Text>
        <Button 
         title="Scan Another Product"
         onPress={this.scanAgain}
         color="blue"
        />
        <Text>or</Text>
        <Button 
         title="Search Product"
         onPress={this.searchAgain}
         color="green"
        />
      </View>
    );
  }
}


class SearchPage extends Component {
  constructor(){
    super();
    this.state = {
      text: ''
    };
    this.startSearch = this.startSearch.bind(this)
  }

  startSearch() {
    this.props.updateSearchTerm(this.state.text)
    this.props.searchProduct(this.state.text)
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
        placeholder="Enter product name or upc"
        placeholderTextColor='#ecf0f1'
        returnKeyType="search"
        keyboardType="default"
        style={styles.input}
        onChangeText={(text) => this.setState({text})}
        />
        <TouchableOpacity style={styles.buttonContainer}>
        <Button title="Search Product" color="#ecf0f1" onPress={this.startSearch}/>
        </TouchableOpacity>
      </View>
    )  
  }
}


class IndexPage extends Component {
  constructor(){
    super()
    this._onPressSearchButton = this._onPressSearchButton.bind(this)
    this._onPressScanButton = this._onPressScanButton.bind(this)
    this._onPressSignUpButton = this._onPressSignUpButton.bind(this)
    this._onPressSignInButton = this._onPressSignInButton.bind(this)
  }
  
  _onPressSearchButton(){
    this.props.updateCurrentPage("SearchPage")
  }

  _onPressScanButton(){
    this.props.updateCurrentPage("CameraPage")
  }

  _onPressSignUpButton(){
    this.props.updateCurrentPage("IndexPage")
  }

  _onPressSignInButton(){
    this.props.updateCurrentPage("IndexPage")
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          foodr
        </Text>
        <TouchableOpacity>
        <Button title="Scan Product" onPress={this._onPressScanButton} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity>
        <Button title="Search Product" onPress={this._onPressSearchButton} color="green" />
        </TouchableOpacity>
        <TouchableOpacity>
        <Button onPress={this._onPressSignUpButton} title="Sign Up" color="purple" />
        </TouchableOpacity>
        <TouchableOpacity>
        <Button onPress={this._onPressSignInButton} title="Sign In" color="brown"/> 
        </TouchableOpacity>
      </View>
    );
  }
}

// DONE

class SearchingPage extends Component {
  render() {
    return(
      <View style={styles.container}>
        <ActivityIndicator
          animating = {true}
          size = 'large'
          style={styles.activityIndicator}
        />
        <Text>Searching...</Text>
      </View>
    );
  }
}

// FOR TESTING

class DefaultPage extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>Default Page</Text>
        <Text>The case statement hit default</Text>
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
  input: {
    height: 40,
    width: 340,
    backgroundColor: '#e67e22',
    color: '#2c3e50',
    fontWeight: "200",
    marginBottom: 20,
    paddingHorizontal: 5
  },
  buttonContainer: {
    backgroundColor: "#d35400",
    borderRadius: 15,
    padding: 5
    
    // justifyContent: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 10,
  },
  preview: {
    height: 300,
    width: Dimensions.get('window').width
  },
  activityIndicator: {
    marginBottom: 20,
  },
  // for testing
  capture: {
    flex: 0,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    padding: 10,
    margin: 5
  },
});

AppRegistry.registerComponent('FoodrFrontend', () => FoodrFrontend);
