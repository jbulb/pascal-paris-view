import { useState, useEffect, useRef, useCallback } from 'react';
import '../../css/AroundTheWorld.css';

const allSlides = [
  'around-the-world-carousel-img around-the-world-carousel-img-0',
  'around-the-world-carousel-img around-the-world-carousel-img-1',
  'around-the-world-carousel-img around-the-world-carousel-img-2',
  'around-the-world-carousel-img around-the-world-carousel-img-3',
  'around-the-world-carousel-img around-the-world-carousel-img-4',
  'around-the-world-carousel-img around-the-world-carousel-img-5',
];

const SLIDES_TO_SHOW = 3;

function AroundTheWorld() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const maxIndex = Math.max(0, allSlides.length - SLIDES_TO_SHOW);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + SLIDES_TO_SHOW >= allSlides.length ? 0 : prev + SLIDES_TO_SHOW));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev - SLIDES_TO_SHOW < 0
        ? Math.max(0, allSlides.length - SLIDES_TO_SHOW)
        : prev - SLIDES_TO_SHOW
    );
  }, []);

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + SLIDES_TO_SHOW >= allSlides.length ? 0 : prev + SLIDES_TO_SHOW
      );
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const visibleSlides = allSlides.slice(currentIndex, currentIndex + SLIDES_TO_SHOW);

  return (
    <div>
      <div className="section-wrap">
        <h1>Pascal Paris Around The World</h1>
        <div className="around-the-world-carousel">
          <div className="container around-the-world-container" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {visibleSlides.map((slideClass, index) => (
                <div
                  key={currentIndex + index}
                  className={slideClass}
                  style={{ flex: '1 1 0', transition: 'opacity 0.3s ease' }}
                ></div>
              ))}
            </div>
            <div
              className="around-the-world-carousel-arrow carousel-arrow-left"
              onClick={prevSlide}
            >
              <span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
            </div>
            <div
              className="around-the-world-carousel-arrow carousel-arrow-right"
              onClick={nextSlide}
            >
              <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AroundTheWorld;
