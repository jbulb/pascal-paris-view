import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogItems } from '../../store/blogSlice';
import '../../index.css';
import '../../css/App.css';

function BlogPosts() {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config);
  const blogItems = useSelector((state) => state.blog.items);
  const status = useSelector((state) => state.blog.status);
  const error = useSelector((state) => state.blog.error);

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
        {blogItems.map((blogItem, index) => {
          const blogItemBackgroundClasses = `blog-post-bottom-item-img ${blogItem.img}`;
          return (
            <div key={blogItem.header + index} className="blog-post-bottom-item">
              <h1>{blogItem.header}</h1>
              <div className={blogItemBackgroundClasses}></div>
              <p>{blogItem.desc} z...</p>
              <a href="/blog-post">Read More</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlogPosts;
