'use client';

import Link from 'next/link';
import { useState } from 'react';
import * as React from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { smoothScrollTo } from '@/lib/scroll';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic/touch fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Verificar si el clic/tap fue fuera del menú
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Pequeño delay para evitar que se cierre inmediatamente al abrir
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true);
        document.addEventListener('touchstart', handleClickOutside, true);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside, true);
        document.removeEventListener('touchstart', handleClickOutside, true);
      };
    }
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm transition-all duration-300">
      <nav ref={menuRef} className="container mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl border-2 border-primary/20 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <span className="font-bold text-base sm:text-lg">É</span>
            </div>
            <span className="text-base sm:text-xl font-semibold tracking-tight group-hover:text-primary transition-colors hidden xs:inline">EduPlay Chile</span>
            <span className="text-base sm:text-xl font-semibold tracking-tight group-hover:text-primary transition-colors xs:hidden">EduPlay</span>
          </Link>
          
          {/* Menu Desktop */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            <li><button onClick={() => smoothScrollTo('inicio')} className="relative group py-2 inline-block">
              <span className="group-hover:text-primary transition-colors">Inicio</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button></li>
            <li><button onClick={() => smoothScrollTo('productos')} className="relative group py-2 inline-block">
              <span className="group-hover:text-primary transition-colors">Catálogo</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button></li>
            <li><button onClick={() => smoothScrollTo('colecciones')} className="relative group py-2 inline-block">
              <span className="group-hover:text-primary transition-colors">Categorías</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button></li>
            <li><button onClick={() => smoothScrollTo('nosotros')} className="relative group py-2 inline-block">
              <span className="group-hover:text-primary transition-colors">Nosotros</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button></li>
            <li><button onClick={() => smoothScrollTo('contacto')} className="relative group py-2 inline-block">
              <span className="group-hover:text-primary transition-colors">Contacto</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button></li>
          </ul>
          
          {/* Acciones */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <button className="hidden sm:flex p-2 hover:bg-secondary border border-border/50 rounded-full transition-all duration-300 hover:scale-110" aria-label="Buscar">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-2 hover:bg-secondary border border-border/50 rounded-full transition-all duration-300 hover:scale-110 relative" aria-label="Carrito">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse text-[10px] sm:text-xs">0</span>
            </button>
            {/* Menu Mobile Toggle */}
            <button 
              className="lg:hidden p-2 hover:bg-secondary border border-border/50 rounded-full transition-all duration-300" 
              aria-label="Menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div 
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="mt-4 pb-4 border-t border-border pt-4">
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li className={cn(
                "transform transition-all duration-300 ease-out",
                isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                isMenuOpen && "delay-[50ms]"
              )}>
                <button onClick={() => { smoothScrollTo('inicio'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 hover:bg-secondary rounded-xl transition-all active:scale-95">Inicio</button>
              </li>
              <li className={cn(
                "transform transition-all duration-300 ease-out",
                isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                isMenuOpen && "delay-[100ms]"
              )}>
                <button onClick={() => { smoothScrollTo('productos'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 hover:bg-secondary rounded-xl transition-all active:scale-95">Catálogo</button>
              </li>
              <li className={cn(
                "transform transition-all duration-300 ease-out",
                isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                isMenuOpen && "delay-[150ms]"
              )}>
                <button onClick={() => { smoothScrollTo('colecciones'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 hover:bg-secondary rounded-xl transition-all active:scale-95">Categorías</button>
              </li>
              <li className={cn(
                "transform transition-all duration-300 ease-out",
                isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                isMenuOpen && "delay-[200ms]"
              )}>
                <button onClick={() => { smoothScrollTo('nosotros'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 hover:bg-secondary rounded-xl transition-all active:scale-95">Nosotros</button>
              </li>
              <li className={cn(
                "transform transition-all duration-300 ease-out",
                isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                isMenuOpen && "delay-[250ms]"
              )}>
                <button onClick={() => { smoothScrollTo('contacto'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 hover:bg-secondary rounded-xl transition-all active:scale-95">Contacto</button>
              </li>
            </ul>
            
            {/* Acciones mobile adicionales */}
            <div className={cn(
              "mt-4 pt-4 border-t border-border flex items-center justify-center gap-3 transform transition-all duration-300 ease-out",
              isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              isMenuOpen && "delay-[300ms]"
            )}>
              <div className="sm:hidden">
                <ThemeToggle />
              </div>
              <button className="sm:hidden p-2 hover:bg-secondary border border-border/50 rounded-full transition-all duration-300" aria-label="Buscar">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
