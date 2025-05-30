import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import { configDotenv } from "dotenv"

configDotenv();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// place user order from front-end 
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId, 
            items: req.body.items, 
            amount: req.body.amount, 
            address: req.body.address, 
        })

        await newOrder.save(); // save order in database 
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}}); // clear cart

        const line_items = req.body.items.map((item) => ({
            price_data:{
                currency:"sgd", 
                product_data: {
                    name: item.name
                }, 
                unit_amount: item.price*100
            }, 
            quantity: item.quantity
        }))

        // add on delivery charges
        line_items.push({
            price_data:{
                currency: "sgd", 
                product_data:{
                    name:"Delivery Charges"
                }, 
                unit_amount: 2*100
            }, 
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items, 
            mode: 'payment', 
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`, 
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({success:true, session_url:session.url})

    } catch (error) {
        console.log(error); 
        res.json({success:false, message:"Error"})
    }
}

const verifyOrder = async (req, res) => {
    const {orderId, success} = req.body; 
    try {
        if (success==="true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true})
            res.json({success:true, message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false, message:"Transaction failed"})
        }
    } catch (error) {
        console.log(error); 
        res.json({success:false, message:"error"})
    }
}

// user orders for frontend 
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId})
        res.json({success: true, data:orders})
    }
    catch (error) {
        console.log(error)
        res.json({success: false, message:"error"})
    }
} 

export {placeOrder, verifyOrder, userOrders}; 