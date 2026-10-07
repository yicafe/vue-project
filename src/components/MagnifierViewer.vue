<template>
  <div class="magnifier-container">
    <!-- 3D 场景容器 -->
    <div ref="containerRef" class="three-container" @mouseleave="handleMouseLeave" @touchmove.prevent="handleTouchMove" @touchend="handleTouchEnd">
      <!-- 放大镜 -->
      <div ref="magDivRef" class="magnifier" :class="{ locked: locked }" @dblclick="toggleLock">
        <canvas ref="magCanvasRef"></canvas>
        <span class="zoom-label">{{ zoomFactor }}×</span>
        <span class="lock-hint">🔒 已锁定</span>
      </div>

      <!-- 模型名称 -->
      <div class="model-name-tag" :class="{ loading: isLoading, 'dark-mode': !isLightMode }">
        <span class="loader"></span>
        <span class="name-text">{{ modelName }}</span>
      </div>

      <!-- 视图控制 -->
      <div class="view-controls" :class="{ 'light-mode': isLightMode }">
        <div class="view-label">视图</div>
        <div class="row">
          <button v-for="v in viewButtons" :key="v.name" :class="{ active: currentView === v.name }" @click="setView(v.name)">{{ v.label }}</button>
        </div>
        <div class="row">
          <button data-view="left" @click="setView('left')">左</button>
          <button class="btn-iso" :class="{ active: currentView === 'iso' }" @click="setView('iso')">轴测</button>
          <button data-view="right" @click="setView('right')">右</button>
        </div>
      </div>

      <!-- 放大镜控制面板 -->
      <div class="magnifier-controls">
        <div class="ctrl-row">
          <label>倍率</label>
          <input type="range" v-model.number="zoomFactor" min="2" max="10" step="0.5" @input="updateZoom" />
          <span class="value">{{ zoomFactor }}×</span>
        </div>
        <div class="ctrl-row">
          <label>尺寸</label>
          <input type="range" v-model.number="magSize" min="80" max="300" step="5" @input="updateSize" />
          <span class="value">{{ magSize }}</span>
        </div>
        <div class="ctrl-row">
          <label>水平</label>
          <input type="range" v-model.number="offsetX" min="-150" max="150" step="1" @input="updateOffsetX" />
          <span class="value">{{ offsetX >= 0 ? '+' : '' }}{{ offsetX }}</span>
        </div>
        <div class="ctrl-row">
          <label>垂直</label>
          <input type="range" v-model.number="offsetY" min="-150" max="150" step="1" @input="updateOffsetY" />
          <span class="value">{{ offsetY >= 0 ? '+' : '' }}{{ offsetY }}</span>
        </div>
        <div class="ctrl-buttons">
          <button :class="{ active: magnifierEnabled }" @click="toggleEnable">{{ magnifierEnabled ? '⏹ 禁用' : '🔍 启用' }}</button>
          <button :class="{ 'lock-active': locked }" @click="toggleLock">🔒 {{ locked ? '解锁' : '锁定' }}</button>
          <button @click="resetMagnifier">重置</button>
        </div>
      </div>

      <!-- 主控制面板 -->
      <div class="panel-wrapper" :class="{ open: panelOpen }">
        <div class="panel-body" :class="{ dark: !isLightMode }">
          <span class="btn-group">
            <button v-for="m in modelPresets" :key="m.key" :class="{ active: currentModelKey === m.key }" @click="loadPresetModel(m.key)">{{ m.label }}</button>
          </span>
          <span class="btn-group">
            <button :class="{ active: currentEnv === 'studio' }" @click="setEnvironment('studio')">室内</button>
            <button :class="{ active: currentEnv === 'outdoor' }" @click="setEnvironment('outdoor')">户外</button>
            <button class="theme-btn" @click="toggleTheme">
              <i :class="isLightMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
              <span>主题</span>
            </button>
            <button :class="{ active: showGrid }" @click="toggleGrid">
              <i class="fas fa-border-all"></i>
              <span>网格</span>
            </button>
            <button :class="{ active: autoRotate }" @click="toggleRotate">
              <i :class="autoRotate ? 'fas fa-stop-circle' : 'fas fa-sync-alt'"></i>
              <span>旋转</span>
            </button>
            <button @click="resetCamera">
              <i class="fas fa-crosshairs"></i>
              <span>重置</span>
            </button>
            <button @click="takeScreenshot">
              <i class="fas fa-camera"></i>
              <span>截图</span>
            </button>
            <label class="file-label">
              <i class="fas fa-upload"></i>
              <span>上传</span>
              <input type="file" accept=".glb,.gltf,.obj,.stl" @change="loadLocalModel" />
            </label>
          </span>
          <button class="toggle-btn toggle-btn-inside" @click="panelOpen = false">
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        <button class="toggle-btn toggle-btn-standalone" @click="panelOpen = true">
          <i class="fas fa-chevron-up"></i>
        </button>
      </div>
    </div>

    <!-- Lookbook -->
    <div class="lookbook-section">
      <div class="lookbook-header">
        <h2>📸 Lookbook <span>图片 · 视频 混合</span></h2>
        <span style="font-size:14px;color:#94a3b8;">共 {{ lookbookData.length }} 项</span>
      </div>
      <div class="lookbook-grid">
        <div v-for="(item, idx) in lookbookData" :key="idx" class="lookbook-item">
          <div class="lookbook-media-wrap" :style="{ paddingBottom: item.ratio === '2:3' ? '150%' : '66.666%' }">
            <img v-if="item.type === 'image'" :src="item.src" :alt="item.title" loading="lazy" />
            <video v-else :src="item.src" :poster="item.poster || ''" preload="metadata" playsinline muted @click="toggleVideoPlay(idx)"></video>
            <span class="ratio-badge">{{ item.ratio }} {{ item.type === 'video' ? '🎬' : '' }}</span>
          </div>
          <div class="lookbook-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <span class="tag">{{ item.tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

