<!--
 * @Author: lengyan
 * @Date: 2023-06-06 11:36:26
 * @LastEditTime: 2023-06-06 13:59:12
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\head\time\index.vue
-->
<template>
    <div class="time-area">
        <span class="inner-timer">{{ timer1 }}</span>
        <span class="inner-timer2">{{ timer2 }}</span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 获取时间
let timer1 = ref(null);
let timer2 = ref(null);
let getTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const str_1 = `${year}年 ${month}月 ${day}日`;
    let hours = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    if (hours < 10) {
        hours = "0" + `${hours}`;
    }
    if (min < 10) {
        min = "0" + `${min}`;
    }
    if (sec < 10) {
        sec = "0" + `${sec}`;
    }
    const str_2 = `${hours}:${min}:${sec}`;

    const str = str_1 + `  `;
    const str2 = str_2;
    return [str, str2];
};

onMounted(() => {
    setInterval(() => {
        [timer1.value, timer2.value] = getTime()
    }, 1000)
})
</script>
<style lang="scss" scoped>
.time-area {
    position: absolute;
    margin-left: 107px;
    margin-top: 5px;
    width: 218px;
    height: 40px;

    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-family: my-title;
    font-weight: 400;
    text-align: JUSTIFIED;
    color: #ffffff;
    line-height: 40px;
    letter-spacing: 0.04px;
    // .inner-timer {
    //     width: 65%;
    // }

    // .inner-timer2 {
    //     width: 35%;
    // }
}
</style>