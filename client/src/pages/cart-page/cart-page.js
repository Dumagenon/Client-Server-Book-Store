import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import AuthContext from '../../context/auth-context';
import StoreContext from '../../context/store-context';
import Loader from '../../components/loader';
import './cart-page.css';

export default function CartPage() {
  const message = useMessage();
  const { dispatch } = useContext(StoreContext);
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const { request, error, clearError, loading } = useHttp();

  useEffect(() => {
    async function getOrders() {
      try {
        const data = await request('/api/orders/cart', 'GET', null, {
          Authorization: `Bearer ${token}`
        });
        setOrders(data);
      } catch (e) {}
    }
    getOrders();
  }, [request, setOrders, token]);

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const onDeleteClick = async (id) => {
    try {
      const data = await request(`/api/orders/delete/${id}`, 'DELETE', null, {
        Authorization: `Bearer ${token}`
      });
      setOrders((orders) => {
        const idx = orders.findIndex(el => el.id === id);
        return [
          ...orders.slice(0, idx),
          ...orders.slice(idx + 1, orders.length)
        ];
      })
      dispatch({
        type: "SET_ORDERS",
        payload: data.orders
      })
    } catch (e) {}
  }

  if (loading) {
    return <Loader />
  }

  return (
    <section className="cart">
      <h1>Cart of your books</h1>
      {orders.length === 0 ? (
        <div className="empty-cart">
          There are no books here yet
        </div>) : 
        <ul className="cart__orders-list">
          <li className="graphs">
            <div className="prod-graf">Product</div>
            <div>Quantaty</div>
            <div>Sub Total</div>
          </li>
          {
            orders.map(order => {
              return (
                <li key={order.id}>
                  <div className="order-desc">
                    <div className="order-title">{order.title}</div>
                    <div className="order-price">$ {order.price.toFixed(2)}</div>
                  </div>
                  <div className="order-quantity">
                    <div className="order-count" title="Size of your order">{order.count}</div>
                  </div>
                  <div className="order-total">
                    <div className="total-price">$ {(order.price * order.count).toFixed(2)}</div>
                    <button
                      className="delete-btn"
                      title="Delete order from cart"
                      onClick={() => onDeleteClick(order.id)}
                    >
                      <i className="small material-icons">close</i>
                    </button>
                  </div>
                </li>
              );
            })
          }
        </ul>
      }
    </section>
  );
}
