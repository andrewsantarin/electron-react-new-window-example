/**
 * Creates a unique URL id.
 *
 * **Note:**
 *
 * Ripped off of `golden-layout` **for demonstration purposes only**.
 * Use your own unique id generator in a real project!
 *
 * @see: https://github.com/golden-layout/golden-layout/blob/6daf09e46ee336f76896af599f7cb3cb92c82edc/src/js_es6/controls/BrowserPopout.js#L160
 * @returns {string} A unique URL id
 */
export function getUniqueUrlId() {
  return (Math.random() * 1000000000000000)
    .toString(36)
    .replace('.', '');
}
