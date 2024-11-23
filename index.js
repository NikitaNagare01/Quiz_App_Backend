const express = require('express');
const mongoose = require('mongoose')
var cors = require('cors');
const dotenv = require('dotenv');
//cookies
const cookieparser = require('cookie-parser');





// env files
dotenv.config({path:'./config.env'});
const PORT = process.env.PORT;

const app = express();

// cors
app.use(cors());

//cookies
app.use(cookieparser());

// To get data in json format
app.use(express.json());


//connecting databse
const DB = process.env.DB;
mongoose.connect(DB,{

}).then(()=>{
    console.log('connection successful');
    

    app.listen(PORT, ()=>{
        console.log(`console is running on port no ${PORT}`);
    })
    
}).catch((err)=> console.log('connection failed'));
// require('./db/conn');

app.get('/', (req, res)=>{
    return res.json({ok:"ok"})
})

app.use('/auth', require('./router/auth'))

app.use('/quiz',require('./router/quiz'));

app.use('/exam', require('./router/exam'));

app.use('/report', require('./router/report'));

app.use((err, req, res, next)=>{
    console.log(err);
    return res.send('got error');
})



// app.listen(PORT, ()=>{
//     console.log(`console is running on port no ${PORT}`);
// })
// app.get('/', (req, res)=>{
//     res.send('hello world from server');
// })
