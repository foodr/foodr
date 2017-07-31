## SEED USERS

dummy_user = User.create(email: 'user@email.com', password: 'password')
User.create(email: 'kanan@email.com', password: 'password')
User.create(email: 'tiff@email.com', password: 'password')
User.create(email: 'vic@email.com', password: 'password')
User.create(email: 'xander@email.com', password: 'password')

## SEED PRODUCTS & INGREDIENTS

scores = [1,2,3,4,5]
true_false = [true, false]
dimensions = [200,300,400]

# 5 Products
5.times do |number|
  product = Product.create(
    upc: number,
    name: Faker::Food.dish,
    score: scores.sample,
    img_url: "https://unsplash.it/#{dimensions.sample}/#{dimensions.sample}"
  )

  # 3 ingredients per product
  3.times do

    product.ingredients << Ingredient.create(
      name: Faker::Food.ingredient,
      description: Faker::Lorem.paragraph,
      is_natural: true_false.sample,
      img_url: "https://unsplash.it/#{dimensions.sample}/#{dimensions.sample}"
      )
  end

  # each product is saved by dummy_user
  product.searches.create(user: dummy_user, is_saved: true_false.sample)
end

## DORITOS

doritos = Product.create(
  upc: "0028400344371",
  name: "Doritos Nacho Cheese Tortilla Chips",
  score: 1,
  img_url: "https://images-na.ssl-images-amazon.com/images/I/41sEhSXmzXL.jpg"
  )

doritos.ingredients << Ingredient.create(
  name: "Corn",
  description: "To create the actual tortilla chip, raw yellow corn kernels are soaked in large vats of near-boiling water, where they’re combined with lime (the chemical, not the fruit). While lime’s main purpose is loosening the husks and making them easier to remove, it also injects a bit of calcium into the corn and releases niacin (vitamin B3), which is known to improve cholesterol levels and lower cardiovascular risks. Once the husks and any excess lime have been washed away, the now-hydrated corn is ground into a corn flour called masa, pressed into that famous Dorito shape and fried in vegetable oil.",
  is_natural: true,
  img_url: "https://www.organicfacts.net/wp-content/uploads/2013/05/Corn12-1020x765.jpg"
  )

doritos.ingredients << Ingredient.create(
  name: "Vegetable Oil",
  description: "Extracted from whichever source (sunflower, canola or corn) is cheapest at the time, vegetable oils have a notorious reputation. “The refining process of removing these oils is extremely chemically harsh,” explains physician and biochemist Cate Shanahan, author of Deep Nutrition: Why Your Genes Need Traditional Food. “It damages the molecules and turns them into new compounds that don’t occur in nature, many of which have toxic effects on our body — like, for instance, disturbing DNA replication and energy processing.”",
  is_natural: true,
  img_url: "https://images-na.ssl-images-amazon.com/images/I/81CBn7U1c1L._SX355_.jpg"
  )

doritos.ingredients << Ingredient.create(
  name: "Maltodextrin",
  description: "An artificial sugar made from maltose (aka malt sugar) and dextrose (see below), Maltodextrin is usually used as a thickener or filler ingredient to add bulk to processed food and to increase its shelf life — maltodextrin itself has a shelf life of two years.",
  is_natural: false,
  img_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Maltodextrin.png/1200px-Maltodextrin.png"
  )

doritos.ingredients << Ingredient.create(
  name: "Monosodium Glutamate",
  description: "Better known as MSG, monosodium glutamate is a naturally occurring amino acid (one of the building blocks of protein) that’s added to foods as a savory flavor enhancer. While it has a reputation for causing insatiable hunger, the food industry has no problem using it because it occurs in nature. And while Shanahan sort of agrees, there’s some room for worry. “Eating MSG without a high-protein ingredient in the food is a huge blast of MSG all at once, and some people are very sensitive to that,” she explains. “They’ll get headaches and some people who get seizures say they’ll get a seizure aura [that is, the feeling you get right before you experience a seizure].” Researchers, however, haven’t come to any decisive conclusions about the effects of MSG.",
  is_natural: false,
  img_url: "https://cdn.authoritynutrition.com/wp-content/uploads/2015/03/msg-monosodium-glutamate.jpg"
  )

