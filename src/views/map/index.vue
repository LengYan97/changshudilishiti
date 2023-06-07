<!--
 * @Author: lengyan
 * @Date: 2023-06-05 10:01:54
 * @LastEditTime: 2023-06-07 16:44:12
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\map\index.vue
-->
<template>
    <Head />
    <Layers />
    <div id="mapContainer"></div>
    <BaseLayer />
    <LinkData />
</template>
<script>
import map from "./index.js";
export default map;
</script>
<style lang="scss" scoped>
#mapContainer {
    width: 100%;
    height: 100%;
    transition: all 0.15s;
    background-color: #efefef;
}
</style>