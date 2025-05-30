import mongoose from "mongoose"; 

// create schema 
const foodSchema = new mongoose.Schema({
    name: {type:String, required:true}, 
    description: {type:String, required:true}, 
    price: {type:Number, required: true}, 
    image:{type:String, required:true}, 
    category:{type:String, required:true}, 
})

// if foodModel is not in database, a new database is formed
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema); 

export default foodModel; 