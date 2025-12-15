'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm transition-all duration-300">
      <nav className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <span className="font-bold text-lg">É</span>
            </div>
            <span className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">Élite Store</span>
          </Link>
          
          {/* Menu Desktop */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            <li><Link href="#inicio" className="relative group py-2">
              <span className="group-hover:text-primary transition-colors">Inicio</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link></li>
            <li><Link href="#productos" className="relative group py-2">
              <span className="group-hover:text-primary transition-colors">Productos</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link></li>
            <li><Link href="#colecciones" className="relative group py-2">
              <span className="group-hover:text-primary transition-colors">Colecciones</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link></li>
            <li><Link href="#nosotros" className="relative group py-2">
              <span className="group-hover:text-primary transition-colors">Nosotros</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link></li>
            <li><Link href="#contacto" className="relative group py-2">
              <span className="group-hover:text-primary transition-colors">Contacto</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link></li>
          </ul>
          
          {/* Acciones */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="p-2 hover:bg-secondary rounded-full transition-all duration-300 hover:scale-110" aria-label="Buscar">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-full transition-all duration-300 hover:scale-110 relative" aria-label="Carrito">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">0</span>
            </button>
            {/* Menu Mobile Toggle */}
            <button 
              className="md:hidden p-2 hover:bg-secondary rounded-full transition-all duration-300" 
              aria-label="Menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-in slide-in-from-top duration-300">
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li><Link href="#inicio" className="block px-4 py-2 hover:bg-secondary rounded-xl transition-all" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
              <li><Link href="#productos" className="block px-4 py-2 hover:bg-secondary rounded-xl transition-all" onClick={() => setIsMenuOpen(false)}>Productos</Link></li>
              <li><Link href="#colecciones" className="block px-4 py-2 hover:bg-secondary rounded-xl transition-all" onClick={() => setIsMenuOpen(false)}>Colecciones</Link></li>
              <li><Link href="#nosotros" className="block px-4 py-2 hover:bg-secondary rounded-xl transition-all" onClick={() => setIsMenuOpen(false)}>Nosotros</Link></li>
              <li><Link href="#contacto" className="block px-4 py-2 hover:bg-secondary rounded-xl transition-all" onClick={() => setIsMenuOpen(false)}>Contacto</Link></li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
