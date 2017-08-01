import { removeTrailingSlash } from 'js/utils/string-utils';

export default (baseHost, api) => {
  return Object.keys(api).reduce((apiFns, resource) => {
    apiFns[resource] = buildCall(baseHost, resource, api[resource]);
    return apiFns;
  }, {});
};

export const defaultOptions = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const defaultThenHandler = res => res.json();

export const computeDscr = (fn, [...args]) => {
  const dscr = fn(...args);
  if (!Array.isArray(dscr)) {
    throw new Error(
      'API descr function should return a `string` or an `array`, got ' +
        `\`${dscr}\`.`
    );
  }
  let [url, options, thenHandler] = dscr;
  //We don't deep merge: all nested properties in default options (ie.
  //headers.Accept) are lost. Hence, if a prop option is overriden (ie.
  //headers), all relevant options should be present.
  options = Object.assign({}, defaultOptions, options);
  thenHandler = thenHandler || defaultThenHandler;
  return [url, options, thenHandler];
};

export const buildCall = (baseHost, resource, fn) => {
  return (...args) => {
    let [path, options, thenHandler] = computeDscr(fn, args);
    if (!options.method) {
      options.method = guessMethod(resource);
    }
    baseHost = removeTrailingSlash(baseHost);
    const url = `${baseHost}/${path}`;
    return fetch(url, options)
      .then(
        res => {
          if (res.ok) return res;
          else return Promise.reject(res.statusText);
        },
        err => Promise.reject(err.toString())
      )
      .then(thenHandler);
  };
};

const patterns = [['GET', /^get/i], ['PUT', /^put/i], ['POST', /post/i]];
/**
 * Takes a string and returns an HTTP verb
 */
export const guessMethod = name => {
  const matchPattern = patterns.find(([method, pattern]) => pattern.test(name));
  if (!matchPattern)
    throw new Error(`Could not guess http method from \`${name}\``);
  const [method] = matchPattern;
  return method;
};
