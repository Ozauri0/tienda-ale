'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-32 h-10 rounded-full bg-secondary animate-pulse" />
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/80 backdrop-blur-sm rounded-full shadow-md border border-border">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'p-2 rounded-full transition-all duration-300 relative',
          theme === 'light'
            ? 'bg-background text-foreground shadow-lg scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
        )}
        aria-label="Tema claro"
        title="Tema claro"
      >
        <Sun className="h-4 w-4" />
        {theme === 'light' && (
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
        )}
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'p-2 rounded-full transition-all duration-300 relative',
          theme === 'dark'
            ? 'bg-background text-foreground shadow-lg scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
        )}
        aria-label="Tema oscuro"
        title="Tema oscuro"
      >
        <Moon className="h-4 w-4" />
        {theme === 'dark' && (
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
        )}
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          'p-2 rounded-full transition-all duration-300 relative',
          theme === 'system'
            ? 'bg-background text-foreground shadow-lg scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
        )}
        aria-label="Tema del sistema"
        title="Tema del sistema"
      >
        <Monitor className="h-4 w-4" />
        {theme === 'system' && (
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
        )}
      </button>
    </div>
  );
}