// ========== Refs ==========
const containerRef = ref(null)
const magDivRef = ref(null)
const magCanvasRef = ref(null)

// ========== 状态 ==========
const isLoading = ref(true)
const modelName = ref('加载中...')
const currentModelKey = ref('dodecahedron')
const isLightMode = ref(true)
const showGrid = ref(true)
const autoRotate = ref(false)
const currentView = ref('iso')
const currentEnv = ref('studio')
const panelOpen = ref(false)

// 放大镜状态
const magnifierEnabled = ref(false)
const locked = ref(false)
const zoomFactor = ref(5)
const magSize = ref(200)
const offsetX = ref(30)
const offsetY = ref(-20)

// 模型预设
const modelPresets = [
  { key: 'helmet', label: '头盔' },
  { key: 'torusknot', label: '环结' },
  { key: 'cube', label: '立方' },
  { key: 'sphere', label: '球体' },
  { key: 'torus', label: '环面' },
  { key: 'dodecahedron', label: '十二面' },
  { key: 'icosahedron', label: '二十面' },
  { key: 'cylinder', label: '圆柱' },
  { key: 'cone', label: '圆锥' },
]

const viewButtons = [
  { name: 'top', label: '上' },
  { name: 'front', label: '前' },
  { name: 'back', label: '后' },
  { name: 'bottom', label: '下' },
]

const lookbookData = ref([
  {
    title: '极简主义 · 概念 A',
    desc: '注重材质与光影的细腻表现，探索形式与功能的平衡。',
    tag: '工业设计',
    type: 'image',
    ratio: '3:2',
    src: 'https://picsum.photos/seed/a1/800/533'
  },
  {
    title: '中国春节 · 申遗宣传片',
    desc: '展示中国春节传统文化与申遗历程，温暖而富有感染力。',
    tag: '文化宣传',
    type: 'video',
    ratio: '3:2',
    src: 'https://showchina.video-china.cn/wzcb/vod/2025/01/14/e2a366cc2dfc47d2919d14f75264d74f/e2a366cc2dfc47d2919d14f75264d74f_h264_1200k_mp4.mp4',
    poster: 'https://picsum.photos/seed/b2/800/533'
  },
  {
    title: '有机形态 · 概念 C',
    desc: '从自然中汲取灵感，打造流畅而富有生命力的产品语言。',
    tag: '概念设计',
    type: 'image',
    ratio: '2:3',
    src: 'https://picsum.photos/seed/c3/600/900'
  },
  {
    title: '中国故事 · 文化短片',
    desc: '用镜头讲述中国故事，展现东方美学与现代生活的交融。',
    tag: '文化传播',
    type: 'video',
    ratio: '2:3',
    src: 'https://showchina.video-china.cn/wzcb/vod/2025/01/14/e2a366cc2dfc47d2919d14f75264d74f/e2a366cc2dfc47d2919d14f75264d74f_h264_1200k_mp4.mp4',
    poster: 'https://picsum.photos/seed/d4/600/900'
  },
  {
    title: '可持续设计 · 概念 E',
    desc: '以环保材料为核心，探索可持续生活方式下的产品创新。',
    tag: '可持续',
    type: 'image',
    ratio: '3:2',
    src: 'https://picsum.photos/seed/e5/800/533'
  },
  {
    title: '智能交互 · 概念 F',
    desc: '以人为本的智能交互设计，让科技与情感自然连接。',
    tag: '智能交互',
    type: 'image',
    ratio: '2:3',
    src: 'https://picsum.photos/seed/f6/600/900'
  }
])

// ========== Three.js 相关 ==========
let scene, camera, renderer, controls
let currentModel = null
let gltfLoader, objLoader, stlLoader, rgbeLoader
let animationId = null
let mouseNDC = new THREE.Vector2(0, 0)
let currentClientPos = { x: 0, y: 0 }
let magnifierRenderer, magCamera
let raycaster, plane
let envMapCache = null

const VIEW_DISTANCE = 5
const viewPositions = {
  top: new THREE.Vector3(0, VIEW_DISTANCE, 0.001),
  bottom: new THREE.Vector3(0, -VIEW_DISTANCE, 0.001),
  left: new THREE.Vector3(-VIEW_DISTANCE, 0, 0.001),
  right: new THREE.Vector3(VIEW_DISTANCE, 0, 0.001),
  front: new THREE.Vector3(0.001, 0, VIEW_DISTANCE),
  back: new THREE.Vector3(0.001, 0, -VIEW_DISTANCE),
  iso: new THREE.Vector3(VIEW_DISTANCE / Math.sqrt(3), VIEW_DISTANCE / Math.sqrt(3), VIEW_DISTANCE / Math.sqrt(3)),
}

// ========== 生命周期 ==========
onMounted(() => {
  nextTick(() => {
    initThree()
    initMagnifier()
    loadDefaultModel()
    animate()
  })
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  renderer?.dispose()
  magnifierRenderer?.dispose()
})

