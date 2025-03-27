import utils from './utils';

/* -------------------------------------------------------------------------- */
/*                                 Typed Text                                 */
/* -------------------------------------------------------------------------- */

const typedTextInit = () => {
  const typedTexts = document.querySelectorAll('[data-typed-text]');
  if (typedTexts.length && window.Typed) {
    typedTexts.forEach((typedText) => {
      return new window.Typed(typedText, {
        strings: utils.getData(typedText, 'typed-text'),
        typeSpeed: 100,
        loop: true,
        backDelay: 1500,
      });
    });
  }
};

export default typedTextInit;
