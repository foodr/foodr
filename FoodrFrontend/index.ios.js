import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Button,
  ActivityIndicator,
  Image,
  Modal,
  TouchableHighlight,
  AlertIOS,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Camera from 'react-native-camera';
import NavigationBar from 'react-native-navbar';

// PARENT

export default class FoodrFrontend extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: 'SearchPage',
      previousPage: 'DefaultPage',
      foundProduct: {},
      foundProductSaved: false,
      userId: false, // false if not logged in
      searchTerm: ''
    }
    this.updateCurrentPage = this.updateCurrentPage.bind(this)
    this.searchProduct = this.searchProduct.bind(this)
    this.updateSearchTerm = this.updateSearchTerm.bind(this)
    this.saveSearch = this.saveSearch.bind(this)
  }

  searchProduct(upc) {
    this.updateCurrentPage('SearchingPage')

    fetch('https://dbc-foodr-api.herokuapp.com/products/' + upc + "?user_id=" + this.state.userId)
    // fetch('http://localhost:3000/products/' + upc + "?user_id=" + this.state.userId)
    .then((data) => data.json())
    .then((jsonData) => {
      this.setState({ foundProduct: jsonData })
      if (this.state.foundProduct.found) {
        this.setState({foundProductSaved: jsonData.search.is_saved})
        this.updateCurrentPage('ProductPage')
      } else {
        this.updateCurrentPage('NoResultsPage')
      }
    });
  }

  saveSearch(searchId) {
    if (this.state.userId) {
      fetch('http://localhost:3000/searches/' + searchId + '/save', {method: 'POST'})
      .then(data => data.json())
      .then(jsonData => {
        if (jsonData.save_successful) {
          this.setState({foundProductSaved: true});
          AlertIOS.alert('Product Saved!');
        } else {
          this.setState({foundProductSaved: false});
          AlertIOS.alert('Product was not saved.');
        }
      })
    } else {
      AlertIOS.alert('Please sign up or login to save an item.');
    }
  }

  updateCurrentPage(pageName) {
    this.setState({currentPage: pageName})
  }

  updateSearchTerm(searchTerm) {
    this.setState({searchTerm: searchTerm})
  }

  render() {
    const titleConfig = {
      title: 'FOODR',
    };

    const leftButtonConfig = {
      title: 'Profile',
      handler: () => this.updateCurrentPage('UserProfilePage'),
    };

    const rightButtonConfig = {
      title: 'Scan',
      handler: () => this.updateCurrentPage('CameraPage'),
    };

    switch(this.state.currentPage) {
      case 'IndexPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              style={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <ScrollView>
              <IndexPage
              updateCurrentPage = {this.updateCurrentPage} />
            </ScrollView>
          </View>
        )
      case 'SearchPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              style={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <ScrollView>
              <SearchPage
                searchProduct = {this.searchProduct}
                updateSearchTerm = {this.updateSearchTerm}
              />
            </ScrollView>
          </View>
        )
      case 'CameraPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              style={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
            />
            <ScrollView>
              <CameraPage
                updateCurrentPage = {this.updateCurrentPage}
                searchProduct = {this.searchProduct}
                updateSearchTerm = {this.updateSearchTerm}
              />
            </ScrollView>
          </View>
        )
      case 'ProductPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              style={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <ScrollView>
              <ProductPage
                foundProduct = {this.state.foundProduct}
                foundProductSaved = {this.state.foundProductSaved}
                updateCurrentPage = {this.updateCurrentPage}
                saveSearch = {this.saveSearch}
              />
            </ScrollView>
        </View>
        )
      case 'NoResultsPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              style={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <ScrollView>
              <NoResultsPage
                updateCurrentPage = {this.updateCurrentPage}
                searchTerm = {this.state.searchTerm}
                />
            </ScrollView>
          </View>
        )
      case 'SearchingPage':
        return(
          <SearchingPage />
        )
      case 'UserProfilePage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              style={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <ScrollView>
              <UserProfilePage />
            </ScrollView>
          </View>
        )
      default:
        return(
          <DefaultPage />
        )
    }
  }
}

// CHILDREN

// VICTORIA

class CameraPage extends Component {
  constructor() {
    super()
    this.onBarCodeRead = this.onBarCodeRead.bind(this)
    this.onPressSearchButton = this.onPressSearchButton.bind(this)

    // for testing
    this.existingItem = this.existingItem.bind(this)
    this.nonExistingItem = this.nonExistingItem.bind(this)
  }

  onBarCodeRead(e) {
    this.props.updateSearchTerm('Product')
    this.props.searchProduct(e.data)
  }

  onPressSearchButton(){
    this.props.updateCurrentPage("SearchPage")
  }

  // for testing
  existingItem() {
    this.props.updateSearchTerm('Product')
    this.props.searchProduct('03077504')
  }

  nonExistingItem() {
    this.props.updateSearchTerm('Product')
    this.props.searchProduct('asdf')
  }

