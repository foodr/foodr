# Foodr

## Project Description
Foodr makes it easier for people to know what is in the food they eat. It allows consumers to scan the UPC or QR codes of packaged food (using their phones) to quickly pull up a full list of ingredients as well as a food score. Each ingredient is marked as natural or artificial, and descriptions of each are written in a clear and easy-to-understand manner.

<img src="https://user-images.githubusercontent.com/17535817/29548681-906835c8-86b7-11e7-8634-27e5616ef0b0.gif" alt="Profile" width="250">


## Team Members
* Alexander Rowland ([@prestidigitation](http://github.com/prestidigitation))
* Kanan Kalelker ([@kykalelker](http://github.com/kykalelker))
* Tiffany Chiu ([@tiffchiu](http://github.com/tiffchiu))
* Victoria Chen ([@vrchen](http://github.com/vrchen))

## MVP Functionality
This application was built using decoupled architecture:

* [Rails back-end](https://github.com/tiffchiu/foodr/tree/master/foodr-backend) - PostgreSQL database deployed to Heroku  
* [React Native front-end web](https://github.com/tiffchiu/foodr/tree/master/foodr-backend) - iOS and Android platforms

[React Native Camera](https://github.com/lwansbrough/react-native-camera) - Open source React Native component for the camera and barcode scanning

## How to Use
#### Logged In
When a user first creates and account and logs in, he or she will be directed to a profile page that tracks "Saved Items" as well as "Recently Searched Items". They have the option to either scan a barcode or to search for an item manually. If the item is found, the corresponding product page is displayed with the item's name, food score, and list of ingredients. Each item in the list has a description, which is brought up on-tap.

From here, the user may want to save an item to their list by clicking "Save Product", which will then add the item to their profile.


#### Not Logged In
Users have the option to use this application without creating an account. They have the option to either scan a barcode or to search for an item manually. If the item is found, the corresponding product page is displayed with the item's name, food score, and list of ingredients. Each item in the list has a description, which is brought up on-tap. The option to "Save Product" will not be displayed if user is not logged in.

If the user clicks on "Profile", he or she will be directed to the application's "Sign Up" page.


## Screenshots
<img src="https://user-images.githubusercontent.com/17535817/29544403-ab441242-869c-11e7-8ce1-a9d8ccc7cee2.png" alt="Home Screen" width="250"> <img src="https://user-images.githubusercontent.com/17535817/29544402-ab3f2d5e-869c-11e7-8368-fc4cf729b085.png" alt="Scan Barcode" width="250"> <img src="https://user-images.githubusercontent.com/17535817/29544400-ab3de64c-869c-11e7-8862-186c9fb4c47a.png" alt="Product Page" width="250"> <img src="https://user-images.githubusercontent.com/17535817/29544398-ab2a706c-869c-11e7-901a-273f7b21f001.png" alt="Artificial Ingredient" width="250"> <img src="https://user-images.githubusercontent.com/17535817/29544404-ab469b2a-869c-11e7-8970-0fdd62b97794.png" alt="Natural Ingredient" width="250"> <img src="https://user-images.githubusercontent.com/17535817/29544401-ab3e77e2-869c-11e7-8ab5-9f40f2167c90.png" alt="Profile" width="250">
