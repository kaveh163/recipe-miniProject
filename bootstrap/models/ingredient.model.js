const mongoose = require('mongoose');
const {
    Schema
} = mongoose;
const ingredientSchema = new Schema({
    ingredient: String
   
    
});
const Ingredient = module.exports = mongoose.model('Ingredient', ingredientSchema);