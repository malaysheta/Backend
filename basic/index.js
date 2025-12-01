const express = require('express')
const dotenv = require('dotenv')

dotenv.config()
const app=express()

const PORT = process.env.PORT;

app.get('/',(req,res)=>{
    res.send("Hello world")
    
})

app.get('/malay',(req,res)=>{
    res.send("Malay's world")
})

app.get('/login',(req,res)=>{
    res.send("Login issue beacause server is not reloaded..")
})

app.listen(PORT,()=>{
    console.log("Server run on port :",PORT)
})