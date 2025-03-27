/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */

const docReady = fn => {
  // see if DOM is already available

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    setTimeout(fn, 1);
  }
};
const isRTL = () => document.querySelector('html').getAttribute('dir') === 'rtl';
const resize = fn => window.addEventListener('resize', fn);
/* eslint consistent-return: */
const isIterableArray = array => Array.isArray(array) && !!array.length;
const camelize = str => {
  if (str) {
    const text = str.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    return `${text.substr(0, 1).toLowerCase()}${text.substr(1)}`;
  }
};
const getData = (el, data) => {
  try {
    return JSON.parse(el.dataset[camelize(data)]);
  } catch (e) {
    return el.dataset[camelize(data)];
  }
};

/* ----------------------------- Colors function ---------------------------- */

const hexToRgb = hexValue => {
  let hex;
  hexValue.indexOf('#') === 0 ? hex = hexValue.substring(1) : hex = hexValue;
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b));
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};
const rgbaColor = (color = '#fff', alpha = 0.5) => `rgba(${hexToRgb(color)}, ${alpha})`;

/* --------------------------------- Colors --------------------------------- */

const getColor = (name, dom = document.documentElement) => getComputedStyle(dom).getPropertyValue(`--sparrow-${name}`).trim();
const getColors = dom => ({
  primary: getColor('primary', dom),
  secondary: getColor('secondary', dom),
  success: getColor('success', dom),
  info: getColor('info', dom),
  warning: getColor('warning', dom),
  danger: getColor('danger', dom),
  light: getColor('light', dom),
  dark: getColor('dark', dom)
});
const getGrays = dom => ({
  white: getColor('white', dom),
  100: getColor('100', dom),
  200: getColor('200', dom),
  300: getColor('300', dom),
  400: getColor('400', dom),
  500: getColor('500', dom),
  600: getColor('600', dom),
  700: getColor('700', dom),
  800: getColor('800', dom),
  900: getColor('900', dom),
  1000: getColor('1000', dom),
  1100: getColor('1100', dom),
  black: getColor('black', dom)
});
const hasClass = (el, className) => {
  !el && false;
  return el.classList.value.includes(className);
};
const addClass = (el, className) => {
  el.classList.add(className);
};
const getOffset = el => {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};
const isScrolledIntoView = el => {
  let top = el.offsetTop;
  let left = el.offsetLeft;
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  while (el.offsetParent) {
    // eslint-disable-next-line no-param-reassign
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }
  return {
    all: top >= window.pageYOffset && left >= window.pageXOffset && top + height <= window.pageYOffset + window.innerHeight && left + width <= window.pageXOffset + window.innerWidth,
    partial: top < window.pageYOffset + window.innerHeight && left < window.pageXOffset + window.innerWidth && top + height > window.pageYOffset && left + width > window.pageXOffset
  };
};
const isElementIntoView = el => {
  const position = el.getBoundingClientRect();
  // checking whether fully visible
  if (position.top >= 0 && position.bottom <= window.innerHeight) {
    return true;
  }

  // checking for partial visibility
  if (position.top < window.innerHeight && position.bottom >= 0) {
    return true;
  }
};
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
};
const getBreakpoint = el => {
  const classes = el && el.classList.value;
  let breakpoint;
  if (classes) {
    breakpoint = breakpoints[classes.split(' ').filter(cls => cls.includes('navbar-expand-')).pop().split('-').pop()];
  }
  return breakpoint;
};
const getCurrentScreenBreakpoint = () => {
  let currentBreakpoint = '';
  if (window.innerWidth >= breakpoints.xl) {
    currentBreakpoint = 'xl';
  } else if (window.innerWidth >= breakpoints.lg) {
    currentBreakpoint = 'lg';
  } else if (window.innerWidth >= breakpoints.md) {
    currentBreakpoint = 'md';
  } else {
    currentBreakpoint = 'sm';
  }
  const breakpointStartVal = breakpoints[currentBreakpoint];
  return {
    currentBreakpoint,
    breakpointStartVal
  };
};

/* --------------------------------- Cookie --------------------------------- */

