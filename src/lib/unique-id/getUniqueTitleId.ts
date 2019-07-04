/**
 * Creates a unique title id.
 * 
 * **Note:**
 * 
 * Ripped off of `golden-layout` **for demonstration purposes only**.
 * Use your own unique id generator in a real project!
 * 
 * @see: https://github.com/golden-layout/golden-layout/blob/6daf09e46ee336f76896af599f7cb3cb92c82edc/src/js_es6/utils/utils.js#L159-L163
 * @returns {string} A unique title id
 */
export function getUniqueTitleId() {
  return Math.floor(Math.random() * 1000000)
    .toString(36);
}
