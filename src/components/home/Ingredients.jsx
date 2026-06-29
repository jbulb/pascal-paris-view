import { useState, useEffect } from 'react';
import '../../css/Ingredients.css';

function Ingredients() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/sections/ingredient')
      .then((r) => r.ok ? r.json() : [])
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="">
      <div className="section-wrap">
        <h1>Only The Best Ingredients</h1>
        <div className="ingredients-wrap">
          {items.map((item) => (
            <div key={item.id} className="ingredients-item">
              <div
                className="ingredients-img"
                style={{
                  backgroundImage: `url(${item.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
              <div className="ingredients-header">
                {item.title && <p>{item.title}</p>}
              </div>
              <div className="ingredients-description">
                <p>{item.body}</p>
              </div>
            </div>
          ))}
          <a className="home-anchor" href="/ourstory#ingredients">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}

export default Ingredients;
