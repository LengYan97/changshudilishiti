/*
 * @Author: lengyan
 * @Date: 2023-03-29 17:31:24
 * @LastEditTime: 2023-04-23 16:54:15
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \v2\src\utils\auth.js
 */
import Cookies from 'js-cookie'

const TokenKey = 'CIM-Token'
const SSOKey = 'oa_accesstoken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeSSOkey() {
  return Cookies.remove(SSOKey)
}
