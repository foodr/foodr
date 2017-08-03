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
  TouchableHighlight,
  TouchableWithoutFeedback,
  ListView,
  KeyboardAvoidingView,
  StatusBar,
  ImageBackground
} from 'react-native';
import Camera from 'react-native-camera';
import NavigationBar from 'react-native-navbar';
import GlobalFont from 'react-native-global-font';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class FoodrFrontend extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: 'IndexPage',
      foundProduct: {},
      userDetails: {},
      foundProductSaved: false,
      searchResults: {},
      userId: false, // false if not logged in
      searchTerm: ''
    }

    this.updateCurrentPage = this.updateCurrentPage.bind(this)
    this.searchUPC = this.searchUPC.bind(this)
    this.searchName = this.searchName.bind(this)
    this.updateSearchTerm = this.updateSearchTerm.bind(this)
    this.saveSearch = this.saveSearch.bind(this)
    this.findUser = this.findUser.bind(this)
    this.authenticateUser = this.authenticateUser.bind(this)
    this.logout = this.logout.bind(this)
    this.createUser = this.createUser.bind(this)
  }

  componentWillMount() {
   let fontName = 'Muli'
   GlobalFont.applyGlobal(fontName)
  }

  logout() {
    this.setState({userId: false})
    this.updateCurrentPage('IndexPage')
  }

  searchUPC(upc) {
    this.updateCurrentPage('SearchingPage')

    fetch('https://dbc-foodr-api-vc.herokuapp.com/products/upc/' + upc + "?user_id=" + this.state.userId)
    // fetch('http://localhost:3000/products/upc/' + upc + "?user_id=" + this.state.userId)
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

  searchName(name) {
    this.updateCurrentPage('SearchingPage')

    fetch('https://dbc-foodr-api-vc.herokuapp.com/products/name/' + name + "?user_id=" + this.state.userId)
    // fetch('http://localhost:3000/products/name/' + name + "?user_id=" + this.state.userId)
    .then((data) => data.json())
    .then((jsonData) => {
      // Detects if an exact match was found
      if (jsonData.found) {
        this.setState({ foundProduct: jsonData })
        this.setState({ foundProductSaved: jsonData.search.is_saved})
        this.updateCurrentPage('ProductPage')
      // Detects if fuzzy search returned any possible matches
      } else if (jsonData.matches.length > 0) {
        this.setState({ searchResults: jsonData })
        this.updateCurrentPage('ResultsPage')
      } else {
        this.updateCurrentPage('NoResultsPage')
      }
    });
  }

  saveSearch(searchId) {
    if (this.state.userId) {
      fetch('https://dbc-foodr-api-vc.herokuapp.com/searches/' + searchId + '/save', {method: 'POST'})
      // fetch('http://localhost:3000/searches/' + searchId + '/save', {method: 'POST'})
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

  authenticateUser(email, password) {
    fetch('https://dbc-foodr-api-vc.herokuapp.com/users/login?email=' + email + '&password=' + password)
    // fetch('http://localhost:3000/users/login?email=' + email + '&password=' + password)
    .then(data => data.json())
    .then(jsonData => {
      if (jsonData.found) {
        this.setState({userId: jsonData.id})
        this.updateCurrentPage('IndexPage')
        AlertIOS.alert('Login Successful!')
      } else {
        AlertIOS.alert(jsonData.errors.join("\n"))
      }
    })
  }

  findUser(){
    if (this.state.userId) {
      fetch('https://dbc-foodr-api-vc.herokuapp.com/users/profile/' + this.state.userId)
      // fetch('http://localhost:3000/users/profile/' + this.state.userId)
      .then(data => data.json())
      .then(jsonData => {
        this.setState({ userDetails: jsonData })
        if (this.state.userDetails.found) {
          this.updateCurrentPage('UserProfilePage')
        } else {
          AlertIOS.alert('You are not a registered user. Please sign up.');
          this.setState({userId: false})
          this.updateCurrentPage('IndexPage');
        }
      })
    } else {
      AlertIOS.alert('Please sign up or login to access your profile.');
    }
  }

  createUser(email, password) {
    fetch('https://dbc-foodr-api-vc.herokuapp.com/users?email=' + email + '&password=' + password, {method: 'POST'})
    // fetch('http://localhost:3000/users?email=' + email + '&password=' + password, {method: 'POST'})
    .then(data => data.json())
    .then(jsonData => {
      if (jsonData.saved) {
        AlertIOS.alert('Registration Successful!')
        this.setState({userId: jsonData.user.id})
        this.updateCurrentPage('IndexPage')
      } else {
        AlertIOS.alert(jsonData.errors.join("\n"))
      }
    })
  }

  updateCurrentPage(pageName) {
    this.setState({currentPage: pageName})
  }

  updateSearchTerm(searchTerm) {
    this.setState({searchTerm: searchTerm})
  }

  render() {
    const titleConfig = {
      title: 'foodr',
      tintColor: 'white',
      style: {
        fontSize: 25,
        fontWeight: 'bold',
      }
    };

    const navbarButtonColor = 'white'

    const leftButtonConfig =
      this.state.userId ?
        {
          title: 'Profile',
          handler: () => this.findUser(),
          tintColor: navbarButtonColor,
        }
      :
        {
          title: 'Login',
          handler: () => this.updateCurrentPage('LoginPage'),
          tintColor: navbarButtonColor,
        }
      ;

    const rightButtonConfig = {
      title: 'Scan',
      handler: () => this.updateCurrentPage('CameraPage'),
      tintColor: navbarButtonColor,
    };

    switch(this.state.currentPage) {
      case 'IndexPage':
        return(
          <View style={styles.parentContainer}>
            <IndexPage
              updateCurrentPage = {this.updateCurrentPage}
              userId = {this.state.userId}
            />
          </View>
        )
      case 'SearchPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              containerStyle={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <SearchPage
              searchName = {this.searchName}
              updateSearchTerm = {this.updateSearchTerm}
            />
          </View>
        )
      case 'CameraPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              containerStyle={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
            />
            <ScrollView>
              <CameraPage
                updateCurrentPage = {this.updateCurrentPage}
                searchUPC = {this.searchUPC}
                updateSearchTerm = {this.updateSearchTerm}
              />
            </ScrollView>
          </View>
        )
      case 'ProductPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              containerStyle={styles.navbar}
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
      case 'ResultsPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              containerStyle={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <ScrollView>
              <ResultsPage
                searchName = {this.searchName}
                searchResults = {this.state.searchResults}
              />
            </ScrollView>
          </View>
        )
      case 'LoginPage':
         return(
           <View style={styles.parentContainer}>
             <NavigationBar
               containerStyle={styles.navbar}
               leftButton={leftButtonConfig}
               title={titleConfig}
               rightButton={rightButtonConfig}
             />
             <LoginPage
               authenticateUser={this.authenticateUser}
               updateCurrentPage = {this.updateCurrentPage}
             />
           </View>
         )
      case 'SignUpPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              containerStyle={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <SignUpPage
              createUser={this.createUser}
            />
          </View>
        )
      case 'NoResultsPage':
        return(
          <View style={styles.parentContainer}>
            <NavigationBar
              containerStyle={styles.navbar}
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
              containerStyle={styles.navbar}
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
              containerStyle={styles.navbar}
              leftButton={leftButtonConfig}
              title={titleConfig}
              rightButton={rightButtonConfig}
            />
            <ScrollView>
              <UserProfilePage
                userDetails = {this.state.userDetails}
                searchUPC = {this.searchUPC}
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

class LoginPage extends Component {
  constructor(){
    super();
    this.state = {
      em: '',
      pw: ''
    }
    this.loginUser = this.loginUser.bind(this)
    this._onPressSignUpButton = this._onPressSignUpButton.bind(this)
  }

  loginUser(){
    this.props.authenticateUser(this.state.em, this.state.pw)
  }

  _onPressSignUpButton(){
    this.props.updateCurrentPage("SignUpPage")
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.centerContainer}>
        <Text style={styles.header}>Login</Text>
        <TextInput
          placeholder="email"
          placeholderTextColor='#949799'
          returnKeyType="next"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onChangeText={(em) => this.setState({em})}
          onSubmitEditing={() => this.passwordInput.focus()}
        />
        <TextInput
          placeholder="password"
          placeholderTextColor='#949799'
          returnKeyType="go"
          keyboardType="default"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onChangeText={(pw) => this.setState({pw})}
          ref={(input) => this.passwordInput = input}
          onSubmitEditing={this.loginUser}
        />
        <TouchableOpacity>
          <Button title="Login" onPress={this.loginUser}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Don't have an account?</Text>
          <Button title="Sign Up" onPress={this._onPressSignUpButton} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
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
    return this.props.searchUPC(productName)
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
          renderRow={(rowData) => <Button title={rowData.name} onPress={() => this.handleButtonPress(rowData.upc)}/>}
        />

        <Text style={styles.header}>Recent Searches</Text>
        <ListView
          dataSource={this.state.recentSearches}
          renderRow={(rowData) => <Button title={rowData.name} onPress={() => this.handleButtonPress(rowData.upc)}/>}
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
    this.props.searchUPC(e.data)
  }

  onPressSearchButton() {
    this.props.updateCurrentPage("SearchPage")
  }

  // for testing
  existingItem() {
    this.props.updateSearchTerm('Product')
    this.props.searchUPC('03077504')
  }

  nonExistingItem() {
    this.props.updateSearchTerm('Product')
    this.props.searchUPC('asdf')
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
      <View key={ingredient.id}>
        <IngredientModal ingredient = {ingredient} />
      </View>
    );
  }

  render() {
    return(
      <View style={styles.productContainer}>
        <Grid>
          <Col style={{ width: 120 }}>
            <Image
              style={{ width: 115, height: 120 }}
              source={{uri: this.props.foundProduct.product.img_url}}
            />
          </Col>
          <Col>
            <Row style={{ height: 73 }}>
              <Text style={{ fontSize: 20, lineHeight: 24, paddingTop: 25, paddingBottom: 0, marginBottom: 0, height: 73  }}>{this.props.foundProduct.product.name}</Text>
            </Row>
            <Row>
              <Text style={{ fontSize: 14 }}>food score: {this.scoreConverter()}</Text>
            </Row>
          </Col>
        </Grid>

        <View style={styles.grayContainer}>
          <Text style={styles.textSmall}>Ingredients:</Text>
          {this.renderIngredientList()}
        </View>

        {this.props.foundProductSaved ?
          <Text>Product is Saved</Text>
          :
          <Button
            onPress={this.saveItem}
            title="Save Product"
            />
        }
      </View>
    )
  }
}

