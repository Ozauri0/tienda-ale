'use client';

import { useEffect } from 'react';
import { smoothScrollTo } from '@/lib/scroll';

export default function ScrollHandler() {
  useEffect(() => {
    // Verificar si hay una sección guardada en sessionStorage
    const sectionId = sessionStorage.getItem('scrollToSection');
    if (sectionId) {
      // Limpiar el sessionStorage
      sessionStorage.removeItem('scrollToSection');
      // Esperar un poco para que la página se cargue completamente
      setTimeout(() => {
        smoothScrollTo(sectionId);
      }, 100);
    }
  }, []);

  return null;
}
