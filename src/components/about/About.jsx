import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import Footer from '../Footer';
import UserUtil from '../../util/UserUtil';
import '../../css/About.css';

function About() {
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
      <div className="about-wrap">
        <div className="about-panel about-panel-6"></div>
        <div className="about-panel about-panel-4"></div>
        <div className="about-panel about-panel-3"></div>
        <div className="about-panel about-panel-0" id="ingredients"></div>
        <div className="about-panel about-panel-5"></div>
        <div className="about-panel about-panel-1"></div>
        <div className="about-panel about-panel-2"></div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
