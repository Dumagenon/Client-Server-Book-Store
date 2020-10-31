import React, { useState, useEffect, useContext } from 'react';
import Rating from 'react-rating';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import AuthContext from '../../context/auth-context';
import Loader from '../../components/loader';
import './reviews-page.css';

export default function ReviewsPage() {
  const message = useMessage();
  const { token, userName } = useContext(AuthContext);
  
  const { request, loading, error, clearError } = useHttp();
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({
    body: '',
    rate: 0,
    owner: userName
  });

  useEffect(() => {
    async function getReviews() {
      try {
        const data = await request('/api/reviews/', 'GET', null, {
          Authorization: `Bearer ${token}`
        });
        setReviews(data);
      } catch (e) {}
    }
    getReviews();
  }, [token, request]);

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const onRateChange = (value) => {
    setReview((state) => {
      return {
        ...state,
        rate: value
      };
    });
  }

  const changeHandler = event => {
    setReview({...review, [event.target.name]: event.target.value});
  }

  const onSubmin = async (e) => {
    e.preventDefault();
    try {
      await request('/api/reviews/add', 'POST', review, {
        Authorization: `Bearer ${token}`
      })
      setReviews((state) => [...state, review])
    } catch (e) {}
    setReview({body: '', rate: 0, owner: userName})
  }

  if (loading) {
    return <Loader />
  }

  return (
    <section className="reviews">
      <h1>Books heal the soul</h1>
      <ul className="reviews">
        {
          reviews.length === 0 ? (
            <div className="empty-reviews">
              Oops.. No reviews yet...
            </div>
          ) : reviews.map(el => (
            <li key={el._id}>
              <div className="review-header">
                <span className="review-owner">{el.owner}</span>
                <span className="review-stars">
                  <Rating 
                    initialRating={el.rate}
                    emptySymbol={<i className="tiny material-icons">star_border</i>}
                    fullSymbol={<i className="tiny material-icons">star</i>}
                    fractions={2}
                    readonly
                  />
                </span>
                <span className="review-rate">{el.rate.toFixed(1)}</span>
              </div>
              <div className="review-body">
                {el.body}
              </div>
            </li>
          ))
        }
      </ul>
      <form className="add-review" onSubmit={onSubmin}>
        <div className="card">
          <div className="card-content">
            <span className="card-title">Here you can tell how good we are.</span>
            <div>
              <label>Enter your review text</label>
              <textarea
                id="textarea1" value={review.body}
                name="body" data-length="300" required
                className="materialize-textarea" onChange={changeHandler} />
            </div>
            <div className="rate">
              <span>Rate our store:</span> 
              <Rating 
                initialRating={review.rate}
                emptySymbol={<i className="small material-icons">star_border</i>}
                fullSymbol={<i className="small material-icons">star</i>}
                fractions={2}
                onChange={onRateChange}
              />
            </div>
          </div>
          <div className="card-action">
            <button className="dark-btn">Add review</button>
          </div>
        </div>
      </form>
    </section>
  );
}