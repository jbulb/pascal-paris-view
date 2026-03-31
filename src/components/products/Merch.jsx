import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import Footer from '../Footer';
import ProductQuickView from '../ProductQuickView';
import FeaturedProducts from '../home/FeaturedProducts';
import CartToast from '../CartToast';
import { addToCart } from '../../store/cartSlice';
import UserUtil from '../../util/UserUtil';
import '../../css/Products.css';
import '../../css/App.css';

const header = [
  {
    img: 'merch-img',
    name: 'Merchandise',
  },
];

const merchItems = [
  {
    img: 'merch-img-0',
    title: 'Pascal Paris Golf Shirt',
    description: 'Define and maintain your style',
    price: '$59.99',
  },
  {
    img: 'merch-img-1',
    title: 'Pascal Paris Tank Top (His)',
    description: 'Boosts curls and reduces frizz',
    price: '$32.99',
  },
  {
    img: 'merch-img-2',
    title: 'Pascal Paris Tank Top (Her)',
    description: 'deposits color and helps stop fading',
    price: '$32.99',
  },
  {
    img: 'merch-img-3',
    title: 'Pascal Paris Visor',
    description: 'deposits color and helps stop fading',
    price: '$34.99',
  },
];

function Merch() {
  const userToken = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showArrow, setShowArrow] = useState(false);
  const [quickViewVisible, setQuickViewVisible] = useState(false);

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

  const showModalOnClick = () => {
    setQuickViewVisible(true);
    document.documentElement.style.overflow = 'hidden';
  };

  if (!UserUtil.isValidUserToken(userToken)) {
    return <div></div>;
  }

  return (
    <div className="App topOfPage">
      <div
        className="go-back-up-arrow"
        onClick={goToTop}
        style={{ display: showArrow ? 'block' : 'none' }}
      ></div>
      <Nav />
      {header.map((headerItem) => {
        const headerBackgroundClasses = `product-header-img ${headerItem.img}`;
        return (
          <div key={headerItem.name} className="product-header-wrap">
            <div>
              <div className={headerBackgroundClasses}>
                <div className="product-header-text"></div>
              </div>
              <div className="section-wrap">
                <h1>Shop {headerItem.name}</h1>
              </div>
            </div>
          </div>
        );
      })}
      <div className="">
        <ProductQuickView />
        <div className="product-wrap section-wrap">
          <div className="products-nav products-sides">
            <div className="sort-options">
              <p>Sort By</p>
              <select className="sort-options-select">
                <option value="Biomineral Collection">Biomineral Collection</option>
                <option value="Botanical Collection">Botanical Collection</option>
                <option value="See All Products">See All Products</option>
                <option value="Swag">Swag Merch</option>
              </select>
              <span className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
            </div>
            <p>Product Type</p>
            <a>Best Sellers</a>
            <a>Value Sets</a>
            <a>Sulfate-Free Shampoos</a>
            <a>Conditioners</a>
            <a>Leave-In Conditioners</a>
            <a>Combing Cremes</a>
            <p>Hair Types</p>
            <a>Curly Hair</a>
            <a>Straight Hair</a>
            <a>Frizzy Hair</a>
            <a>Dry Hair</a>
            <p>Concerns</p>
            <a>Detangler</a>
            <a>Damaged Hair</a>
            <a>Hair Breakage</a>
            <a>Purify &amp; Detox</a>
            <a>Thin &amp; Fine Hair</a>
          </div>
          <div className="products-sides-items products-sides">
            <div className="products-items-wrap">
              {merchItems.map((merch, index) => {
                const backgroundClasses = `products-items-img ${merch.img}`;
                return (
                  <div key={merch.title + index} className="products-items">
                    <div className={backgroundClasses}>
                      <div className="quick-view-button-wrap">
                        <p onClick={showModalOnClick} className="quick-view-button">
                          Quick View
                        </p>
                      </div>
                    </div>
                    <div className="products-items-header">
                      <p>{merch.title}</p>
                    </div>
                    <div className="products-items-description">
                      <p>{merch.description}</p>
                    </div>
                    <div className="products-items-price">
                      <p>{merch.price}</p>
                    </div>
                    <div className="products-items-reviews">
                      <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                      <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                      <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                      <span className="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
                      <span className="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
                    </div>
                    <div className="add-to-cart">
                      <a onClick={() => dispatch(addToCart(merch))}>add to cart</a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <FeaturedProducts />
        </div>
        <Footer />
      </div>
      <CartToast />
    </div>
  );
}

export default Merch;