doritos.ingredients << Ingredient.create(
  name: "Buttermilk",
  description: "Similar to whey, buttermilk is the byproduct of churning butter out of cream and is usually added to processed foods like Doritos as a means of adding heartiness and oftentimes a sort of creamy texture (though, that’s not so much the case for Doritos).",
  is_natural: true,
  img_url: "https://fthmb.tqn.com/1uefBX_jl9StT18NA3jNmtwE414=/960x0/filters:no_upscale()/about/Buttermilk-GettyImages-542871762-58a0e7175f9b58819c216897.jpg"
  )

## NATURE VALLEY BAR

nature_valley = Product.create(
  upc: "0016000507661",
  name: "Nature Valley Peanut Butter Dark Chocolate Chewy Bar",
  score: 4,
  img_url: "https://d2ln0cvn4pv5w2.cloudfront.net/unsafe/1024x800/filters:quality(100):max_bytes(200000):fill(white)/dcmzfk78s4reh.cloudfront.net/1470334066593.jpg"
  )

nature_valley.ingredients << Ingredient.create(
  name: "Roasted Peanuts",
  description: "In addition to being every kid's (and many grownup kid's) favorite sandwich filling, peanuts pack a serious nutritional punch and offer a variety of health benefits.\n\nPeanuts are rich in monounsaturated fats, the type of fat that is emphasized in the heart-healthy Mediterranean diet. Studies of diets with a special emphasis on peanuts have shown that this little legume is a big ally for a healthy heart. In one such randomized, double-blind, cross-over study involving 22 subjects, a high monounsaturated diet that emphasized peanuts and peanut butter decreased cardiovascular disease risk by an estimated 21 percent compared to the average American diet.",
  is_natural: true,
  img_url: "https://sc01.alicdn.com/kf/UTB8tEc_earFXKJk43Ovq6ybnpXaU/Top-Roasted-Peanut-in-Shell-9-11.jpg"
  )

nature_valley.ingredients << Ingredient.create(
  name: "Soy Protein Isolate",
  description: "Soy protein isolate is extracted from defatted soy flour. It is made of almost pure protein, since the isolation process yields a product that is 93 to 97 percent protein, leaving minimal fat and carbohydrates. The concern about the isolation process centers on the fact that aluminum found in the giant vats used to isolate the soy protein may leach into the protein itself, increasing the likelihood of heavy-metal poisoning. This is completely speculative, as we have yet to see an analysis of soy, whey, or any protein isolate showing heavy metal contamination from the containers used during the isolation process.\n\nNinety percent of genetically modified soy is resistant to glyphosate, the pesticide found in Round Up. A concern raised about eating products with soy protein isolate is that you will consume excessive amounts of this chemical. The good news? Glyphosate is not well absorbed by the human GI tract, the potential negative effects on humans are dose-dependent, and the level of that dose is very controversial.",
  is_natural: false,
  img_url: "https://sc01.alicdn.com/kf/UTB8uOrfcVfFXKJk43Otq6xIPFXaX/High-Quality-Soy-Isolated-Protein-and-Soy.jpg"
  )

nature_valley.ingredients << Ingredient.create(
  name: "Chicory Root Extract",
  description: "Chicory root extract is a dietary supplement or food additive produced by mixing dried, ground chicory root with water, and removing the insoluble fraction by filtration and centrifugation. Other methods may be used to remove pigments and sugars. It is used as a source of soluble fiber.",
  is_natural: true,
  img_url: "https://lifefromthegroundup.files.wordpress.com/2013/09/chicory1.jpg"
  )

nature_valley.ingredients << Ingredient.create(
  name: "Cocoa",
  description: "Health benefits of cocoa include relief from high blood pressure, cholesterol, obesity, constipation, diabetes, bronchial asthma, cancer, chronic fatigue syndrome and various neurodegenerative diseases. It is beneficial for quick wound healing, skin care, and it helps to improve cardiovascular health and brain health. It also helps in treating copper deficiency. It possesses mood-enhancing properties and exerts protective effects against neurotoxicity.\n\nCocoa beans are the fermented seeds of the cacao tree, whose Latin name is Theobroma cacao, which means “Food of the Gods”. It is native to the Amazon region and as the meaning suggests, cocoa was historically considered a very important crop in Central and South America. In fact, its beans were so prized that the native tribes used them as a form of currency. The cacao tree stands about 12-25 feet tall and grows naturally in tropical climates.",
  is_natural: true,
  img_url: "https://i1.wp.com/www.rjeem.com/wp-content/uploads/2015/12/00000000000000000000098.jpg"
  )


