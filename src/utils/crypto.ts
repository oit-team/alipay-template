import * as crypto from 'crypto-js'

const KEY = 'F7FA3CB95EFDB120'

/**
* 加密
* @param string word 要加密的文本
* @param string keyStr 密钥
* @returns 结果
*/
export function encrypt(word: string, keyStr?: string) {
  keyStr = keyStr || KEY
  const key = crypto.enc.Utf8.parse(keyStr)
  const str = crypto.enc.Utf8.parse(word)
  const encrypted = crypto.AES.encrypt(str, key, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7,
  })
  return encrypted.toString()
}

/**
* 解密
* @param string word 要解密的文本
* @param string keyStr 密钥
* @returns 结果
*/
export function decrypt(word: string, keyStr?: string) {
  keyStr = keyStr || KEY
  const key = crypto.enc.Utf8.parse(keyStr)
  const decrypt = crypto.AES.decrypt(word, key, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7,
  })
  return crypto.enc.Utf8.stringify(decrypt).toString()
}
