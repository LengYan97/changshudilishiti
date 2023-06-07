/*
 * @Author: lengyan
 * @Date: 2023-04-10 16:37:57
 * @LastEditTime: 2023-06-01 11:32:14
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\utils\getUserInfo.js
 */
import store from '@/store'
import router from '../router'
export function getUser() {
    store.dispatch('Login/getInfo').then(res => {
        console.log(res)
        getInfo()
    })
}



export function getInfo() {
    store.dispatch('Login/getRoleLayerConfig').then(res => {
        if (res.code == 200) {
            layerConf.themeList = res.themeList
            router.push('/')
        }
    })
}