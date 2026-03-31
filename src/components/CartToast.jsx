import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import '../css/Products.css';

function CartToast() {
  const cartItems = useSelector((state) => state.cart.items);
  const [visible, setVisible] = useState(false);
  const lastCountRef = useRef(
    cartItems.reduce((sum, item) => sum + item.quantity, 0)
  );
  const timerRef = useRef(null);

  useEffect(() => {
    const newCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (newCount > lastCountRef.current) {
      setVisible(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 2000);
    }
    lastCountRef.current = newCount;

    return () => clearTimeout(timerRef.current);
  }, [cartItems]);

  const classes = `cart-toast${visible ? ' cart-toast-visible' : ''}`;

  return (
    <div className={classes}>
      <span className="glyphicon glyphicon-ok"></span> Added to cart
    </div>
  );
}

export default CartToast;
