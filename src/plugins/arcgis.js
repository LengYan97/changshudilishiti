/*
 * @Author: lengyan
 * @Date: 2023-06-05 11:21:48
 * @LastEditTime: 2023-06-05 11:22:29
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\plugins\arcgis.js
 */
export const options = {
    url: "http://180.106.151.106:8888/arcgisapi426/init.js",
    css: "http://180.106.151.106:8888/arcgisapi426/esri/themes/light/main.css",
    font: "http://180.106.151.106:8888/arcgisapi426/esri/themes/base/fonts",
    dojoConfig: {
        async: true,
        //locale: 'en-us',//arcgis api语言设置 'zh-cn' 'ja'
    }
}