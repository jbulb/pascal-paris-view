import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut as cognitoSignOut, getUserInfo } from '../auth/cognito';
import '../css/Nav.css';

function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [collections, setCollections] = useState([]);

  const cartItems = useSelector((state) => state.cart.items);
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

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Highlight the nav link for the page you're currently on.
  const navClass = ({ isActive }) =>
    isActive ? 'nav-anchors-wrap-selected' : undefined;

  const cartTooltip = `${cartCount} item${cartCount === 1 ? '' : 's'} in cart`;

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
      {/* Always-visible cart indicator: count bubble, one click straight to
          the cart page. */}
      <div
        className="cart-badge-anchor"
        onClick={() => { closeMobileMenu(); navigate('/cart'); }}
        role="link"
        aria-label={cartTooltip}
        title={cartTooltip}
      >
        <i className="fa fa-shopping-cart"></i>
        {cartCount > 0 && <span className="cart-count-bubble">{cartCount}</span>}
      </div>
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
          className="shopping-cart-anchor"
        >
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
