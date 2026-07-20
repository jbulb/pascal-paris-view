import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import Footer from '../Footer';
import { removeFromCart, updateCartQuantity, cartItemKey } from '../../store/cartSlice';
import UserUtil from '../../util/UserUtil';
import '../../css/ShoppingCart.css';

function ShoppingCart() {
  const userToken = useSelector((state) => state.user.token);
  const cartItems = useSelector((state) => state.cart.items);
  const checkoutUrl = useSelector((state) => state.config.paymentCheckoutUrl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showArrow, setShowArrow] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!UserUtil.isValidUserToken(userToken)) {
      navigate('/login');
    }
  }, [userToken, navigate]);

  useEffect(() => {
    const handleScroll = () => setShowArrow(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const parsePrice = (priceStr) => parseFloat(priceStr.replace('$', ''));

  const handleCheckout = async () => {
    if (cartItems.length === 0 || checkingOut) return;
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const response = await fetch(checkoutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id ?? null,
            title: item.title,
            quantity: item.quantity,
          })),
        }),
      });
      if (!response.ok) {
        // Prefer the API's explanation (e.g. which items are no longer
        // available) over a generic message.
        let detail = '';
        try { detail = (await response.json()).detail || ''; } catch { /* not JSON */ }
        throw new Error(detail);
      }
      const { url } = await response.json();
      // Redirect to Stripe's hosted checkout page.
      window.location.assign(url);
    } catch (err) {
      setCheckoutError(
        err.message || 'Something went wrong starting checkout. Please try again.'
      );
      setCheckingOut(false);
    }
  };

  if (!UserUtil.isValidUserToken(userToken)) {
    return <div></div>;
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 5.0 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  return (
    <div className="App topOfPage">
      <div
        className="go-back-up-arrow"
        onClick={goToTop}
        style={{ display: showArrow ? 'block' : 'none' }}
      ></div>
      <Nav />
      <div className="section-wrap shopping-cart-wrap">
        <div className="shopping-cart-sides-inline shopping-cart-sides-inline-total">
          <h1>My Bag</h1>
          {cartItems.length === 0 && (
            <p style={{ padding: '20px', color: '#818A96', textTransform: 'uppercase' }}>
              Your cart is empty
            </p>
          )}
          {cartItems.map((item, index) => {
            const shoppingBagIMGClasses = `shopping-item-img shopping-item-inline ${item.img}`;
            return (
              <div key={item.title + index} className="shopping-item">
                <div className={shoppingBagIMGClasses}></div>
                <div className="shopping-item-text shopping-item-inline">
                  <p className="shopping-item-header">{item.title}</p>
                  <p className="shopping-item-description">
                    {item.desc || item.description}
                  </p>
                  <a onClick={() => dispatch(removeFromCart(cartItemKey(item)))}>Remove Item</a>
                </div>
                <div className="shopping-item-amount shopping-item-inline">
                  <input
                    value={item.quantity}
                    type="number"
                    min="1"
                    onChange={(e) =>
                      dispatch(
                        updateCartQuantity({
                          key: cartItemKey(item),
                          quantity: parseInt(e.target.value, 10) || 1,
                        })
                      )
                    }
                  />
                </div>
                <div className="shopping-item-price shopping-item-inline">
                  <p>${(parsePrice(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
          {cartItems.length > 0 && (
            <div className="shopping-cart-price-breakdown">
              <div className="shopping-cart-price-breakdown-item">
                <h2 className="shopping-cart-price-breakdown-item-inline">SUBTOTAL:</h2>
                <p className="shopping-cart-price-breakdown-item-inline">
                  ${subtotal.toFixed(2)}
                </p>
              </div>
              <div className="shopping-cart-price-breakdown-item">
                <h2 className="shopping-cart-price-breakdown-item-inline">Shipping:</h2>
                <p className="shopping-cart-price-breakdown-item-inline">
                  ${shipping.toFixed(2)}
                </p>
              </div>
              <div className="shopping-cart-price-breakdown-item">
                <h2 className="shopping-cart-price-breakdown-item-inline">ESTIMATED TAX:</h2>
                <p className="shopping-cart-price-breakdown-item-inline">
                  ${tax.toFixed(2)}
                </p>
              </div>
              <div className="shopping-cart-price-breakdown-item shopping-cart-price-breakdown-item-total">
                <h2 className="shopping-cart-price-breakdown-item-inline">Total:</h2>
                <p className="shopping-cart-price-breakdown-item-inline">
                  ${total.toFixed(2)}
                </p>
              </div>
              <div className="checkout-form-wrap">
                <button onClick={handleCheckout} type="button" disabled={checkingOut}>
                  {checkingOut ? 'Redirecting…' : 'Checkout with Stripe'}
                </button>
                {checkoutError && (
                  <p style={{ color: '#c0392b', marginTop: '10px' }}>{checkoutError}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ShoppingCart;
