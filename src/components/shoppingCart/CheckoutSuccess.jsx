import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Nav from '../Nav';
import Footer from '../Footer';
import { clearCart } from '../../store/cartSlice';
import '../../css/ShoppingCart.css';

function CheckoutSuccess() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Payment completed on Stripe's hosted page; empty the cart.
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="App topOfPage">
      <Nav />
      <div className="section-wrap shopping-cart-wrap">
        <div className="shopping-cart-sides-inline shopping-cart-sides-inline-total">
          <h1>Thank you</h1>
          <p style={{ padding: '20px', color: '#818A96', textTransform: 'uppercase' }}>
            Your order has been placed. A confirmation will be sent to your email.
          </p>
          <div className="checkout-form-wrap">
            <Link to="/">Continue shopping</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutSuccess;
