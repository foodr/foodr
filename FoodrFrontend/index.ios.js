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
  AlertIOS,
  TextInput,
  TouchableOpacity,
  ListView
} from 'react-native';
import Camera from 'react-native-camera';
import NavigationBar from 'react-native-navbar';

// PARENT

export default class FoodrFrontend extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: 'IndexPage',
      foundProduct: {},
      userDetails: {},
      foundProductSaved: false,
      userId: false, // false if not logged in
      searchTerm: ''
    }
    this.updateCurrentPage = this.updateCurrentPage.bind(this)
    this.searchProduct = this.searchProduct.bind(this)
    this.updateSearchTerm = this.updateSearchTerm.bind(this)
    this.saveSearch = this.saveSearch.bind(this)
    this.findUser = this.findUser.bind(this)
    this.logout = this.logout.bind(this)
  }

  logout() {
    this.setState({userId: false})
    this.updateCurrentPage('IndexPage')
  }

  searchProduct(upc) {
    this.updateCurrentPage('SearchingPage')

    // fetch('https://dbc-foodr-api-vc.herokuapp.com/products/' + upc + "?user_id=" + this.state.userId)
    fetch('http://localhost:3000/products/' + upc + "?user_id=" + this.state.userId)
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

  findUser(){
    if (this.state.userId) {
      // fetch('https://dbc-foodr-api-vc.herokuapp.com/users/' + this.state.userId)
      fetch('http://localhost:3000/users/' + this.state.userId)
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
    const titleConfig = {
      title: 'FOODR',
    };



    const leftButtonConfig =
      this.state.userId ?
        {
          title: 'Profile',
          handler: () => this.findUser(),
        }
      :
        {
          title: 'Login',
          handler: () => this.updateCurrentPage('LoginPage'),
        }
      ;

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
            <IndexPage
              updateCurrentPage = {this.updateCurrentPage}
            />
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
      case 'LoginPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              style={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <LoginPage />
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
            <NoResultsPage
              updateCurrentPage = {this.updateCurrentPage}
              searchTerm = {this.state.searchTerm}
              />
          </View>
        )
      case 'SearchingPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              style={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <SearchingPage />
          </View>
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
              <UserProfilePage
                userDetails = {this.state.userDetails}
                searchProduct = {this.searchProduct}
                logout = {this.logout}
              />
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
          return ('No Grade Yet');
      }
  }

  handleButtonPress(productName) {
    return this.props.searchProduct(productName)
  }


render() {
    return(
      <View style={styles.centerContainer}>
        <Text style={styles.header}>Your Profile</Text>
        <Text> {this.props.userDetails.user.email} </Text>
        <Text> Your health grade: {this.scoreConverter()} </Text>
        <TouchableOpacity>
          <Button
            onPress={this.props.logout}
            title="Logout"
          />
        </TouchableOpacity>

        <Text style={styles.header}>Saved Products</Text>
        <ListView
          dataSource={this.state.savedProducts}
          renderRow={(rowData) => <Button title={rowData.name} onPress={() => this.handleButtonPress(rowData.name)}/>}
        />

        <Text style={styles.header}>Recent Searches</Text>
        <ListView
          dataSource={this.state.recentSearches}
          renderRow={(rowData) => <Button title={rowData.name} onPress={() => this.handleButtonPress(rowData.name)}/>}
        />
      </View>
    );
  }
}

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
          style={styles.cameraView}
          onBarCodeRead = {this.onBarCodeRead}
          aspect={Camera.constants.Aspect.fill}>
        </Camera>
        <Text style={styles.contentSmall}>The camera will automatically detect when a barcode is present</Text>

        <Text style={styles.contentSmall}>{"\n\n"}No item to scan?</Text>

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
            onPress={this.nonExistingItem}
            color='red'
          />
        </TouchableOpacity>
      </View>
    );
  }
}

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
      <View style={styles.inlineContainer} key={ingredient.id}>
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
      <View style={styles.body}>
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

        <Text style={styles.header}>Ingredients:</Text>
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
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
        >
          <ScrollView style={{marginTop: 22}}>
            <Image
              style={{width: 375, height: 200}}
              source={{uri: this.props.ingredient.img_url}}
            />

            <Text style={styles.header}>{this.props.ingredient.name}</Text>
            <Text style={styles.contentSmall}>{this.props.ingredient.description}</Text>

            <TouchableOpacity>
              <Button
                onPress={() => {this.setModalVisible(!this.state.modalVisible)}}
                title="Back to Product"
              />
            </TouchableOpacity>
          </ScrollView>
        </Modal>

        <TouchableOpacity>
          <Button
            onPress={() => {this.setModalVisible(true)}}
            title={this.props.ingredient.name}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

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
      <View style={styles.centerContainer}>
        <Text style={styles.header}>{this.props.searchTerm} was not found</Text>
        <Text style={styles.contentSmall}>Would you like to try another product?</Text>
        <TouchableOpacity>
          <Button
           title="Scan a Product"
           onPress={this.scanAgain}
          />
        </TouchableOpacity>

        <Text>or</Text>

        <TouchableOpacity>
          <Button
           title="Enter a Search Term"
           onPress={this.searchAgain}
          />
        </TouchableOpacity>
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
      <View style={styles.centerContainer}>
        <TouchableOpacity>
          <Button title="Scan Product" onPress={this._onPressScanButton} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button title="Search Product" onPress={this._onPressSearchButton} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button onPress={this._onPressSignUpButton} title="Sign Up" />
        </TouchableOpacity>
      </View>
    );
  }
}

class SearchingPage extends Component {
  render() {
    return(
      <View style={styles.centerContainer}>
        <ActivityIndicator
          animating = {true}
          size = 'large'
          style={{marginBottom: 20}}
        />
        <Text>Searching...</Text>
      </View>
    );
  }
}

class LoginPage extends Component {
  render() {
    return(
      <View style={styles.centerContainer}>
        <Text style={styles.header}>Login Page</Text>
      </View>
    );
  }
}

// FOR TESTING

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
    backgroundColor: '#F5FCFF',
  },
  inlineContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  contentSmall: {
    textAlign: 'center',
    margin: 10,
  },
  cameraView: {
    height: 300,
    width: '100%',
  },
  navbar: {
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#EAF1F4',
  },
});

AppRegistry.registerComponent('FoodrFrontend', () => FoodrFrontend);
