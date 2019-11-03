const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017'
const DB_NAME = 'serverless-db'
const { MongoClient } = require('mongodb');
module.exports = {
    createConnection: () => {
        return new Promise((res, rej) => {
            MongoClient.connect(`${DB_URL}/${DB_NAME}`, (err, connection) => {
                if (err) {
                    rej(err)
                    return
                }
                const db = connection.db(DB_NAME)
                res({ collection: db.collection('claps'), connection })
            })
        })
    },
    getClaps(collection, pageId) {
        return new Promise((res, rej) => {
            console.log("Page id check", pageId)
            collection.find({ "pageId": pageId }).toArray(function (err, docs) {
                if (err) {
                    return rej(err)
                }
                res(docs)
            })
        })
    },
    addClaps(collection, data) {
        return new Promise((res, rej) => {
            collection.findOneAndUpdate(data, { $set: data }, { upsert: true }, (err, result) => {
                if (err) {
                    return rej(err)
                }
                return res(result)
            })
        })
    },
    deleteClaps(collection, data) {
        return new Promise((res, rej) => {
            collection.remove(data, (err, result) => {
                if (err) {
                    return rej(err)
                }
                return res(result)
            })
        })
    }
}
