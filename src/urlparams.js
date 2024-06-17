import { window } from './globals';

function getUrlParams () {
  const urlParams = Object.create(null);
  // Only interact with URLs via window.location
  const location = typeof window !== 'undefined' && window.location;
  // Silently skip in non-browser environment
  if (location) {
    const params = location.search.slice(1).split('&');
    const length = params.length;

    for (let i = 0; i < length; i++) {
      if (params[i]) {
        const param = params[i].split('=');
        const name = decodeQueryParam(param[0]);

        // Allow just a key to turn on a flag, e.g., test.html?noglobals
        const value = param.length === 1 ||
          decodeQueryParam(param.slice(1).join('='));
        if (name in urlParams) {
          urlParams[name] = [].concat(urlParams[name], value);
        } else {
          urlParams[name] = value;
        }
      }
    }
  }

  return urlParams;
}

function decodeQueryParam (param) {
  return decodeURIComponent(param.replace(/\+/g, '%20'));
}

export const urlParams = getUrlParams();
