import { useState, useEffect } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import '../../css/Blog.css';

const blogItemsData = [
  {
    header: '5 SECRETS TO FRIZZ CONTROL FOR CURLY HAIR',
    img: 'blog-item-img-0',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec',
  },
  {
    header: 'The 7 Best Natural Ingredients for Your Hair',
    img: 'blog-item-img-1',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec',
  },
  {
    header: 'How To Get Healthy Hair: Healthy Hair Tips',
    img: 'blog-item-img-2',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec',
  },
  {
    header: 'Hair Styles to Complete Your Halloween Look',
    img: 'blog-item-img-3',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec',
  },
];

function Blog() {
  const [showArrow, setShowArrow] = useState(false);

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
          {blogItemsData.map((blogItem, index) => {
            const blogItemBackgroundClasses = `blog-item-img ${blogItem.img}`;
            return (
              <div key={blogItem.header + index} className="blog-item">
                <h1>{blogItem.header}</h1>
                <div className={blogItemBackgroundClasses}></div>
                <p>{blogItem.description} ...</p>
                <a href="/blog-post">Read More</a>
              </div>
            );
          })}
        </div>
        <div className="load-more-blog-wrap">
          <a>Load More</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Blog;
