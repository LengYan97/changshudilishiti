<!--
 * @Author: your name
 * @Date: 2022-04-02 09:27:35
 * @LastEditTime: 2022-05-19 09:14:08
 * @LastEditors: zhangchao 823483914@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \engineering-construct1\src\components\FileUpload.vue
 
-->
<template>
  <div
    class="file_module"
    v-loading="loading"
    element-loading-text="模型载入中..."
    element-loading-background="rgba(0, 0, 0, 0.4)"
  >
    <div class="header_part">
      <div class="header_name">{{ headerName }}</div>
      <div class="double_screen_switch_module" v-if="showDoubleScreen">
        <img
          src="@/assets/right/project_construction/双屏.png"
          width="16"
          height="14"
        />
        <div class="double_screen_title">双屏比对</div>
        <input
          type="checkbox"
          v-model="doubleScreenSwitch"
          @change="handleDoubleScreenChange($event.target.checked)"
        />
      </div>
    </div>
    <!--  multiple-->
    <el-upload
      ref="upload"
      class="upload-demo"
      :limit="1"
      action=""
      :auto-upload="false"
      :show-file-list="!doubleScreenSwitch"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :on-change="handleFile"
    >
      <template #trigger v-if="isEidt">
        <button class="btn_file">上传</button>
      </template>

      <template #file="{ file }">
        <div
          class="file_row"
          v-loading="file.loading"
          element-loading-text="模型加载中..."
          element-loading-background="rgba(0, 0, 0, 0.4)"
        >
          <div class="file_row_header">
            <!-- @click="handlePreview(file.url, file.name, file)" -->
            <img src="~@/assets/right/file_icon.png" width="10" height="12" />
            <div class="file_row_name">
              {{ file.name }}
            </div>
            <div v-if="false" style="font-size: 10px">{{ file.id }}</div>
          </div>

          <div style="display: flex; align-items: center">
            <el-switch
              v-if="file.url != undefined"
              v-model="file.status"
              class="mb-2"
              inline-prompt
              active-text="是"
              inactive-text="否"
              active-color="#44D7B6"
              @change="switchFuc($event, file.model, file.order)"
            />

            <img
              v-if="isEidt"
              src="~@/assets/right/btn_save.png"
              width="11"
              height="12"
              class="file_editBtn"
              title="保存"
              @click="handleSave(file.id)"
            />

            <img
              v-if="isEidt"
              src="~@/assets/right/delete_icon.png"
              width="11"
              height="12"
              title="删除"
              @click="handleRemove(file, file.id)"
              class="file_editBtn"
            />
          </div>
        </div>
      </template>
    </el-upload>
    <DoubleScreenCompare
      ref="doubleScreenComp"
      :editStatus="isEidt"
      :isDoubleScreen="doubleScreenSwitch"
      :rightList="fileList"
      @leftMapChange="handleLeftMapChange"
      @rightMapChange="handleRightMapChange"
    />
  </div>
</template>
<script>
import { loadModules } from "esri-loader";
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  watch,
  toRaw,
  nextTick,
  defineAsyncComponent,
  onDeactivated,
  onBeforeUnmount,
} from "vue";
import { useStore } from "vuex";
import { options } from "@/global/global_config";
import { ElMessage } from "element-plus";
import DoubleScreenCompare from "./doubleScreenCompare/index.vue";

const JSZip = require("jszip");

