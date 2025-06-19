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

const refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401); // if there isn't any token
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); // if the token is not valid
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // if the token is no longer valid
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    });
})

app.delete('/logout', (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken); // Remove the token from the list
    res.sendStatus(204); // No Content
})

app.post('/login', (req, res) => {
    // Authentication logic would go here
    const username = req.body.username;
    const user = { name: username };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken); // Store the refresh token
    // Send both tokens to the client
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
