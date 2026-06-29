import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBlogItems } from '../../store/blogSlice';
import '../../index.css';
import '../../css/App.css';

function BlogPosts() {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config);
  const blogItems = useSelector((state) => state.blog.items);
  const status = useSelector((state) => state.blog.status);

  useEffect(() => {
    if (config.blogItemsUrl) {
      dispatch(fetchBlogItems(config.blogItemsUrl));
    }
  }, [dispatch, config.blogItemsUrl]);

  if (status === 'loading' && blogItems.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="blog-wrap">
      <div className="section-wrap blog-post-bottom-item-wrap">
        {blogItems.map((blogItem) => {
          const blogItemBackgroundClasses = `blog-post-bottom-item-img ${blogItem.img}`;
          return (
            <div key={blogItem.id} className="blog-post-bottom-item">
              <h1>{blogItem.header}</h1>
              <div className={blogItemBackgroundClasses}></div>
              <p>{blogItem.desc}</p>
              <Link to={`/blog-post/${blogItem.id}`}>Read More</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlogPosts;
