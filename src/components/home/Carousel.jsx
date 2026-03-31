import { useState, useEffect, useRef, useCallback } from 'react';
import '../../css/Carousel.css';

const slides = [
  { className: 'carousel-img carousel-img-0' },
  { className: 'carousel-img carousel-img-1' },
];

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const isPausedRef = useRef(false);

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 1000);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-play
  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
        }
      }, 6000);
    };
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };
  const handleMouseLeave = () => {
    isPausedRef.current = false;
  };

  return (
    <div>
      <div
        className="container home-page-carousel-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="carousel-slider" style={{ position: 'relative', overflow: 'hidden' }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={slide.className}
              style={{
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
        <div
          className="carousel-arrow carousel-arrow-left"
          onClick={prevSlide}
        >
          <span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
        </div>
        <div
          className="carousel-arrow carousel-arrow-right"
          onClick={nextSlide}
        >
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
