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
  Image
} from 'react-native';

export default class FoodrFrontend extends Component {
  constructor() {
    super()

    this.state = {
      foundProduct: {
          "found": true,
          "product": {
              "id": 1,
              "upc": "03077504",
              "name": "Quaker Chewy Chocolate Chip Bar",
              "score": 3,
              "img_url": "https://images-na.ssl-images-amazon.com/images/I/81wqeA8l9CL._SL1500_.jpg",
              "created_at": "2017-07-29T02:12:28.868Z",
              "updated_at": "2017-07-29T02:12:28.868Z"
            },
          "ingredients": [
              {
                  "id": 1,
                  "name": "Pumpkin Seed",
                  "description": "this is healthy",
                  "img_url": null,
                  "created_at": "2017-07-29T02:12:28.909Z",
                  "updated_at": "2017-07-29T02:12:28.909Z"
              },
              {
                  "id": 3,
                  "name": "Blue Swimmer Crab",
                  "description": "this is healthy",
                  "img_url": null,
                  "created_at": "2017-07-29T02:12:28.913Z",
                  "updated_at": "2017-07-29T02:12:28.913Z"
              },
              {
                  "id": 5,
                  "name": "White rice",
                  "description": "this is healthy",
                  "img_url": null,
                  "created_at": "2017-07-29T02:12:28.917Z",
                  "updated_at": "2017-07-29T02:12:28.917Z"
              }
          ]
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.welcome}>
          Welcome to FOOOOOODR!
        </Text> */}
        <ProductDetails foundProduct={this.state.foundProduct} />
      </View>
    );
  }
}

class ProductDetails extends Component {
  render() {
    return (
      <View>
        <Image
          style={{width: 375, height: 200}}
        source={{uri: this.props.foundProduct.product.img_url}}
        />
        <Text>{this.props.foundProduct.product.name}</Text>
        <Text>Score: {this.props.foundProduct.product.score}</Text>
        <IngredientList foundProduct={this.props.foundProduct} />
      </View>
    );
  }
}

class IngredientList extends Component {
  state = { ingredients: [] };

  componentWillMount() {
    fetch('https://dbc-foodr-api.herokuapp.com/products/40084510')
    .then((response) => response.json())
    .then((responseJson) => this.setState({ ingredients: responseJson.ingredients
    }));
  }

  renderIngredient() {
    return this.props.foundProduct.ingredients.map(ingredient => <Text>{ingredient.name}</Text>);
  }

  render () {
    return (
      <View>
        <Text>Ingredients List</Text>
        {this.renderIngredient()}
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
