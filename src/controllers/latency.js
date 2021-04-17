const axios = require('axios');
const UserControllers = require('./user');

/**
 * Function returns the delay time when accessing the site http://google.com.
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function latency(req, res) {
    if (UserControllers.tokenHolder.token) {
        UserControllers.tokenTimeExtension(UserControllers.tokenHolder.token);
    }

    let start = new Date();
    axios({
        method: 'get',
        url: 'http://google.com',
        responseType: 'stream'
    })
        .then(() => {
            res.send(`Request time ${(new Date() - start) / 60} ms`)
        });
}

module.exports = {
    latency,
}