'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card py-16 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl border-2 border-primary/20 shadow-md">
                <span className="font-bold text-lg">É</span>
              </div>
              <span className="text-xl font-semibold">Élite Store</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Proveemos material didáctico y juguetes educativos de calidad para el desarrollo integral de niños y niñas en edad preescolar.
            </p>
          </div>
          
          {/* Links Column 1 */}
          <div>
            <h3 className="font-semibold mb-4">Comprar</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Material Didáctico</span>
              </Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Juguetes Educativos</span>
              </Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Mobiliario Escolar</span>
              </Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Ofertas Institucionales</span>
              </Link></li>
            </ul>
          </div>
          
          {/* Links Column 2 */}
          <div>
            <h3 className="font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Asesoría Pedagógica</span>
              </Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Despacho a Regiones</span>
              </Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Certificaciones</span>
              </Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Preguntas Frecuentes</span>
              </Link></li>
            </ul>
          </div>
          
          {/* Links Column 3 */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Sobre Nosotros</span>
              </Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Sostenibilidad</span>
              </Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Carreras</span>
              </Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-primary transition-colors inline-flex items-center group">
                <span className="group-hover:translate-x-1 transition-transform">Prensa</span>
              </Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Élite Store. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" prefetch={false} className="p-2 hover:bg-secondary border border-border/50 rounded-full transition-all duration-300 hover:scale-110" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" prefetch={false} className="p-2 hover:bg-secondary border border-border/50 rounded-full transition-all duration-300 hover:scale-110" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" prefetch={false} className="p-2 hover:bg-secondary border border-border/50 rounded-full transition-all duration-300 hover:scale-110" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
