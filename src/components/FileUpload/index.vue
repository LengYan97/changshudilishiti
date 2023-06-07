<!--
 * @Author: your name
 * @Date: 2022-04-02 09:27:35
 * @LastEditTime: 2022-04-11 16:19:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \engineering-construct1\src\components\FileUpload.vue
 
-->
<template>
  <div class="file_module">
    <div class="header_part">
      <div class="header_name">{{ headerName }}</div>
    </div>
    <el-upload
      ref="upload"
      class="upload-demo"
      :limit="1"
      action=""
      multiple
      :auto-upload="false"
      :show-file-list="true"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :on-change="handleFile"
    >
      <!--  -->
      <template #trigger v-if="isEidt">
        <button class="btn_file">上传</button>
      </template>
      <template #file="{ file }">
        <div class="file_row">
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
  name: "FileUpload1",
  props: {
    headerName: "",
    fileList: null,
    isEidt: null,
  },
  setup(props, context) {
    let files = null;
    const fileName = ref("");
    const upload = ref(null);

    const fileArr = ref([]);

    const handleFile = (uploadFile, uploadFiles) => {
      if (uploadFile.raw) {
        context.emit("fileContent", uploadFile.raw);
      }
    };

    //处理文件超限钩子
    const handleExceed = (files) => {
      upload.value.clearFiles();
      const file = files[0];
      upload.value.handleStart(file);
    };

    // onMounted(() => {});
    //获取pdf的绝对路径
   const getObjectUrl = (file)=> {
      let urlAdress = null;
      if (window.createObjectURL != undefined) {
        // basic
        urlAdress = window.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        urlAdress = window.webkitURL.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        urlAdress = window.URL.createObjectURL(file);
      }
      return urlAdress;
    }


    //previw
    const handlePreview = (url, name, file) => {
      if (url) {
        if (url.startsWith("http") || url.startsWith("https")) {
          window.open(url);
        }
      } else {
        window.open(getObjectUrl(file.raw));
      }
    };

    //清除
    const handleRemove = (file, index) => {
      upload.value.handleRemove(file);
      console.log(file);
      if (file.url) {
        context.emit("deleteFile", file);
      }
    };
    const getFiles = () => {
      return files;
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
      position: absolute;
      top: -2px;
      right: 0px;

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