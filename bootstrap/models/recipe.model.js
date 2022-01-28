const mongoose = require('mongoose');
const {
    Schema
} = mongoose;
const recipeSchema = new Schema({
    food: String, // String is shorthand for {type: String}
    image: String,
    altName: String,
    filename: String,
    ingredients: [String],
    instruction: String,
    user: String
});
const Recipe = module.exports = mongoose.model('Recipe', recipeSchema);