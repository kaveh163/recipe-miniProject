
const mongoose = require('mongoose');

main().catch(err => console.log('Error in DB connection : ' + err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/RecipeDB');
  console.log('MongoDB connection succeeded')
}