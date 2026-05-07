import md5 from 'crypto-js/md5.js';

export const genHash = (key) => {

    return md5(key).toString();
}