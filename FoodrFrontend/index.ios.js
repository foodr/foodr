import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  ActivityIndicator,
  Image,
  Modal,
  TouchableHighlight,
  AlertIOS,
  TextInput,
  TouchableOpacity,
  // FlatLst,
  ListView
} from 'react-native';
import Camera from 'react-native-camera';

// PARENT

export default class FoodrFrontend extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: 'IndexPage',
      previousPage: 'DefaultPage',
      foundProduct: {},
      userDetails: {},
      userId: false, // false if not logged in
      searchTerm: ''
    }
    this.updateCurrentPage = this.updateCurrentPage.bind(this)
    this.searchProduct = this.searchProduct.bind(this)
    this.updateSearchTerm = this.updateSearchTerm.bind(this)
    this.saveSearch = this.saveSearch.bind(this)
    this.findUser = this.findUser.bind(this)
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

  saveSearch(searchId) {
    if (this.state.userId) {
      fetch('http://localhost:3000/searches/' + searchId + '/save', {method: 'POST'})
      .then(data => data.json())
      .then(jsonData => {
        if (jsonData.save_successful) {
          AlertIOS.alert('Product Saved!');
        } else {
          AlertIOS.alert('Product was not saved.');
        }
      })
    } else {
      AlertIOS.alert('Please sign up or login to save an item.');
    }
  }

  findUser(){
    if (this.state.userId) {
      fetch('https://dbc-foodr-api.herokuapp.com/users/' + this.state.userId)
      //fetch('http://localhost:3000/users/' + this.state.userId)
      .then(data => data.json())
      .then(jsonData => {
        this.setState({ userDetails: jsonData })
        if (this.state.userDetails.found) {
          this.updateCurrentPage('UserProfilePage')
        } else {
          AlertIOS.alert('You are not a registered user. Please sign up.');
          this.updateCurrentPage('IndexPage');
        }
      })
    } else {
      AlertIOS.alert('Please sign up or login to access your profile.');
    }
  }

  updateCurrentPage(pageName) {
    this.setState({currentPage: pageName})
  }

  updateSearchTerm(searchTerm) {
    this.setState({searchTerm: searchTerm})
  }

  render() {
    switch(this.state.currentPage) {
      case 'IndexPage':
        return(
          <IndexPage 
          updateCurrentPage = {this.updateCurrentPage} 
          findUser = {this.findUser}/>
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
            saveSearch = {this.saveSearch}
          />
        )
      case 'NoResultsPage':
        return(
          <NoResultsPage
            updateCurrentPage = {this.updateCurrentPage}
            searchTerm = {this.state.searchTerm}
            />
        )
        case 'UserProfilePage':
        return(
          <UserProfilePage
          userDetails = {this.state.userDetails}
          searchProduct = {this.searchProduct}
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



class UserProfilePage extends Component {
  constructor(props){
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      savedProducts: ds.cloneWithRows(this.props.userDetails.saved_products),
      recentSearches: ds.cloneWithRows(this.props.userDetails.searched_products),
    };
    this.scoreConverter = this.scoreConverter.bind(this) 
    this.handleButtonPress = this.handleButtonPress.bind(this)
  }

  scoreConverter() {
      switch(this.props.userDetails.user_grade) {
        case "5.0":
          return ('A');
        case "4.0":
          return ('B');
        case "3.0":
          return ('C');
        case "2.0":
          return ('D');
        case "1.0":
          return ('F');
        default:
          ('Not Found');
      }
  }

  handleButtonPress(productName) {
    return this.props.searchProduct(productName)
  }

  
render() {
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>USER PROFILE</Text>
        <Text> {this.props.userDetails.user.email} </Text>
        <Text> Your health grade for the day: {this.scoreConverter()} </Text>
        <Text style={styles.welcome}> Your saved products are: </Text>
        <ListView
          dataSource={this.state.savedProducts}
          renderRow={(rowData) => <Button title={rowData.name} onPress={() => this.handleButtonPress(rowData.name)}/>}
        />
        <Text style={styles.welcome}> You recently searched: </Text>
        <ListView
          dataSource={this.state.recentSearches}
          renderRow={(rowData) => <Button title={rowData.name} onPress={() => this.handleButtonPress(rowData.name)}/>}
        />
      </View>
    );
  } 
}
// CHILDREN

// XANDER

class LayoutPage extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Text>Layout Page</Text>
      </View>
    )
  }
}

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
          ('Not Found');
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
      <View style={styles.container}>
        <Image
          style={{width: 375, height: 200}}
        source={{uri: this.props.foundProduct.product.img_url}}
        />
        <Text style={styles.welcome}>{this.props.foundProduct.product.name}</Text>
        <Text>Score: {this.scoreConverter()}</Text>

        <Text>Ingredients:</Text>
        {this.renderIngredientList()}

        <Button
          onPress={this.saveItem}
          title="Save Product"
        />
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
          <View style={styles.container}>
            <Image
              style={{width: 375, height: 200}}
            source={{uri: this.props.ingredient.img_url}}
            />

            <Text style={styles.welcome}>{this.props.ingredient.name}</Text>
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
        <Button title="Search Product" color="#fffaf0" onPress={this.startSearch}/>
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
    backgroundColor: 'green',
    color: '#fffaf0',
    fontWeight: "200",
    marginBottom: 20,
    paddingHorizontal: 5
  },
  buttonContainer: {
    backgroundColor: "green",
    borderRadius: 15,
    padding: 5
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