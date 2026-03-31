import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../store/productsSlice';
import { addToCart } from '../../store/cartSlice';
import '../../css/Featured.css';
import '../../css/Products.css';

function FeaturedProducts() {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config);
  const featuredProducts = useSelector((state) => state.products.featured || []);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const [quickViewVisible, setQuickViewVisible] = useState(false);

  useEffect(() => {
    if (config.featuredProductsUrl) {
      dispatch(fetchProducts({ url: config.featuredProductsUrl, productType: 'featured' }));
    }
  }, [dispatch, config.featuredProductsUrl]);

  const showModalOnClick = () => {
    setQuickViewVisible(true);
    document.documentElement.style.overflow = 'hidden';
  };

  if (status === 'loading' && featuredProducts.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="section-wrap">
        <h1>Featured Best Sellers</h1>
        <div className="products-items-wrap">
          {featuredProducts.map((product, index) => {
            const backgroundClasses = `products-items-img ${product.img}`;
            return (
              <div key={product.title + index} className="featured-products-items">
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
                  <p>{product.description}</p>
                </div>
                <div className="products-items-price">
                  <p>{product.price}</p>
                </div>
                <div className="products-items-reviews">
                  <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                  <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                  <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                  <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                  <span className="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
                </div>
                <div className="add-to-cart">
                  <a onClick={() => dispatch(addToCart(product))}>add to cart</a>
                </div>
              </div>
            );
          })}
          <a className="home-anchor" href="/biomineral">
            See More Products
          </a>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProducts;
