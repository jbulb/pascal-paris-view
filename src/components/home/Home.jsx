import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import ProductQuickView from '../ProductQuickView';
import Carousel from './Carousel';
import FeaturedProducts from './FeaturedProducts';
import Ingredients from './Ingredients';
import AroundTheWorld from './AroundTheWorld';
import BlogPosts from './BlogPosts';
import Footer from '../Footer';
import CartToast from '../CartToast';
import UserUtil from '../../util/UserUtil';
import '../../index.css';
import '../../css/App.css';

function Home() {
  const userToken = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    if (!UserUtil.isValidUserToken(userToken)) {
      navigate('/login');
    }
  }, [userToken, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!UserUtil.isValidUserToken(userToken)) {
    return <div></div>;
  }

  return (
    <div className="App topOfPage">
      <ProductQuickView />
      <div
        className="go-back-up-arrow"
        onClick={goToTop}
        style={{ display: showArrow ? 'block' : 'none' }}
      ></div>
      <Nav />
      <Carousel />
      <FeaturedProducts />
      <Ingredients />
      <AroundTheWorld />
      <BlogPosts />
      <Footer />
      <CartToast />
    </div>
  );
}

export default Home;
