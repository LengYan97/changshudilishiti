<!--
 * @Author: lengyan
 * @Date: 2023-06-05 15:02:38
 * @LastEditTime: 2023-06-07 15:53:05
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\head\index.vue
-->
<template>
    <div class="head-area">
        <Time />
        <Title />
        <Weather />
    </div>
</template>
<script setup>
import Title from './title/index.vue'
import Time from './time/index.vue'
import Weather from './weather/index.vue'

</script>
<style lang="scss" scoped>
.head-area {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 71px;
    background-image: url(@/assets/images/head/head_bk.png);
    background-size: 100% 100%;
    z-index: 999;
}
</style>