class ResultsPage extends Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      results: ds.cloneWithRows(this.props.searchResults.matches)
    }
    this.handleButtonPress = this.handleButtonPress.bind(this)
  }

  handleButtonPress(productName) {
    return this.props.searchName(productName)
  }

  render() {
    return(
      <View style={styles.body}>
        <Text style={styles.header}>Possible Matches:</Text>
        <ListView
          dataSource={this.state.results}
          renderRow={(rowData) => <Button title={rowData.name} onPress={() => this.handleButtonPress(rowData.name)}/>}
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
      <View>
        <TouchableOpacity style={styles.ingredientButton}>
          { this.props.ingredient.is_natural ?
          <Image
            style={{width: 30, height: 30}}
            source={{uri: "https://image.flaticon.com/icons/png/512/32/32070.png"}}
          />
          :
          <Image
            style={{width: 30, height: 30}}
            source={{uri: "https://d30y9cdsu7xlg0.cloudfront.net/png/909435-200.png"}}
          />
         }
          <Button
            onPress={() => {this.setModalVisible(true)}}
            title={this.props.ingredient.name}
          />
        </TouchableOpacity>


        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
        >
          <ScrollView style={{marginTop: 22}}>

            <View style={styles.ingredientContainer}>

              { this.props.ingredient.is_natural ?
                <Grid style={styles.ingredientTopNatural}>
                  <Col><Text style={{color: '#ffffff', padding: 10}}>Natural</Text></Col>
                  <Col style={{padding: 15}}>
                    <TouchableWithoutFeedback onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
                      <Image
                        style={styles.closeButton}
                        source={require('./img/close.png')}
                      />
                    </TouchableWithoutFeedback>
                  </Col>
                </Grid>
                :
                <Grid style={styles.ingredientTopArtificial}>
                  <Col><Text style={{color: '#ffffff', padding: 13}}>Artificial</Text></Col>
                  <Col style={{padding: 15}}>
                    <TouchableWithoutFeedback onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
                      <Image
                        style={styles.closeButton}
                        source={require('./img/close.png')}
                      />
                    </TouchableWithoutFeedback>
                  </Col>
                </Grid>

               }

             <Image
               style={styles.ingredientImage}
               source={{uri: this.props.ingredient.img_url}}
             />

            <Text style={[styles.textLarge, styles.ingredientName]}>{this.props.ingredient.name}</Text>
            <Text style={[styles.textMedium, styles.ingredientDescription]}>{this.props.ingredient.description}</Text>
          </View>
          </ScrollView>
        </Modal>
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
  constructor() {
    super();
    this.state = {
      text: ''
    };
    this.startSearch = this.startSearch.bind(this)
  }

  startSearch() {
    if (this.state.text === '') {
      AlertIOS.alert('Please enter a search term')
    } else {
      this.props.updateSearchTerm(this.state.text)
      this.props.searchName(this.state.text)
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.centerContainer}>
        <Text style={styles.header}>Search for a Product:</Text>
        <TextInput
          placeholder="Enter a Product Name"
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
      </KeyboardAvoidingView>
    )
  }
}

