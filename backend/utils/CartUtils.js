const calculateTotal = cartItem => {
    // console.log(cartItem);
    return cartItem.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
};

module.exports = {calculateTotal}