import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';
import { addToCart } from '../store/cartSlice';
import Footer from './Footer';
import ProductQuickView from './ProductQuickView';
import FeaturedProducts from './home/FeaturedProducts';
import '../css/Products.css';
import '../css/App.css';

function Products({ productType }) {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config);
  const products = useSelector((state) => state.products[productType] || []);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const [quickViewVisible, setQuickViewVisible] = useState(false);

  useEffect(() => {
    const url = config.productsUrl[productType];
    if (url) {
      dispatch(fetchProducts({ url, productType }));
    }
  }, [dispatch, config, productType]);

  const showModalOnClick = () => {
    setQuickViewVisible(true);
    document.documentElement.style.overflow = 'hidden';
  };

  if (status === 'loading' && products.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
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
              {products.map((product, index) => {
                const backgroundClasses = `products-items-img ${product.img}`;
                return (
                  <div key={product.title + index} className="products-items">
                    <div className={backgroundClasses}>
                      <div className="quick-view-button-wrap">
                        <p onClick={showModalOnClick} className="quick-view-button">
                          Quick View
                        </p>
                      </div>
                    </div>
                    <div className="products-items-header">
                      <p>{product.title}</p>
                    </div>
                    <div className="products-items-description">
                      <p>{product.desc}</p>
                    </div>
                    <div className="products-items-price">
                      <p>{product.price}</p>
                    </div>
                    <div className="products-items-reviews">
                      <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                      <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                      <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                      <span className="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
                      <span className="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
                    </div>
                    <div className="add-to-cart">
                      <a onClick={() => dispatch(addToCart(product))}>add to cart</a>
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
    </div>
  );
}

export default Products;
