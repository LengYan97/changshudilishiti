import { options } from '@/plugins/arcgis'
import { loadModules } from "esri-loader";
import { defineComponent, onMounted, computed, ref, watch, inject, defineAsyncComponent } from "vue";
import Head from '@/views/head/index.vue'
import Layers from '@/views/layers/index.vue'
import BaseLayer from '@/views/baseLayer/index.vue'
export default {
    name: 'csmap',
    components: { Head, Layers, BaseLayer },
    setup() {
        const initMap = async () => {
            try {
                const [config, Measurement, Basemap, Map, SceneView, MapView, TileLayer, MapImageLayer, FeatureLayer, SceneLayer, SpatialReference, IdentityManager, SceneModification, SceneModifications, Graphic, reactiveUtils, promiseUtils]
                    = await loadModules([
                        "esri/config",
                        "esri/widgets/Measurement",
                        "esri/Basemap",
                        "esri/Map",
                        "esri/views/SceneView",
                        "esri/views/MapView",
                        'esri/layers/TileLayer',
                        'esri/layers/MapImageLayer',
                        "esri/layers/FeatureLayer",
                        'esri/layers/SceneLayer',
                        "esri/geometry/SpatialReference",
                        "esri/identity/IdentityManager",
                        "esri/layers/support/SceneModification",
                        "esri/layers/support/SceneModifications",
                        "esri/Graphic",
                        "esri/core/reactiveUtils",
                        "esri/core/promiseUtils"
                    ], options);
                // config.fontsUrl = options.fontsUrl;
                // IdentityManager.registerToken({ server: "http://2.40.7.227:8080/OneMapServer/rest/services", token: "fILn7mg-U-nJCoJ2L-Lv3c88G-VjSDRiUXalgTw0Ug5OMFGQzm2-u_3NPs6760SymvqSUGK1ptSTmT1Csjt4NdMkUgmYhpQgHiqe5PTFBK4vH3xBaFi4I62sEK1kt1UO2pSiF1ApgXNeuNwClRnwpA.." })
                // IdentityManager.registerToken({ server: "https://222.92.185.58:56443/arcgis/rest/services", token: "lB76-Gkoxq8qQiCiBnsBZledIRJ3vT9HRrQjEvubyLkUz7rRphA0lm-6YwcjLnpnKn0HcBh1mkAlbwAAJtYypg.." })
                IdentityManager.registerToken({ server: "https://222.92.185.58:56443/arcgis/rest/services", token: "mGGZgXXOfAEp17t5-K6pMqSRctr78eLdc4V9fK0-6qvkL7s3mdyxRNQCckSaoZMb2Mkd_wW-bj6yukn-f8Riew.." })

                // var spatialRef = { "wkt": "PROJCS[\"2000SZ\",GEOGCS[\"GCS_China_Geodetic_Coordinate_System_2000\",DATUM[\"D_China_2000\",SPHEROID[\"CGCS2000\",6378137.0,298.257222101]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",350000.0],PARAMETER[\"False_Northing\",-2800000.0],PARAMETER[\"Central_Meridian\",120.7833333333333],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]],VERTCS[\"EGM96_Geoid\",VDATUM[\"EGM96_Geoid\"],PARAMETER[\"Vertical_Shift\",0.0],PARAMETER[\"Direction\",1.0],UNIT[\"Meter\",1.0]]" }
                // var SpatialRefSZ2000 = new SpatialReference(spatialRef);
                // config.geometryServiceUrl = 'http://2.40.7.227:8080/OneMapServer/rest/services/GeometryServer/GeometryServer'
                // config.geometryServiceUrl = 'http://222.92.185.58:56080/arcgis/rest/services/Utilities/Geometry/GeometryServer'
                /**影像视频模块 start */
                /**影像视频模块 end */
                let basemap = new Basemap({
                    baseLayers: [
                    ],
                });
                map = new Map({
                    basemap: basemap
                    // ground: {
                    //     surfaceColor: "#efefef",
                    //     opacity: 0,
                    //     // surfaceColor: "#75a7e400"
                    // },
                    // basemap: "dark-gray-vector",
                    // ground: "world-elevation",
                });
                // 浏览地下需要设置none
                // map.ground.navigationConstraint = {
                //     type: "none"
                // };
                mapView = new SceneView({
                    container: "mapContainer", //
                    map: map, //
                    // viewingMode: 'global',
                    // spatialReference: {
                    //     wkid: 4490
                    // },
                    environment: {
                        background: {
                            type: "color",
                            color: "#efefef"
                        },
                        starsEnabled: false,
                        atmosphereEnabled: false
                    },
                    camera: {
                        // fov: 55,
                        // heading: 0,
                        // titl: 0,
                        // position: {
                        //     x: 120.635947930196,
                        //     y: 31.307733837434565,
                        //     z: 2953.952080225679,
                        // }
                    }
                });


                let qsTileLayer = new TileLayer({
                    id: 'qsdzdt',
                    url: 'https://222.92.185.58:56443/arcgis/rest/services/DigitalSmartGS/%E6%B5%85%E8%89%B2%E7%B3%BB%E7%94%B5%E5%AD%90%E5%9C%B0%E5%9B%BE/MapServer',
                    visible: true
                })
                map.add(qsTileLayer)








                mapView.when(() => {

                })



                /**移除API默认UI */
                mapView.ui.remove("attribution");
                mapView.ui.remove(["compass", "navigation-toggle", "zoom"]);
                mapView.popup.collapseEnabled = false;
                mapView.popup.dockOptions.buttonEnabled = false;
                mapView.popup.highlightEnabled = true;


            } catch (err) {
                console.error(err);
                alert("地图加载出错,请重新刷新页面或者联系管理员");
            }
        }

        onMounted(() => {
            initMap()
        })

        return {

        }
    }
}