export default defineComponent({
  name: "GLTFFileUpoload",
  props: {
    headerName: "",
    fileList: null,
    isEidt: null,
  },
  components: {
    DoubleScreenCompare,
  },
  setup(props, context) {
    let files = null;
    let sketchVM = null;
    const fileName = ref("");
    const upload = ref(null);
    const store = useStore();
    //双屏比对按钮开关
    const doubleScreenSwitch = ref(false);

    //双屏比对屏幕打开的标志
    const doubleScreenOpen = ref(false);

    //双屏比对的图标的显示
    const showDoubleScreen = ref(false);

    //双屏组件
    const doubleScreenComp = ref(null);
    //展示

    const fileArr = ref([]);
    //要素过滤的元素
    let featureFilter = null;
    //精模的layerview
    let modelLayerView = null;
    //精模的右侧的layerview
    let modelLayerView2 = null;

    //当前选中地块的graphic
    let seletedLandGraphic = null;

    //进度条
    let loading = ref(false);
    //获取当前地块信息
    let isCurLandInfo = computed(() => store.state.curLandData);

    watch(isCurLandInfo, (newVal, oldVal) => {
      if (newVal.flowList != oldVal.flowList) {
        recoverDoubleScreen();
      }
    });

    //监听三维图层显隐
    let sceneLayerVis = computed(() => store.state.sceneLayerVisible);
    watch(sceneLayerVis, (val) => {
      if (val) {
        const scenceLayer32 = map.findLayerById("street32_model");
        const scenceLayerShowed = map.findLayerById("street32_model").visible;
        //双屏比对打开时的条件判定，这里的判断是当精模图层打开时，且已经选择左侧的屏幕，需要进行将模型压平
        if (scenceLayerShowed && doubleScreenComp.value.leftValue != "") {
          mapView.whenLayerView(scenceLayer32).then((layerView) => {
            modelLayerView = layerView;
            featureFilter = {
              geometry: toRaw(seletedLandGraphic.value).geometry,
              spatialRelationship: "disjoint",
            };
            modelLayerView.filter = featureFilter;
          });
        }
        //只有单屏时的判定，判断条件是，当精模图层显示，且双屏开关关闭的状态下，进行对精模压平
        if (scenceLayerShowed && !doubleScreenSwitch.value) {
          mapView.whenLayerView(scenceLayer32).then((layerView) => {
            modelLayerView = layerView;
            featureFilter = {
              geometry: toRaw(seletedLandGraphic.value).geometry,
              spatialRelationship: "disjoint",
            };
            modelLayerView.filter = featureFilter;
          });
        }
      }
    });

    //当前的图形
    let curLandGraphic = computed(() => store.state.landGeo);
    let modelList = computed(() => store.state.modelFileList);

    seletedLandGraphic = curLandGraphic;
    watch(curLandGraphic, (val) => {
      seletedLandGraphic = val;
    });

    //是否是删除状态
    let isDelete = false;

    let isShowRightPanel = computed(() => store.state.isShowRightPanel);

    let isShowModelFirst = ref(false);

    //模型参数
    const modelInfo = {
      x: 0,
      y: 0,
      z: 0,
      width: 120,
      heading: 0,
    };

    watch(isShowRightPanel, (value) => {
      if (!value) {
        map.findLayerById("modelGraphicLayer").removeAll();
        map2.findLayerById("modelGraphicLayer").removeAll();
        if (sketchVM) {
          // 消除编辑工具
          sketchVM.destroy();
          map.findLayerById("modelGraphicLayer").removeAll();
        }
        removePressModel();
        if (doubleScreenSwitch.value) {
          removeRightPressModel();
        }

        //关闭双屏
        store.commit("updateScreenIsOpen", value);
      }
    });

    //将双屏恢复到单屏状态
    const recoverToNormal = () => {
      //双屏switch 置空
      doubleScreenSwitch.value = false;
      recoverDoubleScreen();
    };

    const spatialRef = {
      wkt: 'PROJCS["2000SZ",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",350000.0],PARAMETER["False_Northing",-2800000.0],PARAMETER["Central_Meridian",120.7833333333333],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]],VERTCS["EGM96_Geoid",VDATUM["EGM96_Geoid"],PARAMETER["Vertical_Shift",0.0],PARAMETER["Direction",1.0],UNIT["Meter",1.0]]',
    };

    //处理文件
    const handleFile = (uploadFile, uploadFiles) => {
      if (uploadFile.raw) {
        props.fileList.splice(0);
        props.fileList.push({
          name: uploadFile.raw.name,
        });
        modelAddPreview(uploadFile.raw);
        context.emit("modelZipContent", uploadFile.raw);
      }
    };

    //flg     0：获取文件名 1：获取路径
    function jsGetFileName(path, flg) {
      var obj = path.lastIndexOf("/");
      flg = flg ? flg : 0;
      if (flg == 0) {
        //获取文件名
        return path.substr(obj + 1);
      } else {
        //获取路径
        return path.substr(0, obj) + "/";
      }
    }

    //加载三维模型数据
    async function modelAddPreview(file) {
      //获取模型放置的图层
      const model3GraphicLayer = map.findLayerById("modelGraphicLayer");

      let filePath = "";
      // 需要读取的所有文件
      const pendings = [];
      // 文件Map，文件名对应url
      const fileMap = {};
      // zip文件中的gltf文件的entry（JSZip中读取文件的方法）
      let gltfEntry = null;
      // zip文件中gltf文件名
      let gltfFileName = "";

      // 使用JSZip封装好的Promise
      const promise = JSZip.external.Promise;
      const zip = new JSZip();
      // 读取zip文件
      const zipData = await zip.loadAsync(file);
      //加载arcgis sketchView
      const [SketchViewModel] = await loadModules(
        ["esri/widgets/Sketch/SketchViewModel"],
        options
      );

      // modelLayerView = null;
      // featureFilter = null;
      const scenceLayer32 = map.findLayerById("street32_model");
      const scenceLayerIsShow = map.findLayerById("street32_model").visible;
      if (scenceLayerIsShow) {
        mapView.whenLayerView(scenceLayer32).then((layerView) => {
          modelLayerView = layerView;
        });
      }

      if (sketchVM) {
        // 消除编辑工具
        sketchVM.destroy();
        model3GraphicLayer.removeAll();
      }

      sketchVM = new SketchViewModel({
        layer: model3GraphicLayer,
        view: mapView,
      });

      // 遍历zip中的所有文件，生成fileMap
      for (let file in zipData.files) {
        const entry = zipData.file(file);
        //这里是判断是否是文件夹，如果是文件夹就结束本次循环
        if (entry === null) {
          filePath = file;
          continue;
        }
        //判断是否包含该文件
        if (file.includes(".gltf")) {
          gltfEntry = entry;
          gltfFileName = file;
        }
        // push需要加载的文件
        pendings.push(
          entry.async("blob").then((blob) => {
            // 生成url并放进fileMap
            fileMap[file] = URL.createObjectURL(blob);
          })
        );
      }

      // 等待加载文件
      await promise.all(pendings);
      // 加载gltf文件为string类型
      if (gltfEntry) {
        // 转化为json
        const res = await gltfEntry.async("string");
        const gltfJson = JSON.parse(res);

        // 修改buffers和纹理的uri(这里需要注意)
        gltfJson.buffers.forEach((item) => {
          item.uri = fileMap[filePath + item.uri];
        });

        gltfJson.images.forEach((item) => {
          item.uri = fileMap[filePath + item.uri];
        });

        // 更新fileMap中gltf文件url
        fileMap[gltfFileName] = URL.createObjectURL(
          new Blob([JSON.stringify(gltfJson)])
        );

        sketchVM.pointSymbol = {
          type: "point-3d",
          symbolLayers: [
            {
              type: "object",
              resource: {
                href: fileMap[gltfFileName],
              },
            },
          ],
        };

        //创建点
        sketchVM.create("point");
        if (scenceLayerIsShow) {
          featureFilter = {
            geometry: toRaw(seletedLandGraphic.value).geometry,
            spatialRelationship: "disjoint",
          };
          modelLayerView.filter = featureFilter;
        }

        //判断草图工具是否可以编辑
        if (sketchVM.state == "ready") {
          loading.value = false;
          ElMessage({
            type: "success",
            message: "加载模型成功，请编辑...",
          });
        }

        sketchVM.on("create", (event) => {
          if (event.state === "complete") {
            sketchVM.update(event.graphic);
          }
        });

        //监听更新
        sketchVM.on("update", (event) => {
          if (isDelete === true) {
            return;
          }
          if (event.state === "complete") {
            //获取到当前图层的位置信息和姿态信息（用于定姿态定位置）
            let graphic = event.graphics[0];
            modelInfo.x = graphic.geometry.x;
            modelInfo.y = graphic.geometry.y;
            modelInfo.z = graphic.geometry.z;

            modelInfo.heading =
              graphic.symbol.symbolLayers.items[0].heading || -999;
            modelInfo.width =
              graphic.symbol.symbolLayers.items[0].width || -999;
          }
        });

        sketchVM.on("undo", (event) => {});
        sketchVM.on("redo", (event) => {});
        sketchVM.on("delete", (event) => {});
      } else {
        ElMessage({
          type: "error",
          message: "选择的模型数据不正确，请重新选择",
        });
        loading.value = false;
        return;
      }
    }

    //加载模型到地图
    const showModel2Map = async (url, id, x, y, z, heading, width, order) => {
      //获取模型放置的图层
      const model3GraphicLayer = map.findLayerById("modelGraphicLayer");
      isShowModelFirst.value = true;
      const scenceLayer32 = map.findLayerById("street32_model");
      const scenceLayerShowed = map.findLayerById("street32_model").visible;
      if (scenceLayerShowed) {
        mapView.whenLayerView(scenceLayer32).then((layerView) => {
          modelLayerView = layerView;
          featureFilter = {
            // autocasts to FeatureFilter
            geometry: toRaw(seletedLandGraphic.value).geometry,
            spatialRelationship: "disjoint",
          };
          modelLayerView.filter = featureFilter;
        });
      }

      //加载之前的事件触发
      // model3GraphicLayer.graphics.on("before-add", (event) => {
      //   debugger;
      //   console.log("before-add");
      //   ElMessage({
      //     type: "success",
      //     message: "模型正在加载请稍后...",
      //   });
      // });

      //after-add
      // model3GraphicLayer.graphics.on("after-add", (event) => {
      //   console.log(event);

      //   ElMessage({
      //     type: "success",
      //     grouping: true,
      //     duration: 1500,
      //     message: "模型加载中...",
      //   });
      // });

      // //模型加载完成事件监听
      // model3GraphicLayer.graphics.on("after-changes", (event) => {
      //   ElMessage({
      //     type: "success",
      //     message: "模型成功！",
      //   });
      // });

      const [SpatialReference, Graphic, SketchViewModel] = await loadModules(
        [
          "esri/geometry/SpatialReference",
          "esri/Graphic",
          "esri/widgets/Sketch/SketchViewModel",
        ],
        options
      );

      if (sketchVM) {
        sketchVM.destroy();
      }
      // 定义绘制工具
      sketchVM = new SketchViewModel({
        layer: model3GraphicLayer,
        view: mapView,
        updateOnGraphicClick: props.isEidt,
      });

      const SpatialRefSZ2000 = new SpatialReference(spatialRef);
      //图形的加载
      let symbolLayersObj = null;
      if (heading === -999 && width != -999) {
        symbolLayersObj = {
          type: "object",
          width: width,
          resource: {
            href: url,
          },
        };
      } else if (width === -999 && heading != -999) {
        symbolLayersObj = {
          type: "object",
          heading: heading,
          resource: {
            href: url,
          },
        };
      } else if (width === -999 && heading === -999) {
        symbolLayersObj = {
          type: "object",
          resource: {
            href: url,
          },
        };
      } else {
        symbolLayersObj = {
          type: "object",
          heading: heading, //模型研Z轴转动角度
          width: width,
          resource: {
            href: url,
          },
        };
      }
      let modelGraphic = new Graphic({
        geometry: {
          type: "point",
          spatialReference: SpatialRefSZ2000,
          x: x,
          y: y,
          z: z,
        },
        symbol: {
          type: "point-3d",
          symbolLayers: [symbolLayersObj],
        },
      });
      modelGraphic.attributes = {
        id: id, // 地块id
      };

      sketchVM.on("update", (event) => {
        if (event.state === "complete") {
          //获取到当前图层的位置信息和姿态信息（用于定姿态定位置）
          let graphic = event.graphics[0];
          modelInfo.x = graphic.geometry.x;
          modelInfo.y = graphic.geometry.y;
          modelInfo.z = graphic.geometry.z;
          modelInfo.heading =
            graphic.symbol.symbolLayers.items[0].heading || -999;
          modelInfo.width = graphic.symbol.symbolLayers.items[0].width || -999;
        }
      });

      model3GraphicLayer.add(modelGraphic);

      mapView
        .goTo(modelGraphic)
        .then(() => {
          props.fileList[order].loading = false;
          ElMessage({
            type: "success",
            message: "模型加载成功",
            duration: 1000,
          });
        })
        .catch(() => {
          props.fileList[order].loading = false;
        });
      sketchVM.cancel();
    };

    //处理文件超限钩子
    const handleExceed = (files) => {
      upload.value.clearFiles();
      const file = files[0];
      upload.value.handleStart(file);
    };

    //监听编辑和文件的传值，确定是否显示双屏按钮
    watch(
      props,
      (val) => {
        if (!val.isEidt && val.fileList.length > 0) {
          val.fileList.forEach((item) => {
            if (item.url) {
              showDoubleScreen.value = true;
              return;
            }
          });
        } else {
          showDoubleScreen.value = false;
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );

    onMounted(() => {
      // showDoubleScreen.value = props.isEidt
      // nextTick(() => {
      //   showDoubleScreen.value = props.fileList.length > 0;
      // });
      // setTimeout(() => {
      //   showDoubleScreen.value = props.fileList.length > 0;
      // }, 1000);
    });

    onDeactivated(() => {
      if (sketchVM) {
        sketchVM.destroy();
      }
      // recoverDoubleScreen()
    });

    onBeforeUnmount(() => {
      recoverDoubleScreen2();
    });

    //获取pdf的绝对路径
    const getObjectUrl = (file) => {
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
    };

    //加载模型到左侧地图
    const showModel2LeftMapNoEdit = async (
      url,
      id,
      x,
      y,
      z,
      heading,
      width
    ) => {
      //获取模型放置的图层
      const model3GraphicLayer = map.findLayerById("modelGraphicLayer");
      model3GraphicLayer.removeAll();
      isShowModelFirst.value = true;
      const scenceLayer32 = map.findLayerById("street32_model");
      const scenceLayerShowed = map.findLayerById("street32_model").visible;
      if (scenceLayerShowed) {
        mapView.whenLayerView(scenceLayer32).then((layerView) => {
          modelLayerView = layerView;
          featureFilter = {
            // autocasts to FeatureFilter
            geometry: toRaw(seletedLandGraphic.value).geometry,
            spatialRelationship: "disjoint",
          };
          modelLayerView.filter = featureFilter;
        });
      }

      const [SpatialReference, Graphic, SketchViewModel] = await loadModules(
        [
          "esri/geometry/SpatialReference",
          "esri/Graphic",
          "esri/widgets/Sketch/SketchViewModel",
        ],
        options
      );

      if (sketchVM) {
        sketchVM.destroy();
      }
      // 定义绘制工具
      sketchVM = new SketchViewModel({
        layer: model3GraphicLayer,
        view: mapView,
        updateOnGraphicClick: false,
      });

      const SpatialRefSZ2000 = new SpatialReference(spatialRef);
      //图形的加载
      let symbolLayersObj = null;
      if (heading === -999 && width != -999) {
        symbolLayersObj = {
          type: "object",
          width: width,
          resource: {
            href: url,
          },
        };
      } else if (width === -999 && heading != -999) {
        symbolLayersObj = {
          type: "object",
          heading: heading,
          resource: {
            href: url,
          },
        };
      } else if (width === -999 && heading === -999) {
        symbolLayersObj = {
          type: "object",
          resource: {
            href: url,
          },
        };
      } else {
        symbolLayersObj = {
          type: "object",
          heading: heading, //模型研Z轴转动角度
          width: width,
          resource: {
            href: url,
          },
        };
      }
      let modelGraphic = new Graphic({
        geometry: {
          type: "point",
          spatialReference: SpatialRefSZ2000,
          x: x,
          y: y,
          z: z,
        },
        symbol: {
          type: "point-3d",
          symbolLayers: [symbolLayersObj],
        },
      });
      modelGraphic.attributes = {
        id: id, // 地块id
      };

      sketchVM.on("update", (event) => {
        if (event.state === "complete") {
          //这里不做任何处理
        }
      });

      model3GraphicLayer.add(modelGraphic);

      mapView
        .goTo(modelGraphic)
        .then(() => {
          doubleScreenComp.value.leftLoading = false;
          // props.fileList[order].loading = false;
          ElMessage({
            type: "success",
            message: "模型加载成功",
            duration: 1000,
          });
        })
        .catch(() => {
          doubleScreenComp.value.leftLoading = false;
          // props.fileList[order].loading = false;
        });
      sketchVM.cancel();
    };

    //加载模型到左侧地图
    const showModel2RightMapNoEdit = async (
      url,
      id,
      x,
      y,
      z,
      heading,
      width
    ) => {
      //获取模型放置的图层
      const model3GraphicLayer = map2.findLayerById("modelGraphicLayer");
      model3GraphicLayer.removeAll();
      // isShowModelFirst.value = true;
      const scenceLayer32 = map2.findLayerById("street32_model");
      const scenceLayerShowed = map2.findLayerById("street32_model").visible;
      if (scenceLayerShowed) {
        mapView2.whenLayerView(scenceLayer32).then((layerView) => {
          modelLayerView2 = layerView;
          featureFilter = {
            // autocasts to FeatureFilter
            geometry: toRaw(seletedLandGraphic.value).geometry,
            spatialRelationship: "disjoint",
          };
          modelLayerView2.filter = featureFilter;
        });
      }

      const [SpatialReference, Graphic, SketchViewModel] = await loadModules(
        [
          "esri/geometry/SpatialReference",
          "esri/Graphic",
          "esri/widgets/Sketch/SketchViewModel",
        ],
        options
      );

      if (sketchVM) {
        sketchVM.destroy();
      }
      // 定义绘制工具
      sketchVM = new SketchViewModel({
        layer: model3GraphicLayer,
        view: mapView2,
        updateOnGraphicClick: false,
      });

      const SpatialRefSZ2000 = new SpatialReference(spatialRef);
      //图形的加载
      let symbolLayersObj = null;
      if (heading === -999 && width != -999) {
        symbolLayersObj = {
          type: "object",
          width: width,
          resource: {
            href: url,
          },
        };
      } else if (width === -999 && heading != -999) {
        symbolLayersObj = {
          type: "object",
          heading: heading,
          resource: {
            href: url,
          },
        };
      } else if (width === -999 && heading === -999) {
        symbolLayersObj = {
          type: "object",
          resource: {
            href: url,
          },
        };
      } else {
        symbolLayersObj = {
          type: "object",
          heading: heading, //模型研Z轴转动角度
          width: width,
          resource: {
            href: url,
          },
        };
      }
      let modelGraphic = new Graphic({
        geometry: {
          type: "point",
          spatialReference: SpatialRefSZ2000,
          x: x,
          y: y,
          z: z,
        },
        symbol: {
          type: "point-3d",
          symbolLayers: [symbolLayersObj],
        },
      });
      modelGraphic.attributes = {
        id: id, // 地块id
      };

      sketchVM.on("update", (event) => {
        if (event.state === "complete") {
          //这里不做任何处理
        }
      });

      model3GraphicLayer.add(modelGraphic);

      mapView2
        .goTo(modelGraphic)
        .then(() => {
          doubleScreenComp.value.rightLoading = false;
          // props.fileList[order].loading = false;
          ElMessage({
            type: "success",
            message: "模型加载成功",
            duration: 1000,
          });
        })
        .catch(() => {
          doubleScreenComp.value.rightLoading = false;
          // props.fileList[order].loading = false;
        });
      sketchVM.cancel();
    };

    //预览
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
    const handleRemove = (file, modelID) => {
      // upload.value.handleRemove(file);
      isDelete = true;
      setTimeout(() => {
        isDelete = false;
      }, 500);

      // map.findLayerById("modelGraphicLayer").removeAll();
      //删除时都要销毁
      if (sketchVM) {
        sketchVM.destroy();
      }
      if (file.url) {
        let fileInfo = {
          file: file,
          id: modelID,
        };
        context.emit("deleteFile", fileInfo);
      } else {
        let fileInfo = {
          file: file,
        };
        context.emit("deleteFile", fileInfo);
      }
    };

    //保存
    const handleSave = (id) => {
      if (sketchVM) {
        sketchVM.cancel();
      }
      let modelObj = {
        model: modelInfo,
        modelId: id,
      };
      context.emit("uploadModel", modelObj);
    };

    const getFiles = () => {
      return files;
    };
    //模型加载开关
    const switchFuc = (value, item, order) => {
      if (value) {
        props.fileList[order].loading = true;
      }
      let info = {
        isOpen: value,
        model: item,
        order: order,
      };
      context.emit("switchChange", info);
    };

    const eidtModel = (val) => {
      if (sketchVM) {
        if (val) {
          sketchVM.updateOnGraphicClick = true;
        } else {
          sketchVM.cancel();
          sketchVM.updateOnGraphicClick = false;
        }
      }
    };

    //移除压平
    const removePressModel = () => {
      if (map) {
        if (sketchVM) {
          sketchVM.destroy();
        }
        const scenceLayer32 = map.findLayerById("street32_model");
        const scenceLayerIsShow = map.findLayerById("street32_model").visible;
        if (scenceLayerIsShow) {
          
          mapView.whenLayerView(scenceLayer32).then((layerView) => {
            modelLayerView = layerView;

            modelLayerView.filter = null;
            layerView.filter = null;
          });
        }
      }
    };

    //移除右侧压平
    const removeRightPressModel = () => {
      if (sketchVM) {
        sketchVM.destroy();
      }
      const scenceLayer32 = map2.findLayerById("street32_model");
      const scenceLayerIsShow = map2.findLayerById("street32_model").visible;
      if (scenceLayerIsShow) {
        mapView2.whenLayerView(scenceLayer32).then((layerView) => {
          modelLayerView2 = layerView;
          modelLayerView2.filter = null;
        });
      }
    };

    //控制双屏比对开关
    const handleDoubleScreenChange = (value) => {
      //判断是否有模型在预览，如果预览要恢复到初始不加载模型和压平的状态
      if (!value) {
        recoverDoubleScreen();
      } else {
        controlMapLayer();
        recoverLeftScreen();
      }
      store.commit("updateScreenIsOpen", value);
    };

    //控制地图的初始化状态
    const controlMapLayer = () => {
      map.findLayerById("dzdt").visible = false;
      map.findLayerById("dzdt_poi").visible = false;
      map.findLayerById("dzdt_zj").visible = false;
      map.findLayerById("dom").visible = true;
      map.findLayerById("street32_model").visible = true;
      store.commit("updateSceneLayerVisible", true);
    };

    //如果左侧已经展示模型 要恢复状态展示恢复左侧
    const recoverLeftScreen = () => {
      map.findLayerById("modelGraphicLayer").removeAll();
      props.fileList.forEach((item) => {
        if (item.status != 0) {
          item.status = 0;
        }
      });
      if (sketchVM) {
        // 消除编辑工具
        sketchVM.destroy();
      }
      removePressModel();
    };

    //还原
    const recoverDoubleScreen = () => {
      map.findLayerById("modelGraphicLayer").removeAll();
      map2.findLayerById("modelGraphicLayer").removeAll();
      if (sketchVM) {
        // 消除编辑工具
        sketchVM.destroy();
      }
      removePressModel();
      removeRightPressModel();
      doubleScreenComp.value.leftValue = "";
      doubleScreenComp.value.rightValue = "";
      props.fileList.forEach((item) => {
        if (item.status != 0) {
          item.status = 0;
        }
      });
      //关闭双屏
      store.commit("updateScreenIsOpen", false);
    };
    //单独处理onMounted的重置
    const recoverDoubleScreen2 = () => {
      if (map) {
        if (map.findLayerById("modelGraphicLayer").visible) {
          map.findLayerById("modelGraphicLayer").removeAll();
        }
        if (map2.findLayerById("modelGraphicLayer").visible) {
          map2.findLayerById("modelGraphicLayer").removeAll();
        }

        // map2.findLayerById("modelGraphicLayer").removeAll();
        if (sketchVM) {
          // 消除编辑工具
          sketchVM.destroy();
        }
        //如果精模显示就移去压平
        if (map.findLayerById("street32_model").visible) {
          removePressModel();
        }

        //如果双屏打开就移去压平
        if (doubleScreenSwitch.value) {
          removeRightPressModel();
        }

        //关闭双屏
        store.commit("updateScreenIsOpen", false);
      }
    };

    //左侧地图模型开关
    const handleLeftMapChange = (value) => {
      if (value != "") {
        const model = toRaw(findWhichModel(value));
        let { href, id, x, y, z, heading, width } = model;
        showModel2LeftMapNoEdit(href, id, x, y, z, heading, width);
      } else {
        map.findLayerById("modelGraphicLayer").removeAll();
        doubleScreenComp.value.leftLoading = false;
        removePressModel();
      }
    };

    //右侧地图模型控制
    const handleRightMapChange = (value) => {
      if (value != "") {
        const model = toRaw(findWhichModel(value));
        let { href, id, x, y, z, heading, width } = model;
        showModel2RightMapNoEdit(href, id, x, y, z, heading, width);
      } else {
        map2.findLayerById("modelGraphicLayer").removeAll();
        doubleScreenComp.value.rightLoading = false;
        removeRightPressModel();
      }
    };

    //根据id找到模型
    const findWhichModel = (id) => {
      for (let i = 0; i < modelList.value.length; i++) {
        if (modelList.value[i].id == id) {
          return modelList.value[i].model;
        }
      }
      return null;
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
      loading,
      showModel2Map,
      switchFuc,
      isShowRightPanel,
      handleSave,
      isShowModelFirst,
      eidtModel,
      featureFilter,
      modelLayerView,
      removePressModel,
      doubleScreenOpen,
      doubleScreenSwitch,
      handleDoubleScreenChange,
      showDoubleScreen,
      handleLeftMapChange,
      handleRightMapChange,
      modelList,
      showModel2LeftMapNoEdit,
      doubleScreenComp,
      removeRightPressModel,
      recoverToNormal,
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
    .double_screen_switch_module {
      display: flex;
      align-items: center;
      .double_screen_title {
        font-size: 10px;
        color: #1ad0f1;
        margin-left: 10px;
      }

      input[type="checkbox"] {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        border: none;
        box-sizing: border-box;
        background: url("~@/assets/right/check_box_bg.png") no-repeat;
        background-size: 100% 100%;
      }

      input[type="checkbox"]:checked {
        width: 12px;
        height: 12px;
        appearance: none;
        background: url("~@/assets/right/check_box_active_bg.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  :deep(.upload-demo) {
    // width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    .file_row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      width: 96%;
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
        margin-left: 5px;
      }
    }
    .el-upload {
      display: flex;
      justify-content: flex-start;
      // position: absolute;
      // top: -2px;
      // right: 0px;

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