<!--
 * @Author: lengyan
 * @Date: 2023-06-05 17:10:16
 * @LastEditTime: 2023-06-06 10:48:27
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\layers\tree\index.vue
-->
<template>
    <el-tree :data="data" class="my-tree" show-checkbox @node-click="handleNodeClick">
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

<style lang="scss" >
.my-tree {
    width: 372px;
    margin: auto;
    margin-top: 16px;
    background: rgba(38, 79, 160, 0.47);

    .el-tree-node {
        .el-tree-node__content {
            background: linear-gradient(180deg, #164080, rgba(39, 50, 109, 0.64) 100%);
            height: 47px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            margin-bottom: 8px;
        }

        .el-tree-node__children {
            .el-tree-node__content {
                background: none !important;
                margin-bottom: 0px;

            }
        }
    }

}
</style>