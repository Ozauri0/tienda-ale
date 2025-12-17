export function smoothScrollTo(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

export function navigateToSection(sectionId: string) {
  // Si estamos en la página principal, hacer scroll
  if (window.location.pathname === '/') {
    smoothScrollTo(sectionId);
  } else {
    // Si estamos en otra página, redirigir a la página principal y guardar la sección en sessionStorage
    sessionStorage.setItem('scrollToSection', sectionId);
    window.location.href = '/';
  }
}
