import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import Loader from '../../components/loader';
import './catalog-page.css';

const CatalogPage = () => {
  const [books, setBooks] = useState([]);
  const message = useMessage();
  const { request, loading, error, clearError } = useHttp();

  useEffect(() => {
    async function getBooks() {
      try {
        const data = await request('/api/books/', 'GET', null, {});
        setBooks(data);
      } catch (e) {}
    }
    getBooks();
  }, [request]);

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  if (loading) {
    return <Loader />
  }
  
  if (books.length === 0) {
    return <div className="catalog">
      <div className="empty-catalog">There are no books for sale yet!</div>
    </div>
  }

  return ( <>
    <h1>
      Read with us!
      <div className="books-count">We have: {books.length} books for programmers:</div>
    </h1>
    
    <div className="catalog">
      {
        books.map(book => {
          return (
            <div key={book._id} className="catalog__item">
              <div className="card book-card">
                <div className="card-content white-text">
                  <span className="card-title">
                    <Link to={`/book/${book._id}`}>{book.title}</Link>
                  </span>
                  <p>{book.description}</p>
                </div>
                <div className="card-action">
                  <div className="info-book">
                    <div className="author">
                      Author{book.author.split(',').length === 1 ? "" : "s"}: {book.author}
                    </div>
                    <div className="seller">
                      Selleer: {book.seller}
                    </div>
                  </div>
                  <div className="buy-block">
                    <Link
                      className="buy-book"
                      to={`/book/${book._id}`}
                    >
                      Show more
                    </Link>
                    <div className="price">
                      {book.price}$
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  </>
  )
}

export default CatalogPage;