// ========== 初始化 Three.js ==========
function initThree() {
  const container = containerRef.value
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeeeeee)

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(3, 2, 5)

  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.autoRotate = false
  controls.autoRotateSpeed = 2.0
  controls.minDistance = 0.8
  controls.maxDistance = 20
  controls.target.set(0, 0, 0)

  // 灯光
  const ambient = new THREE.AmbientLight(0x404060, 0.5)
  scene.add(ambient)
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.0)
  dirLight.position.set(5, 8, 5)
  dirLight.castShadow = true
  scene.add(dirLight)
  const fillLight = new THREE.DirectionalLight(0x8888ff, 0.6)
  fillLight.position.set(-3, 1, 4)
  scene.add(fillLight)
  const backLight = new THREE.DirectionalLight(0xffaa66, 0.4)
  backLight.position.set(-2, 0, -5)
  scene.add(backLight)

  // 网格和地面
  const gridHelper = new THREE.GridHelper(6, 20, 0x8888ff, 0xccccdd)
  gridHelper.position.y = -0.8
  scene.add(gridHelper)
  const groundGeo = new THREE.PlaneGeometry(8, 8)
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.8
  ground.receiveShadow = true
  scene.add(ground)

  // 加载器
  gltfLoader = new GLTFLoader()
  objLoader = new OBJLoader()
  stlLoader = new STLLoader()
  rgbeLoader = new RGBELoader()

  raycaster = new THREE.Raycaster()
  plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

  // 窗口自适应
  const resizeObserver = new ResizeObserver(() => onResize())
  resizeObserver.observe(container)

  // 鼠标事件
  container.addEventListener('mousemove', handleMouseMove)
  container.addEventListener('mouseleave', handleMouseLeave)

  // 键盘事件（可选）
  window.addEventListener('resize', onResize)
}

// ========== 放大镜初始化 ==========
function initMagnifier() {
  const canvas = magCanvasRef.value
  if (!canvas) return

  magnifierRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  })
  magnifierRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  magnifierRenderer.setClearColor(0x000000, 0)
  magnifierRenderer.shadowMap.enabled = true
  magnifierRenderer.shadowMap.type = THREE.PCFSoftShadowMap

  magCamera = new THREE.PerspectiveCamera(
    camera.fov / zoomFactor.value,
    1,
    0.1, 1000
  )
  magCamera.position.copy(camera.position)
  magCamera.up.copy(camera.up)
  magCamera.lookAt(controls.target)

  // 设置放大镜尺寸
  const magDiv = magDivRef.value
  if (magDiv) {
    magDiv.style.width = magSize.value + 'px'
    magDiv.style.height = magSize.value + 'px'
  }
  magnifierRenderer.setSize(magSize.value, magSize.value)

  // 初始位置（中心）
  const rect = containerRef.value?.getBoundingClientRect()
  if (rect) {
    currentClientPos = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
}

// ========== 模型加载 ==========
function loadDefaultModel() {
  isLoading.value = true
  modelName.value = '加载十二面体...'
  setTimeout(() => {
    createPresetModel('dodecahedron')
    currentModelKey.value = 'dodecahedron'
  }, 200)
}

function createPresetModel(type) {
  const group = new THREE.Group()
  let mesh
  const colors = {
    torusknot: 0x3b82f6,
    cube: 0xef4444,
    sphere: 0x22c55e,
    torus: 0xf59e0b,
    dodecahedron: 0x06b6d4,
    icosahedron: 0xd946ef,
    cylinder: 0xf97316,
    cone: 0x84cc16,
  }

  switch (type) {
    case 'helmet':
      loadHelmetModel()
      return
    case 'torusknot':
      mesh = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16),
        new THREE.MeshPhysicalMaterial({ color: colors.torusknot, metalness: 0.3, roughness: 0.2, emissive: 0x1a1a4e, emissiveIntensity: 0.2 })
      )
      group.add(mesh)
      replaceModel(group, '环结')
      break
    case 'cube':
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.2, 1.2),
        new THREE.MeshPhysicalMaterial({ color: colors.cube, metalness: 0.1, roughness: 0.3 })
      )
      group.add(mesh)
      replaceModel(group, '立方')
      break
    case 'sphere':
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 48, 32),
        new THREE.MeshPhysicalMaterial({ color: colors.sphere, metalness: 0.2, roughness: 0.1 })
      )
      group.add(mesh)
      replaceModel(group, '球体')
      break
    case 'torus':
      mesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.8, 0.25, 30, 48),
        new THREE.MeshPhysicalMaterial({ color: colors.torus, metalness: 0.4, roughness: 0.2 })
      )
      group.add(mesh)
      replaceModel(group, '环面')
      break
    case 'dodecahedron':
      mesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.85),
        new THREE.MeshPhysicalMaterial({ color: colors.dodecahedron, metalness: 0.2, roughness: 0.3, emissive: 0x064e6b, emissiveIntensity: 0.15 })
      )
      group.add(mesh)
      replaceModel(group, '十二面体')
      break
    case 'icosahedron':
      mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.85),
        new THREE.MeshPhysicalMaterial({ color: colors.icosahedron, metalness: 0.15, roughness: 0.25, emissive: 0x6b1d7a, emissiveIntensity: 0.15 })
      )
      group.add(mesh)
      replaceModel(group, '二十面体')
      break
    case 'cylinder':
      mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.7, 1.4, 32),
        new THREE.MeshPhysicalMaterial({ color: colors.cylinder, metalness: 0.3, roughness: 0.2 })
      )
      group.add(mesh)
      replaceModel(group, '圆柱')
      break
    case 'cone':
      mesh = new THREE.Mesh(
        new THREE.ConeGeometry(0.85, 1.5, 32),
        new THREE.MeshPhysicalMaterial({ color: colors.cone, metalness: 0.1, roughness: 0.4 })
      )
      group.add(mesh)
      replaceModel(group, '圆锥')
      break
    default:
      break
  }
}

