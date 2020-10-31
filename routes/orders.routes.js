const { Router } = require('express');
const Order = require('../models/Order');
const Book = require('../models/Book');
const isAuth = require('../middlewares/auth.middleware');
const router = Router();

router.get('/', isAuth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId });

    res.status(200).json(orders);
  } catch(e) {
    res.status(500).json({message: e.message});
  }
})

router.post('/create', isAuth, async (req, res) => {
  try {
    const isOld = await Order.findOne({product: req.body.product, customer: req.user.userId});

    if (isOld) {
      isOld.count = req.body.count;
      await isOld.save();
    } else {
      const order = await new Order({ ...req.body, customer: req.user.userId });
      await order.save();
    }
    
    const orders = await Order.find({ customer: req.user.userId });
    
    res.status(201).json({ message: 'Order added!', orders });
  } catch (e) {
    res.status(500).json({message: e.message});
  }
})

router.get('/cart', isAuth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId });
    const cart = [];
    for (let order of orders) {
      const { title, price } = await Book.findById(order.product);

      cart.push({ title, price, count: order.count, id: order._id });
    }

    res.status(200).json(cart);
  } catch(e) {
    res.status(500).json({message: e.message});
  }
})

router.delete('/delete/:id', isAuth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    
    const orders = await Order.find({ customer: req.user.userId });

    res.status(200).json({ message: "Order was sucessesfuly deleted!", orders });
  } catch (e) {
    res.status(500).json({message: e.message});
  }
})

module.exports = router;