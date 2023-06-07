/*
 * @Author: lengyan
 * @Date: 2023-06-05 10:40:35
 * @LastEditTime: 2023-06-05 10:40:42
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\pinia\index.js
 */
import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('main', {
    // other options...
})