function loadHelmetModel() {
  isLoading.value = true
  modelName.value = '加载头盔...'
  gltfLoader.load(
    'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) => {
      replaceModel(gltf.scene, '头盔')
    },
    (progress) => {
      const pct = Math.round((progress.loaded / progress.total) * 100)
      modelName.value = `加载头盔 ${pct}%`
    },
    () => {
      modelName.value = '⚠️ 切换备用模型'
      setTimeout(() => createPresetModel('torusknot'), 300)
    }
  )
}

function replaceModel(newGroup, name) {
  if (currentModel) scene.remove(currentModel)
  currentModel = newGroup
  currentModel.position.y = 0
  const box = new THREE.Box3().setFromObject(newGroup)
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  if (maxDim > 2.5) {
    const scale = 2.0 / maxDim
    newGroup.scale.set(scale, scale, scale)
  }
  scene.add(newGroup)
  modelName.value = name
  isLoading.value = false
  controls.target.set(0, 0, 0)
  controls.update()
}

function loadPresetModel(type) {
  currentModelKey.value = type
  createPresetModel(type)
}

// ========== 环境贴图 ==========
async function setEnvironment(type) {
  currentEnv.value = type
  const url = type === 'studio'
    ? 'https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr'
    : 'https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.hdr'
  try {
    const envMap = await new Promise((resolve) => {
      rgbeLoader.load(url, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        resolve(texture)
      }, undefined, () => resolve(null))
    })
    if (envMap) {
      scene.environment = envMap
      scene.backgroundIntensity = 0.8
      scene.traverse(child => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => { if (m.envMap) m.envMap = envMap })
          } else {
            if (child.material.envMap) child.material.envMap = envMap
          }
        }
      })
    }
  } catch (e) {
    console.warn('环境贴图加载失败', e)
  }
}

// ========== 视图控制 ==========
function setView(viewName) {
  currentView.value = viewName
  const targetPos = viewPositions[viewName]
  if (!targetPos) return
  animateCameraTo(targetPos)
}

let viewAnimId = null
function animateCameraTo(targetPos, duration = 400) {
  if (viewAnimId) cancelAnimationFrame(viewAnimId)
  const startPos = camera.position.clone()
  const startTime = performance.now()

  function update() {
    const elapsed = performance.now() - startTime
    let t = Math.min(elapsed / duration, 1)
    t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    camera.position.lerpVectors(startPos, targetPos, t)
    controls.target.set(0, 0, 0)
    controls.update()
    if (t < 1) {
      viewAnimId = requestAnimationFrame(update)
    } else {
      camera.position.copy(targetPos)
      controls.target.set(0, 0, 0)
      controls.update()
      viewAnimId = null
    }
  }
  update()
}

function resetCamera() {
  setView('iso')
}

// ========== 放大镜功能 ==========
function toggleEnable() {
  magnifierEnabled.value = !magnifierEnabled.value
  if (!magnifierEnabled.value) {
    const magDiv = magDivRef.value
    if (magDiv) magDiv.style.display = 'none'
    if (locked.value) {
      locked.value = false
      if (magDiv) magDiv.classList.remove('locked')
    }
  } else {
    // 尝试显示
    const rect = containerRef.value?.getBoundingClientRect()
    if (rect) {
      const cx = currentClientPos.x || rect.left + rect.width / 2
      const cy = currentClientPos.y || rect.top + rect.height / 2
      if (cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom) {
        const magDiv = magDivRef.value
        if (magDiv) {
          magDiv.style.display = 'block'
          updateMagnifierPosition(cx, cy)
          renderMagnifier()
        }
      }
    }
  }
}

function toggleLock() {
  if (!magnifierEnabled.value) return
  locked.value = !locked.value
  const magDiv = magDivRef.value
  if (magDiv) {
    magDiv.classList.toggle('locked', locked.value)
  }
  if (locked.value) {
    const rect = containerRef.value?.getBoundingClientRect()
    if (rect) {
      const x = currentClientPos.x - rect.left
      const y = currentClientPos.y - rect.top
      const ndx = (x / rect.width) * 2 - 1
      const ndy = -(y / rect.height) * 2 + 1
      mouseNDC.set(ndx, ndy)
    }
  }
}

function updateMagnifierPosition(clientX, clientY) {
  if (locked.value) return
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect) return
  const x = clientX - rect.left
  const y = clientY - rect.top

  let left = x + offsetX.value
  let top = y + offsetY.value

  const magDiv = magDivRef.value
  if (!magDiv) return
  const magW = magDiv.offsetWidth
  const magH = magDiv.offsetHeight
  if (left < 0) left = 0
  if (left + magW > rect.width) left = rect.width - magW
  if (top < 0) top = 0
  if (top + magH > rect.height) top = rect.height - magH

  magDiv.style.left = left + 'px'
  magDiv.style.top = top + 'px'

  const ndx = (x / rect.width) * 2 - 1
  const ndy = -(y / rect.height) * 2 + 1
  mouseNDC.set(ndx, ndy)

  currentClientPos = { x: clientX, y: clientY }
}

