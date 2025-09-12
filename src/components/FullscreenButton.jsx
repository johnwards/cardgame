import { useState, useEffect } from 'react';

const FullscreenButton = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if we're on mobile
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);

    // Hide button after 10 seconds
    if (mobile) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleFullscreen = () => {
    // Hide address bar
    window.scrollTo(0, 1);
    document.body.scrollTop = 1;

    // Try to request fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }

    // Update viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Hide the button after clicking
    setIsVisible(false);
  };

  if (!isMobile || !isVisible) {
    return null;
  }

  return (
    <button
      onClick={handleFullscreen}
      className="fixed top-2 right-2 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm shadow-lg"
      style={{ touchAction: 'manipulation' }}
    >
      📱 Fullscreen
    </button>
  );
};

export default FullscreenButton;