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
        this.findUser()
        this.updateCurrentPage('UserProfilePage')
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
        <TouchableOpacity style={styles.insideAppButtons} onPress={this.loginUser}>
          <Text style={styles.indexButtonText}> Go</Text>
        </TouchableOpacity>

          <Text style={styles.FormPageTagline}>Don't have an account?
          <Text style={styles.indexRegisterText} onPress={this._onPressSignUpButton}> Sign Up.</Text>
        </Text>
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
      <View>
        <View style={styles.profileScore}>
          <View><Text style={styles.textWhite}>Your health grade:</Text></View>
          <View><Text style={styles.score}>{this.scoreConverter()}</Text></View>
        </View>

        <Text style={styles.textLargeFoods}>My Foods</Text>
        <View style={styles.grayResultsContainer}>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.savedProducts}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            renderRow={(rowData) =>
              <TouchableOpacity onPress={() => this.handleButtonPress(rowData.upc)}>
                <View><Text style={[styles.textMedium, styles.listItems]}>{rowData.name}</Text></View>
              </TouchableOpacity>}
          />
        </View>

      <View style={styles.recentlySearchedContainer}>
        <Text style={styles.textSmallHeaderRecent}>recently searched</Text>
        <ListView
          enableEmptySections={true}
          horizontal={true}
          dataSource={this.state.recentSearches}
          renderRow={(rowData) =>
            <TouchableOpacity onPress={() => this.handleButtonPress(rowData.upc)}>
              <View>
                <Image
                  style={styles.productImageCircle}
                  source={{uri: rowData.img_url}}
            />
          </View>
        </TouchableOpacity>}
        />
      </View>
        <TouchableOpacity onPress={this.props.logout}>
          <Text style={styles.greenActionLink}>Log Out</Text>
        </TouchableOpacity>
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
    this.props.searchUPC('0028400344371')
  }

  nonExistingItem() {
    this.props.updateSearchTerm('Product')
    this.props.searchUPC('asdf')
  }

  render() {
    return(
      <View style={styles.body}>
        <Text style={{fontSize: 16, marginVertical: 10}}>Place Barcode in View</Text>
        <Camera
          ref={(cam) => {this.camera = cam;}}
          style={styles.cameraView}
          onBarCodeRead = {this.onBarCodeRead}
          aspect={Camera.constants.Aspect.fill}>
        </Camera>
        <Text style={styles.contentSmall}>The camera will automatically detect when a barcode is present</Text>

        <Text style={styles.textSmall}>{"\n\n"}No item to scan?</Text>


        <TouchableOpacity onPress={this.onPressSearchButton}>
          <Text style={styles.indexButtonTextInverse}> Enter Search Term </Text>
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
      <View>
        <Grid>
          <Col style={{width: 120, marginLeft: 25, marginRight: 13}}>
            <Image
              style={styles.productImage}
              source={{uri: this.props.foundProduct.product.img_url}}
            />
          </Col>
          <Col>
            <Row style={{height: 78}}>
              <Text style={[styles.textLarge, styles.productTitle]}>{this.props.foundProduct.product.name}</Text>
            </Row>
            <Row>
              <Text style={styles.textMedium}>food score: {this.scoreConverter()}</Text>
            </Row>
          </Col>
        </Grid>

        <View style={styles.grayContainer}>
          <View style={{width: 300, paddingBottom: 12}}><Text style={styles.textSmall}>ingredients:</Text></View>
          {this.renderIngredientList()}
        </View>

        {this.props.foundProductSaved ?
          <Text style={styles.grayActionLink}>Product is Saved</Text>
          :
          <TouchableOpacity onPress={this.saveItem}>
            <Text style={styles.greenActionLink}>Save Product</Text>
          </TouchableOpacity>
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
      <View>
        <Text style={styles.textSmallHeader}>possible matches</Text>

        <View style={styles.grayResultsContainer}>
          <ListView
            dataSource={this.state.results}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            renderRow={(rowData) =>
              <TouchableOpacity onPress={() => this.handleButtonPress(rowData.name)}>
                <View><Text style={[styles.textMedium, styles.listItems]}>{rowData.name}</Text></View>
              </TouchableOpacity>}
          />
        </View>
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
        <TouchableOpacity style={styles.ingredientButton} onPress={() => {this.setModalVisible(true)}}>
          { this.props.ingredient.is_natural ?
          <Image
            style={styles.ingredientIcon}
            source={require('./img/natural-icon.png')}
          />
          :
          <Image
            style={styles.ingredientIcon}
            source={require('./img/artificial-icon.png')}
          />
         }
          <Text style={styles.ingredientLabel}>{this.props.ingredient.name}</Text>
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
        <Image source={require('./img/empty.png')} style={{marginBottom: 15}} />
        <Text style={styles.textLarge}>{this.props.searchTerm} was not found</Text>
        <Text style={styles.contentSmall}>Would you like to try another product?</Text>

        <TouchableOpacity onPress={this.scanAgain}>
          <Text style={styles.greenActionLinkNoPadding}>Scan a Product</Text>
        </TouchableOpacity>
        <Text>or</Text>
        <TouchableOpacity onPress={this.searchAgain}>
          <Text style={styles.greenActionLinkNoPadding}>Enter a Search Term</Text>
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
        <TouchableOpacity style={styles.insideAppButtons} onPress={this.startSearch}>
          <Text style={styles.indexButtonText}>Search</Text>
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


          <View style={styles.logoContainer}>
            <View style={{height: 50}}><Text style={[styles.indexTitle, styles.clearBackground]}>foodr</Text></View>
          </View>
          <View>
            <View><Text style={[{textAlign: 'center', marginTop: 10, marginBottom: 30 }, styles.indexTagline, styles.clearBackground]}>Eat what's good for you.</Text></View>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={{paddingRight: 25}} onPress={this._onPressScanButton}>
              <Image source={require('./img/barcode.png')} />
              <Text style={styles.homeTextLarge}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingLeft: 25}} onPress={this._onPressSearchButton}>
              <Image style={{height: 50}} source={require('./img/search.png')} />
              <Text style={styles.homeTextLarge}>Search</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            {this.props.userId ?
              <View></View>
              :

              <View style={[{ marginTop: 50, alignItems: 'center' }, styles.clearBackground]}>
                <TouchableOpacity style={styles.indexButtons} onPress={this._onPressLoginButton}>
                  <Text style={styles.indexButtonText}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.indexTagline}>Don't have an account?
                  <Text style={styles.indexRegisterText} onPress={this._onPressSignUpButton}> Sign Up.</Text>
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
        <TouchableOpacity style={styles.insideAppButtons} onPress={this.handleSubmit}>
          <Text style={styles.indexButtonText}>Submit </Text>
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
    paddingHorizontal: 25,
    paddingVertical: 20
  },
  iconContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 75
  },
  logoContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 75
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeContainerTop: {
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
    margin: 10,
    textAlign: 'center',
    borderColor: 'white',
    borderBottomColor: '#00B875',
    borderWidth: 1,
  },
  header: {
    fontSize: 20,
    margin: 10,
    fontWeight: '600'
  },
  contentSmall: {
    textAlign: 'center',
    fontSize: 14,
    margin: 10,
    paddingHorizontal: 25
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
  clearBackground: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  indexTitle: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  indexTagline: {
    color: 'white',
    fontSize: 14,
  },
  FormPageTagline: {
    fontSize: 14,
  },
  indexButtons: {
    backgroundColor: '#00B875',
    padding: 10,
    margin: 5,
    borderRadius: 25,
    width: 200,
    alignItems: 'center'
  },
   insideAppButtons: {
    backgroundColor: '#00B875',
    padding: 10,
    margin: 5,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
    marginTop: 20
  },
  indexButtonText: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 25,
  },
  indexButtonTextInverse: {
    color: '#00B575',
    fontSize: 16,
    lineHeight: 25,
  },
  indexRegisterText: {
    fontWeight: 'bold',
  },

