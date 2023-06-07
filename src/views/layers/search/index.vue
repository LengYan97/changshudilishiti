<!--
 * @Author: lengyan
 * @Date: 2023-06-05 16:33:25
 * @LastEditTime: 2023-06-05 16:54:35
 * @LastEditors: lengyan
 * @Description: 
 * @FilePath: \webSystem\src\views\layers\search\index.vue
-->
<template>
    <div class="search-area">
        <el-input ref="buttonRef" v-model="input" :prefix-icon="Search" placeholder="请输入关键字" class="input-with-select"
            clearable>
            <template #append>
                <el-button @click="onClickOutside">
                    搜索</el-button>
            </template>
        </el-input>
    </div>
</template>

<script setup>
import { Search, CloseBold } from '@element-plus/icons-vue'
import { ref, unref, computed, watch } from 'vue';
const input = ref('')
const onClickOutside = () => {
}
</script>

<style lang="scss" scoped>
.search-area {
    height: 37px;
    width: 372px;
    transition: 0.4s;
    margin: auto;
    margin-top: 12px;

    :deep(.el-input-group--append) {
        border: 3px solid #126493;
        background: transparent;
        height: 37px;

        .el-input__wrapper {
            border-radius: unset;
            box-shadow: unset;
            background: rgba(28, 49, 92, 0.31);

            .el-input__inner {
                font-size: 16px;
                color: #000000;
            }
        }

        .el-input-group__append {
            width: 57px;
            background: #1f6aff;
            padding: 0;
            // box-shadow: unset;
            border-radius: unset;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);

            .el-button {
                width: 100%;
                font-size: 14px;
                height: 100%;
                color: #fff;
                padding: 0;
                appearance: none;
            }

            .el-button:not(.is-text, .is-link, .el-button--text):active,
            .el-button:not(.is-text, .is-link, .el-button--text):focus,
            .el-button:not(.is-text, .is-link, .el-button--text):hover {
                background-color: transparent;
                border: none;
            }

            .el-button:not(.is-text, .is-link, .el-button--text):focus-visible {
                border-color: transparent;
                outline: none;
                outline-offset: 0px;
            }
        }
    }
}
</style>