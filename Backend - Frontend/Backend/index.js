const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT
const app = express()

app.get('/',(req,res)=>{
    res.send('Hello World!')
})

app.get('/api/jokes',(req,res)=>{
    const jokes = [
        {
            id:1,
            title : 'Frist Joke',
            joke : 'This is a joke',
        },
        {
            id:2,
            title : 'Second Joke',
            joke : 'This is a joke',
        },
        {
            id:3,
            title : 'Third Joke',
            joke : 'This is a joke',
        },
        {
            id:4,
            title : 'Forth Joke',
            joke : 'This is a joke',
        },
    ]
    res.send(jokes);
})
app.listen(PORT,()=>{
    console.log("server listen at port :",PORT);
    
})