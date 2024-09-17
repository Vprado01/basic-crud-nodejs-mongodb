const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')

//Middleware
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'Invalid book ID'
            }
        )
    }
    try {
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json(
                {
                    message: "Book not found"
                }
            )
        }
    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }
    next.book = book
    next()
}

//Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('Get all books')
        if (books.length == 0) {
            res.status(204).json([])
        }
        res(books)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

//Crear un nuevo libro
router.post('/', async (req, res) => {
    const { title, author, genre, publicationDate } = req?.body
    if (!title || !author || !genre || !publicationDate) {
        return res.status(400).json({
            message: "All the fields are mandatory"
        })
    }

    const book = new Book(
        {
            title, //title:title
            author,
            genre,
            publication_date
        }
    )
    try {
        const newBook = await book.save()
        console.log(newBook)
        res.status(201).json(newBook)
    } catch (error) {
        message: error.message
    }
})