function renderMagnifier() {
  if (!magCamera || !magnifierRenderer) return
  magCamera.position.copy(camera.position)
  magCamera.up.copy(camera.up)
  const target = computeIntersection()
  magCamera.lookAt(target)
  magCamera.updateProjectionMatrix()
  magnifierRenderer.render(scene, magCamera)
}

function computeIntersection() {
  raycaster.setFromCamera(mouseNDC, camera)
  const intersects = raycaster.intersectObjects(scene.children, true)
  if (intersects.length > 0) {
    return intersects[0].point
  }
  const planeIntersect = new THREE.Vector3()
  const ray = raycaster.ray
  const hit = ray.intersectPlane(plane, planeIntersect)
  if (hit) return hit
  return controls.target.clone()
}

function updateZoom() {
  if (!magCamera) return
  magCamera.fov = camera.fov / zoomFactor.value
  magCamera.updateProjectionMatrix()
  const magDiv = magDivRef.value
  if (magDiv) {
    const label = magDiv.querySelector('.zoom-label')
    if (label) label.textContent = zoomFactor.value + '×'
  }
  if (magnifierEnabled.value && magDiv?.style.display !== 'none') {
    renderMagnifier()
  }
}

function updateSize() {
  const magDiv = magDivRef.value
  if (magDiv) {
    magDiv.style.width = magSize.value + 'px'
    magDiv.style.height = magSize.value + 'px'
  }
  if (magnifierRenderer) {
    magnifierRenderer.setSize(magSize.value, magSize.value)
  }
  if (magnifierEnabled.value && magDiv?.style.display !== 'none') {
    renderMagnifier()
  }
}

function updateOffsetX() {
  if (magnifierEnabled.value) {
    const rect = containerRef.value?.getBoundingClientRect()
    if (rect) {
      const cx = currentClientPos.x || rect.left + rect.width / 2
      const cy = currentClientPos.y || rect.top + rect.height / 2
      updateMagnifierPosition(cx, cy)
      renderMagnifier()
    }
  }
}

function updateOffsetY() {
  if (magnifierEnabled.value) {
    const rect = containerRef.value?.getBoundingClientRect()
    if (rect) {
      const cx = currentClientPos.x || rect.left + rect.width / 2
      const cy = currentClientPos.y || rect.top + rect.height / 2
      updateMagnifierPosition(cx, cy)
      renderMagnifier()
    }
  }
}

function resetMagnifier() {
  if (locked.value) {
    locked.value = false
    const magDiv = magDivRef.value
    if (magDiv) magDiv.classList.remove('locked')
  }
  zoomFactor.value = 5
  magSize.value = 200
  offsetX.value = 30
  offsetY.value = -20
  updateZoom()
  updateSize()
  updateOffsetX()
  updateOffsetY()
  const rect = containerRef.value?.getBoundingClientRect()
  if (rect) {
    const cx = rect.width / 2
    const cy = rect.height / 2
    currentClientPos = { x: rect.left + cx, y: rect.top + cy }
    updateMagnifierPosition(currentClientPos.x, currentClientPos.y)
    mouseNDC.set(0, 0)
  }
}

// ========== 事件处理 ==========
function handleMouseMove(e) {
  if (!magnifierEnabled.value) return
  if (locked.value) return
  const magDiv = magDivRef.value
  if (!magDiv) return
  magDiv.style.display = 'block'
  updateMagnifierPosition(e.clientX, e.clientY)
  renderMagnifier()
}

function handleMouseLeave() {
  if (magnifierEnabled.value) {
    magnifierEnabled.value = false
    const magDiv = magDivRef.value
    if (magDiv) magDiv.style.display = 'none'
    if (locked.value) {
      locked.value = false
      if (magDiv) magDiv.classList.remove('locked')
    }
  }
}

function handleTouchMove(e) {
  if (!magnifierEnabled.value) return
  if (locked.value) return
  const touch = e.touches[0]
  if (!touch) return
  const magDiv = magDivRef.value
  if (!magDiv) return
  magDiv.style.display = 'block'
  updateMagnifierPosition(touch.clientX, touch.clientY)
  renderMagnifier()
}

function handleTouchEnd() {
  if (magnifierEnabled.value) {
    magnifierEnabled.value = false
    const magDiv = magDivRef.value
    if (magDiv) magDiv.style.display = 'none'
    if (locked.value) {
      locked.value = false
      if (magDiv) magDiv.classList.remove('locked')
    }
  }
}