// Product Page
productContainer: {
  width: 120,
  marginLeft: 25,
  marginRight: 15,
  marginBottom: 5
},
productTitle: {
  lineHeight: 24,
  paddingTop: 32,
  paddingBottom: 0,
  paddingRight: 25,
  marginBottom: 0,
  height: 76
},
productImage: {
  width: 115,
  height: 115,
  padding: 15,
  marginLeft: 0,
  margin: 15,
},
ingredientButton: {
  flexDirection: 'row',
  alignItems: 'center',

  paddingVertical: 7,
  paddingRight: 5,
  margin: 4,

  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,

  backgroundColor: '#ffffff'
  },
  ingredientLabel: {
    paddingLeft: 5,
    paddingRight: 3
  },
  ingredientIcon: {
    marginLeft: 10,
    marginRight: 3
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
    borderColor: '#9B9B9B',
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

// Profile
  profileScore: {
    justifyContent: 'center',
    backgroundColor: '#B50058',
    height: 215,
    alignItems: 'center',
    paddingVertical: 25,
  },
  score: {
    fontSize: 40,
    color: '#ffffff'
  },
  recentlySearchedContainer: {
    marginHorizontal: 25,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderColor: '#C7C7C7',
  },
  productImageCircle: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderColor: '#C7C7C7',
    borderWidth: 1,
    marginTop: 5,
    marginRight: 12,
    backgroundColor: '#C7C7C7',
  },

// homeTextLarge
homeTextLarge: {
  fontSize: 20,
  color: '#ffffff',
  textAlign: 'center',
  backgroundColor: 'rgba(0,0,0,0)',
},

// Global Styles
  textLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D0D0D',
  },
  textLargeFoods: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D0D0D',
    paddingTop: 20,
    paddingLeft: 25,
    paddingBottom: 15,
  },
  textMedium: {
    fontSize: 16,
    fontWeight: "300",
    color: '#0D0D0D',
  },
  textSmall: {
    fontSize: 14,
    color: '#0D0D0D'
  },
  textSmallHeader: {
    fontSize: 14,
    color: '#0D0D0D',
    paddingTop: 20,
    paddingBottom: 10,
    marginLeft: 25
  },
  textSmallHeaderRecent: {
    fontSize: 14,
    color: '#0D0D0D',
    paddingTop: 20,
    paddingBottom: 10,
  },
  textWhite: {
    fontSize: 14,
    color: '#ffffff'
  },
  grayActionLink: {
    fontSize: 14,
    color: '#787878',
    textAlign: 'center',
    paddingVertical: 20,
  },
  greenActionLink: {
    fontSize: 14,
    color: '#00B575',
    textAlign: 'center',
    paddingVertical: 20,
  },
  greenActionLinkNoPadding: {
    fontSize: 14,
    color: '#00B575',
    textAlign: 'center',
    paddingVertical: 15,
  },
  listViewContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#F7F8F9',
  },
  listItems: {
    paddingVertical: 25
  },
  grayResultsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#F7F8F9',
    paddingHorizontal: 25,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#C7C7C7',
  }
});

AppRegistry.registerComponent('FoodrFrontend', () => FoodrFrontend);
