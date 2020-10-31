import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import AuthContext from '../../context/auth-context';
import PlusMinus from '../../components/plus-minus';
import Loader from '../../components/loader';
import StoreContext from '../../context/store-context';
import './book-page.css';

const BookPage = () => {
  const auth = useContext(AuthContext); 
  const { dispatch } = useContext(StoreContext);
  const message = useMessage();
  const bookId = useParams().id;
  const [book, setBook] = useState({});
  const [order, setOrder] = useState({
    product: bookId,
    customer: '',
    count: 1
  });
  const { request, loading, error, clearError } = useHttp();
  
  const getBook = useCallback(async () => {
    try {
      const data = await request(`/api/books/${bookId}`, 'GET', null);
      setBook(data);
    } catch (e) {}
  }, [request, bookId, setBook])

  useEffect(() => {
    getBook();
    message(error);
    clearError();
  }, [getBook, message, error, clearError]);

  const onBuyClick = async () => {
    try {
      const data = await request('/api/orders/create', "POST", order, {
        Authorization: `Bearer ${auth.token}`
      });
      dispatch({ type: "SET_ORDERS", payload: data.orders });
      window.M.toast({ html: "Thanks for order! We sent this to our managers." });
    } catch (e) {}
  }

  const onPlusClick = () => {
    setOrder((state) => {
      return {
        ...state,
        count: state.count + 1
      };
    })
  }

  const onMinusClick = () => {
    setOrder((state) => {
      return {
        ...state,
        count: state.count === 1 ? 1 : state.count - 1
      }
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="book-section">
      <div key={book._id} className="catalog__item">
        <div className="card book-card">
          <div className="card-content white-text">
            <span className="card-title">{book.title}</span>
            <p>{book.description}</p>
          </div>
          <div className="card-action">
            <div className="info-book">
              <div className="author">
                Author: {book.author}
              </div>
              <div className="seller">
                Selleer: {book.seller}
              </div>
            </div>
            <div className="buy-block">
              <button
                className="buy-book"
                onClick={onBuyClick}
              >
                Buy now
              </button>
              <PlusMinus
                value={order.count} onPlus={onPlusClick} onMinus={onMinusClick}/>
              <div className="price">
                {(book.price * order.count).toFixed(2)}$
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookPage;