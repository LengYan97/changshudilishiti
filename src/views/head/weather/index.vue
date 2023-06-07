<!--
 * @Author: lengyan
 * @Date: 2023-06-06 14:45:27
 * @LastEditTime: 2023-06-06 15:55:56
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\head\weather\index.vue
-->
<script setup>
import axios from "axios";
import rainy from "@/assets/images/head/weather/大雨.png";
import cloudy from "@/assets/images/head/weather/多云.png";
import sunny from "@/assets/images/head/weather/晴.png";
import yin from "@/assets/images/head/weather/阴.png";
import xue from "@/assets/images/head/weather/小雪.png";


import { ref, onMounted } from "vue";
//****获取天气信息 */
const temp = ref(0); // 天气温度
const maxTemp = ref(20);
const minTemp = ref(0);

const wea = ref('晴天')
const weather = ref(sunny);
const humidity = ref("65%"); // 天气湿度
//
const air_level = ref("优"); // 空气质量
const getWeather = () => {
    // 简单的获取状态，这里就不从配置文件获取了
    axios
        .get(
            "https://v0.yiketianqi.com/api?unescape=1&version=v61&appid=49922755&appsecret=TjU3xCQq&city=%E8%8B%8F%E5%B7%9E"
        )
        .then((res1) => {
            let res = res1.data
            console.log(res);
            wea.value = res.wea
            temp.value = res.tem;
            minTemp.value = res.tem2;
            maxTemp.value = res.tem1;
            air_level.value = res.air_level;
            humidity.value = res.humidity;
            const wea_img = res.wea_img;
            let currentWea = ""; // 传给天气控制模块
            switch (wea_img) {
                case "qing":
                    weather.value = sunny;
                    currentWea = "qingtian";
                    break;
                case "yun":
                    weather.value = cloudy;
                    currentWea = "duoyun";
                    break;
                case "yin":
                    weather.value = yin;
                    currentWea = "yintian";
                    break;
                case "yu":
                    weather.value = rainy;
                    currentWea = "yu";
                    break;
                case "xue":
                    weather.value = xue;
                    currentWea = "xue";
                    break;
                default:
                    weather.value = cloudy;
                    currentWea = "shaoyun";
            }
        });
};
// ****初始化****
onMounted(() => {
    getWeather();
});
</script>

<template>
    <div class="weather">
        <div class="w-temp">
            <img class="weather-icon" :src="weather" />{{ wea }}<span style="line-height: 34px">{{ minTemp }}&nbsp;~&nbsp;{{
                maxTemp
            }}℃</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.weather {
    position: absolute;
    right: 279px;
    top: 3px;
    font-family: my-title;
    font-size: 16px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 180px;
    height: 40px;
    line-height: 40px;

    .w-temp {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .weather-icon {
            width: 30px;
            height: 30px;
        }
    }
}
</style>