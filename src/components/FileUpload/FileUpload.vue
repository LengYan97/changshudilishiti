<!--
 * @Author: your name
 * @Date: 2022-04-02 09:27:35
 * @LastEditTime: 2022-04-08 19:39:45
 * @LastEditors: Please set LastEditors
 * @Description: 这是一个作废的组件
 * @FilePath: \engineering-construct1\src\components\FileUpload.vue
-->
<template>
  <div class="file_module">
    <div class="header_part">
      <div class="header_name">{{ headerName }}</div>
      <a v-if="fileUrl" class="file_scan" :href="fileUrl ? fileUrl : '#'"
        >查看</a
      >
    </div>
    <div v-if="isEidt == '1'" class="file_edit">
      <button class="btn_file">上传</button>
      <input
        ref="myInput"
        class="file_input"
        type="file"
        @change="fileInputChange"
      />
      <div class="file_name" @click="previewScanFile">{{ fileName }}</div>
      <div class="btn_delete" @click="deleteFile" v-show="fileName !='' ?true:false">删除</div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref ,onMounted} from "vue";

export default defineComponent({
  name: "FileUpload",
  props: {
    headerName: "",
    fileUrl: null,
    isEidt: null,
  },
  setup(props, context) {
    let files = "";
    const fileName = ref("");
    const myInput = ref(null);
    const fileInputChange = (event) => {
      event.target.type = 'file' 
      fileName.value = event.target.files[0].name;
      files = event.target.files;
    };
    const getFile = ()=>{
      return files;
    }
    
    const deleteFile = (event)=>{
      fileName.value = "";
      files = "";
      event.target.type = 'text' ;
       event.target.value=""
    }
    const previewScanFile = ()=>{
      context.emit("previewFile",files);
    }
    onMounted(()=>{
      myInput
    })

    return {
      fileName,
      fileInputChange,
      deleteFile,
      getFile,
      previewScanFile
    };
  },
});
</script>
<style lang='scss' scoped>
.file_module {
  padding-bottom: 10px;
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
    .file_scan {
      font-size: 14px;
      font-family: TENGXZTB, TENGXZTB-Regular;
      font-weight: 400;
      text-align: left;
      color: #fdb97b;
      font-family: "myfont1";
      text-decoration: none;
    }
  }

  .file_edit {
    display: flex;
    align-items:flex-end;
    margin-top: 16px;

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

    .file_input {
      width: 57px;
      height: 25px;
      position: absolute;
      font-size: 12px;
      opacity: 0;
      cursor: pointer;
    }
    .file_name{
      font-size: 10px;
      color: #50D9E8;
      margin-left: 20px;
      max-width: 65%;
      text-align: start;
       white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .btn_delete{
      color: #FF8282;
      font-size: 10px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>