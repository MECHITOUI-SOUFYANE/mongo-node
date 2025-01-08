const {MongoClient} = require('mongodb');

let dbConnection

module.exports = {
    connectToDb: (callback) => {
        MongoClient.connect("mongodb://0.0.0.0:27017/bookstore")
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