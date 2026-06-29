import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../Nav';
import Footer from '../Footer';
import '../../css/Blog.css';

function Blog() {
  const [blogItems, setBlogItems] = useState([]);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    fetch('/api/blog/items')
      .then((r) => r.ok ? r.json() : [])
      .then(setBlogItems)
      .catch(() => setBlogItems([]));
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowArrow(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="App topOfPage">
      <div
        className="go-back-up-arrow"
        onClick={goToTop}
        style={{ display: showArrow ? 'block' : 'none' }}
      ></div>
      <Nav />
      <div className="blog-wrap">
        <div className="blog-header"></div>
        <div className="section-wrap blog-item-wrap">
          {blogItems.map((blogItem) => {
            const blogItemBackgroundClasses = `blog-item-img ${blogItem.img}`;
            return (
              <div key={blogItem.id} className="blog-item">
                <h1>{blogItem.header}</h1>
                <div className={blogItemBackgroundClasses}></div>
                <p>{blogItem.desc}</p>
                <Link to={`/blog-post/${blogItem.id}`}>Read More</Link>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Blog;
