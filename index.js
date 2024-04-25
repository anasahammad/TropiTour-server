const express = require('express')
const app = express();
const cors = require('cors')

const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('country is comming soon')
})

app.listen(port, ()=>{
    console.log(`The server is running from ${port}`);
})