import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import Products from '../Products';
import CartToast from '../CartToast';
import UserUtil from '../../util/UserUtil';
import '../../css/Products.css';
import '../../css/App.css';

const header = [
  {
    img: 'biomineral-img',
    name: 'Biomineral Collection',
  },
];

function Biomineral() {
  const userToken = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const [showArrow, setShowArrow] = useState(false);

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
      {header.map((headerItem, index) => {
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
      <Products productType="biomineral" />
      <CartToast />
    </div>
  );
}

export default Biomineral;
