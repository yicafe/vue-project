<!-- ModelViewer.vue -->
<template>
  <div ref="container" class="model-container">
    <div v-if="loading" class="loading-overlay">Loading... {{ progress }}%</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

const props = defineProps({
  modelUrl: {
    type: String,
    required: true
  },
  backgroundColor: {
    type: String,
    default: '#f0f0f0'
  },
  showAxes: {
    type: Boolean,
    default: false
  },
  autoRotate: {
    type: Boolean,
    default: false
  },
  scale: {
    type: Number,
    default: 1
  },
  cameraPosition: {
    type: Object,
    default: () => ({ x: 5, y: 5, z: 5 })
  },
  envMapUrl: {
    type: String,
    //default: null // HDR 环境贴图路径
    default: '../models3dgltf/studio.hdr' // HDR 环境贴图路径
  }
})

const emit = defineEmits(['loaded', 'error'])
const container = ref(null)
const loading = ref(true)
const progress = ref(0)

let scene = null
let camera = null
let renderer = null
let controls = null
let model = null

// 初始化场景
const initScene = () => {
  // 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(props.backgroundColor)

  // 相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.offsetWidth / container.value.offsetHeight,
    0.01,
    1000
  )
  camera.position.set(
    props.cameraPosition.x,
    props.cameraPosition.y,
    props.cameraPosition.z
  )

  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.setSize(container.value.offsetWidth, container.value.offsetHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  container.value.appendChild(renderer.domElement)

  // 加载 HDR 环境贴图
  if (props.envMapUrl) {
    new RGBELoader().load(props.envMapUrl, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = texture
      //scene.background = texture // 可选：将背景设置为 HDR
      scene.background = new THREE.Color(0xadd8e6) // 象牙白可选：将背景设置为 HDR
    })
  }

  // 半球光（模拟天空和地面光照）
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
  hemisphereLight.position.set(0, 10, 0)
  scene.add(hemisphereLight)

  // 环境光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
  scene.add(ambientLight)

  // 主平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(5, 10, 7)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  scene.add(directionalLight)

  // 辅助平行光
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight2.position.set(-5, 10, -7)
  directionalLight2.castShadow = true
  directionalLight2.shadow.mapSize.width = 2048
  directionalLight2.shadow.mapSize.height = 2048
  scene.add(directionalLight2)

  // 聚光灯
  const spotLight = new THREE.SpotLight(0xffffff, 1.0, 100, Math.PI / 6, 0.5)
  spotLight.position.set(0, 10, 0)
  spotLight.castShadow = true
  spotLight.shadow.mapSize.width = 2048
  spotLight.shadow.mapSize.height = 2048
  scene.add(spotLight)

  // 点光源
  const pointLight = new THREE.PointLight(0xffccaa, 0.8, 100)
  pointLight.position.set(0, 5, 0)
  pointLight.castShadow = true
  scene.add(pointLight)

  // 坐标系
  if (props.showAxes) {
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
  }

  // 控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.autoRotate = props.autoRotate
}

// 加载模型
const loadModel = () => {
  const loader = new GLTFLoader()
  loader.load(
    props.modelUrl,
    (gltf) => {
      model = gltf.scene
      model.scale.set(props.scale, props.scale, props.scale)
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          // 确保材质支持光照和环境贴图
          if (child.material) {
            // 设置为金属材质
            child.material.metalness = 1.0  // 金属度：1.0 为纯金属
            child.material.roughness = 0.1  // 粗糙度：越低越光滑
            child.material.envMapIntensity = 1.5  // 增强环境贴图反射
            if (scene.environment) {
              child.material.envMap = scene.environment
              child.material.needsUpdate = true  // 更新材质
            }
          }
        }
      })
      scene.add(model)
      centerModel()
      loading.value = false
      emit('loaded', model)
    },
    (xhr) => {
      progress.value = Math.round((xhr.loaded / xhr.total) * 100)
    },
    (error) => {
      console.error('Error loading model:', error)
      loading.value = false
      emit('error', error)
    }
  )
}

// 居中模型
const centerModel = () => {
  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)

  controls.target.copy(center)
  camera.position.copy(center)
  camera.position.z += maxDim * 2
  controls.update()
}

// 动画循环
const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

// 窗口resize处理
const handleResize = () => {
  camera.aspect = container.value.offsetWidth / container.value.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.offsetWidth, container.value.offsetHeight)
}

onMounted(() => {
  initScene()
  loadModel()
  animate()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  scene.traverse((child) => {
    if (child.isMesh) {
      child.geometry.dispose()
      child.material.dispose()
    }
  })
  renderer.dispose()
  controls.dispose()
  container.value.removeChild(renderer.domElement)
})
</script>

<style scoped>
.model-container {
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  font-size: 1.2em;
  color: #333;
}
</style>
