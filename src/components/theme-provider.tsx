'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    let animationTimeout: NodeJS.Timeout;
    let isAnimating = false;

    // Agregar clase de transición al HTML cuando cambie el tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && mutation.target === document.documentElement) {
          // Prevenir ciclos infinitos
          if (isAnimating) return;
          
          const html = document.documentElement;
          const isThemeChange = html.classList.contains('light') || 
                               html.classList.contains('dark') || 
                               html.classList.contains('ocean');
          
          if (isThemeChange && !html.classList.contains('theme-transitioning')) {
            isAnimating = true;
            
            // Forzar reflow para asegurar que los estilos se apliquen
            html.classList.add('theme-transitioning');
            void html.offsetWidth;
            
            // Remover la clase después de la animación
            animationTimeout = setTimeout(() => {
              html.classList.remove('theme-transitioning');
              isAnimating = false;
            }, 400);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
      if (animationTimeout) clearTimeout(animationTimeout);
    };
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