// ========== 本地模型加载 ==========
function loadLocalModel(e) {
  const file = e.target.files[0]
  if (!file) return
  const ext = file.name.split('.').pop().toLowerCase()
  const reader = new FileReader()
  isLoading.value = true
  modelName.value = `读取 ${file.name} ...`

  reader.onload = (ev) => {
    const data = ev.target.result
    try {
      let group = new THREE.Group()
      if (ext === 'glb' || ext === 'gltf') {
        gltfLoader.parse(data, '', (gltf) => {
          replaceModel(gltf.scene, file.name)
        }, (err) => {
          modelName.value = '⚠️ GLTF 解析失败'
          console.error(err)
        })
        return
      }
      if (ext === 'obj') {
        group = objLoader.parse(data)
      } else if (ext === 'stl') {
        const geo = stlLoader.parse(data)
        const mat = new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, metalness: 0.2, roughness: 0.4 })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.castShadow = true
        group.add(mesh)
      } else {
        modelName.value = `⚠️ 不支持的格式: ${ext}`
        return
      }
      replaceModel(group, file.name)
    } catch (err) {
      modelName.value = `⚠️ 加载失败: ${err.message}`
      console.error(err)
    }
  }
  if (ext === 'glb' || ext === 'gltf' || ext === 'stl') {
    reader.readAsArrayBuffer(file)
  } else {
    reader.readAsText(file)
  }
  e.target.value = ''
}

// ========== 其他控制 ==========
function toggleTheme() {
  isLightMode.value = !isLightMode.value
  if (scene) {
    scene.background = new THREE.Color(isLightMode.value ? 0xeeeeee : 0x1a1a2e)
  }
  if (containerRef.value) {
    containerRef.value.style.background = isLightMode.value ? '#eeeeee' : '#1a1a2e'
  }
}

function toggleGrid() {
  showGrid.value = !showGrid.value
  if (scene) {
    scene.children.forEach(child => {
      if (child.isGridHelper || (child.isMesh && child.material && child.material.type === 'ShadowMaterial')) {
        child.visible = showGrid.value
      }
    })
  }
}

function toggleRotate() {
  if (!controls) return
  autoRotate.value = !autoRotate.value
  controls.autoRotate = autoRotate.value
}

function takeScreenshot() {
  if (!renderer) return
  renderer.render(scene, camera)
  const link = document.createElement('a')
  link.download = `model_${modelName.value || 'view'}.png`
  link.href = renderer.domElement.toDataURL('image/png')
  link.click()
}

