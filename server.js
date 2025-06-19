require('dotenv').config();
// This is a simple Express server that uses JWT for authentication
const express =require('express');
const jwt = require('jsonwebtoken');
const app = express();
// const cors = require('cors');
app.use(express.json());

const posts = [
    {
        username: 'Mihir Trivedi',
        title: 'Post 1'
    },
    {
        username: 'Ravi Patel',
        title: 'Post 2'
    }
]

app.get('/posts', authenticationToken,(req, res) => {
    // res.json(posts);    
    res.json(posts.filter(post => post.username === req.user.name));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // if the token is no longer valid
        req.user = user;
        next(); // pass the execution off to whatever request the client intended
    });
}