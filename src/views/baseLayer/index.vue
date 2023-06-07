<!--
 * @Author: lengyan
 * @Date: 2023-06-06 16:01:05
 * @LastEditTime: 2023-06-06 17:50:16
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\baseLayer\index.vue
-->
<template>
    <div class="base-layer">
        <img src="@/assets/images/baselayer/dzdt.png" height="85" alt="">
        <img src="@/assets/images/baselayer/qxsy.png" height="85" alt="">
    </div>
</template>

<style lang="scss" scoped>
.base-layer {
    position: absolute;
    bottom: 32px;
    left: 50px;
    height: 85px;
    display: flex;
    cursor: pointer;

    img:nth-child(2) {
        margin-left: -120px;
        transition: 0.35s;
    }

    &:hover {
        img {
            margin-left: 0px;
            transition: 0.35s;
        }
    }
}
</style>