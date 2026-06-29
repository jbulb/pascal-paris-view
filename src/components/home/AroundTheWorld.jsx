import { useState, useEffect, useRef, useCallback } from 'react';
import '../../css/AroundTheWorld.css';

const SLIDES_TO_SHOW = 3;

function AroundTheWorld() {
  const [allSlides, setAllSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch('/api/sections/around_the_world')
      .then((r) => r.ok ? r.json() : [])
      .then(setAllSlides)
      .catch(() => setAllSlides([]));
  }, []);

  const nextSlide = useCallback(() => {
    if (allSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + SLIDES_TO_SHOW >= allSlides.length ? 0 : prev + SLIDES_TO_SHOW));
  }, [allSlides.length]);

  const prevSlide = useCallback(() => {
    if (allSlides.length === 0) return;
    setCurrentIndex((prev) =>
      prev - SLIDES_TO_SHOW < 0
        ? Math.max(0, allSlides.length - SLIDES_TO_SHOW)
        : prev - SLIDES_TO_SHOW
    );
  }, [allSlides.length]);

  useEffect(() => {
    if (allSlides.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + SLIDES_TO_SHOW >= allSlides.length ? 0 : prev + SLIDES_TO_SHOW
      );
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [allSlides.length]);

  if (allSlides.length === 0) return null;

  const visibleSlides = allSlides.slice(currentIndex, currentIndex + SLIDES_TO_SHOW);

  return (
    <div>
      <div className="section-wrap">
        <h1>Pascal Paris Around The World</h1>
        <div className="around-the-world-carousel">
          <div className="container around-the-world-container" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {visibleSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="around-the-world-carousel-img"
                  style={{
                    flex: '1 1 0',
                    transition: 'opacity 0.3s ease',
                    backgroundImage: `url(${slide.img})`,
                  }}
                ></div>
              ))}
            </div>
            <div className="around-the-world-carousel-arrow carousel-arrow-left" onClick={prevSlide}>
              <span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
            </div>
            <div className="around-the-world-carousel-arrow carousel-arrow-right" onClick={nextSlide}>
              <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AroundTheWorld;
