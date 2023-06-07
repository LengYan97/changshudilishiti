<!--
 * @Author: lengyan
 * @Date: 2023-06-07 16:10:26
 * @LastEditTime: 2023-06-07 17:37:44
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\link_data\index.vue
-->
<template>
    <div class="link-area">
        <div class="head"></div>
        <Search />
        <Tree />
    </div>
</template>
<script setup>
import Search from './search/index.vue'
import Tree from './tree/index.vue'
</script>   
<style lang="scss" scoped>
.link-area {
    position: absolute;
    top: 103px;
    right: 45px;
    width: 377px;
    height: calc(100% - 103px - 117px);
    min-height: 420px;

    .head {
        width: 100%;
        height: 55px;
        background: #417fe4;
        border-radius: 5px 5px 0px 0px;
    }

    background: rgba(255, 255, 255, 0.90);
    border: 3px solid #3761f1;
    border-radius: 8px;
}
</style>