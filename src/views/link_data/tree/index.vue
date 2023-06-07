<!--
 * @Author: lengyan
 * @Date: 2023-06-07 17:20:14
 * @LastEditTime: 2023-06-07 17:47:16
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\link_data\tree\index.vue
-->
<template>
    <el-tree :data="data" class="link-tree" @node-click="handleNodeClick">
    </el-tree>
</template>

<script setup>
import { toRaw } from 'vue';
const handleNodeClick = (data) => {
    const a1 = toRaw(data)
    console.log(a1);
}
const data = [
    {
        label: '自然地理实体',
        children: [
            {
                label: 'Level two 1-1',
                children: [
                    {
                        label: 'Level three 1-1-1',
                    },
                ],
            },
        ],
    },
    {
        label: '人工地理实体',
        children: [
            {
                label: 'Level two 2-1',
                children: [
                    {
                        label: 'Level three 2-1-1',
                    },
                ],
            },
            {
                label: 'Level two 2-2',
                children: [
                    {
                        label: 'Level three 2-2-1',
                    },
                ],
            },
        ],
    },

]
</script>

<style lang="scss" scoped>
.link-tree {
    margin-top: 12px;
    margin-left: 15px;
    font-size: 16px;

    :deep(.el-tree-node) {
        .el-tree-node__content {
            font-size: 16px;
            // font-weight: bold;
        }
    }
}
</style>