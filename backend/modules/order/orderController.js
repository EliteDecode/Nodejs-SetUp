const asyncHandler = require("express-async-handler");
const OrderModel = require("./OrderModel");

const createOrder = asyncHandler (async(req, res) => {
    // get all the order details from the cart including the cartId and save 
   try {

    const {cartId, user, totalAmount} = req.body
    const newOrder = new OrderModel({ cartId, user, totalAmount });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);

   } catch (error) {
    
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
   }
   
})

const getAllOrders = asyncHandler (async (req, res) => {
    // get all the oders for that particular user
    try {
        const orders = await OrderModel.find()
        res.json(orders)
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ error: 'Failed to get orders' }); 
    }
})

const getOrderById = asyncHandler (async (req, res) => {
    // get Order by Id
    try {
        const Order = await OrderModel.findById(req.params.id);
        if (!Order) {
           return res.status(404).json({error: 'Oder not found'}) 
        }
        res.json(Order)

    } catch (error) {
        console.error('Error getting order by ID:', error);
        res.status(500).json({ error: 'Failed to get order' });
    }
})

const deleteOrder = asyncHandler (async (req, res) => {
    // delete Order
    try {
        const order = await OrderModel.findByIdAndDelete(req.params.id)
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
            res.status(500).json({ error: 'Failed to delete order' });
    }
})

 const UpdateOrderStatus = asyncHandler (async (req, res) => {
    try {
        
        const { status } = req.body;
        const Order = await OrderModel.findByIdAndUpdate(req.params.id, {status}, {new:true });
                if (!Oder) {
                   return res.status(404).json({error: 'Order not found'}) 
                }
                res.json(Order)
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ error: 'Failed to update order status' });
        }
 })

 module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    deleteOrder,
    UpdateOrderStatus
 }