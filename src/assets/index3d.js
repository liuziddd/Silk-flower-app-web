import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// 添加fetch请求超时控制函数
function fetchWithTimeout(url, options = {}, timeout = 60000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`请求超时(${timeout / 1000}秒): ${url}`)), timeout)
        )
    ]);
}

// 监听父窗口的消息
window.addEventListener('message', (event) => {
    // 确保消息来源安全
    try {
        if (event.data && event.data.action === 'reloadModel') {
            console.log('接收到父窗口重新加载指令');
            // 全局loadModel函数将在DOMContentLoaded后定义
            if (typeof window.reloadModelFunction === 'function') {
                window.reloadModelFunction();
            }
        }
    } catch (e) {
        console.error('处理父窗口消息时出错:', e);
    }
});

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 主要变量定义
    let scene, camera, renderer, controls, mixer;
    let model = null;
    let clock = new THREE.Clock();
    let isAutoRotate = true;
    let animationMixers = [];
    let currentModelPath = '';
    let isLoading = false; // 添加加载状态标记

    // 获取API基础URL
    let apiBaseUrl = '';

    // 尝试从URL参数获取API基础URL
    try {
        const urlParams = new URLSearchParams(window.location.search);
        apiBaseUrl = urlParams.get('apiBaseUrl') || '';
        console.log('从URL参数获取的API基础URL:', apiBaseUrl);
    } catch (e) {
        console.error('获取URL参数失败:', e);
    }

    // 如果没有API基础URL，尝试从父窗口获取
    if (!apiBaseUrl) {
        try {
            if (window.parent && window.parent.apiBaseUrl) {
                apiBaseUrl = window.parent.apiBaseUrl;
                console.log('从父窗口获取的API基础URL:', apiBaseUrl);
            }
        } catch (e) {
            console.error('从父窗口获取API基础URL失败:', e);
        }
    }

    console.log('最终使用的API基础URL:', apiBaseUrl);

    // 获取DOM元素
    const container = document.getElementById('model-viewer');
    const loading = document.getElementById('loading');
    const rotateToggle = document.getElementById('rotate-toggle');
    const resetCamera = document.getElementById('reset-camera');
    const themeToggle = document.getElementById('theme-toggle');
    const fullscreenBtn = document.getElementById('fullscreen');

    // 初始化主题
    let isDarkTheme = true;
    try {
        // 检查父窗口的主题设置
        if (window.parent && window.parent.document) {
            isDarkTheme = window.parent.document.documentElement.classList.contains('dark');
            document.body.className = isDarkTheme ? 'dark' : 'light';
        }
    } catch (e) {
        console.log('无法访问父窗口主题设置，使用默认主题');
    }

    // 初始化场景
    initScene();

    // 加载模型 - 根据当前主题选择模型
    loadModel();

    // 开始渲染循环
    animate();

    // 导出重新加载函数到全局作用域，供消息监听器使用
    window.reloadModelFunction = loadModel;

    // 根据主题切换相应的模型文件
    function loadModel() {
        // 如果已经在加载中，则忽略重复请求
        if (isLoading) {
            console.log('模型已经在加载中，忽略重复请求');
            return;
        }

        isLoading = true;

        // 通知父窗口开始加载
        try {
            window.parent.postMessage({ action: 'modelLoadStarted' }, '*');
        } catch (e) {
            console.log('无法通知父窗口加载开始');
        }

        // 如果当前有模型，先移除
        if (model) {
            scene.remove(model);
            model = null;

            // 清理动画混合器
            animationMixers = [];
        }

        // 根据当前主题设置模型路径
        let modelName = '';
        if (isDarkTheme) {
            modelName = 'red.fbx'; // 暗色主题使用红色模型
        } else {
            modelName = 'pink.fbx'; // 亮色主题使用粉色模型
        }

        // 构建API路径
        const modelPath = `${apiBaseUrl}/api/3d/${modelName}`;

        // 打印完整的模型路径以进行调试
        console.log('完整模型路径:', modelPath);
        console.log('当前主题:', isDarkTheme ? 'dark' : 'light');

        // 如果模型路径没变，不重新加载
        if (modelPath === currentModelPath && model) {
            isLoading = false;
            return;
        }

        currentModelPath = modelPath;

        // 显示加载提示
        loading.classList.remove('hidden');

        // 检测文件扩展名以确定使用哪个加载器
        const fileExtension = modelName.split('.').pop().toLowerCase();
        console.log('尝试加载模型:', modelPath, '文件类型:', fileExtension);

        // 使用带超时的fetch (60秒超时)
        fetchWithTimeout(modelPath, {}, 60000)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`模型文件不存在 (${response.status}): ${modelPath}`);
                }
                console.log('文件存在检查 - 通过:', modelPath);
                loadModelWithPath(modelPath, fileExtension);

                // 通知父窗口请求成功
                try {
                    window.parent.postMessage({ action: 'modelRequestSuccess' }, '*');
                } catch (e) {
                    console.log('无法通知父窗口请求成功');
                }
            })
            .catch(error => {
                console.error('文件存在检查 - 失败:', error);
                showLoadingError(`无法访问文件: ${error.message}`);

                // 通知父窗口加载失败
                try {
                    window.parent.postMessage({
                        action: 'modelLoadFailed',
                        error: error.message,
                        modelPath: modelPath
                    }, '*');
                } catch (e) {
                    console.log('无法通知父窗口加载失败');
                }

                isLoading = false;
            });
    }

    // 使用给定路径加载模型的实际函数
    function loadModelWithPath(path, fileExtension) {
        // 初始化进度条
        const progressFill = document.getElementById('progress-fill');
        const loadingMessage = document.querySelector('.loading-container .message');
        const loadingMessageSmall = document.querySelector('.loading-container .message-small');

        // 重置进度条
        progressFill.style.width = '0%';

        // 显示加载提示
        loading.classList.remove('hidden');

        // 加载管理器用于跟踪整体加载进度
        const loadingManager = new THREE.LoadingManager();

        // 加载进度回调
        loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
            const percent = Math.round((itemsLoaded / itemsTotal) * 100);
            console.log(`总体加载进度: ${percent}%`);
            progressFill.style.width = `${percent}%`;
            loadingMessage.textContent = `加载3D模型... ${percent}%`;

            // 发送加载进度到父窗口
            try {
                window.parent.postMessage({
                    action: 'modelLoadProgress',
                    percent: percent
                }, '*');
            } catch (e) { }
        };

        // 加载错误回调
        loadingManager.onError = function (url) {
            console.error('加载资源失败:', url);
            showLoadingError(`无法加载: ${url.split('/').pop()}`);
            isLoading = false;
        };

        // 所有资源加载完成
        loadingManager.onLoad = function () {
            console.log('所有资源加载完成');
            if (model) {
                // 加载成功，隐藏加载提示
                setTimeout(() => {
                    loading.classList.add('hidden');
                    isLoading = false;

                    // 通知父窗口加载完成
                    try {
                        window.parent.postMessage({
                            action: 'modelLoadSuccess'
                        }, '*');
                    } catch (e) {
                        console.log('无法通知父窗口加载完成');
                    }
                }, 500); // 延迟隐藏，让进度条动画完成
            } else {
                isLoading = false;
            }
        };

        if (fileExtension === 'fbx') {
            // 使用FBX加载器
            const loader = new FBXLoader(loadingManager);

            // 显示加载提示
            loadingMessage.textContent = '正在加载FBX模型...';
            loadingMessageSmall.textContent = 'FBX模型较大，可能需要一些时间，请耐心等待';

            loader.load(
                path,
                (fbxModel) => {
                    console.log('FBX模型加载成功:', path);
                    console.log('模型几何体数量:', countMeshes(fbxModel));

                    // 给模型添加环境光遮蔽效果(AO)
                    enhanceFBXModel(fbxModel);

                    handleLoadedModel(fbxModel);
                },
                (xhr) => {
                    // 加载进度
                    if (!xhr.lengthComputable) return;
                    const percent = Math.round(xhr.loaded / xhr.total * 100);
                    console.log(`模型加载进度: ${percent}% (${formatFileSize(xhr.loaded)} / ${formatFileSize(xhr.total)})`);

                    // 更新进度条
                    progressFill.style.width = `${percent}%`;
                    loadingMessage.textContent = `加载FBX模型... ${percent}%`;
                    loadingMessageSmall.textContent = `已加载 ${formatFileSize(xhr.loaded)} / ${formatFileSize(xhr.total)}`;

                    // 发送详细加载进度到父窗口
                    try {
                        window.parent.postMessage({
                            action: 'modelLoadDetailProgress',
                            percent: percent,
                            loaded: formatFileSize(xhr.loaded),
                            total: formatFileSize(xhr.total)
                        }, '*');
                    } catch (e) { }
                },
                (error) => {
                    // 加载错误
                    console.error('FBX加载错误:', error);
                    console.error('尝试的文件路径:', path);
                    showLoadingError(`FBX加载错误: ${error.message || '未知错误'}`);
                    isLoading = false;
                }
            );
        } else if (fileExtension === 'glb' || fileExtension === 'gltf') {
            // 使用GLTF加载器
            const loader = new GLTFLoader(loadingManager);

            // 添加Draco解压支持
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
            loader.setDRACOLoader(dracoLoader);

            // 显示加载提示
            loadingMessage.textContent = '正在加载GLB/GLTF模型...';

            loader.load(
                path,
                (gltf) => {
                    handleLoadedModel(gltf.scene);
                },
                (xhr) => {
                    if (!xhr.lengthComputable) return;
                    const percent = Math.round(xhr.loaded / xhr.total * 100);
                    console.log(`GLTF模型加载进度: ${percent}%`);

                    // 更新进度条
                    progressFill.style.width = `${percent}%`;
                    loadingMessage.textContent = `加载GLB/GLTF模型... ${percent}%`;
                    loadingMessageSmall.textContent = `已加载 ${formatFileSize(xhr.loaded)} / ${formatFileSize(xhr.total)}`;
                },
                (error) => {
                    console.error('GLTF加载错误:', error);
                    showLoadingError(`GLTF加载错误: ${error.message || '未知错误'}`);
                }
            );
        } else if (fileExtension === 'obj') {
            // 使用OBJ加载器
            const loader = new OBJLoader(loadingManager);

            // 显示加载提示
            loadingMessage.textContent = '正在加载OBJ模型...';

            loader.load(
                path,
                (objModel) => {
                    handleLoadedModel(objModel);
                },
                (xhr) => {
                    if (!xhr.lengthComputable) return;
                    const percent = Math.round(xhr.loaded / xhr.total * 100);
                    console.log(`OBJ模型加载进度: ${percent}%`);

                    // 更新进度条
                    progressFill.style.width = `${percent}%`;
                    loadingMessage.textContent = `加载OBJ模型... ${percent}%`;
                },
                (error) => {
                    console.error('OBJ加载错误:', error);
                    showLoadingError(`OBJ加载错误: ${error.message || '未知错误'}`);
                }
            );
        } else {
            console.error('不支持的文件格式:', fileExtension);
            showLoadingError('不支持的文件格式: ' + fileExtension);
        }
    }

    // 增强FBX模型的材质和光照效果
    function enhanceFBXModel(fbxModel) {
        // 计算顶点法线（如果模型没有）
        fbxModel.traverse(function (child) {
            if (child.isMesh) {
                if (!child.geometry.attributes.normal) {
                    console.log('为网格计算法线:', child.name);
                    child.geometry.computeVertexNormals();
                }
            }
        });
    }

    // 计算模型中的网格数量
    function countMeshes(model) {
        let count = 0;
        model.traverse(function (child) {
            if (child.isMesh) count++;
        });
        return count;
    }

    // 格式化文件大小为人类可读形式
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
        else return (bytes / 1073741824).toFixed(2) + ' GB';
    }

    // 处理已加载的模型
    function handleLoadedModel(loadedModel) {
        model = loadedModel;

        // 设置模型位置和比例
        // 根据模型尺寸自动缩放，但比原来放大1.5倍
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = (1 / maxDim) * 1.5; // 增加模型缩放系数
        model.scale.set(scale, scale, scale);

        // 居中模型
        box.setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        // 遍历模型的所有子对象，应用材质设置
        model.traverse(function (child) {
            if (child.isMesh) {
                console.log('处理模型网格:', child.name);

                // 确保材质正确设置
                if (child.material) {
                    // 如果材质是数组
                    if (Array.isArray(child.material)) {
                        child.material.forEach((mat, index) => {
                            console.log(`处理材质数组[${index}]:`, mat);
                            setupMaterial(mat);
                        });
                    } else {
                        // 单个材质
                        console.log('处理单个材质:', child.material);
                        setupMaterial(child.material);
                    }
                }

                // 启用阴影
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // 处理FBX动画
        if (model.animations && model.animations.length > 0) {
            console.log('模型包含动画:', model.animations.length);
            mixer = new THREE.AnimationMixer(model);
            animationMixers.push(mixer);

            // 播放所有动画
            model.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        }

        // 添加到场景
        scene.add(model);

        // 调整相机以更好地查看模型
        adjustCameraToModel();
    }

    // 设置材质属性，增强渲染效果
    function setupMaterial(material) {
        if (!material) return;

        // 确保材质使用正确的颜色空间
        if (material.map) {
            material.map.colorSpace = THREE.SRGBColorSpace;

            // 性能优化：降低纹理分辨率
            if (material.map.image && (material.map.image.width > 1024 || material.map.image.height > 1024)) {
                console.log('优化纹理大小:', material.map.image.width, 'x', material.map.image.height);

                // 使用mipmap并降低各向异性级别以提高性能
                material.map.generateMipmaps = true;
                material.map.minFilter = THREE.LinearMipMapLinearFilter;
                material.map.anisotropy = 1;
            }
        }

        // 增强材质效果
        material.needsUpdate = true;

        if (!isDarkTheme) {
            // 亮色主题下特别提高材质亮度

            // 降低粗糙度，提高光泽
            material.roughness = material.roughness !== undefined ? Math.max(material.roughness * 0.5, 0.1) : 0.2;
            material.metalness = material.metalness !== undefined ? Math.min(material.metalness * 1.5, 0.9) : 0.7;

            // 提高发光强度
            material.emissiveIntensity = material.emissiveIntensity || 0.8;

            // 如果有发光颜色，增强它
            if (material.emissive && material.emissive.isColor) {
                // 增强发光强度
                material.emissiveIntensity *= 2.5;
            }

            // 特别增强粉色模型的颜色亮度
            if (material.color) {
                const color = material.color.getHSL({ h: 0, s: 0, l: 0 });
                // 大幅增加亮度，略微减少饱和度使颜色看起来更亮
                material.color.setHSL(color.h, Math.min(color.s * 0.85, 1.0), Math.min(color.l * 2.0, 1.0));
            }
        } else {
            // 暗色主题处理（保持现有设置）
            material.roughness = material.roughness !== undefined ? Math.max(material.roughness * 0.8, 0.3) : 0.4;
            material.metalness = material.metalness !== undefined ? Math.min(material.metalness * 1.2, 0.7) : 0.5;
            material.emissiveIntensity = material.emissiveIntensity || 0.5;

            if (material.color) {
                const color = material.color.getHSL({ h: 0, s: 0, l: 0 });
                material.color.setHSL(color.h, color.s, Math.min(color.l * 1.4, 0.9));
            }
        }

        // 性能优化：禁用不必要的昂贵特性
        material.flatShading = false; // 使用平滑着色
        material.wireframe = false;

        // 如果不需要透明效果，关闭以提高性能
        if (material.opacity >= 0.98) {
            material.transparent = false;
            material.opacity = 1.0;
        }

        // 性能优化：降低光线反射计算开销
        if (!isDarkTheme) {
            // 亮色主题使用简化的光照计算
            material.envMapIntensity = material.envMapIntensity || 0.8;
        } else {
            // 暗色主题保留更详细的光照
            material.envMapIntensity = material.envMapIntensity || 0.5;
        }
    }

    // 调整相机以更好地查看模型
    function adjustCameraToModel() {
        if (!model) return;

        // 计算模型边界框
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // 计算合适的相机距离
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraDistance = maxDim / (2 * Math.tan(fov / 2));

        // 添加一些额外距离以确保完全可见，但比原来更近一些
        cameraDistance *= 1.2;

        // 设置相机位置
        camera.position.set(0, 0, cameraDistance);

        // 设置控制器目标点为模型中心
        controls.target.copy(center);

        // 更新控制器
        controls.update();
    }

    // 初始化Three.js场景
    function initScene() {
        // 创建场景
        scene = new THREE.Scene();

        // 设置背景色为透明
        scene.background = null;

        // 创建相机
        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 4);

        // 创建渲染器
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            logarithmicDepthBuffer: true, // 提高深度精度，避免z-fighting
            powerPreference: 'high-performance' // 尽量使用高性能GPU
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比以提高性能
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping; // 使用ACES色调映射提高动态范围
        renderer.toneMappingExposure = isDarkTheme ? 1.5 : 2.0; // 亮色主题下使用更高曝光度
        renderer.setClearColor(0x000000, 0); // 透明背景
        container.appendChild(renderer.domElement);

        // 创建轨道控制器
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = true;
        controls.autoRotate = isAutoRotate;
        controls.autoRotateSpeed = isDarkTheme ? 1.0 : 1.2; // 亮色主题下稍快的旋转速度
        controls.minDistance = 0.5; // 限制相机最小距离
        controls.maxDistance = 10;  // 限制相机最大距离

        // 创建光照环境
        setupLighting();

        // 监听主题变化，更新光照
        document.body.addEventListener('classchange', updateLightingForTheme);

        // 响应窗口大小变化
        window.addEventListener('resize', onWindowResize);
    }

    // 单独的光照设置函数，便于主题切换时更新
    function setupLighting() {
        // 清除现有灯光
        scene.children.forEach(child => {
            if (child.isLight) scene.remove(child);
        });

        // 灯光强度根据主题调整
        const lightIntensity = isDarkTheme ? 1.0 : 1.5;
        const ambientIntensity = isDarkTheme ? 0.8 : 1.2;

        // 环境光 - 柔和全局光照
        const ambientLight = new THREE.AmbientLight(
            isDarkTheme ? 0xffffff : 0xfff6fa, // 亮色主题下略带粉色的环境光
            ambientIntensity
        );
        scene.add(ambientLight);

        // 定向光 - 模拟太阳光
        const directionalLight = new THREE.DirectionalLight(
            isDarkTheme ? 0xffffff : 0xfff0f5, // 亮色主题下柔和粉色调光源
            lightIntensity * 1.2
        );
        directionalLight.position.set(1, 1, 1);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        directionalLight.shadow.bias = -0.0001;
        directionalLight.shadow.normalBias = 0.02; // 添加法线偏移以改善阴影质量
        scene.add(directionalLight);

        // 添加反光 - 从另一侧照亮物体
        const fillLight = new THREE.DirectionalLight(
            isDarkTheme ? 0xffffff : 0xffe4e1, // 粉红色调填充光
            lightIntensity * 0.8
        );
        fillLight.position.set(-1, 0.5, -1);
        scene.add(fillLight);

        // 添加底部光源 - 让模型底部也能被照亮
        const bottomLight = new THREE.DirectionalLight(
            isDarkTheme ? 0xffffff : 0xfffafa, // 雪白色底部光
            lightIntensity * 0.6
        );
        bottomLight.position.set(0, -1, 0);
        scene.add(bottomLight);

        // 添加顶部补充光源 - 进一步增亮模型
        const topLight = new THREE.DirectionalLight(
            isDarkTheme ? 0xffffff : 0xfff0f5, // 柔和粉色顶部光
            lightIntensity * 0.7
        );
        topLight.position.set(0, 3, 0);
        scene.add(topLight);

        // 亮色主题下添加额外的光源以增强高光效果
        if (!isDarkTheme) {
            // 添加聚光灯突出显示模型
            const spotLight = new THREE.SpotLight(0xfff0f5, 0.8);
            spotLight.position.set(2, 2, 2);
            spotLight.angle = Math.PI / 6;
            spotLight.penumbra = 0.3;
            spotLight.decay = 1.5;
            spotLight.distance = 10;
            scene.add(spotLight);

            // 添加额外侧光以增强轮廓
            const rimLight = new THREE.DirectionalLight(0xffe4e1, 0.4);
            rimLight.position.set(-2, 1, -1);
            scene.add(rimLight);
        }
    }

    // 主题变化时更新光照
    function updateLightingForTheme() {
        // 更新渲染器设置
        renderer.toneMappingExposure = isDarkTheme ? 1.5 : 2.0;

        // 更新光照系统
        setupLighting();
    }

    // 窗口大小变化处理
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);

        // 更新控制器
        controls.update();

        // 更新动画混合器
        const delta = clock.getDelta();
        for (const mixer of animationMixers) {
            mixer.update(delta);
        }

        // 渲染场景
        renderer.render(scene, camera);
    }

    // 显示加载错误
    function showLoadingError(message = '模型加载失败') {
        const progressFill = document.getElementById('progress-fill');
        const loadingMessage = document.querySelector('.loading-container .message');
        const loadingMessageSmall = document.querySelector('.loading-container .message-small');
        const loadingContent = document.querySelector('.loading-container .loading-content');
        const spinner = document.querySelector('.loading-container .spinner');

        // 停止加载动画
        spinner.style.animation = 'none';
        // 红色进度条表示错误
        progressFill.style.width = '100%';
        progressFill.style.backgroundColor = '#ff4d4d';
        // 设置错误信息
        loadingMessage.innerHTML = `<span style="color:#ff4d4d">⚠️ ${message}</span>`;
        loadingMessageSmall.textContent = '请确保后端API服务已启动，3D模型文件存在且格式正确';
        // 添加重试按钮
        if (!document.getElementById('retry-button')) {
            const retryButton = document.createElement('button');
            retryButton.id = 'retry-button';
            retryButton.textContent = '重试加载';
            retryButton.style.marginTop = '15px';
            retryButton.style.padding = '8px 16px';
            retryButton.style.borderRadius = '4px';
            retryButton.style.border = 'none';
            retryButton.style.backgroundColor = isDarkTheme ? 'var(--dark-accent)' : 'var(--light-accent)';
            retryButton.style.color = isDarkTheme ? 'black' : 'white';
            retryButton.style.fontWeight = 'bold';
            retryButton.style.cursor = 'pointer';
            retryButton.onclick = () => {
                // 移除重试按钮
                retryButton.remove();
                // 恢复动画
                spinner.style.animation = 'spin 1s linear infinite';
                // 重置进度条
                progressFill.style.width = '0%';
                progressFill.style.backgroundColor = '';
                // 重新加载模型
                loadModel();
            };
            loadingContent.appendChild(retryButton);
        }

        // 添加API诊断信息
        if (!document.getElementById('api-debug-info')) {
            const debugInfo = document.createElement('div');
            debugInfo.id = 'api-debug-info';
            debugInfo.style.marginTop = '15px';
            debugInfo.style.padding = '10px';
            debugInfo.style.backgroundColor = 'rgba(0,0,0,0.2)';
            debugInfo.style.borderRadius = '4px';
            debugInfo.style.fontSize = '12px';
            debugInfo.style.textAlign = 'left';
            debugInfo.innerHTML = `
                <p style="margin:0 0 5px 0;font-weight:bold;">诊断信息:</p>
                <ul style="margin:0;padding-left:20px;list-style:disc;">
                    <li>API基础URL: ${apiBaseUrl || '未设置'}</li>
                    <li>当前主题: ${isDarkTheme ? '暗色 (red.fbx)' : '亮色 (pink.fbx)'}</li>
                    <li>请求路径: ${currentModelPath || '未知'}</li>
                    <li>请求时间: ${new Date().toLocaleString()}</li>
                </ul>
                <p style="margin:5px 0 0 0;font-style:italic;">提示: 请检查后端API是否已启动，并且配置了正确的CORS设置</p>
            `;
            loadingContent.appendChild(debugInfo);
        }

        // 显示错误信息
        loading.classList.remove('hidden');

        // 记录到控制台
        console.error('模型加载错误:', message);
        console.error('当前API路径:', apiBaseUrl);
        console.error('当前模型路径:', currentModelPath);

        // 通知父窗口显示的具体错误
        try {
            window.parent.postMessage({
                action: 'modelLoadError',
                message: message,
                apiBaseUrl: apiBaseUrl,
                modelPath: currentModelPath
            }, '*');
        } catch (e) {
            console.log('无法通知父窗口错误详情');
        }
    }

    // 自动旋转切换
    rotateToggle.addEventListener('click', () => {
        controls.autoRotate = !controls.autoRotate;
        isAutoRotate = controls.autoRotate;

        rotateToggle.style.background = controls.autoRotate
            ? (document.body.classList.contains('light') ? 'var(--light-accent)' : 'var(--dark-accent)')
            : '';
        rotateToggle.style.color = controls.autoRotate
            ? (document.body.classList.contains('light') ? 'white' : 'black')
            : '';
    });

    // 重置相机
    resetCamera.addEventListener('click', () => {
        camera.position.set(0, 0, 5);
        controls.target.set(0, 0, 0);
        controls.update();
    });

    // 主题切换
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        document.body.classList.toggle('dark');
        isDarkTheme = document.body.classList.contains('dark');

        // 切换模型
        loadModel();

        // 更新旋转按钮样式
        if (controls.autoRotate) {
            rotateToggle.style.background = document.body.classList.contains('light')
                ? 'var(--light-accent)'
                : 'var(--dark-accent)';
            rotateToggle.style.color = document.body.classList.contains('light') ? 'white' : 'black';
        }

        // 尝试与父窗口同步主题
        try {
            if (window.parent && window.parent.document) {
                const isDark = document.body.classList.contains('dark');
                // 触发父窗口的主题切换
                const parentThemeSwitcher = window.parent.document.querySelector('button[title="切换主题"]');
                if (parentThemeSwitcher &&
                    ((isDark && !window.parent.document.documentElement.classList.contains('dark')) ||
                        (!isDark && window.parent.document.documentElement.classList.contains('dark')))) {
                    parentThemeSwitcher.click();
                }
            }
        } catch (e) {
            console.log('无法同步父窗口主题');
        }
    });

    // 全屏功能
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
        if (e.key === 'r' || e.key === 'R') {
            resetCamera.click();
        }
        if (e.key === 't' || e.key === 'T') {
            themeToggle.click();
        }
        if (e.key === ' ') { // 空格键
            rotateToggle.click();
        }
    });

    // 全屏切换函数
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`无法进入全屏模式: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // 监听父窗口的主题变化 (通过轮询)
    if (window.parent) {
        setInterval(() => {
            try {
                const parentIsDark = window.parent.document.documentElement.classList.contains('dark');
                const iframeIsDark = document.body.classList.contains('dark');

                if (parentIsDark !== iframeIsDark) {
                    document.body.className = parentIsDark ? 'dark' : 'light';
                    isDarkTheme = parentIsDark;

                    // 切换模型
                    loadModel();

                    // 更新旋转按钮样式
                    if (controls.autoRotate) {
                        rotateToggle.style.background = parentIsDark
                            ? 'var(--dark-accent)'
                            : 'var(--light-accent)';
                        rotateToggle.style.color = parentIsDark ? 'black' : 'white';
                    }
                }
            } catch (e) {
                // 忽略跨域错误
            }
        }, 1000);
    }
}); 