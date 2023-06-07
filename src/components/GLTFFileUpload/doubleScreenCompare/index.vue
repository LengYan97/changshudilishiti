<!--
 * @Author: your name
 * @Date: 2022-04-26 11:35:27
 * @LastEditTime: 2022-05-09 09:05:50
 * @LastEditors: zhangchao 823483914@qq.com
 * @Description: 双屏比对组件
 * @FilePath: \engineering-construct1\src\components\GLTFFileUpload\doubleScreenCompare\index.vue
-->
<template>
  <div class="double_screen_module" v-if="!editStatus && isDoubleScreen">
    <div>双屏比对配置</div>
    <div class="select_module">
      <div
        class="left_screen"
        v-loading="leftLoading"
        element-loading-text="模型加载中..."
        element-loading-background="rgba(0, 0, 0, 0.4)"
      >
        <el-select
          :teleported="false"
          v-model="leftValue"
          :fit-input-width="true"
          clearable
          placeholder="请选择（左）"
          @change="handleLeftChange"
          @clear="handleLeftClear"
        >
          <el-option
            v-for="item in rightList"
            :title="item.name"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>

      <img
        src="@/assets/right/project_construction/比对.png"
        width="16"
        height="16"
      />
      <div
        class="right_screen"
        v-loading="rightLoading"
        element-loading-text="模型加载中..."
        element-loading-background="rgba(0, 0, 0, 0.4)"
      >
        <el-select
          :teleported="false"
          clearable
          v-model="rightValue"
          placeholder="请选择（右）"
          :fit-input-width="true"
          @change="handleRightChange"
        >
          <el-option
            v-for="item in rightList"
            :title="item.name"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue";
export default defineComponent({
  name: "double-screen-compare",
  props: {
    editStatus: null,
    isDoubleScreen: null,
    rightList: null,
  },
  setup(props, context) {
    const leftValue = ref("");
    const rightValue = ref("");
    const leftLoading = ref(false);
    const rightLoading = ref(false);

    const handleLeftChange = (val) => {
      leftLoading.value = true;
      context.emit("leftMapChange", val);
    };

    const handleRightChange = (val) => {
      rightLoading.value = true;
      context.emit("rightMapChange", val);
    };

    onMounted(() => {});
    return {
      leftValue,
      rightValue,
      handleLeftChange,
      handleRightChange,
      leftLoading,
      rightLoading,
    };
  },
});
</script>
<style lang='scss' scoped>
.double_screen_module {
  font-size: 14px;
  text-align: start;
  display: flex;
  flex-direction: column;
  .select_module {
    display: flex;
    align-items: center;
    margin-top: 10px;
    width: 100%;
    justify-content: space-evenly;
    margin-bottom: 16px;
    // justify-content: space-between;
    .left_screen {
      width: 42.8%;
      text-align: center;
      display: flex;

      // margin-right: 5px;
    }
    .right_screen {
      width: 42.8%;
      text-align: center;
      display: flex;

      // margin-left: 5px;
      // :deep(.el-select) {
      //   width:92%;
      //   .el-select-dropdown__wrap {
      //     // max-height: 274px;
      //     color: #fff;
      //     .el-select-dropdown__item {
      //       color: #fff;
      //       .hover {
      //         background: #13284c !important;
      //       }
      //     }
      //   }
      // }
    }

    :deep(.el-select) {
      // width: 90%;
      //  width: 80%;
      .el-popper {
        //  left: 0 !important;
        // margin-left: -5px;
        .el-select-dropdown {
          // left: 0px !important;
          .el-select-dropdown__wrap {
            // max-height: 274px;
            color: #fff;
            .el-select-dropdown__item {
              color: #fff;
              padding: 0 32px 0 10px;
              width: 175px;
              .hover {
                background: #13284c !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>