// ========== 窗口自适应 ==========
function onResize() {
  const container = containerRef.value
  if (!container) return
  const w = container.clientWidth
  const h = container.clientHeight
  if (camera) {
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  if (renderer) {
    renderer.setSize(w, h)
  }
  if (magnifierRenderer && magSize.value) {
    magnifierRenderer.setSize(magSize.value, magSize.value)
  }
}

// ========== 动画循环 ==========
function animate() {
  animationId = requestAnimationFrame(animate)
  if (controls) controls.update()
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
  if (magnifierEnabled.value && magDivRef.value?.style.display !== 'none') {
    renderMagnifier()
  }
}

// ========== 视频控制（Lookbook） ==========
function toggleVideoPlay(idx) {
  const item = lookbookData.value[idx]
  if (item.type !== 'video') return
  // 使用 DOM 操作播放/暂停
  const items = document.querySelectorAll('.lookbook-media-wrap video')
  if (items[idx]) {
    const video = items[idx]
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }
}

// 暴露方法给父组件（可选）
defineExpose({
  setEnvironment,
  loadPresetModel,
  resetCamera,
  takeScreenshot,
})
</script>

<style scoped>
/* ---------- 容器 ---------- */
.magnifier-container {
  width: 100%;
  background: white;
  border-radius: 32px;
  padding: 30px 25px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.three-container {
  width: 100%;
  height: 620px;
  background: #eeeeee;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.06);
  transition: background 0.4s;
  cursor: crosshair;
  touch-action: none;
}

/* ---------- 放大镜 ---------- */
.magnifier {
  position: absolute;
  display: none;
  border-radius: 50%;
  overflow: hidden;
  pointer-events: none;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.35), inset 0 0 30px rgba(0, 0, 0, 0.05);
  z-index: 50;
  backdrop-filter: blur(2px);
  background: rgba(255, 255, 255, 0.05);
  transform: translate(-50%, -50%);
  transition: width 0.15s, height 0.15s, border-color 0.2s;
}
.magnifier.locked {
  border-color: #f59e0b;
  box-shadow: 0 8px 40px rgba(245, 158, 11, 0.4);
  pointer-events: auto;
  cursor: grab;
}
.magnifier canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}
.magnifier .zoom-label {
  position: absolute;
  bottom: 6px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 10px;
  border-radius: 12px;
  pointer-events: none;
  font-family: monospace;
  letter-spacing: 0.3px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.magnifier .lock-hint {
  position: absolute;
  top: 6px;
  left: 10px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  color: #f59e0b;
  font-size: 10px;
  padding: 1px 8px;
  border-radius: 10px;
  pointer-events: none;
  display: none;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
.magnifier.locked .lock-hint {
  display: block;
}

/* ---------- 模型名称 ---------- */
.model-name-tag {
  position: absolute;
  top: 14px;
  left: 18px;
  color: rgba(0, 0, 0, 0.8);
  font-size: 13px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  padding: 4px 16px;
  border-radius: 16px;
  pointer-events: none;
  z-index: 15;
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}
.model-name-tag .loader {
  display: none;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.10);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.model-name-tag.loading .loader {
  display: inline-block;
}
.model-name-tag.loading .name-text {
  opacity: 0.5;
}
.model-name-tag.dark-mode {
  color: rgba(255, 255, 255, 0.85);
  background: rgba(0, 0, 0, 0.45);
  border-color: rgba(255, 255, 255, 0.08);
}
.model-name-tag.dark-mode .loader {
  border-color: rgba(255, 255, 255, 0.15);
  border-top-color: #3b82f6;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---------- 视图控制 ---------- */
.view-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(30, 30, 50, 0.55);
  backdrop-filter: blur(12px);
  padding: 6px 8px 8px 8px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  user-select: none;
  transition: background 0.3s, border-color 0.3s;
  min-width: 66px;
}
.view-controls.light-mode {
  background: rgba(220, 220, 240, 0.75);
  border-color: rgba(0, 0, 0, 0.08);
}
.view-controls .row {
  display: flex;
  gap: 3px;
  justify-content: center;
}
.view-controls button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  line-height: 1;
  padding: 0;
}
.view-controls.light-mode button {
  color: rgba(0, 0, 0, 0.75);
  background: rgba(0, 0, 0, 0.04);
}
.view-controls button:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: scale(1.05);
}
.view-controls.light-mode button:hover {
  background: rgba(0, 0, 0, 0.10);
}
.view-controls button.active {
  background: #3b82f6;
  color: #fff;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}
.view-controls.light-mode button.active {
  background: #3b82f6;
  color: #fff;
}
.view-controls .btn-iso {
  width: 36px;
  font-size: 9px;
}
.view-controls .view-label {
  font-size: 7px;
  color: rgba(255, 255, 255, 0.30);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 1px;
  text-align: center;
}
.view-controls.light-mode .view-label {
  color: rgba(0, 0, 0, 0.25);
}

/* ---------- 放大镜控制面板 ---------- */
.magnifier-controls {
  position: absolute;
  bottom: 90px;
  right: 20px;
  z-index: 40;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 12px 16px 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  color: #fff;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: opacity 0.3s;
  user-select: none;
}
.magnifier-controls .ctrl-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.magnifier-controls label {
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  min-width: 26px;
}
.magnifier-controls input[type="range"] {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.magnifier-controls input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.magnifier-controls input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #fff;
}
.magnifier-controls .value {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  min-width: 32px;
  text-align: right;
  font-family: monospace;
}
.magnifier-controls .ctrl-buttons {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  margin-top: 2px;
  flex-wrap: wrap;
}
.magnifier-controls .ctrl-buttons button {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 11px;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 500;
  font-family: inherit;
}
.magnifier-controls .ctrl-buttons button:hover {
  background: rgba(255, 255, 255, 0.18);
}
.magnifier-controls .ctrl-buttons button.active {
  background: #22c55e;
  color: #000;
}
.magnifier-controls .ctrl-buttons button.lock-active {
  background: #f59e0b;
  color: #000;
}

/* ---------- 主面板 ---------- */
.panel-wrapper {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  transform-origin: bottom right;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.panel-body {
  background: rgba(240, 240, 250, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 8px 12px 6px 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-wrap: wrap;
  gap: 4px 6px;
  align-items: center;
  justify-content: flex-end;
  max-width: 480px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: bottom right;
  opacity: 0;
  transform: scale(0.85) translateY(12px);
  pointer-events: none;
  visibility: hidden;
}
.panel-body.open {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: auto;
  visibility: visible;
}
.panel-body.dark {
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.08);
}
.panel-body.dark button,
.panel-body.dark .file-label {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}
.panel-body.dark button:hover,
.panel-body.dark .file-label:hover {
  background: rgba(255, 255, 255, 0.2);
}
.panel-body.dark button.active {
  background: #3b82f6;
  color: #fff;
}
.panel-body.dark .btn-group:not(:last-child)::after {
  color: rgba(255, 255, 255, 0.12);
}
.panel-body.dark .toggle-btn {
  background: rgba(30, 30, 50, 0.7);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.15);
}
.panel-body.dark .toggle-btn:hover {
  background: rgba(50, 50, 80, 0.8);
}
.panel-body .btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 3px 5px;
  align-items: center;
}
.panel-body .btn-group:not(:last-child)::after {
  content: '|';
  color: rgba(0, 0, 0, 0.15);
  margin: 0 3px;
  font-size: 14px;
  font-weight: 100;
}
.panel-body button,
.panel-body .file-label {
  background: rgba(0, 0, 0, 0.06);
  border: none;
  color: #1a1a2e;
  border-radius: 18px;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 500;
  font-family: inherit;
  text-decoration: none;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 6px 2px 6px;
  min-width: 40px;
  gap: 1px;
  line-height: 1.2;
  text-align: center;
}
.panel-body button:hover,
.panel-body .file-label:hover {
  background: rgba(0, 0, 0, 0.12);
}
.panel-body button.active {
  background: #3b82f6;
  color: #fff;
}
.panel-body button i,
.panel-body .file-label i {
  font-size: 15px;
  display: block;
}
.panel-body button span,
.panel-body .file-label span {
  font-size: 9px;
  opacity: 0.8;
  letter-spacing: 0.3px;
  display: block;
  line-height: 1.2;
  margin-top: 1px;
}
.panel-body .btn-group:first-child button {
  flex-direction: row;
  padding: 2px 8px;
  min-width: unset;
  gap: 0;
  font-size: 11px;
}
.panel-body .btn-group:first-child button span {
  display: none;
}
.panel-body .file-label {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.06);
  padding: 4px 6px 2px 6px;
}
.panel-body .file-label:hover {
  background: rgba(0, 0, 0, 0.12);
}
.panel-body .file-label input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  left: 0;
  top: 0;
}
.panel-body .theme-btn {
  min-width: 40px;
}
.toggle-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(220, 220, 240, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: #1a1a2e;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.1);
  user-select: none;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
  margin-left: 4px;
}
.toggle-btn:hover {
  transform: scale(1.1);
  background: rgba(240, 240, 255, 0.9);
}
.panel-wrapper .toggle-btn-standalone {
  display: flex;
}
.panel-wrapper .toggle-btn-standalone.hidden {
  display: none;
}
.panel-wrapper .toggle-btn-inside {
  display: none;
}
.panel-wrapper.open .toggle-btn-inside {
  display: flex;
}
.panel-wrapper.open .toggle-btn-standalone {
  display: none;
}

