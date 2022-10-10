const express = require('express');
// const { post } = require('./routes/auth');
const app = express();
const auth = require('./routes/auth');
const post = require('./routes/post');


app.use(express.json());
app.use('/post',post);
app.use('/auth',auth);

app.listen(2000, ()=>console.log('Port running on port 2000'))