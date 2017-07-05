import { baseHost } from '../../config/config';

const urlGetStamps = baseHost + 'stamps';

export const getStamps = () =>
  fetch(urlGetStamps, {
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(res => res.json());
