import React from 'react';
import './plus-minus.css';

const PlusMinus = ({ value, onPlus, onMinus }) => {
  return (
    <div className="plus-minus-block">
      <button className="plus-minus-btn" onClick={onMinus}>-</button>
      <span className="value">{value}</span>
      <button className="plus-minus-btn" onClick={onPlus}>+</button>
    </div>
  );
}

export default PlusMinus;