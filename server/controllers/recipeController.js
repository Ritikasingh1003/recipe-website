require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

// GET/
// homepage

exports.homepage = async(req,res) => {
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

        const food = { latest, thai, american, chinese };

        res.render('index', {title: 'Cooking Blog - Home', categories, food});
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// GET/categories
// Categories

exports.exploreCategories = async(req,res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', {title: 'Cooking Blog - Categories', categories});
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


// GET/categories/:id
// Categories By Id

exports.exploreCategoriesById = async(req,res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({ 'category': categoryId}).limit(limitNumber);
        res.render('categories', {title: 'Cooking Blog - Categories', categoryById});
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}



// GET/recipe/:id
// Recipes

exports.exploreRecipe = async(req,res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', {title: 'Cooking Blog - Recipes', recipe});
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}



// post/search
// Search

exports.searchRecipe = async(req,res) => {
    try{
        let searchTerm = req.body.searchTerm;

        let recipe = await Recipe.find({ $text: {$search: searchTerm, $diacriticSensitive: true }});
        res.render('search', {title: 'Cooking Blog - Search', recipe});
    } catch (error){
        res.status(500).send({message: error.message || "Error Occured" })
    }
}


// GET/explore-recipe
// Recipes

exports.exploreLatest = async(req,res) => {
    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        res.render('explore-latest', {title: 'Cooking Blog - Explore Latest', recipe});
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


// GET/explore-random
// explore random as JSON

exports.exploreRandom = async(req,res) => {
    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random()*count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('explore-random', {title: 'Cooking Blog - Explore Random', recipe});
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// GET/submit-recipe
// submit recipe
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

// POST/submit-recipe-on-post
// submit recipe on post
exports.submitRecipeOnPost = async(req, res) => {
    try {
  
      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }
  
        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });
      
      await newRecipe.save();
  
      req.flash('infoSubmit', 'Recipe has been added.')
      res.redirect('/submit-recipe');
    } catch (error) {
      // res.json(error);
      req.flash('infoErrors', error);
      res.redirect('/submit-recipe');
    }
}


// async function insertDymmyRecipeData(){
//     try {
//         await Recipe.insertMany([
//             { 
//             "name": "Southern Fried Chicken",
//             "description": `Recipe Description Goes Here`,
//             "email": "recipeemail@raddy.co.uk",
//             "ingredients": [
//                 "1 level teaspoon baking powder",
//                 "1 level teaspoon cayenne pepper",
//                 "1 level teaspoon hot smoked paprika",
//             ],
//             "category": "American", 
//             "image": "southern-friend-chicken.jpg"
//             },
//             { 
//             "name": "Grilled Lobster Rolls",
//             "description": `Recipe Description Goes Here`,
//             "email": "recipeemail@raddy.co.uk",
//             "ingredients": [
//                 "1 level teaspoon baking powder",
//                 "1 level teaspoon cayenne pepper",
//                 "1 level teaspoon hot smoked paprika",
//             ],
//             "category": "American", 
//             "image": "grilled-lobster-rolls.jpg"
//             },
//             { 
//                 "name": "Spring Rolls",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                     "1 level teaspoon baking powder",
//                     "1 level teaspoon cayenne pepper",
//                     "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American", 
//                 "image": "spring-rolls.jpg"
//             },
//             { 
//                 "name": "Tom Daley",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                     "1 level teaspoon baking powder",
//                     "1 level teaspoon cayenne pepper",
//                     "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American", 
//                 "image": "tom-daley.jpg"
//             },
//             { 
//                 "name": "Key Lime Pie",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                     "1 level teaspoon baking powder",
//                     "1 level teaspoon cayenne pepper",
//                     "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American", 
//                 "image": "key-lime-pie.jpg"
//            },
//            { 
//                 "name": "Stir Fried Vegetables",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                     "1 level teaspoon baking powder",
//                     "1 level teaspoon cayenne pepper",
//                     "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "Chinese", 
//                 "image": "stir-fried-vegetables.jpg"
//            },
//            { 
//                 "name": "Chinese Steak Tofu Stew",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                     "1 level teaspoon baking powder",
//                     "1 level teaspoon cayenne pepper",
//                     "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "Chinese", 
//                 "image": "chinese-steak-tofu-stew.jpg"
//            },
//         ]);
//     } catch (error) {
//     console.log('err', + error)
//     }
// }

// insertDymmyRecipeData();


