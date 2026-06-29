import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from '../Nav';
import Footer from '../Footer';
import '../../css/Blog.css';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/blog/items/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setPost)
      .catch(() => setPost(null));

    fetch('/api/blog/items')
      .then((r) => r.ok ? r.json() : [])
      .then((items) => setRelatedPosts(items.filter((p) => p.id !== Number(id)).slice(0, 3)))
      .catch(() => setRelatedPosts([]));
  }, [id]);

  useEffect(() => {
    const handleScroll = () => setShowArrow(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const renderBody = (body) => {
    if (!body) return null;
    return body.split('\n\n').map((paragraph, i) => {
      if (paragraph.startsWith('**') && paragraph.includes('**')) {
        const match = paragraph.match(/^\*\*(.+?)\*\*([\s\S]*)/);
        if (match) {
          return (
            <div key={i} className="blog-post-countdown-wrap">
              <h3>{match[1]}</h3>
              <p>{match[2].trim()}</p>
            </div>
          );
        }
      }
      return <p key={i}>{paragraph}</p>;
    });
  };

  if (!post) {
    return (
      <div className="App topOfPage">
        <Nav />
        <div className="section-wrap blog-post-wrap">
          <p style={{ textAlign: 'center', padding: '60px 0', color: '#818A96' }}>
            Loading...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App topOfPage">
      <div
        className="go-back-up-arrow"
        onClick={goToTop}
        style={{ display: showArrow ? 'block' : 'none' }}
      ></div>
      <Nav />
      <div className="section-wrap blog-post-wrap">
        <h2>{post.header.toUpperCase()}</h2>
        {post.img && <div className={`blog-post-header-img ${post.img}`}></div>}
        <div className="blog-post-body">
          {renderBody(post.body)}
        </div>
      </div>
      {relatedPosts.length > 0 && (
        <div className="blog-wrap">
          <div className="section-wrap blog-post-bottom-item-wrap">
            {relatedPosts.map((item) => {
              const imgClasses = `blog-post-bottom-item-img ${item.img}`;
              return (
                <div key={item.id} className="blog-post-bottom-item">
                  <h1>{item.header}</h1>
                  <div className={imgClasses}></div>
                  <p>{item.desc}</p>
                  <Link to={`/blog-post/${item.id}`}>Read More</Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default BlogPost;