  render() {
    return(
      <View style={styles.body}>
        <Text style={styles.header}>Place Barcode in View</Text>
        <Camera
          ref={(cam) => {this.camera = cam;}}
          style={styles.preview}
          onBarCodeRead = {this.onBarCodeRead}
          aspect={Camera.constants.Aspect.fill}>
        </Camera>
        <Text style={styles.small_content}>The camera will automatically detect when a barcode is present</Text>

        <Text style={styles.small_content}>{"\n\n"}No item to scan?</Text>

        <TouchableOpacity>
          <Button
            title="Enter a Search Term"
            onPress={this.onPressSearchButton}
          />
          <Button
            title="Test: Existing Item"
            onPress={this.existingItem}
            color='red'
          />
          <Button
            title="Test: Nonexisting Item"
            onPress={this.existingItem}
            color='red'
          />
        </TouchableOpacity>
      </View>
    );
  }
}

// TIFF

class ProductPage extends Component {
  constructor() {
    super()
    this.saveItem = this.saveItem.bind(this)
  }

  saveItem() {
    this.props.saveSearch(this.props.foundProduct.search.id);
  }

  scoreConverter() {
    let numberScore = this.props.foundProduct.product.score
      switch(numberScore) {
        case 5:
          return ('A');
        case 4:
          return ('B');
        case 3:
          return ('C');
        case 2:
          return ('D');
        case 1:
          return ('F');
        default:
          return ('Not Found');
      }
  }

  renderIngredientList() {
    return this.props.foundProduct.ingredients.map(ingredient =>
      <View key={ingredient.id}>
        { ingredient.is_natural ?
          <Image
            style={{width: 50, height: 50}}
            source={{uri: "https://image.flaticon.com/icons/png/512/32/32070.png"}}
          />
          :
          <Image
            style={{width: 50, height: 50}}
            source={{uri: "https://d30y9cdsu7xlg0.cloudfront.net/png/909435-200.png"}}
          />
         }

        <IngredientModal ingredient = {ingredient} />
      </View>
    );
  }

  render() {
    return(
      <View>
        <Image
          style={{width: 375, height: 200}}
        source={{uri: this.props.foundProduct.product.img_url}}
        />
        <Text style={styles.header}>{this.props.foundProduct.product.name}</Text>
        <Text>Score: {this.scoreConverter()}</Text>

        {this.props.foundProductSaved ?
          <Text>Product is Saved</Text>
          :
          <Button
            onPress={this.saveItem}
            title="Save Product"
          />
        }

        <Text>Ingredients:</Text>
        {this.renderIngredientList()}

      </View>
    )
  }
}

class IngredientModal extends Component {
  constructor() {
    super()
    this.state = {
      modalVisible: false
    }
    this.setModalVisible = this.setModalVisible.bind(this)
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={{marginTop: 22}}>

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
          <View>
            <Image
              style={{width: 375, height: 200}}
            source={{uri: this.props.ingredient.img_url}}
            />

            <Text style={styles.header}>{this.props.ingredient.name}</Text>
            <Text>{this.props.ingredient.description}</Text>

            <TouchableHighlight onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>

          </View>
        </Modal>

        <TouchableHighlight onPress={() => {this.setModalVisible(true)}}>
          <Text>{this.props.ingredient.name}</Text>
        </TouchableHighlight>

      </View>
    );
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
      <View>
        <Text style={styles.header}>{this.props.searchTerm} was not found</Text>
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

// KANAN

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
      <View style={styles.body}>
        <Text style={styles.header}>Search for a Product:</Text>
        <TextInput
          placeholder="Enter a Product Name or UPC"
          placeholderTextColor='#949799'
          returnKeyType="search"
          keyboardType="default"
          style={styles.input}
          onChangeText={(text) => this.setState({text})}
          onSubmitEditing={this.startSearch}
        />
        <TouchableOpacity>
          <Button title="Search" onPress={this.startSearch}/>
        </TouchableOpacity>
      </View>
    )
  }
}

// KANAN

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
      <View>
        <TouchableOpacity>
          <Button title="Scan Product" onPress={this._onPressScanButton} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button title="Search Product" onPress={this._onPressSearchButton} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button onPress={this._onPressSignUpButton} title="Sign Up" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button onPress={this._onPressSignInButton} title="Sign In" />
        </TouchableOpacity>
      </View>
    );
  }
}

// DONE

class SearchingPage extends Component {
  render() {
    return(
      <View style={styles.body}>
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

class UserProfilePage extends Component {
  render() {
    return(
      <View style={styles.body}>
        <Text style={styles.header}>User Profile Page</Text>
        <Text>This is where the users info will go.</Text>
      </View>
    );
  }
}

class DefaultPage extends Component {
  render() {
    return(
      <View style={styles.body}>
        <Text style={styles.header}>Default Page</Text>
        <Text>The case statement hit default</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 300,
    borderRadius: 10,
    margin: 10,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
  },
  buttonContainer: {
    backgroundColor: "green",
    borderRadius: 15,
    padding: 5
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  small_content: {
    textAlign: 'center',
    margin: 10,
  },
  preview: {
    height: 300,
    width: '100%',
  },
  activityIndicator: {
    marginBottom: 20,
  },
  navbar: {
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#EAF1F4',
  },
});

AppRegistry.registerComponent('FoodrFrontend', () => FoodrFrontend);
