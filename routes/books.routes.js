const { Router } = require('express');
const Book = require('../models/Book');
const isAuth = require('../middlewares/auth.middleware');
const Author = require('../models/Author');
const router = Router();

async function isAuthorExist(authors) {
  const authorsArr = authors.split(',');

  for (let value of authorsArr) {
    const isAuthor = await Author.findOne({ name: value.trim() });

    if (!isAuthor) {
      const author = await new Author({ name: value.trim() });
      await author.save();
    }
  }
}

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json(books);
  } catch(e) {
    res.status(500).json({message: e.message});
  }
})

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    res.status(200).json(book);
  } catch(e) {
    res.status(500).json({message: e.message});
  }
})

router.post('/add', isAuth, async (req, res) => {
  try {
    isAuthorExist(req.body.author);
    
    const book = new Book({ ...req.body });
    
    await book.save();

    res.status(201).json({message: 'Book added!'});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
})

module.exports = router;