const Crypto = require("crypto");

/**
 * @description aes 암호화 및 복호화를 위한 키를 생성합니다.
 *
 * @return {String} key
 */
function createKey(param) {
    let myKey = param;
    var md5 = Crypto.createHash("md5");
    return md5.update(myKey).digest("hex");
}

/**
 * @description aes 암호화를 수행합니다.
 * @param {String} plainText - 평문
 * @param {String} key - 키
 *
 * @return {String} 암호문
 */
function enCrypt(plainText, key) {
    let iv = key.slice(16, 32);
    plainText = Buffer.from(plainText);
    let cipher = Crypto.createCipheriv("AES-256-CBC", key, iv);
    let encrypted = cipher.update(plainText);
    return Buffer.concat([encrypted, cipher.final()]).toString("base64");
}

/**
 * @description aes 복호화를 수행합니다.
 * @param {String} encryptText - 암호문
 * @param {String} key - 키
 *
 * @return {String} 복호문
 */
function deCrypt(encryptText, key) {
    let iv = key.slice(16, 32);
    encryptText = Buffer.from(encryptText, "base64");
    let cipher = Crypto.createDecipheriv("AES-256-CBC", key, iv);
    let decrypted = cipher.update(encryptText);
    return Buffer.concat([decrypted, cipher.final()]).toString("utf-8");
}

module.exports.enCrypt = enCrypt;
module.exports.deCrypt = deCrypt;
module.exports.createKey = createKey;
