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
        if (!book) {
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
    res.book = book //setea book como una propiedad de res
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
        res.json(books)
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
            publicationDate
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

router.get('/:id', getBook, async (req, res) => {
    res.json(res.book);
})

router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publicationDate = req.body.publicationDate || book.publicationDate;

        const updatedBook = await book.save()
        res.json(updatedBook)
        console.log(updatedBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.patch('/:id', getBook, async (req, res) => {
    if (!req.body.title && !req.body.genre && !req.body.author && !req.body.publicationDate) {
        res.status(400).json({
            message: "At least one field must be sent"
        })
    }
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publicationDate = req.body.publicationDate || book.publicationDate;

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        })
        res.json({
            message: `${book.title} has been deleted`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
})

module.exports = router