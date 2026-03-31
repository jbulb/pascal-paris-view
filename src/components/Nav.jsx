import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userSignedOut } from '../store/userSlice';
import { removeFromCart } from '../store/cartSlice';
import '../css/Nav.css';

function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownVisible, setCartDropdownVisible] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const signOut = () => {
    dispatch(userSignedOut());
    navigate('/login');
  };

  const showCartDropdown = () => setCartDropdownVisible(true);
  const hideCartDropdown = () => setCartDropdownVisible(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderCartDropdown = () => (
    <div className="shopping-cart-dropdown" style={{ display: cartDropdownVisible ? 'block' : 'none' }}>
      {cartItems.map((item, index) => {
        const shoppingBagIMGClasses = `shopping-item-img shopping-item-inline ${item.img}`;
        return (
          <div key={item.title + index} className="shopping-item">
            <div className={shoppingBagIMGClasses}></div>
            <div className="shopping-item-text shopping-item-inline">
              <p className="shopping-item-header">{item.title}</p>
              <p className="shopping-item-description">{item.desc || item.description}</p>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(removeFromCart(item.title));
                }}
              >
                Remove Item
              </a>
            </div>
            <div className="shopping-item-amount shopping-item-inline">
              <input value={item.quantity} readOnly />
            </div>
            <div className="shopping-item-price shopping-item-inline">
              <p>{item.price}</p>
            </div>
          </div>
        );
      })}
      {cartItems.length > 0 && (
        <div className="checkout">
          <Link to="/cart">Continue to Checkout</Link>
        </div>
      )}
      {cartItems.length === 0 && (
        <p style={{ padding: '10px', color: '#818A96' }}>Your cart is empty</p>
      )}
    </div>
  );

  return (
    <div>
      <nav>
        <Link to="/">
          <div className="nav-logo-doc"></div>
        </Link>
        <a className="hamburger-toggle" onClick={toggleMobileMenu}>
          <i className={mobileMenuOpen ? 'fa fa-times' : 'fa fa-bars'}></i>
        </a>
        <div className={'nav-anchors-wrap anchor-wrap-doc' + (mobileMenuOpen ? ' mobile-menu-open' : '')}>
          <Link to="/biomineral" onClick={closeMobileMenu}>Biomineral Collection</Link>
          <Link to="/botanical" onClick={closeMobileMenu}>Botanical Collection</Link>
          <Link to="/bundle-packages" onClick={closeMobileMenu}>Bundle Packages</Link>
          <Link to="/merchandise" onClick={closeMobileMenu}>Merchandise</Link>
          <Link to="/blog" onClick={closeMobileMenu}>Blog</Link>
          <Link to="/ourstory" onClick={closeMobileMenu}>About</Link>
          <a onClick={signOut}>Sign Out</a>
          <Link
            to="/cart"
            onClick={closeMobileMenu}
            onMouseEnter={showCartDropdown}
            onMouseLeave={hideCartDropdown}
            className="shopping-cart-anchor"
          >
            {renderCartDropdown()}
            <span className="cart-link-label">
              <i className="fa fa-shopping-cart"></i> Cart ({cartCount})
            </span>
          </Link>
        </div>
      </nav>
      <nav className="scrolly-nav">
        <Link to="/">
          <div className="nav-logo"></div>
        </Link>
        <div className="nav-anchors-wrap anchor-wrap-scrolly">
          <Link to="/biomineral">Biomineral Collection</Link>
          <Link to="/botanical">Botanical Collection</Link>
          <Link to="/bundle-packages">Bundle Packages</Link>
          <Link to="/merchandise">Merchandise</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/ourstory">About</Link>
          <Link
            to="/cart"
            onMouseEnter={showCartDropdown}
            onMouseLeave={hideCartDropdown}
            className="shopping-cart-anchor"
          >
            {renderCartDropdown()}
            <span className="cart-link-label">
              <i className="fa fa-shopping-cart"></i> Cart ({cartCount})
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
