import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { removeFromCart } from '../store/cartSlice';
import { signOut as cognitoSignOut, getUserInfo } from '../auth/cognito';
import '../css/Nav.css';

function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownVisible, setCartDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [collections, setCollections] = useState([]);

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo().then(setUser).catch(() => setUser(null));
    fetch('/api/collections')
      .then((r) => r.ok ? r.json() : [])
      .then(setCollections)
      .catch(() => setCollections([]));
  }, []);

  const admin = !!user && user.groups.includes('admin');

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    cognitoSignOut();
    setUser(null);
    closeMobileMenu();
    navigate('/');
  };

  const handleSignIn = () => {
    closeMobileMenu();
    navigate('/login');
  };

  // The cart dropdown is a hover affordance — only show it on devices that
  // can actually hover. On touch devices the emulated mouseenter would open
  // it on first tap, covering the button and trapping the user; a tap should
  // go straight to the /cart page instead.
  const canHover = () => window.matchMedia('(hover: hover)').matches;
  const showCartDropdown = () => { if (canHover()) setCartDropdownVisible(true); };
  const hideCartDropdown = () => setCartDropdownVisible(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Highlight the nav link for the page you're currently on.
  const navClass = ({ isActive }) =>
    isActive ? 'nav-anchors-wrap-selected' : undefined;

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
    <>
    <nav>
      {user && (
        <div className="nav-user-badge" title={user.email || user.name}>
          <i className="fa fa-user-circle"></i> {user.name}
        </div>
      )}
      <Link to="/">
        <div className="nav-logo-doc"></div>
      </Link>
      <a className="hamburger-toggle" onClick={toggleMobileMenu}>
        <i className={mobileMenuOpen ? 'fa fa-times' : 'fa fa-bars'}></i>
      </a>
      <div className={'nav-anchors-wrap anchor-wrap-doc' + (mobileMenuOpen ? ' mobile-menu-open' : '')}>
        {user && (
          <span className="nav-mobile-greeting">
            <i className="fa fa-user-circle"></i> {user.name}
          </span>
        )}
        <NavLink to="/" end onClick={closeMobileMenu} className={navClass}>
          <i className="fa fa-home"></i> Home
        </NavLink>
        {collections.map((c) => (
          <NavLink key={c.id} to={`/${c.name}`} onClick={closeMobileMenu} className={navClass}>
            {c.display_name || c.name}
          </NavLink>
        ))}
        <NavLink to="/blog" onClick={closeMobileMenu} className={navClass}>Blog</NavLink>
        <NavLink to="/ourstory" onClick={closeMobileMenu} className={navClass}>About</NavLink>
        {admin && (
          <NavLink to="/admin/products" onClick={closeMobileMenu} className={navClass}>
            <i className="fa fa-cog"></i> Admin
          </NavLink>
        )}
        {user ? (
          <a onClick={handleSignOut}>Sign Out</a>
        ) : (
          <a onClick={handleSignIn}>Sign In</a>
        )}
        <div
          onClick={() => { closeMobileMenu(); navigate('/cart'); }}
          onMouseEnter={showCartDropdown}
          onMouseLeave={hideCartDropdown}
          className="shopping-cart-anchor"
        >
          {renderCartDropdown()}
          <span className="cart-link-label">
            <i className="fa fa-shopping-cart"></i> Cart ({cartCount})
          </span>
        </div>
      </div>
    </nav>
    <div className="nav-spacer"></div>
    </>
  );
}

export default Nav;
