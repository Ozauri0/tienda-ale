'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostrar el botón cuando el usuario haya scrolleado más de 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <style jsx>{`
        .scroll-to-top-btn {
          background-color: hsl(0 0% 9%);
          color: hsl(0 0% 98%);
          border-color: hsl(0 0% 9% / 0.2);
        }
        
        :global(.dark) .scroll-to-top-btn {
          background-color: hsl(0 0% 98%);
          color: hsl(0 0% 9%);
          border-color: hsl(0 0% 98% / 0.2);
        }
        
        .scroll-to-top-btn:hover {
          border-color: hsl(0 0% 9%);
        }
        
        :global(.dark) .scroll-to-top-btn:hover {
          border-color: hsl(0 0% 98%);
        }
      `}</style>
      
      <button
        onClick={scrollToTop}
        className={`scroll-to-top-btn fixed bottom-6 right-6 z-40 p-3 md:p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 border-2 group ${
          isVisible 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
    </>
  );
}
