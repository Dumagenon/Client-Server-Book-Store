import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import AuthContext from '../../context/auth-context';
import './create-book-page.css';

const CreateBookPage = () => {
  const auth = useContext(AuthContext);

  const [formCreation, setCreateForm] = useState({
    seller: auth.userName,
    title: '',
    author: '',
    description: '',
    price: 0,
  });

  const message = useMessage();
  const history = useHistory();
  const { request, error, clearError } = useHttp();

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHandler = event => {
    setCreateForm({...formCreation, [event.target.name]: event.target.value});
  };

  const onSubmit = async (e) => {
    e.preventDefault()

    setCreateForm({ ...formCreation });
    
    console.log(formCreation)
    await request('/api/books/add', "POST", formCreation, {
      Authorization: `Bearer ${auth.token}`
    })

    history.push('/');
  };

  return (
    <section className="create">
      <h3>Create New Book</h3>
      <form onSubmit={onSubmit} className="card">
        <div className="card-content">
          <div className="form-field">
            <div> 
              <label>Book title: </label>
              <input  type="text"
                  required
                  name="title"
                  className="create-input"
                  value={formCreation.title}
                  onChange={changeHandler}
                  />
            </div>
            <div> 
              <label>Author: </label>
              <input  type="text"
                  required
                  name="author"
                  className="create-input"
                  value={formCreation.author}
                  onChange={changeHandler}
              />
            </div>
          </div>
          <div className="form-field">
            <div> 
              <label>Description: </label>
              <input type="text"
                  required
                  name="description"
                  className="create-input"
                  value={formCreation.description}
                  onChange={changeHandler}
                  />
            </div>
            <div>
              <label>Price in USD: </label>
              <input 
                  type="number"
                  min="0" step="any"
                  name="price"
                  className="create-input"
                  value={formCreation.price}
                  onChange={changeHandler}
                  />
            </div>
          </div>
        </div>
        <div className="card-action">
          <button type="submit"
            className="dark-btn">Create Product</button>
        </div>
      </form>
    </section>
  )
}

export default CreateBookPage;