## QUAKER CHEWY BAR

chewy = Product.create(
  upc: "03077504",
  name: "Quaker Chewy Chocolate Chip Bar",
  score: 3,
  img_url: "https://images-na.ssl-images-amazon.com/images/I/81wqeA8l9CL._SL1500_.jpg"
  )

chewy.ingredients << Ingredient.create(
  name: "Granola",
  description: "Granola is an extremely popular breakfast and snack food with a wealth of health benefits, including its ability to lower cholesterol, regulate digestion, aid in weight loss attempts, improve your heart health, increase energy, prevent anemia and promote proper organ function. Intake of granola also helps to lower blood pressure, increase cognitive activity, improve skin quality, build stronger bones, manage diabetes, stimulate new tissue and hormonal growth, and even prevent cancer.\n\nGranola is traditionally composed of rolled oats, which are oat groats that have been pressed flat and lightly steamed, as well as honey, nuts, and puffed rice. The entire mixture is baked until crispy and can then be taken anywhere quite conveniently for an energy-boosting snack. Most commonly, granola is regularly used by people on-the-go, as well as by hikers, campers, and outdoor-oriented people who won’t have a refrigerator for their food, and don’t want to worry about crushing anything that they plan to eat.",
  is_natural: true,
  img_url: "https://pioneerwoman.files.wordpress.com/2016/01/homemade-granola-08.jpg"
  )

chewy.ingredients << Ingredient.create(
  name: "Semisweet Chocolate Chip",
  description: "Semisweet chocolate contains an impressive oxygen radical absorbance capacity (ORAC) value of 18,053 micromoles in 100 grams. These powerful antioxidants are responsible for protecting your body from oxygen free radicals that cause you to age. The flavonoids in semisweet chocolate help protect your low-density-lipoprotein (LDL) cholesterol from oxidation, thus preventing the dreaded “bad cholesterol.” Interestingly, according to Harvard University, when chocolate is combined with dairy milk, these antioxidant benefits are prevented. Traditionally, semisweet chocolate does not contain any milk, but manufacturers may hold artistic licensing on this tradition, so read the label before consuming this tasty treat.",
  is_natural: false,
  img_url: "https://nuts.com/images/auto/510x340/assets/51e5a614afaf394a.jpg"
  )

chewy.ingredients << Ingredient.create(
  name: "Corn Syrup",
  description: "Corn syrup is a food syrup which is made from the starch of corn (called maize in some countries) and contains varying amounts of maltose and higher oligosaccharides, depending on the grade. Corn syrup, also known as glucose syrup to confectioners, is used in foods to soften texture, add volume, prevent crystallization of sugar, and enhance flavor. Corn syrup is distinct from high-fructose corn syrup (HFCS), which is manufactured from corn syrup by converting a large proportion of its glucose into fructose using the enzyme D-xylose isomerase, thus producing a sweeter compound due to higher levels of fructose.",
  is_natural: false,
  img_url: "https://health.clevelandclinic.org/wp-content/uploads/sites/3/2015/04/CornSyrup.jpg"
  )

chewy.ingredients << Ingredient.create(
  name: "Glycerin",
  description: "Glycerin belongs to a special category of carbohydrates called polyols, which also includes sugar alcohols like sorbitol and erythritol. Like sugar alcohols, which I’ve talked about before, glycerin tastes sweet but it is not metabolized as sugar in the body and doesn’t cause a rise in blood sugar. For that reason, it’s sometimes used as a sweetener in foods marketed to diabetics and low-carb dieters.  Glycerin also has that moisture-attracting property. The same way that adding glycerin to a lotion helps keeps your skin stay plump and moist, adding glycerin to foods helps them stay moist. So glycerin is also widely used in food manufacturing as a preservative.",
  is_natural: false,
  img_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Glycerin_Skelett.svg/1200px-Glycerin_Skelett.svg.png"
  )
