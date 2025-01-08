const {MongoClient} = require('mongodb');
const args = require('minimist')(process.argv.slice(2));
const username = args?.username;
const password = args?.password;
const appName = args?.app;
const appClusterId = args?.cluster;
let dbConnection
module.exports = {
    connectToDb: (callback) => {
        MongoClient.connect(`mongodb+srv://${username}:${password}@${appClusterId}.mongodb.net/?retryWrites=true&w=majority&appName=${appName}`)
            .then((client) => {
                dbConnection = client.db();
                return callback();
            })
            .catch(err => {
                console.log(err);
                callback(err);
            })
    },
    getDb: () => dbConnection
}