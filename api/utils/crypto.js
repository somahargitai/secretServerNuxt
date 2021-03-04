const CryptoJS = require("crypto-js");

var key = 'byz7VFNtbRQM0yBODcCb1lrUtVVH3D3x';

const encryptSecret = (secret) => {
  const encryptedSecret = CryptoJS.AES
    .encrypt(secret, key)
    .toString();
  return encryptedSecret;
};

const decryptSecret = (encryptedSecret) => {
  const decryptedSecret = CryptoJS.AES
    .decrypt(encryptedSecret, key)
    .toString(CryptoJS.enc.Utf8);
  return decryptedSecret;
}

module.exports = {
  encryptSecret,
  decryptSecret
};
