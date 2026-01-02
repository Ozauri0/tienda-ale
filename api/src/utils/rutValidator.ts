/**
 * Valida el formato del RUT chileno
 * Formato esperado: 12345678-9 o 12.345.678-9
 */
export const validateRUT = (rut: string): boolean => {
  // Limpiar el RUT
  const cleanRUT = rut.replace(/\./g, '').replace(/-/g, '');
  
  if (cleanRUT.length < 2) return false;

  // Separar número y dígito verificador
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toUpperCase();

  // Validar que el cuerpo sea numérico
  if (!/^\d+$/.test(body)) return false;

  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDV = 11 - (sum % 11);
  const calculatedDV =
    expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();

  return dv === calculatedDV;
};

/**
 * Formatea el RUT al formato estándar: 12.345.678-9
 */
export const formatRUT = (rut: string): string => {
  // Limpiar el RUT
  const cleanRUT = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  
  if (cleanRUT.length < 2) return rut;

  // Separar número y dígito verificador
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1);

  // Formatear con puntos
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${formattedBody}-${dv}`;
};

/**
 * Limpia el RUT eliminando puntos y guiones
 */
export const cleanRUT = (rut: string): string => {
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
};
