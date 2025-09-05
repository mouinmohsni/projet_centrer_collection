
require('dotenv').config();
const express = require('express')
const bodyParser =require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())





 const port = process.env.PORT || 3000


app.get('/api/test', (req, res) => {
    res.send('Hello! Server is running on port 3000')
})


app.listen(port ,()=>{
    console.log(`server running on port ${port}`)
})