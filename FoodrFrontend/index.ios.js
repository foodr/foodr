import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button
} from 'react-native';
import Camera from 'react-native-camera';

export default class FoodrFrontend extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: 'cameraPage',
      foundProduct: {},
      userId: false
    }
    this.updateCurrentPage = this.updateCurrentPage.bind(this)
    this.searchProduct = this.searchProduct.bind(this)
  }

  searchProduct(upc) {
    this.updateCurrentPage('searching')

    // fetch('https://dbc-foodr-api.herokuapp.com/products/' + upc + "?user_id=" + this.state.userId)
    fetch('http://localhost:3000/products/' + upc + "?user_id=" + this.state.userId)
    .then((data) => data.json())
    .then((jsonData) => {
      this.setState({ foundProduct: jsonData })
      if (this.state.foundProduct.found) {
        this.updateCurrentPage('productPage')
      } else {
        this.updateCurrentPage('noResultsPage')
      }
    });
  }

  updateCurrentPage(pageName) {
    this.setState({currentPage: pageName})
  }

  render() {
    switch(this.state.currentPage) {
      case 'searching':
        return(
          <Searching />
        )
      case 'indexPage':
        return(
          <IndexPage />
        )
      case 'cameraPage':
        return(
          <CameraPage
            searchProduct = {this.searchProduct}
          />
        )
      case 'productPage':
        return(
          <ProductPage
            foundProduct = {this.state.foundProduct}
          />
        )
      case 'noResultsPage':
        return(
          <NoResultsPage
            updateCurrentPage = {this.updateCurrentPage}
          />
        )
      case 'searchPage':
        return(
          <SearchPage />
        )
      default:
        return(
          <IndexPage />
        )
    }
  }
}

class CameraPage extends Component {
  constructor() {
    super()
    this.onBarCodeRead = this.onBarCodeRead.bind(this)
    this.takePicture = this.takePicture.bind(this)
  }

  onBarCodeRead(e) {
    this.props.searchProduct(e.data)
  }

  // for testing
  takePicture() {
    this.props.searchProduct('03077504')
    // this.props.searchProduct('asdf')
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


        <Text style={styles.capture} onPress={this.takePicture}>[CAPTURE]</Text>


      </View>
    );
  }
}

class ProductPage extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.welcome} >Product Page</Text>
        <Text>{this.props.foundProduct.product.name}</Text>
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
    this.props.updateCurrentPage('cameraPage')
  }

  goToSearch() {
    this.props .updateCurrentPage('searchPage')
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

class Searching extends Component {
  render() {
    return(
      <View style={styles.container}>
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
});

AppRegistry.registerComponent('FoodrFrontend', () => FoodrFrontend);