const setCookie = (name, value, expire) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + expire);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()}`;
};
const getCookie = name => {
  const keyValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return keyValue ? keyValue[2] : keyValue;
};
const settings = {
  tinymce: {
    theme: 'oxide'
  },
  chart: {
    borderColor: 'rgba(255, 255, 255, 0.8)'
  }
};

/* -------------------------- Chart Initialization -------------------------- */

const newChart = (chart, config) => {
  const ctx = chart.getContext('2d');
  return new window.Chart(ctx, config);
};

/* ---------------------------------- Store --------------------------------- */

const getItemFromStore = (key, defaultValue, store = localStorage) => {
  try {
    return JSON.parse(store.getItem(key)) || defaultValue;
  } catch {
    return store.getItem(key) || defaultValue;
  }
};
const setItemToStore = (key, payload, store = localStorage) => store.setItem(key, payload);
const getStoreSpace = (store = localStorage) => parseFloat((escape(encodeURIComponent(JSON.stringify(store))).length / (1024 * 1024)).toFixed(2));

/* get Dates between */

const getDates = (startDate, endDate, interval = 1000 * 60 * 60 * 24) => {
  const duration = endDate - startDate;
  const steps = duration / interval;
  return Array.from({
    length: steps + 1
  }, (v, i) => new Date(startDate.valueOf() + interval * i));
};
const getPastDates = duration => {
  let days;
  switch (duration) {
    case 'week':
      days = 7;
      break;
    case 'month':
      days = 30;
      break;
    case 'year':
      days = 365;
      break;
    default:
      days = duration;
  }
  const date = new Date();
  const endDate = date;
  const startDate = new Date(new Date().setDate(date.getDate() - (days - 1)));
  return getDates(startDate, endDate);
};

/* Get Random Number */
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
const utils = {
  docReady,
  resize,
  isIterableArray,
  camelize,
  getData,
  hasClass,
  addClass,
  hexToRgb,
  rgbaColor,
  getColor,
  getColors,
  getGrays,
  getOffset,
  isScrolledIntoView,
  getBreakpoint,
  setCookie,
  getCookie,
  newChart,
  settings,
  getItemFromStore,
  setItemToStore,
  getStoreSpace,
  getDates,
  getPastDates,
  getRandomNumber,
  getCurrentScreenBreakpoint,
  breakpoints,
  isElementIntoView,
  isRTL
};

/* -------------------------------------------------------------------------- */
/*                                  Detector                                  */
/* -------------------------------------------------------------------------- */

const detectorInit = () => {
  const {
    is
  } = window;
  const html = document.querySelector('html');
  is.opera() && addClass(html, 'opera');
  is.mobile() && addClass(html, 'mobile');
  is.firefox() && addClass(html, 'firefox');
  is.safari() && addClass(html, 'safari');
  is.ios() && addClass(html, 'ios');
  is.iphone() && addClass(html, 'iphone');
  is.ipad() && addClass(html, 'ipad');
  is.ie() && addClass(html, 'ie');
  is.edge() && addClass(html, 'edge');
  is.chrome() && addClass(html, 'chrome');
  is.mac() && addClass(html, 'osx');
  is.windows() && addClass(html, 'windows');
  navigator.userAgent.match('CriOS') && addClass(html, 'chrome');
};

/*-----------------------------------------------
|   DomNode
-----------------------------------------------*/
class DomNode {
  constructor(node) {
    this.node = node;
  }
  addClass(className) {
    this.isValidNode() && this.node.classList.add(className);
  }
  removeClass(className) {
    this.isValidNode() && this.node.classList.remove(className);
  }
  toggleClass(className) {
    this.isValidNode() && this.node.classList.toggle(className);
  }
  hasClass(className) {
    this.isValidNode() && this.node.classList.contains(className);
  }
  data(key) {
    if (this.isValidNode()) {
      try {
        return JSON.parse(this.node.dataset[this.camelize(key)]);
      } catch (e) {
        return this.node.dataset[this.camelize(key)];
      }
    }
    return null;
  }
  attr(name) {
    return this.isValidNode() && this.node[name];
  }
  setAttribute(name, value) {
    this.isValidNode() && this.node.setAttribute(name, value);
  }
  removeAttribute(name) {
    this.isValidNode() && this.node.removeAttribute(name);
  }
  setProp(name, value) {
    this.isValidNode() && (this.node[name] = value);
  }
  on(event, cb) {
    this.isValidNode() && this.node.addEventListener(event, cb);
  }
  isValidNode() {
    return !!this.node;
  }

  // eslint-disable-next-line class-methods-use-this
  camelize(str) {
    const text = str.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    return `${text.substr(0, 1).toLowerCase()}${text.substr(1)}`;
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Anchor JS                                 */
/* -------------------------------------------------------------------------- */

const anchors = new window.AnchorJS();
anchors.options = {
  icon: '#'
};
anchors.add('[data-anchor]');

/* --------------------------------------------------------------------------
|                                 bg player
--------------------------------------------------------------------------- */

const bgPlayerInit = () => {
  const Selector = {
    DATA_YOUTUBE_EMBED: '[data-youtube-embed]',
    YT_VIDEO: '.yt-video'
  };
  const DATA_KEY = {
    YOUTUBE_EMBED: 'youtube-embed'
  };
  const ClassName = {
    LOADED: 'loaded'
  };
  const Events = {
    SCROLL: 'scroll',
    LOADING: 'loading',
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  };
  const youtubeEmbedElements = document.querySelectorAll(Selector.DATA_YOUTUBE_EMBED);
  const loadVideo = () => {
    function setupPlayer() {
      window.YT.ready(() => {
        youtubeEmbedElements.forEach(youtubeEmbedElement => {
          const userOptions = utils.getData(youtubeEmbedElement, DATA_KEY.YOUTUBE_EMBED);
          const defaultOptions = {
            videoId: 'hLpy-DRuiz0',
            startSeconds: 1,
            endSeconds: 50
          };
          const options = window._.merge(defaultOptions, userOptions);
          const youTubePlayer = () => {
            // eslint-disable-next-line
            new YT.Player(youtubeEmbedElement, {
              videoId: options.videoId,
              playerVars: {
                autoplay: 1,
                disablekb: 1,
                controls: 0,
                modestbranding: 1,
                // Hide the Youtube Logo
                loop: 1,
                fs: 0,
                enablejsapi: 0,
                start: options?.startSeconds,
                end: options?.endSeconds
              },
              events: {
                onReady: e => {
                  e.target.mute();
                  e.target.playVideo();
                },
                onStateChange: e => {
                  if (e.data === window.YT.PlayerState.PLAYING) {
                    document.querySelectorAll(Selector.DATA_YOUTUBE_EMBED).forEach(embedElement => {
                      embedElement.classList.add(ClassName.LOADED);
                    });
                  }
                  if (e.data === window.YT.PlayerState.PAUSED) {
                    e.target.playVideo();
                  }
                  if (e.data === window.YT.PlayerState.ENDED) {
                    // Loop from starting point
                    e.target.seekTo(options.startSeconds);
                  }
                }
              }
            });
          };
          youTubePlayer();
        });
      });
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.onload = setupPlayer;
  };
  if (document.readyState !== Events.LOADING) {
    loadVideo();
  } else {
    document.addEventListener(Events.DOM_CONTENT_LOADED, () => loadVideo());
  }

  /* --------------------------------------------------------------------------
  |                                 Adjust BG Ratio
  --------------------------------------------------------------------------- */

  const adjustBackgroundRatio = () => {
    const ytElements = document.querySelectorAll(Selector.YT_VIDEO);
    ytElements.forEach(ytEl => {
      const ytElement = ytEl;
      const width = ytElement.parentElement.offsetWidth + 200;
      const height = width * 9 / 16;
      const minHeight = ytElement.parentElement.offsetHeight + 112;
      const minWidth = minHeight * 16 / 9;
      ytElement.style.width = `${width}px`;
      ytElement.style.height = `${height}px`;
      ytElement.style.minHeight = `${minHeight}px`;
      ytElement.style.minWidth = `${minWidth}px`;
    });
  };
  adjustBackgroundRatio();
  document.addEventListener(Events.SCROLL, () => adjustBackgroundRatio());
};

/* --------------------------------------------------------------------------
|                                 Sparrow Navbar
/* -------------------------------------------------------------------------- */

const bootstrapNavbarInit = () => {
  const navbar = document.querySelector('.navbar-sparrow');
  if (navbar) {
    const windowHeight = window.innerHeight;
    const handleAlpha = () => {
      const scrollTop = window.pageYOffset;
      let alpha = scrollTop / windowHeight * 2;
      alpha >= 1 && (alpha = 1);
      navbar.style.backgroundColor = `rgba(0, 0, 0, ${alpha})`;
    };
    handleAlpha();
    document.addEventListener('scroll', () => handleAlpha());

    // Top navigation background toggle on mobile
    navbar.addEventListener('show.bs.collapse', e => {
      e.currentTarget.classList.toggle('bg-black');
    });
    navbar.addEventListener('hide.bs.collapse', e => {
      e.currentTarget.classList.toggle('bg-black');
    });
  }
};

/* --------------------------------------------------------------------------
|                                 Countdown
--------------------------------------------------------------------------- */

const countdownInit = () => {
  const countdownElements = document.querySelectorAll('[data-countdown]');
  countdownElements.forEach(el => {
    const countdownElement = el;
    const userOptions = utils.getData(countdownElement, 'countdown');
    const countDownDate = new Date(`${userOptions?.month} ${`${userOptions?.date},`} ${userOptions.year}`).getTime();

    // Update the count down every 1 second
    const updateCountdown = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = countDownDate - currentTime;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
      const minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
      const seconds = Math.floor(distance % (1000 * 60) / 1000);
      countdownElement.innerHTML = `${days} days ${`0${hours}`.toString().slice(-2)}:${`0${minutes}`.toString().slice(-2)}:${`0${seconds}`.toString().slice(-2)}`;

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(updateCountdown);
        countdownElement.innerHTML = 'EXPIRED';
      }
    }, 10);
  });
};

/* -------------------------------------------------------------------------- */
/*                                  Count Up                                  */
/* -------------------------------------------------------------------------- */

const countupInit = () => {
  if (window.countUp) {
    const countups = document.querySelectorAll('[data-countup]');
    countups.forEach(node => {
      const {
        endValue,
        ...options
      } = utils.getData(node, 'countup');
      let playCountUpTriggerd = false;
      const countUP = () => {
        if (utils.isElementIntoView(node) && !playCountUpTriggerd) {
          const countUp = new window.countUp.CountUp(node, endValue, {
            duration: 3,
            useEasing: false,
            ...options
          });
          if (!countUp.error) {
            countUp.start();
          } else {
            console.error(countUp.error);
          }
          playCountUpTriggerd = true;
        }
      };
      countUP();
      window.addEventListener('scroll', () => countUP());
    });
  }
};

/*-----------------------------------------------
|    Draw SVG
-----------------------------------------------*/

/*
  gsap
*/

const Selector = {
  DATA_ZANIM_SVG_TRIGGER: 'data-zanim-svg-trigger',
  DATA_ZANIM_REPEAT: '[zanim-repeat]',
  PATH: 'path',
  ZANIM_SVG: 'zanim-svg'
};
const Events = {
  SCROLL: 'scroll'
};
const drawSvgInit = () => {
  const drawSvg = el => {
    const path = el.querySelector(Selector.PATH);
    const defaultOptions = {
      delay: 0,
      duration: 2,
      ease: 'Expo.easeOut'
    };
    const controller = Object.assign(defaultOptions, utils.getData(el, Selector.ZANIM_SVG));
    const timeline = window.gsap.timeline();
    timeline.from(path, controller.duration, {
      drawSVG: 0,
      delay: controller.delay,
      ease: controller.ease
    });
    window.gsap.set(path, {
      visibility: 'visible'
    });
  };
  const triggerSvg = () => {
    const svgTriggerElement = document.querySelectorAll(`[${Selector.DATA_ZANIM_SVG_TRIGGER}]`);
    svgTriggerElement.forEach(el => {
      if (utils.isElementIntoView(el) && el.hasAttribute(Selector.DATA_ZANIM_SVG_TRIGGER)) {
        drawSvg(el);
        if (!document.querySelector(Selector.DATA_ZANIM_REPEAT)) {
          el.removeAttribute(Selector.DATA_ZANIM_SVG_TRIGGER);
        }
      }
    });
  };
  triggerSvg();
  window.addEventListener(Events.SCROLL, () => triggerSvg());
};

/*-----------------------------------------------
|   Fancynav
-----------------------------------------------*/
const fancyNavInit = () => {
  const ClassName = {
    SHOW: 'show',
    PLAY: 'play',
    COLLAPSED: 'collapsed',
    FANCYNAVBAR_LEFT: 'fancynavbar-left',
    FANCYNAVBAR_TOP: 'fancynavbar-top'
  };
  const Selector = {
    FANCYNAVBAR: '.fancynavbar',
    FANCYNAVBAR_LEFT: '.fancynavbar-left',
    FANCYNAVBAR_TOGGLERBAR: '.fancynavbar-togglerbar',
    FANCYNAVBAR_BRAND_IMG: '.fancynavbar-brand-img',
    FANCYNAVBAR_ADDON: '.fancynavbar-addon',
    FANCYNAVBAR_COLLAPSE: '.fancynavbar-collapse',
    FANCYNAVBAR_TOGGLER: '.fancynavbar-toggler',
    FANCYNAVBAR_TOGGLER_ICON: '.fancynavbar-toggler-icon',
    PATH_TOP: '#path-top',
    PATH_MIDDLE: '#path-middle',
    PATH_BOTTOM: '#path-bottom',
    FANCYNAV_LINK: '.fancynav-link',
    FANCY_DROPDOWN: '.fancy-dropdown',
    FANCY_DROPDOWN_MENU: '.fancy-dropdown-menu',
    FANCY_DROPDOWN_TOGGLE: '.fancy-dropdown-toggle',
    FANCY_DROPDOWN_ITEM: '.fancy-dropdown-item',
    DATA_ONE_PAGE: '[data-one-page]'
  };
  const DATA_KEY = {
    ZANIM_XS: 'data-zanim-xs',
    ZANIM_MD: 'data-zanim-md',
    ZANIM_LG: 'data-zanim-lg',
    EXCLUSIVE: 'data-exclusive'
  };
  const Events = {
    CLICK: 'click',
    SCROLL: 'scroll',
    RESIZE: 'resize'
  };
  const EASE = 'CubicBezier';
  const fancynavbar = document.querySelector(Selector.FANCYNAVBAR);
  const isFancynavbarLeft = fancynavbar?.classList.contains(ClassName.FANCYNAVBAR_LEFT);
  const isFancynavbarTop = fancynavbar?.classList.contains(ClassName.FANCYNAVBAR_TOP);

  /*-----------------------------------------------
  |   RTL compatibility
  -----------------------------------------------*/
  if ((utils.isRTL() || isFancynavbarLeft) && !(utils.isRTL() && isFancynavbarLeft)) {
    const fancyNavbarBrandImg = document.querySelector(Selector.FANCYNAVBAR_BRAND_IMG);
    const fancyNavbarTogglerIcon = document.querySelector(Selector.FANCYNAVBAR_TOGGLER_ICON);
    const fancyNavbarAddon = document.querySelector(Selector.FANCYNAVBAR_ADDON);
    const reverseZanimData = el => {
      const attrObj = JSON.parse(el.getAttribute(DATA_KEY.ZANIM_LG));
      attrObj.from.x = -attrObj.from.x;
      const attrStr = JSON.stringify(attrObj);
      el.setAttribute(DATA_KEY.ZANIM_LG, attrStr);
    };
    reverseZanimData(fancynavbar);
    reverseZanimData(fancyNavbarBrandImg);
    reverseZanimData(fancyNavbarTogglerIcon);
    reverseZanimData(fancyNavbarAddon);
  }
  if (isFancynavbarTop) {
    const fancyNavbarBrandImg = document.querySelector(Selector.FANCYNAVBAR_BRAND_IMG);
    const fancyNavbarTogglerIcon = document.querySelector(Selector.FANCYNAVBAR_TOGGLER_ICON);
    const fancyNavbarAddon = document.querySelector(Selector.FANCYNAVBAR_ADDON);
    const setZanimData = (el, anim) => {
      const animStr = JSON.stringify(anim);
      el.setAttribute(DATA_KEY.ZANIM_LG, animStr);
    };
    const reverseZanimDataY = (el, val) => {
      const attrObj = JSON.parse(el.getAttribute(DATA_KEY.ZANIM_LG));
      attrObj.from.y = -val;
      const attrStr = JSON.stringify(attrObj);
      el.setAttribute(DATA_KEY.ZANIM_LG, attrStr);
    };
    const anim = JSON.parse(fancynavbar.getAttribute(DATA_KEY.ZANIM_XS));
    const childAnim = {
      ...anim,
      delay: 0.4
    };
    const addonAnim = {
      ...anim,
      delay: 0.5
    };
    setZanimData(fancynavbar, anim);
    setZanimData(fancyNavbarBrandImg, childAnim);
    reverseZanimDataY(fancyNavbarBrandImg, 38);
    setZanimData(fancyNavbarTogglerIcon, childAnim);
    setZanimData(fancyNavbarAddon, addonAnim);
    reverseZanimDataY(fancyNavbarAddon, 30);
  }
  if (fancynavbar) {
    const fancyNavbarCollapse = document.querySelector(Selector.FANCYNAVBAR_COLLAPSE);
    const fancyNavbarToggler = document.querySelector(Selector.FANCYNAVBAR_TOGGLER);
    const exclusive = document.querySelector(`[${DATA_KEY.EXCLUSIVE}]`);
    let x = '100%';
    (utils.isRTL() || isFancynavbarLeft) && !(utils.isRTL() && isFancynavbarLeft) && (x = '-100%');

    /*-----------------------------------------------
    |   Fancy Navbar Collapse Animation
    -----------------------------------------------*/
    const fancyNavbarCollapseTimeline = window.gsap.timeline().pause();
    const fancyNavItems = document.querySelectorAll(`${Selector.FANCYNAV_LINK}, ${Selector.FANCY_DROPDOWN_MENU}`);
    // $fancyNavItems.css('opacity', 0);

    fancyNavbarCollapseTimeline.fromTo(fancyNavbarCollapse, 0.6, {
      x
    }, {
      x: '0%',
      ease: EASE
    }).staggerFromTo(Array.from(fancyNavItems), 0.8, {
      y: 56,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      ease: EASE
    }, 0.05, '-=0.4');
    /*-----------------------------------------------
    |   End of Drawer Animation
    -----------------------------------------------*/

    /*-----------------------------------------------
    |   Fancy Navbar Toggler Icon Animation
    -----------------------------------------------*/
    const fancyNavbarTogglerIconTimeline = window.gsap.timeline().pause();
    const fancyNavbarTogglerIcon = document.querySelector(Selector.FANCYNAVBAR_TOGGLER_ICON);
    const fancyNavbarTogglerIconPathTop = fancyNavbarTogglerIcon.querySelector(Selector.PATH_TOP);
    const fancyNavbarTogglerIconPathMiddle = fancyNavbarTogglerIcon.querySelector(Selector.PATH_MIDDLE);
    const fancyNavbarTogglerIconPathBottom = fancyNavbarTogglerIcon.querySelector(Selector.PATH_BOTTOM);
    fancyNavbarTogglerIconTimeline.fromTo(fancyNavbarTogglerIconPathTop, 0.5, {
      'stroke-dashoffset': '0',
      'stroke-dasharray': '30px 88px'
    }, {
      'stroke-dashoffset': '-81px',
      delay: 0,
      ease: EASE
    }, 0).fromTo(fancyNavbarTogglerIconPathMiddle, 0.5, {
      'stroke-dashoffset': '0',
      'stroke-dasharray': '30px 30px'
    }, {
      'stroke-dashoffset': '-15px',
      'stroke-dasharray': '0.1px 30px',
      delay: 0,
      ease: EASE
    }, 0).fromTo(fancyNavbarTogglerIconPathBottom, 0.5, {
      'stroke-dashoffset': '-87.9px',
      'stroke-dasharray': '30px 88.1px'
    }, {
      'stroke-dashoffset': '-6.3px',
      delay: 0,
      ease: EASE
    }, 0);
    /*-----------------------------------------------
    |   End of Fancy Navbar Toggler Icon Animation
    -----------------------------------------------*/

    const animateMenu = () => {
      fancyNavbarTogglerIcon.classList.contains(ClassName.PLAY) ? fancyNavbarTogglerIconTimeline.reverse() : fancyNavbarTogglerIconTimeline.play();
      fancyNavbarTogglerIcon.classList.toggle(ClassName.PLAY);
      fancyNavbarToggler.classList.contains(ClassName.COLLAPSED) ? fancyNavbarCollapseTimeline.reverse() : fancyNavbarCollapseTimeline.play();
      fancyNavbarToggler.classList.toggle(ClassName.COLLAPSED);
    };
    fancyNavbarToggler.addEventListener(Events.CLICK, animateMenu);
    document.querySelector('main').addEventListener(Events.CLICK, () => {
      fancyNavbarToggler.classList.contains(ClassName.COLLAPSED) && animateMenu();
    });

    /*-----------------------------------------------
    |   Resize Fancy Dropdown
    -----------------------------------------------*/
    const fancyDropdownMenus = document.querySelectorAll(Selector.FANCY_DROPDOWN_MENU);
    if (fancyDropdownMenus.length) {
      fancyDropdownMenus.forEach(el => {
        const fancyDropdownMenu = el;
        const dpMenuPrevSiblingHeight = `${fancyDropdownMenu.previousElementSibling.offsetHeight}px`;
        fancyDropdownMenu.closest(Selector.FANCY_DROPDOWN).style.height = dpMenuPrevSiblingHeight;
      });

      /*-----------------------------------------------
      |   On Resize, Adjust the Menu Height
      -----------------------------------------------*/
      window.resize(() => {
        const fancyDropdownList = document.querySelectorAll(Selector.FANCY_DROPDOWN);
        fancyDropdownList.forEach(el => {
          const fancyDropdown = el;
          const dropdownToggleHeight = el.querySelector(Selector.FANCY_DROPDOWN_TOGGLE).offsetHeight;
          if (fancyDropdown.classList.contains(ClassName.SHOW)) {
            const fancyDropdownMenuHeight = fancyDropdown.querySelector(Selector.FANCY_DROPDOWN_MENU).offsetHeight;
            fancyDropdown.style.height = `${dropdownToggleHeight + fancyDropdownMenuHeight}px`;
          } else {
            fancyDropdown.style.height = `${dropdownToggleHeight}px`;
          }
        });
      });
    }
    /*-----------------------------------------------
    |   End of Resize Fancy Dropdown
    -----------------------------------------------*/
    const fancyNavLinks = document.querySelectorAll(Selector.FANCYNAV_LINK);
    fancyNavLinks.forEach(fancyNavLink => {
      fancyNavLink.addEventListener(Events.CLICK, e => {
        const fancyLink = e.target;
        // if one-page
        if (fancyLink.closest(Selector.DATA_ONE_PAGE)) {
          animateMenu();
        } else {
          const fancyDropdownMenuTl = window.gsap.timeline().pause();
          const targetFancyLink = fancyLink.closest(Selector.FANCY_DROPDOWN_TOGGLE);
          const targetNavSiblings = targetFancyLink?.nextElementSibling;
          const siblingsList = targetNavSiblings?.querySelectorAll(Selector.FANCY_DROPDOWN_ITEM);
          const listOfItems = Array.from(siblingsList);
          fancyDropdownMenuTl.staggerFromTo(listOfItems, 0.3, {
            y: 30,
            opacity: 0
          }, {
            y: 0,
            opacity: 1,
            ease: EASE
          }, 0.01).delay(0.1);
          const targetFancyLinkParentLi = fancyLink?.closest(Selector.FANCY_DROPDOWN);
          targetFancyLinkParentLi?.classList?.toggle(ClassName.SHOW);
          if (fancyLink.closest(Selector.FANCY_DROPDOWN).classList.contains(ClassName.SHOW)) {
            targetFancyLinkParentLi.style.height = `${targetFancyLink.offsetHeight + targetFancyLink.nextElementSibling.offsetHeight}px`;
            fancyDropdownMenuTl.play();
          } else {
            fancyDropdownMenuTl.reverse();
            targetFancyLinkParentLi.style.height = `${targetFancyLink.offsetHeight}px`;
          }

          /*-----------------------------------------------
          |   Exclusive
          -----------------------------------------------*/

          if (exclusive) {
            const currentDropdownEl = fancyLink.closest(Selector.FANCY_DROPDOWN);
            const dropdownElements = document.querySelectorAll(Selector.FANCY_DROPDOWN);
            dropdownElements.forEach(item => {
              const dropdownElement = item;
              if (dropdownElement !== currentDropdownEl) {
                dropdownElement.style.height = `${targetFancyLink.offsetHeight}px`;
                dropdownElement.classList.remove(ClassName.SHOW);
              }
            });
          }
        }
      });
    }); // ------------- click event end ------------

    /*-----------------------------------------------
    |   Transparency on scroll on mobile
    -----------------------------------------------*/
    const togglerbar = document.querySelector(Selector.FANCYNAVBAR_TOGGLERBAR);
    const onscrollFadeIn = utils.getData(togglerbar, 'onscroll-fade-in');
    const prevBgColor = window.getComputedStyle(togglerbar).backgroundColor;
    const prevBgClass = togglerbar.classList.value.split(' ').filter(className => className.indexOf('bg-') === 0)[0];
    if (onscrollFadeIn) {
      let sideNavBgColor = window.getComputedStyle(togglerbar).backgroundColor;
      if (sideNavBgColor === 'transparent') sideNavBgColor = 'rgb(0, 0, 0)';
      if (sideNavBgColor.indexOf('a') === -1) {
        sideNavBgColor = sideNavBgColor.replace(')', ', 1)').replace('rgb', 'rgba');
      }
      let backgroundColorAlpha = sideNavBgColor.split(', ')[3].split(')')[0];
      if (window.pageYOffset === 0) backgroundColorAlpha = 0;
      const fancynavBreakpoint = fancynavbar.classList.value.split(' ').filter(className => className.indexOf('fancynavbar-expand') === 0)[0].split('fancynavbar-expand-')[1];
      const ChangeFancyNavBG = () => {
        const windowHeight = window.innerHeight;
        if (window.innerWidth > utils.breakpoints[fancynavBreakpoint]) {
          prevBgClass && togglerbar.classList.add(prevBgClass);
          togglerbar.style.backgroundColor = `${prevBgColor.replace('rgba', 'rgb').split(',').slice(0, 3).join()})`;
        } else {
          togglerbar.classList.remove(prevBgClass);
          const tempBgColor = sideNavBgColor.split(', ');
          let bgColor = tempBgColor.join();
          togglerbar.style.backgroundColor = bgColor;
          const adjustFancyNavBG = () => {
            if (window.innerWidth < utils.breakpoints[fancynavBreakpoint]) {
              const scrollTop = window.pageYOffset;
              backgroundColorAlpha = scrollTop / windowHeight * 2;
              backgroundColorAlpha >= 1 && (backgroundColorAlpha = 1);
              tempBgColor[3] = `${backgroundColorAlpha})`;
              bgColor = tempBgColor.join();
              togglerbar.style.backgroundColor = bgColor;
            }
          };
          // adjustFancyNavBG();
          document.addEventListener(Events.SCROLL, () => adjustFancyNavBG());
        }
      };
      ChangeFancyNavBG();
      window.addEventListener(Events.RESIZE, () => ChangeFancyNavBG());
    }
  }
};

/*-----------------------------------------------
|   Gooogle Map
-----------------------------------------------*/

function initMap() {
  const themeController = document.body;
  const $googlemaps = document.querySelectorAll('[data-gmap]');
  if ($googlemaps.length && window.google) {
    // Visit https://snazzymaps.com/ for more themes
    const mapStyles = {
      Default: [{
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#e9e9e9'
        }, {
          lightness: 17
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{
          color: '#f5f5f5'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#ffffff'
        }, {
          lightness: 17
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#ffffff'
        }, {
          lightness: 29
        }, {
          weight: 0.2
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          color: '#ffffff'
        }, {
          lightness: 18
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{
          color: '#ffffff'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          color: '#f5f5f5'
        }, {
          lightness: 21
        }]
      }, {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{
          color: '#dedede'
        }, {
          lightness: 21
        }]
      }, {
        elementType: 'labels.text.stroke',
        stylers: [{
          visibility: 'on'
        }, {
          color: '#ffffff'
        }, {
          lightness: 16
        }]
      }, {
        elementType: 'labels.text.fill',
        stylers: [{
          saturation: 36
        }, {
          color: '#333333'
        }, {
          lightness: 40
        }]
      }, {
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          color: '#f2f2f2'
        }, {
          lightness: 19
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#fefefe'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#fefefe'
        }, {
          lightness: 17
        }, {
          weight: 1.2
        }]
      }],
      Gray: [{
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{
          saturation: 36
        }, {
          color: '#000000'
        }, {
          lightness: 40
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{
          visibility: 'on'
        }, {
          color: '#000000'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 17
        }, {
          weight: 1.2
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 21
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 17
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 29
        }, {
          weight: 0.2
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 18
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 19
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 17
        }]
      }],
      Midnight: [{
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#ffffff'
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 13
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#144b53'
        }, {
          lightness: 14
        }, {
          weight: 1.4
        }]
      }, {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{
          color: '#08304b'
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          color: '#0c4152'
        }, {
          lightness: 5
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#0b434f'
        }, {
          lightness: 25
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#0b3d51'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }]
      }, {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{
          color: '#146474'
        }]
      }, {
        featureType: 'water',
        elementType: 'all',
        stylers: [{
          color: '#021019'
        }]
      }],
      Hopper: [{
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          hue: '#165c64'
        }, {
          saturation: 34
        }, {
          lightness: -69
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{
          hue: '#b7caaa'
        }, {
          saturation: -14
        }, {
          lightness: -18
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'landscape.man_made',
        elementType: 'all',
        stylers: [{
          hue: '#cbdac1'
        }, {
          saturation: -6
        }, {
          lightness: -9
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          hue: '#8d9b83'
        }, {
          saturation: -89
        }, {
          lightness: -12
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          hue: '#d4dad0'
        }, {
          saturation: -88
        }, {
          lightness: 54
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          hue: '#bdc5b6'
        }, {
          saturation: -89
        }, {
          lightness: -3
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{
          hue: '#bdc5b6'
        }, {
          saturation: -89
        }, {
          lightness: -26
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          hue: '#c17118'
        }, {
          saturation: 61
        }, {
          lightness: -45
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [{
          hue: '#8ba975'
        }, {
          saturation: -46
        }, {
          lightness: -28
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          hue: '#a43218'
        }, {
          saturation: 74
        }, {
          lightness: -51
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'administrative.province',
        elementType: 'all',
        stylers: [{
          hue: '#ffffff'
        }, {
          saturation: 0
        }, {
          lightness: 100
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'administrative.neighborhood',
        elementType: 'all',
        stylers: [{
          hue: '#ffffff'
        }, {
          saturation: 0
        }, {
          lightness: 100
        }, {
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.locality',
        elementType: 'labels',
        stylers: [{
          hue: '#ffffff'
        }, {
          saturation: 0
        }, {
          lightness: 100
        }, {
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [{
          hue: '#ffffff'
        }, {
          saturation: 0
        }, {
          lightness: 100
        }, {
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{
          hue: '#3a3935'
        }, {
          saturation: 5
        }, {
          lightness: -57
        }, {
          visibility: 'off'
        }]
      }, {
        featureType: 'poi.medical',
        elementType: 'geometry',
        stylers: [{
          hue: '#cba923'
        }, {
          saturation: 50
        }, {
          lightness: -46
        }, {
          visibility: 'on'
        }]
      }],
      Beard: [{
        featureType: 'poi.business',
        elementType: 'labels.text',
        stylers: [{
          visibility: 'on'
        }, {
          color: '#333333'
        }]
      }],
      AssassianCreed: [{
        featureType: 'all',
        elementType: 'all',
        stylers: [{
          visibility: 'on'
        }]
      }, {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }, {
          saturation: '-100'
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{
          saturation: 36
        }, {
          color: '#000000'
        }, {
          lightness: 40
        }, {
          visibility: 'off'
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{
          visibility: 'off'
        }, {
          color: '#000000'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 17
        }, {
          weight: 1.2
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#4d6059'
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#4d6059'
        }]
      }, {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#4d6059'
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          lightness: 21
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#4d6059'
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#4d6059'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          visibility: 'on'
        }, {
          color: '#7f8d89'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#7f8d89'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#7f8d89'
        }, {
          lightness: 17
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#7f8d89'
        }, {
          lightness: 29
        }, {
          weight: 0.2
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 18
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#7f8d89'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#7f8d89'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#7f8d89'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#7f8d89'
        }]
      }, {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 19
        }]
      }, {
        featureType: 'water',
        elementType: 'all',
        stylers: [{
          color: '#2b3638'
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#2b3638'
        }, {
          lightness: 17
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#24282b'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#24282b'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text',
        stylers: [{
          visibility: 'off '
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }],
      SubtleGray: [{
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{
          saturation: '-100'
        }]
      }, {
        featureType: 'administrative.province',
        elementType: 'all',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{
          saturation: -100
        }, {
          lightness: 65
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{
          saturation: -100
        }, {
          lightness: '50'
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'road',
        elementType: 'all',
        stylers: [{
          saturation: -100
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [{
          visibility: 'simplified'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'all',
        stylers: [{
          lightness: '30'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'all',
        stylers: [{
          lightness: '40'
        }]
      }, {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{
          saturation: -100
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          hue: '#ffff00'
        }, {
          lightness: -25
        }, {
          saturation: -97
        }]
      }, {
        featureType: 'water',
        elementType: 'labels',
        stylers: [{
          lightness: -25
        }, {
          saturation: -100
        }]
      }],
      Tripitty: [{
        featureType: 'all',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{
          color: '#2c5ca5'
        }]
      }, {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{
          color: '#2c5ca5'
        }]
      }, {
        featureType: 'road',
        elementType: 'all',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'water',
        elementType: 'all',
        stylers: [{
          color: '#193a70'
        }, {
          visibility: 'on'
        }]
      }],
      Cobalt: [{
        featureType: 'all',
        elementType: 'all',
        stylers: [{
          invert_lightness: true
        }, {
          saturation: 10
        }, {
          lightness: 30
        }, {
          gamma: 0.5
        }, {
          hue: '#435158'
        }]
      }]
    };
    $googlemaps.forEach(itm => {
      const latLng = utils.getData(itm, 'latlng').split(',');
      const markerPopup = itm.innerHTML;
      const icon = utils.getData(itm, 'icon') ? utils.getData(itm, 'icon') : 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png';
      const zoom = utils.getData(itm, 'zoom');
      const mapElement = itm;
      const mapStyle = utils.getData(itm, 'theme');
      if (utils.getData(itm, 'theme') === 'streetview') {
        const pov = utils.getData(itm, 'pov');
        const mapOptions = {
          position: {
            lat: Number(latLng[0]),
            lng: Number(latLng[1])
          },
          pov,
          zoom,
          gestureHandling: 'none',
          scrollwheel: false
        };
        return new window.google.maps.StreetViewPanorama(mapElement, mapOptions);
      }
      const mapOptions = {
        zoom,
        scrollwheel: utils.getData(itm, 'scrollwheel'),
        center: new window.google.maps.LatLng(latLng[0], latLng[1]),
        styles: localStorage.getItem('theme') === 'dark' ? mapStyles.Cobalt : mapStyles[mapStyle]
      };
      const map = new window.google.maps.Map(mapElement, mapOptions);
      const infowindow = new window.google.maps.InfoWindow({
        content: markerPopup
      });
      const marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(latLng[0], latLng[1]),
        icon,
        map
      });
      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });
      themeController && themeController.addEventListener('clickControl', ({
        detail: {
          control,
          value
        }
      }) => {
        if (control === 'theme') {
          map.set('styles', value === 'dark' ? mapStyles.Cobalt : mapStyles[mapStyle]);
        }
      });
      return null;
    });
  }
}

/*-----------------------------------------------
|                     Isotope
-----------------------------------------------*/

const isotopeInit = () => {
  const Selector = {
    ISOTOPE_ITEM: '.isotope-item',
    DATA_ISOTOPE: '[data-isotope]',
    DATA_FILTER: '[data-filter]',
    DATA_FILER_NAV: '[data-filter-NAV]'
  };
  const DATA_KEY = {
    ISOTOPE: 'isotope'
  };
  const ClassName = {
    ACTIVE: 'active'
  };
  if (window.Isotope) {
    const masonryItems = document.querySelectorAll(Selector.DATA_ISOTOPE);
    masonryItems.length && masonryItems.forEach(masonryItem => {
      window.imagesLoaded(masonryItem, () => {
        masonryItem.querySelectorAll(Selector.ISOTOPE_ITEM).forEach(item => {
          // eslint-disable-next-line
          item.style.visibility = "visible";
        });
        const userOptions = utils.getData(masonryItem, DATA_KEY.ISOTOPE);
        const defaultOptions = {
          itemSelector: Selector.ISOTOPE_ITEM,
          layoutMode: 'packery'
        };
        const options = window._.merge(defaultOptions, userOptions);
        const isotope = new window.Isotope(masonryItem, options);

        // --------- filter -----------------
        const filterElement = document.querySelector(Selector.DATA_FILER_NAV);
        filterElement?.addEventListener('click', e => {
          if (e.target.classList.contains('isotope-nav')) {
            const item = e.target.dataset.filter;
            isotope.arrange({
              filter: item
            });
            document.querySelectorAll(Selector.DATA_FILTER).forEach(el => {
              el.classList.remove(ClassName.ACTIVE);
            });
            e.target.classList.add(ClassName.ACTIVE);
          }
        });
        // ---------- filter end ------------

        return isotope;
      });
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 bigPicture                                 */
/* -------------------------------------------------------------------------- */

const lightboxInit = () => {
  if (window.BigPicture) {
    const bpItems = document.querySelectorAll('[data-bigpicture]');
    bpItems.forEach(bpItem => {
      const userOptions = utils.getData(bpItem, 'bigpicture');
      const defaultOptions = {
        el: bpItem
      };
      const options = window._.merge(defaultOptions, userOptions);
      bpItem.addEventListener('click', () => {
        window.BigPicture(options);
      });
    });
  }
};

/*-----------------------------------------------
|   Cookie notice
-----------------------------------------------*/
const cookieNoticeInit = () => {
  const Selector = {
    NOTICE: '.notice',
    DATA_TOGGLE_NOTICE: '[data-bs-toggle="notice"]'
  };
  const Events = {
    CLICK: 'click',
    HIDDEN_BS_TOAST: 'hidden.bs.toast'
  };
  const DataKeys = {
    OPTIONS: 'options'
  };
  const ClassNames = {
    HIDE: 'hide'
  };
  const notices = document.querySelectorAll(Selector.NOTICE);
  let showNotice = true;
  notices.forEach(item => {
    const notice = new window.bootstrap.Toast(item);
    const options = {
      autoShow: false,
      autoShowDelay: 0,
      showOnce: false,
      cookieExpireTime: 3600000,
      autohide: false,
      ...utils.getData(item, DataKeys.OPTIONS)
    };
    const {
      showOnce,
      autoShow,
      autoShowDelay
    } = options;
    if (showOnce) {
      const hasNotice = utils.getCookie('notice');
      showNotice = hasNotice === null;
    }
    if (autoShow && showNotice) {
      setTimeout(() => {
        notice.show();
      }, autoShowDelay);
    }
    item.addEventListener(Events.HIDDEN_BS_TOAST, e => {
      const el = e.currentTarget;
      const toastOptions = {
        cookieExpireTime: 3600000,
        showOnce: false,
        autohide: false,
        ...utils.getData(el, DataKeys.OPTIONS)
      };
      toastOptions.showOnce && utils.setCookie('notice', false, toastOptions.cookieExpireTime);
    });
  });
  const btnNoticeToggle = document.querySelector(Selector.DATA_TOGGLE_NOTICE);
  btnNoticeToggle && btnNoticeToggle.addEventListener(Events.CLICK, ({
    currentTarget
  }) => {
    const id = currentTarget.getAttribute('href');
    const notice = new window.bootstrap.Toast(document.querySelector(id));

    /* eslint-disable-next-line */
    const el = notice._element;
    utils.hasClass(el, ClassNames.HIDE) ? notice.show() : notice.hide();
  });
};

/*-----------------------------------------------
|   Inline Player [plyr]
-----------------------------------------------*/

const plyrInit = () => {
  if (window.Plyr) {
    const plyrs = document.querySelectorAll('[data-plyr]');
    plyrs.forEach(plyr => {
      const userOptions = utils.getData(plyr, 'plyr');
      const defaultOptions = {
        captions: {
          active: true
        }
      };
      const options = window._.merge(defaultOptions, userOptions);
      return new window.Plyr(plyr, options);
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Popover                                  */
/* -------------------------------------------------------------------------- */

const popoverInit = () => {
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(popoverTriggerEl => new window.bootstrap.Popover(popoverTriggerEl));
};

/* -------------------------------------------------------------------------- */
/*                                  Preloader                                 */
/* -------------------------------------------------------------------------- */

const preloaderInit = () => {
  const bodyElement = document.querySelector('body');
  window.imagesLoaded(bodyElement, () => {
    const preloader = document.querySelector('.preloader');
    preloader?.classList.add('loaded');
    setTimeout(() => {
      preloader?.remove();
    }, 800);
  });
};

/* -------------------------------------------------------------------------- */
/*                               Progressbar JS                               */
/* -------------------------------------------------------------------------- */

/*
  global ProgressBar
*/
const progressBarInit = () => {
  const Selector = {
    DATA_PROGRESS_CIRCLE: '[data-progress-circle]',
    DATA_PROGRESS_LINE: '[data-progress-line]'
  };
  const Events = {
    SCROLL: 'scroll'
  };
  const {
    merge
  } = window._;

  // progressbar.js@1.0.0 version is used
  // Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

  /*-----------------------------------------------
  |   Progress Circle
  -----------------------------------------------*/
  const progressCircle = document.querySelectorAll(Selector.DATA_PROGRESS_CIRCLE);
  if (progressCircle.length) {
    progressCircle.forEach(item => {
      const userOptions = utils.getData(item, 'progress-circle');
      const getDefaultOptions = () => ({
        strokeWidth: 2,
        trailWidth: 2,
        easing: 'easeInOut',
        duration: 3000,
        svgStyle: {
          'stroke-linecap': 'round',
          display: 'block',
          width: '100%'
        },
        text: {
          autoStyleContainer: false
        },
        from: {
          color: '#aaa',
          width: 2
        },
        to: {
          color: '#333',
          width: 2
        },
        // Set default step function for all animate calls
        step: (state, circle) => {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
          const percentage = Math.round(circle.value() * 100);
          circle.setText(`<span class='value'>${percentage}<b>%</b></span> <span>${userOptions.subText || ''}</span>`);
        }
      });
      const options = merge(getDefaultOptions(), userOptions);
      const bar = new ProgressBar.Circle(item, options);
      const linearGradient = `<defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color='#1970e2' />
          <stop offset="100%" stop-color='#4695ff' />
        </linearGradient>
      </defs>`;
      bar.svg.insertAdjacentHTML('beforeEnd', linearGradient);
      let playProgressTriggered = false;
      const progressCircleAnimation = () => {
        if (!playProgressTriggered) {
          if (utils.isElementIntoView(item)) {
            bar.animate(options.progress / 100);
            playProgressTriggered = true;
          }
        }
        return playProgressTriggered;
      };
      progressCircleAnimation();
      window.addEventListener(Events.SCROLL, () => {
        progressCircleAnimation();
      });
      document.body.addEventListener('clickControl', ({
        detail: {
          control
        }
      }) => {
        if (control === 'theme') {
          bar.trail.setAttribute('stroke', utils.getGrays()['200']);
          if (!bar.path.getAttribute('stroke').includes('url')) {
            bar.path.setAttribute('stroke', utils.getGrays()['400']);
          }
        }
      });
    });
  }

  /*-----------------------------------------------
  |   Progress Line
  -----------------------------------------------*/
  const progressLine = document.querySelectorAll(Selector.DATA_PROGRESS_LINE);
  if (progressLine.length) {
    progressLine.forEach(item => {
      const userOptions = utils.getData(item, 'progress-line');
      const getDefaultOptions = () => ({
        strokeWidth: 1,
        easing: 'easeInOut',
        duration: 3000,
        trailWidth: 1,
        color: '#333',
        svgStyle: {
          width: '100%',
          height: '0.25rem',
          'stroke-linecap': 'round',
          'border-radius': '0.125rem'
        },
        text: {
          style: {
            transform: null
          },
          autoStyleContainer: false
        },
        step(state, line) {
          line.setText(`<span class='value'>${Math.round(line.value() * 100)}<b>%</b></span> <span>${userOptions.subText}</span>`);
        }
      });
      const options = merge(getDefaultOptions(), userOptions);
      const bar = new ProgressBar.Line(item, options);
      let playProgressTriggered = false;
      const progressLineAnimation = () => {
        if (!playProgressTriggered) {
          if (utils.isElementIntoView(item)) {
            bar.animate(options.progress / 100);
            playProgressTriggered = true;
          }
        }
        return playProgressTriggered;
      };
      progressLineAnimation();
      window.addEventListener(Events.SCROLL, () => {
        progressLineAnimation();
      });
    });
  }
  // ----------- progress line end --------------
};

/* --------------------------------------------------------------------------
|                                 Rellax js
/* -------------------------------------------------------------------------- */

const rellaxInit = () => window.Rellax && new window.Rellax('[data-parallax]', {});

/*-----------------------------------------------
|                  Swiper
-----------------------------------------------*/
const swiperInit = () => {
  const Selector = {
    DATA_SWIPER: '[data-swiper]',
    DATA_ZANIM_TIMELINE: '[data-zanim-timeline]',
    IMG: 'img',
    SWIPER_NAV: '.swiper-nav',
    SWIPER_BUTTON_NEXT: '.swiper-button-next',
    SWIPER_BUTTON_PREV: '.swiper-button-prev'
  };
  const DATA_KEY = {
    SWIPER: 'swiper'
  };
  const Events = {
    SLIDE_CHANGE: 'slideChange'
  };
  const swipers = document.querySelectorAll(Selector.DATA_SWIPER);
  swipers.forEach(swiper => {
    const options = utils.getData(swiper, DATA_KEY.SWIPER);
    const thumbsOptions = options.thumb;
    let thumbsInit;
    if (thumbsOptions) {
      const thumbImages = swiper.querySelectorAll(Selector.IMG);
      let slides = '';
      thumbImages.forEach(img => {
        slides += `
          <div class='swiper-slide'>
            <img class='img-fluid rounded mt-1' src=${img.src} alt=''/>
          </div>
        `;
      });
      const thumbs = document.createElement('div');
      thumbs.setAttribute('class', 'swiper thumb');
      thumbs.innerHTML = `<div class='swiper-wrapper'>${slides}</div>`;
      if (thumbsOptions.parent) {
        const parent = document.querySelector(thumbsOptions.parent);
        parent.parentNode.appendChild(thumbs);
      } else {
        swiper.parentNode.appendChild(thumbs);
      }
      thumbsInit = new window.Swiper(thumbs, thumbsOptions);
    }
    const swiperNav = swiper.querySelector(Selector.SWIPER_NAV);
    const newSwiper = new window.Swiper(swiper, {
      ...options,
      navigation: {
        nextEl: swiperNav?.querySelector(Selector.SWIPER_BUTTON_NEXT),
        prevEl: swiperNav?.querySelector(Selector.SWIPER_BUTTON_PREV)
      },
      thumbs: {
        swiper: thumbsInit
      }
    });

    // - zanimation effect start
    if (swiper) {
      newSwiper.on(Events.SLIDE_CHANGE, () => {
        const timelineElements = swiper.querySelectorAll(Selector.DATA_ZANIM_TIMELINE);
        timelineElements.forEach(el => {
          window.zanimation(el, animation => {
            setTimeout(() => {
              animation.play();
            }, 1200);
          });
        });
      });
    }
    // - zanimation effect end
  });
};

/* -------------------------------------------------------------------------- */
/*                                   Tooltip                                  */
/* -------------------------------------------------------------------------- */
const tooltipInit = () => {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl, {
    trigger: 'hover'
  }));
};

/* -------------------------------------------------------------------------- */
/*                                 Typed Text                                 */
/* -------------------------------------------------------------------------- */

const typedTextInit = () => {
  const typedTexts = document.querySelectorAll('[data-typed-text]');
  if (typedTexts.length && window.Typed) {
    typedTexts.forEach(typedText => new window.Typed(typedText, {
      strings: utils.getData(typedText, 'typed-text'),
      typeSpeed: 100,
      loop: true,
      backDelay: 1500
    }));
  }
};

/*-----------------------------------------------
|                 Zanimation
-----------------------------------------------*/

/*
global CustomEase, gsap
*/
CustomEase.create('CubicBezier', '.77,0,.18,1');

/*-----------------------------------------------
|   Global Functions
-----------------------------------------------*/
const filterBlur = () => {
  let blur = 'blur(5px)';
  const isIpadIphoneMacFirefox = (window.is.ios() || window.is.mac()) && window.is.firefox();
  if (isIpadIphoneMacFirefox) {
    blur = 'blur(0px)';
  }
  return blur;
};
const zanimationEffects = {
  default: {
    from: {
      opacity: 0,
      y: 70
    },
    to: {
      opacity: 1,
      y: 0
    },
    ease: 'CubicBezier',
    duration: 0.8,
    delay: 0
  },
  'slide-down': {
    from: {
      opacity: 0,
      y: -70
    },
    to: {
      opacity: 1,
      y: 0
    },
    ease: 'CubicBezier',
    duration: 0.8,
    delay: 0
  },
  'slide-left': {
    from: {
      opacity: 0,
      x: 70
    },
    to: {
      opacity: 1,
      x: 0
    },
    ease: 'CubicBezier',
    duration: 0.8,
    delay: 0
  },
  'slide-right': {
    from: {
      opacity: 0,
      x: -70
    },
    to: {
      opacity: 1,
      x: 0
    },
    ease: 'CubicBezier',
    duration: 0.8,
    delay: 0
  },
  'zoom-in': {
    from: {
      scale: 0.9,
      opacity: 0,
      filter: filterBlur()
    },
    to: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)'
    },
    delay: 0,
    ease: 'CubicBezier',
    duration: 0.8
  },
  'zoom-out': {
    from: {
      scale: 1.1,
      opacity: 1,
      filter: filterBlur()
    },
    to: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)'
    },
    delay: 0,
    ease: 'CubicBezier',
    duration: 0.8
  },
  'zoom-out-slide-right': {
    from: {
      scale: 1.1,
      opacity: 1,
      x: -70,
      filter: filterBlur()
    },
    to: {
      scale: 1,
      opacity: 1,
      x: 0,
      filter: 'blur(0px)'
    },
    delay: 0,
    ease: 'CubicBezier',
    duration: 0.8
  },
  'zoom-out-slide-left': {
    from: {
      scale: 1.1,
      opacity: 1,
      x: 70,
      filter: filterBlur()
    },
    to: {
      scale: 1,
      opacity: 1,
      x: 0,
      filter: 'blur(0px)'
    },
    delay: 0,
    ease: 'CubicBezier',
    duration: 0.8
  },
  'blur-in': {
    from: {
      opacity: 0,
      filter: filterBlur()
    },
    to: {
      opacity: 1,
      filter: 'blur(0px)'
    },
    delay: 0,
    ease: 'CubicBezier',
    duration: 0.8
  }
};
if (utils.isRTL()) {
  Object.keys(zanimationEffects).forEach(key => {
    if (zanimationEffects[key].from.x) {
      zanimationEffects[key].from.x = -zanimationEffects[key].from.x;
    }
  });
}
const zanimation = (el, callback) => {
  const Selector = {
    DATA_ZANIM_TIMELINE: '[data-zanim-timeline]',
    DATA_KEYS: '[data-zanim-xs], [data-zanim-sm], [data-zanim-md], [data-zanim-lg], [data-zanim-xl]'
  };
  const DATA_KEY = {
    DATA_ZANIM_TRIGGER: 'data-zanim-trigger'
  };

  /*-----------------------------------------------
  |   Get Controller
  -----------------------------------------------*/
  let controllerZanim;
  const currentBreakpointName = utils.getCurrentScreenBreakpoint().currentBreakpoint;
  const currentBreakpointVal = utils.getCurrentScreenBreakpoint().breakpointStartVal;
  const getController = element => {
    let options = {};
    let controller = {};
    if (element.hasAttribute(`data-zanim-${currentBreakpointName}`)) {
      controllerZanim = `zanim-${currentBreakpointName}`;
    } else {
      /*-----------------------------------------------
      |   Set the mobile first Animation
      -----------------------------------------------*/
      let animationBreakpoints = [];
      const attributes = element.getAttributeNames();
      attributes.forEach(attribute => {
        if (attribute !== DATA_KEY.DATA_ZANIM_TRIGGER && attribute.startsWith('data-zanim-')) {
          const breakPointName = attribute.split('data-zanim-')[1];
          if (utils.breakpoints[breakPointName] < currentBreakpointVal) {
            animationBreakpoints.push({
              name: breakPointName,
              size: utils.breakpoints[breakPointName]
            });
          }
        }
      });
      controllerZanim = undefined;
      if (animationBreakpoints.length !== 0) {
        animationBreakpoints = animationBreakpoints.sort((a, b) => a.size - b.size);
        const activeBreakpoint = animationBreakpoints.pop();
        controllerZanim = `zanim-${activeBreakpoint.name}`;
      }
    }
    const userOptions = utils.getData(element, controllerZanim);
    controller = window._.merge(options, userOptions);
    if (!(controllerZanim === undefined)) {
      if (userOptions.animation) {
        options = zanimationEffects[userOptions.animation];
      } else {
        options = zanimationEffects.default;
      }
    }
    if (controllerZanim === undefined) {
      options = {
        delay: 0,
        duration: 0,
        ease: 'Expo.easeOut',
        from: {},
        to: {}
      };
    }

    /*-----------------------------------------------
    |   populating the controller
    -----------------------------------------------*/
    controller.delay || (controller.delay = options.delay);
    controller.duration || (controller.duration = options.duration);
    controller.from || (controller.from = options.from);
    controller.to || (controller.to = options.to);
    if (controller.ease) {
      controller.to.ease = controller.ease;
    } else {
      controller.to.ease = options.ease;
    }
    return controller;
  };
  /*-----------------------------------------------
  |   End of Get Controller
  -----------------------------------------------*/

  /*-----------------------------------------------
  |   For Timeline
  -----------------------------------------------*/

  const zanimTimeline = el.hasAttribute('data-zanim-timeline');
  if (zanimTimeline) {
    const timelineOption = utils.getData(el, 'zanim-timeline');
    const timeline = gsap.timeline(timelineOption);
    const timelineElements = el.querySelectorAll(Selector.DATA_KEYS);
    timelineElements.forEach(timelineEl => {
      const controller = getController(timelineEl);
      timeline.fromTo(timelineEl, controller.duration, controller.from, controller.to, controller.delay).pause();
      window.imagesLoaded(timelineEl, callback(timeline));
    });
  } else if (!el.closest(Selector.DATA_ZANIM_TIMELINE)) {
    /*-----------------------------------------------
    |   For single elements outside timeline
    -----------------------------------------------*/
    const controller = getController(el);
    callback(gsap.fromTo(el, controller.duration, controller.from, controller.to).delay(controller.delay).pause());
  }
  callback(gsap.timeline());
};

/*-----------------------------------------------
|    Zanimation Init
-----------------------------------------------*/

const zanimationInit = () => {
  const Selector = {
    DATA_ZANIM_TRIGGER: '[data-zanim-trigger]',
    DATA_ZANIM_REPEAT: '[zanim-repeat]'
  };
  const DATA_KEY = {
    DATA_ZANIM_TRIGGER: 'data-zanim-trigger'
  };
  const Events = {
    SCROLL: 'scroll'
  };

  /*-----------------------------------------------
  |   Triggering zanimation when the element enters in the view
  -----------------------------------------------*/
  const triggerZanimation = () => {
    const triggerElement = document.querySelectorAll(Selector.DATA_ZANIM_TRIGGER);
    triggerElement.forEach(el => {
      if (utils.isElementIntoView(el) && el.hasAttribute(DATA_KEY.DATA_ZANIM_TRIGGER)) {
        zanimation(el, animation => animation.play());
        if (!document.querySelector(Selector.DATA_ZANIM_REPEAT)) {
          el.removeAttribute(DATA_KEY.DATA_ZANIM_TRIGGER);
        }
      }
    });
  };
  triggerZanimation();
  window.addEventListener(Events.SCROLL, () => triggerZanimation());
};
const gsapAnimation = {
  zanimationInit,
  zanimation
};

/* -------------------------------------------------------------------------- */
/*                            Theme Initialization                            */
/* -------------------------------------------------------------------------- */

docReady(fancyNavInit);
docReady(countdownInit);
docReady(plyrInit);
docReady(initMap);
docReady(tooltipInit);
docReady(popoverInit);
docReady(typedTextInit);
docReady(progressBarInit);
docReady(rellaxInit);
docReady(countupInit);
docReady(isotopeInit);
docReady(zanimationInit);
docReady(swiperInit);
docReady(drawSvgInit);
docReady(bgPlayerInit);
docReady(lightboxInit);
docReady(cookieNoticeInit);
docReady(bootstrapNavbarInit);
docReady(preloaderInit);
//# sourceMappingURL=theme.js.map