/* ---------- Lookbook ---------- */
.lookbook-section {
  margin-top: 30px;
  border-top: 2px dashed #e2e8f0;
  padding-top: 28px;
}
.lookbook-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.lookbook-header h2 {
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}
.lookbook-header h2 span {
  background: #e2e8f0;
  font-size: 14px;
  padding: 0 14px;
  border-radius: 40px;
  color: #334155;
  font-weight: 500;
}
.lookbook-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}
.lookbook-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f2f5;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.lookbook-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}
.lookbook-media-wrap {
  position: relative;
  width: 100%;
  background: #0f0f1a;
  overflow: hidden;
  cursor: pointer;
}
.lookbook-media-wrap img,
.lookbook-media-wrap video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.lookbook-item:hover .lookbook-media-wrap img {
  transform: scale(1.02);
}
.lookbook-item:hover .lookbook-media-wrap video {
  transform: scale(1.02);
}
.lookbook-media-wrap .ratio-badge {
  position: absolute;
  bottom: 10px;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 10px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  pointer-events: none;
  z-index: 2;
}
.lookbook-info {
  padding: 8px 18px 14px 18px;
}
.lookbook-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}
.lookbook-info p {
  font-size: 14px;
  color: #64748b;
  margin-top: 2px;
  line-height: 1.5;
}
.lookbook-info .tag {
  display: inline-block;
  margin-top: 6px;
  font-size: 11px;
  background: #eef2ff;
  color: #4f46e5;
  padding: 2px 12px;
  border-radius: 20px;
  font-weight: 500;
}

/* ---------- 响应式 ---------- */
@media (max-width: 760px) {
  .three-container {
    height: 420px;
  }
  .panel-body {
    padding: 6px 8px;
    gap: 3px 4px;
    max-width: 300px;
    border-radius: 16px;
  }
  .panel-body button,
  .panel-body .file-label {
    padding: 2px 4px 1px 4px;
    min-width: 32px;
  }
  .panel-body button i,
  .panel-body .file-label i {
    font-size: 13px;
  }
  .panel-body button span,
  .panel-body .file-label span {
    font-size: 8px;
  }
  .panel-body .btn-group:first-child button {
    font-size: 9px;
    padding: 1px 5px;
  }
  .toggle-btn {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }
  .model-name-tag {
    font-size: 11px;
    top: 10px;
    left: 12px;
    padding: 3px 12px;
  }
  .model-name-tag .loader {
    width: 14px;
    height: 14px;
  }
  .panel-wrapper {
    bottom: 14px;
    right: 14px;
  }
  .view-controls {
    top: 12px;
    right: 12px;
    padding: 4px 6px 6px 6px;
    min-width: 56px;
    border-radius: 12px;
  }
  .view-controls button {
    width: 26px;
    height: 26px;
    font-size: 9px;
    border-radius: 6px;
  }
  .view-controls .btn-iso {
    width: 30px;
    font-size: 8px;
  }
  .view-controls .view-label {
    font-size: 6px;
  }
  .view-controls .row {
    gap: 2px;
  }
  .lookbook-grid {
    gap: 18px;
    max-width: 100%;
  }
  .lookbook-info {
    padding: 6px 14px 12px 14px;
  }
  .lookbook-info h3 {
    font-size: 14px;
  }
  .lookbook-info p {
    font-size: 13px;
  }
  .lookbook-media-wrap .ratio-badge {
    font-size: 9px;
    bottom: 8px;
    right: 10px;
    padding: 1px 8px;
  }
  .magnifier-controls {
    bottom: 80px;
    right: 12px;
    padding: 10px 12px 12px 12px;
    min-width: 160px;
    gap: 5px;
  }
  .magnifier-controls label {
    font-size: 10px;
    min-width: 22px;
  }
  .magnifier-controls .value {
    font-size: 11px;
    min-width: 28px;
  }
  .magnifier-controls .ctrl-buttons button {
    font-size: 10px;
    padding: 2px 10px;
  }
}
@media (max-width: 480px) {
  .lookbook-item {
    border-radius: 12px;
  }
  .lookbook-info {
    padding: 4px 12px 10px 12px;
  }
  .lookbook-info h3 {
    font-size: 13px;
  }
  .lookbook-info p {
    font-size: 12px;
  }
  .lookbook-media-wrap .ratio-badge {
    font-size: 8px;
    bottom: 6px;
    right: 8px;
    padding: 1px 6px;
  }
  .magnifier-controls {
    bottom: 70px;
    right: 8px;
    padding: 8px 10px 10px 10px;
    min-width: 140px;
  }
  .magnifier-controls label {
    font-size: 9px;
    min-width: 18px;
  }
  .magnifier-controls .value {
    font-size: 10px;
    min-width: 24px;
  }
  .magnifier-controls .ctrl-buttons button {
    font-size: 9px;
    padding: 2px 8px;
  }
}
</style>