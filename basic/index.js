const express = require('express')
const app=express()

const PORT = 3000

app.get('/',(req,res)=>{
    res.send("Hello world")
    
})

app.get('/malay',(req,res)=>{
    res.send("Malay's world")
})

app.listen(PORT,()=>{
    console.log("Server run on port :",PORT)
})