const express = require('express');
const {connectToDb, getDb} = require('./db');
const {ObjectId} = require("mongodb");

// init app
const app = express();
app.use(express.json())

const BOOKS_COLLECTION = 'books';

// db object
let db;

// db connection
connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log("app listing in port 3000")
        });
        db = getDb();
    } else {
        console.log("error : ", err)
    }
})


// routes :

// get All books
app.get(`/${BOOKS_COLLECTION}`, (req, res) => {
    let books = [];
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 3;
    db?.collection(BOOKS_COLLECTION)
        .find()
        .sort({author: 1})
        .skip(page * size)
        .limit(size)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch((err) => {
            res.status(500).json({error: err})
        })
})

// get single book by id
app.get(`/${BOOKS_COLLECTION}/:id`, (req, res) => {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
        db?.collection(BOOKS_COLLECTION)
            .findOne({_id: new ObjectId(id)})
            .then(doc => {
                if (doc !== null) {
                    res.status(200).json(doc)
                } else {
                    res.status(404).json({error: "document not found"})
                }
            })
            .catch(err => res.status(500).json({error: 'could not fetch document'}))
    } else {
        res.status(400).json({error: "bad request"})
    }
})

// post document

app.post(`/${BOOKS_COLLECTION}`, (req, res) => {
    const body = req.body;
    db?.collection(BOOKS_COLLECTION)
        .insertOne(body)
        .then(result =>
            res.status(201).json(result)
        )
        .catch(() => res.status(500).json({error: 'could not create a new document'}))
})


// delete book by id

app.delete(`/${BOOKS_COLLECTION}/:id`, (req, res) => {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
        db?.collection(BOOKS_COLLECTION)
            .deleteOne({_id: new ObjectId(id)})
            .then(response => {
                res.status(204).json({message: 'the document was removed successfully'})
            })
            .catch(err => res.status(500).json({error: "could not delete document"}))
    } else {
        res.status(400).json({error: "bad request"})
    }
})

// update book by id

app.patch(`/${BOOKS_COLLECTION}/:id`, (req, res) => {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
        const body = req.body;
        db.collection(BOOKS_COLLECTION)
            .updateOne(
                {_id: new ObjectId(id)},
                {$set: body}
            )
            .then(response => res.status(201).json({message: "the document was update successfully"}))
            .catch(() => res.status(500).json({error: "could not update document"}))
    } else {
        res.status(400).json({error: "bad request"})
    }
})