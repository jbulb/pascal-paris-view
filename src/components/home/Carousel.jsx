import { useState, useEffect, useRef, useCallback } from 'react';
import '../../css/Carousel.css';

function Carousel() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    fetch('/api/sections/carousel')
      .then((r) => r.ok ? r.json() : [])
      .then(setSlides)
      .catch(() => setSlides([]));
  }, []);

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning || slides.length === 0) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 1000);
    },
    [isTransitioning, slides.length]
  );

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    timerRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const handleMouseEnter = () => { isPausedRef.current = true; };
  const handleMouseLeave = () => { isPausedRef.current = false; };

  if (slides.length === 0) return null;

  return (
    <div>
      <div
        className="home-page-carousel-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="carousel-slider" style={{ position: 'relative', overflow: 'hidden' }}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="carousel-img"
              style={{
                backgroundImage: `url(${slide.img})`,
                position: index === 0 ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                pointerEvents: currentSlide === index ? 'auto' : 'none',
              }}
            ></div>
          ))}
        </div>
        <div className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
          <span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
        </div>
        <div className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
          <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
        </div>
        <div className="carousel-dots" style={{ textAlign: 'center', marginTop: '10px' }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot${currentSlide === index ? ' carousel-dot-active' : ''}`}
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                margin: '0 5px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentSlide === index ? '#333' : '#ccc',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Carousel;
