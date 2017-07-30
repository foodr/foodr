import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  ActivityIndicator
} from 'react-native';
import Camera from 'react-native-camera';

export default class FoodrFrontend extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: 'CameraPage',
      foundProduct: {},
      userId: false
    }
    this.updateCurrentPage = this.updateCurrentPage.bind(this)
    this.searchProduct = this.searchProduct.bind(this)
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

  updateCurrentPage(pageName) {
    this.setState({currentPage: pageName})
  }

  render() {
    switch(this.state.currentPage) {
      case 'IndexPage':
        return(
          <IndexPage />
        )
      case 'SearchPage':
        return(
          <SearchPage />
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
        <Camera
          ref={(cam) => {this.camera = cam;}}
          style={styles.preview}
          onBarCodeRead = {this.onBarCodeRead}
          aspect={Camera.constants.Aspect.fill}>
        </Camera>
        <Text style={styles.instructions}>The camera will automatically detect when a barcode is present</Text>


        <Text style={styles.capture} onPress={this.existingItem}>[EXISTING ITEM]</Text>
        <Text style={styles.capture} onPress={this.nonExistingItem}>[NONEXISTING ITEM]</Text>
      </View>
    );
  }
}

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

class NoResultsPage extends Component {
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
        <Text style={styles.welcome}>No Products Found</Text>
        <Text>Sorry we do not have that item in our database{"\n\n"}</Text>
        <Button
            onPress={this.goToCamera}
            title="Scan Another Item"
          />
        <Text>or</Text>
        <Button
            onPress={this.goToSearch}
            title="Search for an Item"
          />
      </View>
    )
  }
}

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

class SearchPage extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Text>Search Page</Text>
      </View>
    );
  }
}

class IndexPage extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Text>Index Page</Text>
      </View>
    );
  }
}

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