class IndexPage extends Component {
  constructor(){
    super()
    this._onPressSearchButton = this._onPressSearchButton.bind(this)
    this._onPressScanButton = this._onPressScanButton.bind(this)
    this._onPressSignUpButton = this._onPressSignUpButton.bind(this)
    this._onPressLoginButton = this._onPressLoginButton.bind(this)
  }

  _onPressSearchButton(){
    this.props.updateCurrentPage("SearchPage")
  }

  _onPressScanButton(){
    this.props.updateCurrentPage("CameraPage")
  }

  _onPressSignUpButton(){
    this.props.updateCurrentPage("SignUpPage")
  }

  _onPressLoginButton(){
    this.props.updateCurrentPage("LoginPage")
  }

  render() {
    return(
      <View>
        <StatusBar
          barStyle="light-content"
        />
        <Image source={require('./img/bg.png')}>
          <View style={styles.centerContainer}>

            <Text style={[styles.indexTitle, styles.clearBackbround]}>foodr</Text>
            <Text style={[{ marginBottom: 30 }, styles.indexTagline, styles.clearBackbround]}>Eat what's good for you.</Text>

            <TouchableOpacity style={styles.indexButtons} onPress={this._onPressScanButton}>
              <Text style={styles.indexButtonText}>Scan Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.indexButtons} onPress={this._onPressSearchButton}>
              <Text style={styles.indexButtonText}>Search Product</Text>
            </TouchableOpacity>

            {this.props.userId ?
              <View></View>
              :

              <View style={[{ marginTop: 50, alignItems: 'center' }, styles.clearBackbround]}>
                <TouchableOpacity style={styles.indexButtons} onPress={this._onPressLoginButton}>
                  <Text style={styles.indexButtonText}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.indexTagline}>New User?
                  <Text style={styles.indexRegisterText} onPress={this._onPressSignUpButton}> Register account.</Text>
                </Text>
              </View>
            }
          </View>
        </Image>
      </View>
    )

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

