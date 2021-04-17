const Schema = require('../models/user');
const mongoose = require('mongoose');
const Users = mongoose.model('Users', Schema);
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 * An object that, when initialized, will contain the token.
 * 
 * @param {\} token of user
 */
function tokenHolder(token) {
    this.token = token;
}

/**
 * User registration and token assignment function.
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function signup(req, res) {

    if (tokenHolder.token) return res.status(500)
        .send('User already registered.');

    let user = await Users.findOne({ userId: req.body.userId }).exec();

    if (user) {
        tokenHolder.token = jwt.sign({
            userId: user.userId,
            idType: user.idType,
            password: user.password
        },
            config.secret, {
            expiresIn: 600 // expires in 10 min
        });

        return res.status(200).send({
            auth: true,
            token: tokenHolder.token
        });
    }

    let hash = await bcrypt.hash(req.body.password, saltRounds);

    Users.create({
        userId: req.body.userId,
        idType: req.body.idType,
        password: hash
    }, (err, user) => {
        if (err) return res.status(500)
            .send('There was a problem registering the user.');
        // create a token
        tokenHolder.token = jwt.sign({
            userId: user.userId,
            idType: user.idType,
            password: user.password
        },
            config.secret, {
            expiresIn: 600 // expires in 10 min
        });
        return res.status(200).send({
            auth: true,
            token: tokenHolder.token
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

    let user = await Users.findOne({ userId: req.body.userId }).exec();

    let result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
        return res.status(200).json({
            massage: 'Error. User is not found'
        });
    }

    if (tokenHolder.token) {
        let decodedToken = jwt.verify(tokenHolder.token, config.secret);
        let user = await Users.findOne({
            userId: decodedToken.userId,
            password: decodedToken.password
        }).exec();

        if (user) {
            res.status(200).json({
                massage: tokenHolder.token
            });
        } else {
            res.status(404).json({
                massage: 'Error. User is not found in db.'
            });
        }
    } else {
        res.status(404).json({
            massage: 'Error. User is not login.'
        });
    }
}

    /**
     * User data clearing function. 
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async function logout(req, res) {
        if (req.params.all === 'true') {
            tokenHolder.token = null;
            res.send('User logout');
        } else {
            res.status(404).json({
                massage: 'Error. No such command found.'
            });
        }
    }

    /**
     * The function provides information about the last logged in user.
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async function userInfo(req, res) {

        if (tokenHolder.token) {

            tokenTimeExtension(tokenHolder.token);

            let decodedToken = jwt.verify(tokenHolder.token, config.secret);

            let info = await Users.findOne({ userId: decodedToken.userId }).exec();

            if (info) {
                res.json(info);
            }
        } else {
            res.status(404).json({
                massage: 'Error. User is not found.'
            });
        }
    }

    function tokenTimeExtension(token) {
        let decodedToken = jwt.verify(token, config.secret);

        jwt.sign({
            userId: decodedToken.userId,
            idType: decodedToken.idType,
            password: decodedToken.password,
        },
            config.secret, {
            expiresIn: 600 // Extension in 10 min
        });
    }

    module.exports = {
        logout,
        signin,
        signup,
        tokenHolder,
        tokenTimeExtension,
        userInfo,
    }