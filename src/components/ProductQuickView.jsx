import { useState } from 'react';
import '../css/ProductQuickView.css';

function ProductQuickView() {
  const [visible, setVisible] = useState(false);

  const hideModal = () => {
    setVisible(false);
    document.documentElement.style.overflow = 'scroll';
  };

  // Expose a way for parent components to open this modal
  // We use a custom event approach so sibling components can trigger it
  // Parents can also pass showQuickView as a callback
  return (
    <div className="">
      <div className="product-quickview-wrap" style={{ display: visible ? 'block' : 'none' }}>
        <div className="product-quickview">
          <div onClick={hideModal} className="exit-quickview">
            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </div>
          <div className="product-quickview-sides product-quickview-sides-img"></div>
          <div className="product-quickview-sides product-quickview-sides-text">
            <div className="product-quickview-header">
              <p>Control Hairspray</p>
            </div>
            <div className="product-quickview-description">
              <p>
                Adjustable holding power in your hands! This humidity resistant, shaping and
                control pray provides texture, natural shine and touchable support that lasts
                all day.
              </p>
            </div>
            <div className="product-quickview-price">
              <p>$26.00</p>
            </div>
            <div className="products-items-reviews">
              <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
              <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
              <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
              <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
              <span className="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
            </div>
            <div className="quantity-size">
              <div className="product-quantity quantity-size-inline">
                <p>Quantity</p>
                <input />
              </div>
              <div className="product-size quantity-size-inline">
                <p>Size</p>
                <select>
                  <option value="8.5oz">8.5oz</option>
                  <option value="33.8oz">33.8oz</option>
                </select>
                <span className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
              </div>
            </div>
            <div className="add-to-cart quickview-add-to-cart">
              <a className="quickview-add-to-cart-a">add to cart</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductQuickView;
