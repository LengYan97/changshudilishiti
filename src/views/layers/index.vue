<!--
 * @Author: lengyan
 * @Date: 2023-06-05 15:17:43
 * @LastEditTime: 2023-06-05 17:13:13
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\layers\index.vue
-->
<template>
    <div class="layers-area">
        <div class="title"></div>
        <Search />
        <Tree />
    </div>
</template>
<script setup>
import Search from './search/index.vue'
import Tree from './tree/index.vue'
</script>
<style lang="scss" scoped>
.layers-area {
    width: 400px;
    min-height: 500px;
    height: calc(100% - 133px - 93px);
    z-index: 1;

    position: absolute;
    top: 93px;
    left: 42px;
    background: linear-gradient(90deg, rgba(109, 124, 146, 0.784), rgb(26, 52, 90) 50%, rgba(109, 124, 146, 0.75));

    .title {
        width: 400px;
        height: 50px;
        background-image: url(@/assets/images/layers/layers_title.png);
        background-size: 100% 100%;
    }
}
</style>