class SignUpPage extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit() {
    this.props.createUser(this.state.email, this.state.password)
  }

  render() {
    return(
      <KeyboardAvoidingView behavior="padding" style={styles.centerContainer}>
        <Text style={styles.header}>Sign Up</Text>
        <TextInput
          placeholder="Enter your e-mail address"
          placeholderTextColor='#949799'
          style={styles.input}
          returnKeyType="next"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(email) => this.setState({email})}
          onSubmitEditing={() => {this.passwordInput.focus()}}
        />

        <TextInput
          placeholder="Enter a password"
          placeholderTextColor='#949799'
          style={styles.input}
          returnKeyType="done"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          ref={(input) => this.passwordInput = input}
          onChangeText={(password) => this.setState({password})}
          onSubmitEditing={this.handleSubmit}
        />
        <TouchableOpacity>
          <Button title="Submit" onPress={this.handleSubmit}/>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    backgroundColor: '#ffffff',
  },
  productDetails: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grayContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#F7F8F9',
    paddingHorizontal: 25
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
    margin: 10,
    fontWeight: '600'
  },
  contentSmall: {
    textAlign: 'center',
    fontSize: 16,
    margin: 10,
  },
  cameraView: {
    height: 300,
    width: '100%',
  },

// Nav Bar
  navbar: {
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#00B875',
  },

// Index Page
  clearBackbround: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  indexTitle: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  indexTagline: {
    color: 'white',
    fontSize: 12,
  },
  indexButtons: {
    backgroundColor: '#00B875',
    padding: 10,
    margin: 5,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
  },
  indexButtonText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 25,
  },
  indexRegisterText: {
    fontWeight: 'bold',
  },


// Product Page
  productImage: {
    width: 115,
    height: 120,
  },
  ingredientButton: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 3,
    margin: 3,

    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },


// Ingredient Page
  ingredientContainer: {
    borderWidth: 1,
    borderRadius: 5,
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 25,
    borderColor: '#C7C7C7'
  },
  ingredientTopNatural: {
    backgroundColor: '#FFD45C'
  },
  ingredientTopArtificial: {
    backgroundColor: '#1B60AB'
  },
  ingredientImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: '#858585',
    borderWidth: 5,
    marginTop: 25
  },
  ingredientName: {
    margin: 10,
    textAlign: 'center',
    paddingTop: 5,
  },
  ingredientDescription: {
    textAlign: 'center',
    margin: 10,
    width: 250,
    fontWeight: 'normal',
    lineHeight: 20,
  },
  closeButton: {
    alignSelf: 'flex-end'
  },

// Global Styles
  textLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D0D0D',
  },
  textMedium: {
    fontSize: 16,
    fontWeight: "300",
    color: '#0D0D0D',
  },
  textSmall: {
    fontSize: 14,
    color: '#0D0D0D'
  }
});

AppRegistry.registerComponent('FoodrFrontend', () => FoodrFrontend);
