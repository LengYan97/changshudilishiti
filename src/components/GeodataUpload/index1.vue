<!--
 * @Author: your name
 * @Date: 2022-04-06 09:10:58
 * @LastEditTime: 2022-04-24 15:43:08
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \engineering-construct1\src\components\GeodataUpload\index1.vue
-->
<!--
 * @Author: your name
 * @Date: 2022-04-02 09:27:35
 * @LastEditTime: 2022-04-06 09:06:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \engineering-construct1\src\components\FileUpload.vue
 
-->
<template>
  <div class="file_module">
    <div class="header_part">
      <div class="header_name">{{ headerName }}</div>
      <el-switch
        v-show="isShowSwitch"
        v-model="isOpen"
        class="mb-2"
        inline-prompt
        active-text="是"
        inactive-text="否"
        active-color="#44D7B6"
        @change="switchFuc"
      />
    </div>
    <!-- :show-file-list="isEidt" -->
    <el-upload
      ref="upload"
      class="upload-demo"
      :limit="1"
      action=""
      multiple
      :auto-upload="false" 
      :on-exceed="handleExceed"
      :file-list="fileList"
      :on-change="handleFile"
    >
      <!--  -->
      <template #trigger v-if="isEidt">
        <button class="btn_file">上传</button>
      </template>
      <template #file="{ file }" >
        <div class="file_row" >
          <div
            class="file_row_header"
            @click="handlePreview(file.url, file.name, file)"
          >
            <img src="~@/assets/right/file_icon.png" width="10" height="12" />
            <div class="file_row_name">
              {{ file.name }}
            </div>
          </div>
          
          <img
            v-if="isEidt"
            src="~@/assets/right/delete_icon.png"
            width="11"
            height="12"
            @click="handleRemove(file)"
            class="file_editBtn"
          />
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "GeodataUpload",
  props: {
    headerName: "",
    fileList: null,
    isEidt: null,
    isShowSwitch: null,
    showlist: null,
  },
  setup(props, context) {
    let files = null;
    const fileName = ref("");
    const isOpen = ref(false);

    const fileArr = ref([]);
    let fileJson = "";

    const handleFile = (files, uploadFiles) => {
      //读取本地文件
      if (files.raw) {
        if (files.raw.type === "application/json") {
          let reader = new FileReader();
          reader.readAsText(files.raw); //读取文件为 Text
          reader.onload = function (evt) {
            let json = evt.target.result; //读取json数据
            let obj = JSON.stringify(json);    
            context.emit("filesArr", obj);
          };
        }
      }

      // let reader = new FileReader();
      // reader.readAsText(uploadFile.raw);

      // reader.onload = function (e) {
      //   if (reader.result) {
      //     let res = JSON.stringify(reader.result);
      //     console.log(res);
      //     fileJson = res;
      //     context.emit("filesArr", res);
      //   }
      // };
    };

    //处理文件超限钩子
    const handleExceed = (files) => {
      upload.value.clearFiles();
      const file = files[0];
      // file.uid = genFileId()
      upload.value.handleStart(file);
    };

    const upload = ref(null);
    onMounted(() => {});

    //previw
    const handlePreview = (url, name, file) => {
      if (url.startsWith("http") || url.startsWith("https")) {
        window.open(url);
      } else {
        alert("本地预览");
      }
    };

    //清除
    const handleRemove = (file, index) => {
      upload.value.handleRemove(file);
      context.emit("deleteFile", file);
    };
    const getFiles = () => {
      return files;
    };

    const switchFuc = (value) => {
      context.emit("switchChange", value);
    };

    return {
      fileName,
      handleFile,
      fileArr,
      upload,
      handlePreview,
      handleRemove,
      handleExceed,
      getFiles,
      isOpen,
      fileJson,
      switchFuc,
      // fileList,
    };
  },
});
</script>
<style lang='scss' scoped>
.file_module {
  // padding-bottom: 10px;
  position: relative;
  border-bottom: 0.5px dashed #3f78bf;
  font-family: "myfont1";
  font-size: 14px;

  .header_part {
    display: flex;
    justify-content: space-between;
        align-items: center;
    margin-top: 10px;
    .header_name {
      font-size: 14px;
      max-width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  :deep(.upload-demo) {
    // width: 100%;
    margin-top: 10px;
    .file_row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      width: 90%;
      align-items: center;
      color: #fff;
      .file_row_header {
        display: flex;
        align-items: center;
        max-width: 97%;
        cursor: pointer;
      }
      .file_row_name {
        margin-left: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #50d9e8;
      }
      .file_editBtn {
        cursor: pointer;
      }
    }
    .el-upload {
      display: flex;
      justify-content: flex-start;

      .btn_file {
        color: #fff;
        font-family: "myfont1";
        text-decoration: none;
        outline: none;
        box-shadow: none;
        border: none;
        width: 57px;
        height: 25px;
        line-height: 25px;
        background: url("@/assets/right/upload_bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        cursor: pointer;
      }
    }
  }

  :deep(.el-upload-list__item:hover) {
    background-color: rgba(0, 191, 255, 0.28);
  }
}
</style>