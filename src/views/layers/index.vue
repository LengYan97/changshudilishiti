<!--
 * @Author: lengyan
 * @Date: 2023-06-05 15:17:43
 * @LastEditTime: 2023-06-07 17:17:58
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\layers\index.vue
-->
<template>
    <div class="layers-area">
        <div class="title"></div>
        <div class="body">
            <!-- <Search /> -->
            <Tree />
        </div>

    </div>
</template>
<script setup>
import Tree from './tree/index.vue'
</script>
<style lang="scss" scoped>
.layers-area {
    width: 400px;
    min-height: 500px;
    height: calc(100% - 133px - 92px);
    z-index: 1;

    position: absolute;
    top: 93px;
    left: 42px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .body {
        height: calc(100% - 57px);
        background-color: rgba(255, 255, 255, 0.726);
        border: 3px solid #5088DC;
        border-radius: 10px;
    }

    .title {
        width: 400px;
        height: 50px;
        background-image: url(@/assets/images/layers/layers_title.png);
        background-size: 100% 100%;
    }
}
</style>