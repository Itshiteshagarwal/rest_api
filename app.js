const express = require('express');
const app = express();
const bodyParser = require('body-parser')
require('dotenv').config();
const mongoose = require('mongoose')
const cors = require('cors')
const userRoute = require('./api/routes/user')
const userloginRoute = require('./api/routes/user_login')
const addcartRoute = require('./api/routes/add_cart')
const removeRoute = require('./api/routes/remove_cart')
const getRoute = require('./api/routes/get_item')
const productRoute = require('./api/routes/products')
const homeRoute = require('./api/routes/home')
const addRoute = require('./api/routes/add_product')
const updateRoute = require('./api/routes/update_product')
const paymentRoute = require('./api/routes/paymentroute')

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on('error',err=>{
    console.log('connection failed');
});

mongoose.connection.on('connected',connected=>{
    console.log('database connected sucessfully');
})



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user',userRoute);
app.use('/user_login',userloginRoute);
app.use('/add_cart',addcartRoute);
app.use('/remove_cart',removeRoute);
app.use('/get_item',getRoute);
app.use('/products',productRoute);
app.use('/',homeRoute);
app.use(cors());
app.use('/add_product',addRoute);
app.use('/update_product',updateRoute);
app.use('/paymentroute',paymentRoute);


app.use((req,res,next)=>{
    res.status(404).json({
        error:'bad request'
    })
})


// app.use((req,res,next)=>{
//     res.status(200).json({
//         message:'app is running localhost: 3000'
//     })
// })


module.exports = app;