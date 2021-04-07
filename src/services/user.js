
const Schema = require('../models/user');
const mongoose = require('mongoose');
const Users = mongoose.model('Users', Schema);
const request = require('request');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

let token;

/**
 * User registration and token assignment function.
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function signup(req, res) {
    Users.create({
        user_id: req.body.user_id,
        id_type: req.body.id_type,
        password: req.body.password
    }, (err, user) => {
        if (err) return res.status(500)
            .send('There was a problem registering the user.');
        // create a token
        token = jwt.sign({
            user_id: user.user_id,
            id_type: user.id_type,
            password: user.password
        },
            config.secret, {
            expiresIn: 600 // expires in 10 min
        });
        res.status(200).send({
            auth: true,
            token: token
        });
    });
}

/**
 * User search function by his ID and password.
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function signin(req, res) {

    let decodedToken = jwt.verify(token, config.secret);

    if (req.body.user_id !== decodedToken.user_id || req.body.password !== decodedToken.password) {
        res.status(200).json({
            massage: 'Error. User is not found'
        });
    } else {
        let user = await Users.findOne({
            user_id: decodedToken.user_id,
            password: decodedToken.password
        }).exec();

        if (user) {
            res.status(200).json({
                massage: 'Success! User found.'
            });
        } else {
            res.status(404).json({
                massage: 'Error. User is not found in db.'
            });
        }
    }
}

/**
 * User data clearing function. 
 * So far, I have not found how to delete user data in JWT and extend the lifetime of the token.
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function logout(req, res) {
    if (req.params.all === 'true') {
        res.send('User deleted');
    } else if (req.params.all === 'false') {
        res.send('All users deleted');
    } else {
        res.status(404).json({
            massage: 'Error. No such command found.'
        });
    }
}

/**
 * The function provides information about the last logged in user.
 * The task did not say exactly what kind of user to search for and by what parameters.
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function userInfo(req, res) {
    let info = await Users.findOne({}).exec();
    if (info) {
        res.send(`
        user id : ${info.user_id} 
        ${'<br>'} 
        id type : ${info.id_type}`);
    } else {
        res.status(404).json({
            massage: 'Error. User is not found.'
        });
    }
}

/**
 * Latency check function on google
 * 
 * @param {*} req 
 * @param {*} res 
 */
function latency(req, res) {
    var start = new Date();
    request.get({
        url: 'https://google.com',
        time: true
    }, function (err, response) {
        res.send(`Request time ${(new Date() - start) / 60} ms`)
    });
}

module.exports = {
    latency,
    logout,
    signin,
    signup,
    userInfo,
}