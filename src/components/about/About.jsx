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
  const [sections, setSections] = useState([]);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    if (!UserUtil.isValidUserToken(userToken)) {
      navigate('/login');
    }
  }, [userToken, navigate]);

  useEffect(() => {
    fetch('/api/sections/about%')
      .then((r) => r.ok ? r.json() : [])
      .then(setSections)
      .catch(() => setSections([]));
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowArrow(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!UserUtil.isValidUserToken(userToken)) {
    return <div></div>;
  }

  const renderSection = (section) => {
    if (section.section_type === 'about_image') {
      return (
        <div
          key={section.id}
          className="about-panel"
          style={{ backgroundImage: `url(${section.img})` }}
        >
          {(section.title || section.body) && (
            <div className="about-panel-overlay">
              {section.title && <h1>{section.title}</h1>}
              {section.body && <p>{section.body}</p>}
            </div>
          )}
        </div>
      );
    }

    if (section.section_type === 'about_text_dark') {
      return (
        <div key={section.id} className="about-text-section about-text-section-dark">
          {section.title && <h2>{section.title}</h2>}
          {section.body && section.body.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>
      );
    }

    return (
      <div key={section.id} className="about-text-section">
        {section.title && <h2>{section.title}</h2>}
        {section.body && section.body.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
      </div>
    );
  };

  return (
    <div className="App topOfPage">
      <div
        className="go-back-up-arrow"
        onClick={goToTop}
        style={{ display: showArrow ? 'block' : 'none' }}
      ></div>
      <Nav />
      <div className="about-wrap">
        {sections.map(renderSection)}
      </div>
      <Footer />
    </div>
  );
}

export default About;
