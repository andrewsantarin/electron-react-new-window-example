export const isProduction = function isProduction() {
  return process.env.NODE_ENV === 'production';
}
