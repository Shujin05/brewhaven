import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import 'dotenv/config'
import orderRouter from "./routes/orderRoute.js"

// app configuration 
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

app.get("/", (req, res)=>{
    res.send("API Working")
})

// DB connection 
connectDB();

// API endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)


// run express server 
app.listen(port, ()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

// mongodb+srv://limshujin:Shujin2005@cluster0.251xl.mongodb.net/?
// retryWrites=true&w=majority&appName=Cluster0

