<template>
  <div class="w-full overflow-hidden bg-zinc-900" :class="{'dark': isDarkMode, 'light': !isDarkMode}">
    <!-- 固定导航栏 -->
    <nav class="fixed top-0 left-0 right-0 z-50 w-full shadow-lg">
      <div class="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4">
        <div class="flex items-center w-full md:w-auto justify-between">
          <div class="flex items-center">
            <span class="text-xl font-bold gradient-heading">🌸花小绢·绢花品牌</span>
            <span class="hidden md:inline text-sm text-gray-400 font-bold ml-2">(DESIGNED BY LIUYOUXU)</span>
          </div>
          <div class="flex items-center md:hidden">
            <button @click="toggleTheme" class="ml-2 p-1 rounded-full transition-all duration-300 hover:bg-zinc-800 focus:outline-none" title="切换主题">
              <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 桌面菜单 -->
        <ul class="hidden md:flex space-x-6">
          <li>
            <a
              href="#"
              :class="{ 'font-bold theme-brand-gradient': isHomePage, 'transition hover:text-blue-400': !isHomePage }"
              @click="
                isHomePage = true;
                isProductPage = false;
                isCommunityPage = false;
                isCustomPage = false;
                isVRPage = false;
              "
            >
              首页
            </a>
          </li>
          <li>
            <a
              href="#product-section"
              :class="{ 'font-bold theme-brand-gradient': isProductPage, 'transition hover:text-blue-400': !isProductPage }"
              @click="
                isHomePage = false;
                isProductPage = true;
                isCommunityPage = false;
                isCustomPage = false;
                isVRPage = false;
              "
            >
              产品
            </a>
          </li>
          <li>
            <a
              href="#community-section"
              :class="{ 'font-bold theme-brand-gradient': isCommunityPage, 'transition hover:text-blue-400': !isCommunityPage }"
              @click="
                isHomePage = false;
                isProductPage = false;
                isCommunityPage = true;
                isCustomPage = false;
                isVRPage = false;
              "
            >
              社区
            </a>
          </li>
          <li>
            <a
              href="#"
              :class="{ 'font-bold theme-brand-gradient': isCustomPage, 'transition hover:text-blue-400': !isCustomPage }"
              @click="
                isHomePage = false;
                isProductPage = false;
                isCommunityPage = false;
                isCustomPage = true;
                isVRPage = false;
              "
            >
              AI定制
            </a>
          </li>
          <li>
            <a
              href="#vr-section"
              :class="{ 'font-bold theme-brand-gradient': isVRPage, 'transition hover:text-blue-400': !isVRPage }"
              @click="
                isHomePage = false;
                isProductPage = false;
                isCommunityPage = false;
                isCustomPage = false;
                isVRPage = true;
              "
            >
              3D模型
            </a>
          </li>
          <li>
            <button @click="toggleTheme" class="p-1 rounded-full transition-all duration-300 hover:bg-zinc-800 focus:outline-none" title="切换主题">
              <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </li>
        </ul>
        
        <!-- 移动菜单 -->
        <div v-if="mobileMenuOpen" class="absolute top-full left-0 w-full bg-zinc-900 shadow-lg md:hidden py-2">
          <ul class="flex flex-col space-y-2 px-4">
            <li class="py-2 border-b border-zinc-700">
              <a
                href="#"
                :class="{ 'font-bold theme-brand-gradient': isHomePage, 'transition hover:text-blue-400': !isHomePage }"
                @click="
                  isHomePage = true;
                  isProductPage = false;
                  isCommunityPage = false;
                  isCustomPage = false;
                  isVRPage = false;
                  mobileMenuOpen = false;
                "
              >
                首页
              </a>
            </li>
            <li class="py-2 border-b border-zinc-700">
              <a
                href="#product-section"
                :class="{ 'font-bold theme-brand-gradient': isProductPage, 'transition hover:text-blue-400': !isProductPage }"
                @click="
                  isHomePage = false;
                  isProductPage = true;
                  isCommunityPage = false;
                  isCustomPage = false;
                  isVRPage = false;
                  mobileMenuOpen = false;
                "
              >
                产品
              </a>
            </li>
            <li class="py-2 border-b border-zinc-700">
              <a
                href="#community-section"
                :class="{ 'font-bold theme-brand-gradient': isCommunityPage, 'transition hover:text-blue-400': !isCommunityPage }"
                @click="
                  isHomePage = false;
                  isProductPage = false;
                  isCommunityPage = true;
                  isCustomPage = false;
                  isVRPage = false;
                  mobileMenuOpen = false;
                "
              >
                社区
              </a>
            </li>
            <li class="py-2 border-b border-zinc-700">
              <a
                href="#"
                :class="{ 'font-bold theme-brand-gradient': isCustomPage, 'transition hover:text-blue-400': !isCustomPage }"
                @click="
                  isHomePage = false;
                  isProductPage = false;
                  isCommunityPage = false;
                  isCustomPage = true;
                  isVRPage = false;
                  mobileMenuOpen = false;
                "
              >
                AI定制
              </a>
            </li>
            <li class="py-2">
              <a
                href="#vr-section"
                :class="{ 'font-bold theme-brand-gradient': isVRPage, 'transition hover:text-blue-400': !isVRPage }"
                @click="
                  isHomePage = false;
                  isProductPage = false;
                  isCommunityPage = false;
                  isCustomPage = false;
                  isVRPage = true;
                  mobileMenuOpen = false;
                "
              >
                3D模型
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- 主区域 -->
<section
  class="flex flex-col items-stretch w-full min-h-screen pt-16 md:pt-0 mt-0 md:flex-row theme-gradient-bg"
  v-if="isHomePage"
>
  <div
    class="w-full h-64 md:h-auto bg-center bg-cover md:w-1/2"
    :style="{ 'background-image': isDarkMode ? 'url(\'/images/首页1.jpg\')' : 'url(\'/images/首页2.jpeg\')' }"
  ></div>
  <div
    class="flex flex-col justify-center w-full px-6 py-8 md:w-1/2 md:px-16 md:py-16"
  >
    <h1 class="mb-4 text-4xl md:text-6xl font-bold gradient-heading">绢语·华彩</h1>
    <p class="mb-4 md:mb-8 text-xl md:text-2xl font-bold">
      融合传统工艺与现代设计，探索你的专属之美
    </p>
    <p class="mb-6 md:mb-8 text-sm text-left font-microsoftYaHei">
      <div
        class="relative block p-3 md:p-4 transition-all rounded-lg shadow-lg cursor-pointer hover:scale-105 group"
        :style="{ background: 'var(--beijinghua-gradient-card)' }"
        @click="openMuseumWindow"
      >
        <span class="transition-colors text-sm md:text-base group-hover:text-black pb-6 block">
          绢花工艺，作为中国传统工艺之一，经过千年的传承与创新，融合了细腻的手工技巧和丰富的文化内涵。每一朵绢花都凝聚了艺术家的心血与创意，不仅是美的象征，更承载着深厚的文化底蕴。<br />
          绢花的制作工艺源远流长，早在汉代便已萌芽，而到了唐宋时期，绢花工艺达到了顶峰。如今，绢花不仅用于装饰，也常被用于礼仪场合、婚礼和传统节庆中，象征着美好与祝福。每一朵绢花都是匠人们辛勤创作的结晶，它们通过精湛的技艺将丝绸的柔美与自然的生命力巧妙结合，展现了工艺与艺术的完美融合。
        </span>
        <div class="absolute bottom-2 right-2 left-2 flex justify-end mt-4">
          <span class="text-xs theme-gold bg-opacity-0">
            点击跳转至中国非遗数字博物馆绢花页面
          </span>
        </div>
      </div>
    </p>
    <button
      class="theme-btn px-6 py-3 text-lg md:text-xl font-bold transition-all transform rounded-full shadow-lg font-microsoftYaHei hover:scale-110 hover:shadow-2xl"
      @click="
        isHomePage = false;
        isProductPage = true;
      "
    >
      立即探索
    </button>
  </div>
</section>

    <!-- 产品区 -->
    <section
      id="product-section"
      class="flex flex-col items-stretch w-full py-12 md:py-20 pt-20 theme-gradient-bg"
      v-if="isProductPage"
    >
      <div class="flex flex-col justify-center w-full px-6 md:px-12">
        <h2 class="mb-4 text-3xl md:text-4xl font-bold gradient-heading">绢花工艺</h2>
        <p class="text-base md:text-lg">
          绢花工艺源于千年历史，结合现代设计，为您带来前所未有的美感体验。
        </p>
        <!-- 修改后的按钮容器 -->
        <div class="flex flex-wrap justify-center w-full mt-6 space-y-4 md:space-y-0 space-x-0 md:space-x-6">
          <a
            href="https://shop.jd.com/your-shop-id.html"
            target="_blank"
            class="theme-btn w-full md:w-auto px-6 py-3 text-lg md:text-xl font-bold transition-all transform rounded-full shadow-lg hover:scale-110 hover:shadow-2xl mb-4 md:mb-0"
            style="border-radius: 25px"
          >
            查看京东店铺
          </a>
          <a
            href="https://shop.taobao.com/your-shop-id.html"
            target="_blank"
            class="theme-btn w-full md:w-auto px-6 py-3 text-lg md:text-xl font-bold transition-all transform rounded-full shadow-lg hover:scale-110 hover:shadow-2xl"
            style="border-radius: 25px"
          >
            查看淘宝店铺
          </a>
        </div>
      </div>
      <!-- 修改后的产品展示容器 - 使用单一数组 -->
      <div
        class="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 px-4 md:px-8 mt-8"
      >
        <a
          v-for="(product, idx) in allProducts"
          :key="idx"
          :href="product.link"
          target="_blank"
          class="p-2 transition-transform shadow-lg cursor-pointer rounded-xl hover:scale-105 product-card"
        >
          <img :src="product.image" class="w-full object-cover h-36 md:h-auto mb-4 rounded-lg" />
          <h3 class="font-semibold theme-gold">{{ product.name }}</h3>
          <p class="text-sm text-gray-300">{{ product.description }}</p>
        </a>
      </div>
    </section>
    <!-- 社区区 -->
    <section
      id="community-section"
      class="w-full py-12 md:py-16 pt-20 theme-gradient-bg"
      v-if="isCommunityPage"
    >
      <div class="max-w-6xl px-4 mx-auto">
        <div class="mb-8 md:mb-10 text-center">
          <h2 class="mb-3 text-3xl md:text-4xl font-bold gradient-heading">加入我们的社区</h2>
          <p class="mb-4 text-base md:text-lg">
            在这里，您可以分享您的绢花创意，与其他爱好者交流。
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 左侧：论坛讨论区 -->
          <div class="p-4 md:p-6 rounded-lg bg-zinc-800 bg-opacity-60">
            <h3 class="mb-4 text-xl md:text-2xl font-bold text-center theme-gold">
              绢花爱好者论坛
            </h3>
            <div
              class="h-64 md:h-[500px] overflow-y-auto border border-zinc-600 rounded-lg forumHeight"
            >
              <!-- 论坛内容模拟 -->
              <div class="p-4">
                <div class="mb-6 pb-4 border-b border-zinc-700">
                  <div class="flex items-center mb-2">
                    <div
                      class="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white mr-2"
                    >
                      L
                    </div>
                    <span class="font-semibold">李小花</span>
                    <span class="ml-2 text-xs text-gray-400">3小时前</span>
                  </div>
                  <p>
                    最近尝试了古风绢花发簪的制作，大家有什么好的建议吗？
                  </p>
                  <div class="mt-2 flex items-center">
                    <button class="mr-4 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      24
                    </button>
                    <button class="text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      8
                    </button>
                  </div>
                </div>
                <!-- 更多论坛帖子... 省略其他类似结构 -->
              </div>
            </div>
            <div class="mt-4 text-center">
              <button
                class="px-6 py-2 text-white bg-amber-600 rounded hover:bg-amber-500 transition"
              >
                查看更多讨论
              </button>
            </div>
          </div>

          <!-- 右侧：作品展示区 -->
          <div class="p-4 md:p-6 rounded-lg bg-zinc-800 bg-opacity-60">
            <h3 class="mb-4 text-xl md:text-2xl font-bold text-center theme-gold">
              社区作品展示
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="aspect-square overflow-hidden rounded-lg">
                <img
                  src="/images/r7jkpul05mdl_0.jpg"
                  class="w-full h-full object-cover transition hover:scale-110"
                  alt="社区作品"
                />
              </div>
              <div class="aspect-square overflow-hidden rounded-lg">
                <img
                  src="/images/ear-drop.jpg"
                  class="w-full h-full object-cover transition hover:scale-110"
                  alt="社区作品"
                />
              </div>
              <div class="aspect-square overflow-hidden rounded-lg">
                <img
                  src="/images/bracelet-new.jpg"
                  class="w-full h-full object-cover transition hover:scale-110"
                  alt="社区作品"
                />
              </div>
              <div class="aspect-square overflow-hidden rounded-lg">
                <img
                  src="/images/brooch-new.jpg"
                  class="w-full h-full object-cover transition hover:scale-110"
                  alt="社区作品"
                />
              </div>
            </div>
            <div class="mt-4 text-center">
              <button
                class="px-6 py-2 text-white bg-amber-600 rounded hover:bg-amber-500 transition"
              >
                分享我的作品
              </button>
            </div>
          </div>
        </div>

        <!-- 社区活动 -->
        <div class="mt-8 md:mt-10 p-4 md:p-6 rounded-lg bg-zinc-800 bg-opacity-60">
          <h3 class="mb-4 text-xl md:text-2xl font-bold text-center theme-gold">
            即将举办的活动
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div class="p-3 md:p-4 bg-zinc-700 bg-opacity-60 rounded-lg">
              <h4 class="font-bold mb-2">绢花制作工作坊</h4>
              <p class="text-sm">
                学习基础的绢花制作技巧，适合初学者参加。
              </p>
              <p class="text-xs text-gray-300 mt-2">
                时间：2023年11月15日 14:00-16:00
              </p>
              <button
                class="mt-2 px-4 py-1 text-sm text-white bg-amber-600 rounded hover:bg-amber-500 transition w-full"
              >
                报名参加
              </button>
            </div>
            <div class="p-3 md:p-4 bg-zinc-700 bg-opacity-60 rounded-lg">
              <h4 class="font-bold mb-2">绢花设计大赛</h4>
              <p class="text-sm">向社区展示您的绢花创意，赢取丰厚奖品。</p>
              <p class="text-xs text-gray-300 mt-2">
                截止日期：2023年12月10日
              </p>
              <button
                class="mt-2 px-4 py-1 text-sm text-white bg-amber-600 rounded hover:bg-amber-500 transition w-full"
              >
                了解详情
              </button>
            </div>
            <div class="p-3 md:p-4 bg-zinc-700 bg-opacity-60 rounded-lg">
              <h4 class="font-bold mb-2">线上花艺讲座</h4>
              <p class="text-sm">
                知名花艺设计师分享绢花创作经验和设计理念。
              </p>
              <p class="text-xs text-gray-300 mt-2">
                时间：2023年11月25日 19:30-21:00
              </p>
              <button
                class="mt-2 px-4 py-1 text-sm text-white bg-amber-600 rounded hover:bg-amber-500 transition w-full"
              >
                预约观看
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 定制区 -->
    <section
      id="ai-design-section"
      class="w-full py-10 section-container theme-gradient-bg"
      v-if="isCustomPage"
    >   

      <div class="max-w-6xl px-4 mx-auto">
        <div class="mb-10 text-center">
          <h2 class="mb-6 text-4xl font-bold gradient-heading">设计您的专属绢花</h2>
          
          <!-- 豆包嵌入部分样式与百度贴吧一致 -->
          <div class="overflow-hidden bg-white rounded-lg shadow-xl mb-10">
            <div
              class="p-4 text-white"
              :style="{ background: 'var(--beijinghua-gradient-amber)' }"
            >
              <h3 class="text-xl font-bold">豆包AI设计助手</h3>
              <p class="text-sm">使用豆包AI工具，设计属于您自己的绢花饰品</p>
            </div>

            <!-- 豆包嵌入iframe -->
            <div class="bg-white rounded-lg p-6 text-center">
              <button 
                @click="openDoubaoPopup" 
                class="px-6 py-3 font-bold text-white transition rounded-lg shadow-lg theme-btn"
              >
                打开豆包AI设计助手
              </button>
            </div>
          </div>
        </div>

        <!-- AI设计工具区域 -->
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- 左侧：AI生成区 -->
          <div class="p-6 rounded-lg shadow-xl bg-zinc-800">
            <h3 class="mb-4 text-2xl font-bold text-amber-400">AI绢花生成器</h3>

            <!-- 设计选项 -->
            <div class="mb-6">
              <div class="mb-4">
                <label class="block mb-2 text-sm font-medium">绢花类型</label>
                <select
                  v-model="designOptions.flowerType"
                  class="w-full p-2 border rounded-md bg-zinc-700 border-zinc-600"
                >
                  <option v-for="type in flowerTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block mb-2 text-sm font-medium">颜色主题</label>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="color in colorThemes"
                    :key="color.name"
                    :style="{ backgroundColor: color.value }"
                    class="w-8 h-8 border-2 rounded-full cursor-pointer"
                    :class="{
                      'border-amber-400':
                        designOptions.colorTheme === color.name,
                      'border-transparent':
                        designOptions.colorTheme !== color.name,
                    }"
                    @click="designOptions.colorTheme = color.name"
                  ></div>
                </div>
              </div>

              <div class="mb-4">
                <label class="block mb-2 text-sm font-medium">风格</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="style in designStyles"
                    :key="style"
                    @click="designOptions.style = style"
                    class="px-3 py-1 text-sm rounded-full"
                    :class="
                      designOptions.style === style
                        ? 'bg-amber-600 text-white'
                        : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                    "
                  >
                    {{ style }}
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <label class="block mb-2 text-sm font-medium"
                  >描述您的想法 (可选)</label
                >
                <textarea
                  v-model="designOptions.description"
                  class="w-full h-20 p-2 border rounded-md bg-zinc-700 border-zinc-600"
                  placeholder="描述您想要的绢花外观、用途或灵感来源..."
                ></textarea>
              </div>
            </div>

            <!-- 生成按钮 -->
            <button
              @click="generateDesign"
              class="w-full py-3 font-bold text-white transition rounded-lg shadow-lg theme-btn"
              :disabled="isGenerating"
            >
              <span v-if="isGenerating">
                <i class="mr-2 fas fa-spinner fa-spin"></i> 正在生成...
              </span>
              <span v-else>生成我的专属绢花设计</span>
            </button>
          </div>

          <!-- 右侧：结果展示区 -->
          <div class="flex flex-col p-6 rounded-lg shadow-xl bg-zinc-800">
            <h3 class="mb-4 text-2xl font-bold text-amber-400">设计预览</h3>

            <div
              v-if="isGenerating"
              class="flex items-center justify-center flex-grow"
            >
              <div class="text-center">
                <div
                  class="inline-block w-12 h-12 mb-4 border-t-2 border-b-2 rounded-full animate-spin border-amber-500"
                ></div>
                <p>花小绢正在为您创作独特设计...</p>
                <p class="mt-2 text-xs text-gray-400">根据您的选择生成专属绢花，这可能需要几秒钟</p>
              </div>
            </div>

            <div v-else-if="generatedDesign" class="flex flex-col flex-grow">
              <div
                class="relative flex-grow overflow-hidden rounded-lg bg-zinc-900"
              >
                <img
                  :src="generatedDesign.imageUrl"
                  class="object-contain w-full h-full"
                  alt="生成的绢花设计"
                />
                
                <!-- 如果有多个设计变体，显示缩略图选择器 -->
                <div v-if="generatedVariants && generatedVariants.length > 0" class="flex justify-center mt-3 space-x-2">
                  <div 
                    v-for="(variant, index) in generatedVariants" 
                    :key="index"
                    class="w-12 h-12 overflow-hidden rounded-lg cursor-pointer"
                    :class="variant.selected ? 'ring-2 ring-amber-500' : 'opacity-70'"
                    @click="selectVariant(index)"
                  >
                    <img :src="variant.imageUrl" class="object-cover w-full h-full" :alt="`变体 ${index+1}`" />
                  </div>
                </div>
              </div>

              <div class="p-4 mt-4 rounded-lg bg-zinc-700">
                <h4 class="mb-2 font-bold text-amber-400">AI设计说明</h4>
                <p class="text-sm">{{ generatedDesign.description }}</p>
                
                <!-- 设计细节表格 -->
                <div v-if="generatedDesign.details" class="pt-3 mt-3 border-t border-zinc-600">
                  <h5 class="mb-2 text-xs font-bold text-amber-300">设计细节</h5>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>花型：<span class="text-white">{{ generatedDesign.details.flowerType }}</span></div>
                    <div>配色：<span class="text-white">{{ generatedDesign.details.color }}</span></div>
                    <div>风格：<span class="text-white">{{ generatedDesign.details.style }}</span></div>
                    <div>创建时间：<span class="text-white">{{ generatedDesign.createdAt }}</span></div>
                  </div>
                </div>
                
                <!-- 错误提示 -->
                <div v-if="generatedDesign.isError" class="p-2 mt-3 text-xs bg-red-900 rounded bg-opacity-30">
                  <i class="mr-1 fas fa-exclamation-circle"></i> 
                  图像生成服务暂时不可用，我们显示了预设样例。请稍后重试。
                </div>
              </div>

              <div class="flex gap-3 mt-4">
                <button
                  class="flex-1 py-2 text-white transition rounded-lg theme-btn"
                >
                  <i class="mr-1 fas fa-save"></i> 保存设计
                </button>
                <button
                  @click="regenerateWithModifications"
                  class="flex-1 py-2 text-white transition rounded-lg bg-zinc-700 hover:bg-zinc-600"
                >
                  <i class="mr-1 fas fa-sync-alt"></i> 重新生成
                </button>
                <button
                  @click="contactDesigner"
                  class="flex-1 py-2 text-white transition rounded-lg bg-zinc-700 hover:bg-zinc-600"
                >
                  <i class="mr-1 fas fa-comments"></i> 咨询定制
                </button>
              </div>
            </div>

            <div
              v-else
              class="flex items-center justify-center flex-grow rounded-lg bg-zinc-900"
            >
              <div class="p-6 text-center">
                <!-- 使用已有的图片替代不存在的flower-placeholder.svg -->
                <img
                  src="/images/rightsilk.jpg"
                  class="w-24 h-24 mx-auto mb-4 opacity-30"
                  alt="设计占位图"
                />
                <p class="text-gray-400">
                  选择您喜欢的选项，点击生成按钮创建专属设计
                </p>
                <p class="mt-2 text-xs text-gray-500">由花小绢的AI绢花生成技术提供支持</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史设计展示 -->
        <div class="mt-12">
          <h3 class="mb-6 text-2xl font-bold text-center">社区优秀设计</h3>

          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            <!-- 使用已有的图片 -->
            <div
              v-for="(design, index) in communityDesigns"
              :key="index"
              class="overflow-hidden transition-transform rounded-lg shadow-lg bg-zinc-800 hover:scale-105"
            >
              <img
                :src="design.imageUrl"
                class="object-cover w-full aspect-square"
                :alt="design.name"
              />
              <div class="p-3">
                <h4 class="font-bold truncate text-amber-400">
                  {{ design.name }}
                </h4>
                <p class="text-xs text-gray-400">by {{ design.designer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- VR 3D模型展示区 -->
    <section
      id="vr-section"
      class="w-full py-20 theme-gradient-bg"
      v-if="isVRPage"
    >
      <div class="max-w-7xl px-4 mx-auto">
        <div class="mb-10 text-center">
          <h2 class="mb-3 text-4xl font-bold gradient-heading">绢花3D展示</h2>
          <p class="text-lg mb-4">通过3D技术，探索绢花的精美细节和立体结构。</p>
        </div>
        
        <!-- 3D模型查看器iframe -->
        <div class="bg-zinc-800 rounded-lg shadow-xl overflow-hidden">
          <iframe 
            :src="index3dPath + '?apiBaseUrl=' + encodeURIComponent(apiBaseUrl)"
            class="w-full" 
            style="height: 750px; border: none;"
            frameborder="0"
            allow="fullscreen"
            title="绢花3D模型查看器"
            ref="modelIframe"
            @load="onIframeLoaded"
          ></iframe>
        </div>
        
        <!-- 添加3D模型介绍信息 -->
        <div class="mt-10">
          <!-- 模型展示说明文本 -->
          <div class="text-center">
            <h3 class="mb-4 text-2xl font-bold gradient-heading">绢语·华彩 3D艺术</h3>
            <p class="max-w-3xl mx-auto text-lg">
              这个3D模型展示了我们精心制作的绢花艺术品，每一处细节都体现了传统工艺与现代技术的融合。
              您可以360°全方位欣赏这件作品，感受绢花的精致质感与艺术气息。
            </p>
          </div>
          
          <!-- 模型信息卡片 -->
          <div class="grid grid-cols-1 gap-8 mt-10 md:grid-cols-3">
            <div 
              class="p-5 transition-transform rounded-lg shadow-lg hover:scale-105"
              :class="isDarkMode ? 'bg-zinc-800' : 'bg-white bg-opacity-90'"
            >
              <h4 class="mb-2 text-xl font-bold" :class="isDarkMode ? 'text-amber-400' : 'text-pink-600'">模型详情</h4>
              <p>精细度: 高</p>
              <p>三角面数: 180,000+</p>
              <p>材质: PBR渲染</p>
              <p>文件格式: FBX</p>
            </div>
            <div 
              class="p-5 transition-transform rounded-lg shadow-lg hover:scale-105"
              :class="isDarkMode ? 'bg-zinc-800' : 'bg-white bg-opacity-90'"
            >
              <h4 class="mb-2 text-xl font-bold" :class="isDarkMode ? 'text-amber-400' : 'text-pink-600'">创作灵感</h4>
              <p>灵感源自中国传统绢花工艺</p>
              <p>融合现代设计美学</p>
              <p>由专业艺术家精心制作</p>
              <p>两种配色主题展现不同风格</p>
            </div>
            <div 
              class="p-5 transition-transform rounded-lg shadow-lg hover:scale-105"
              :class="isDarkMode ? 'bg-zinc-800' : 'bg-white bg-opacity-90'"
            >
              <h4 class="mb-2 text-xl font-bold" :class="isDarkMode ? 'text-amber-400' : 'text-pink-600'">使用指南</h4>
              <p>鼠标左键拖动: 旋转模型</p>
              <p>滚轮: 缩放模型</p>
              <p>右键拖动: 平移视角</p>
              <p>主题切换: 查看不同风格设计</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 页脚 -->
    <footer class="w-full py-5 text-center shadow-2xl">
      <p>© 2025 花小绢·绢花品牌官网. 保留所有权利。</p>
      <div class="mt-2">
        <a href="/privacy" class="transition-all duration-300 ease-in-out">隐私政策</a>
        <span class="mx-2">|</span>
        <a href="/terms" class="transition-all duration-300 ease-in-out">服务条款</a>
      </div>
    </footer>

    <!-- 花小绢聊天组件 - 更新后的完整版本 -->
    <div class="fixed z-50 bottom-4 md:bottom-6 right-4 md:right-6">
      <!-- 聊天头像按钮 -->
      <div 
        @click="toggleChatWindow" 
        class="relative flex items-center justify-center chat-avatar"
        :class="{'animate-pulse': hasNewMessage}"
      >
        <img 
          :src="`/biaoqing/${currentMood}.png`" 
          class="object-cover w-full h-full" 
          alt="花小绢" 
        />
        <div v-if="hasNewMessage" class="notification-dot"></div>
      </div>

      <!-- 聊天窗口 -->
      <div 
        v-if="isChatOpen" 
        class="absolute right-0 chat-window bottom-16 md:bottom-20"
      >
        <!-- 聊天窗口头部 - 简化版 -->
        <div class="chat-header">
          <div class="flex items-center">
            <img :src="`/biaoqing/${currentMood}.png`" class="w-8 h-8 mr-2 rounded-full" alt="花小绢" />
            <span class="font-bold">花小绢</span>
          </div>
          <div class="flex items-center">
            <!-- 直接显示新建对话和清除历史的按钮 -->
            <button @click="createNewChat" class="px-2 py-1 mr-1 text-xs text-white rounded bg-amber-600 hover:bg-amber-500">
              新对话
            </button>
            <button @click="clearChatHistory" class="px-2 py-1 mr-1 text-xs text-white rounded bg-amber-600 hover:bg-amber-500">
              清除历史
            </button>
            <button @click="toggleChatWindow" class="p-1 rounded hover:bg-amber-600">
              ✕
            </button>
          </div>
        </div>
        
        <!-- 聊天内容区 -->
        <div class="chat-messages" ref="chatMessagesContainer">
          <div v-if="chatMessages.length === 0" class="flex items-center justify-center h-full">
            <div class="text-center text-gray-500">
              <div class="mb-4 text-4xl">👋</div>
              <p>开始和花小绢聊天吧！</p>
              <p class="mt-1 text-xs">有关绢花工艺的问题，花小绢都能回答哦~</p>
            </div>
          </div>
          <div v-for="(message, index) in chatMessages" :key="index" class="mb-3 px-2 md:px-3">
            <div 
              v-if="message.sender === 'bot'" 
              class="bot-message"
            >
              <div class="message-avatar">
                <img :src="`/biaoqing/${message.mood || '热情'}.png`" class="w-full h-full" alt="花小绢" />
              </div>
              <div class="message-content text-left text-sm md:text-base">{{ message.text }}</div>
            </div>
            <div 
              v-else 
              class="user-message"
            >
              <div class="message-content text-left text-sm md:text-base">
                {{ message.text }}
              </div>
            </div>
          </div>
          <div v-if="isTyping" class="mt-2 bot-message px-2 md:px-3">
            <div class="message-avatar">
              <img :src="`/biaoqing/认真.png`" class="w-full h-full" alt="花小绢" />
            </div>
            <div class="message-content text-left">
              <span class="inline-block w-6 text-center animate-pulse">...</span>
            </div>
          </div>
        </div>
        
        <!-- 聊天输入区 -->
        <div class="chat-input">
          <input 
            v-model="userInput" 
            @keyup.enter="sendMessage"
            placeholder="和花小绢聊聊..." 
            class="flex-1 text-sm md:text-base"
          />
          <button 
            @click="sendMessage" 
            class="px-3 md:px-4 py-2 bg-amber-500 text-white rounded-r-lg hover:bg-amber-600"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      index3dPath: new URL('./assets/index3d.html', import.meta.url).href,
      isHomePage: true,
      isProductPage: false,
      isCommunityPage: false,
      isCustomPage: false,
      isVRPage: false,
      isDarkMode: true, // 默认为黑色主题
      // 花小绢聊天组件状态
      isChatOpen: false,
      userInput: "",
      chatMessages: [],
      isTyping: false,
      hasNewMessage: false,
      currentMood: "热情",
      isAudioEnabled: false,
      audioPlayer: null,
      chatSessionId: undefined, // 会话ID，用于连续对话
      isChatMenuOpen: false, // 聊天菜单是否打开
      // 豆包API相关
      doubanApiKeys: {
        accessKeyId: "AKLTYTcxYzk0ZDc3NDBjNGYzZjg5YzdmZWRkMjE0NmNjM2E",
        secretAccessKey: "WlRVd05HVTNNelV4WmpNMU5EUXhZMkZsTldZNFpUZGlaR00xTW1GallUYw=="
      },
      // 生成的设计变体
      generatedVariants: [],
      // 表情包映射
      moodMapping: {
        greeting: "热情",
        happy: "喜爱",
        excited: "喜爱+害羞",
        neutral: "认真",
        curious: "侃侃而谈",
        confused: "无语",
        sad: "乞求",
        angry: "生气",
        proud: "傲娇",
        loving: "比心",
        shy: "矜持",
        confident: "理所应当"
      },
      // 合并products和newProducts为一个allProducts数组
      allProducts: [
        // 原来的products
        {
          name: "绢花项链",
          description: "经典而现代，让您时刻优雅。",
          image: "/images/necklace.jpg",
          link: "https://item.jd.com/1110592.html",
        },
        {
          name: "绢花耳环",
          description: "精致迷人，点亮时刻。",
          image: "/images/earrings.jpg",
          link: "https://detail.tmall.com/item.htm?id=605165654577",
        },
        {
          name: "绢花胸针",
          description: "艺术典雅，独特魅力。",
          image: "/images/brooch.jpg",
          link: "https://item.jd.com/2222222.html",
        },
        {
          name: "绢花戒指",
          description: "精致小巧，优雅迷人。",
          image: "/images/flower-ring.jpg",
          link: "https://item.jd.com/4444444.html",
        },
        {
          name: "绢花手链",
          description: "独特设计，佩戴舒适。",
          image: "/images/bracelet.jpg",
          link: "https://item.jd.com/5555555.html",
        },
        {
          name: "绢花别针",
          description: "精美设计，细腻工艺。",
          image: "/images/pin.jpg",
          link: "https://item.jd.com/6666666.html",
        },
        // 原来的newProducts
        {
          name: "绢花发簪",
          description: "古典雅致，点缀发间风情。",
          image: "/images/rightsilk.jpg",
          link: "https://item.jd.com/7777777.html",
        },
        {
          name: "绢花耳坠",
          description: "灵动飘逸，演绎东方美学。",
          image: "/images/ear-drop.jpg",
          link: "https://detail.tmall.com/item.htm?id=7071777777",
        },
        {
          name: "绢花胸饰",
          description: "立体造型，彰显独特品味。",
          image: "/images/brooch-new.jpg",
          link: "https://item.jd.com/8888888.html",
        },
        {
          name: "绢花手镯",
          description: "柔美缠绕，腕间艺术绽放。",
          image: "/images/bracelet-new.jpg",
          link: "https://item.jd.com/9999999.html",
        },
        {
          name: "绢花摆件",
          description: "居家装饰，传承文化之美。",
          image: "/images/decoration.jpg",
          link: "https://item.jd.com/10101010.html",
        },
        {
          name: "绢花香囊",
          description: "古法熏香，承载美好祈愿。",
          image: "/images/sachet.jpg",
          link: "https://item.jd.com/12121212.html",
        },
      ],
      // AI设计工具相关
      designOptions: {
        flowerType: "牡丹",
        colorTheme: "传统红",
        style: "古典",
        description: "",
      },
      flowerTypes: [
        "牡丹",
        "莲花",
        "梅花",
        "兰花",
        "菊花",
        "玫瑰",
        "百合",
        "桃花",
      ],
      colorThemes: [
        { name: "传统红", value: "#cc0000" },
        { name: "典雅紫", value: "#8a2be2" },
        { name: "祥和黄", value: "#ffd700" },
        { name: "清新绿", value: "#228b22" },
        { name: "沉稳蓝", value: "#4169e1" },
        { name: "高贵金", value: "#d4af37" },
        { name: "纯净白", value: "#f5f5f5" },
        { name: "神秘黑", value: "#2c2c2c" },
      ],
      designStyles: [
        "古典",
        "现代",
        "简约",
        "奢华",
        "民族",
        "复古",
        "自然",
        "艺术",
      ],
      isGenerating: false,
      generatedDesign: null,

      // 社区设计展示 - 使用已有的图片
      communityDesigns: [
        {
          id: 1,
          name: "金丝牡丹胸针",
          designer: "花间一壶酒",
          imageUrl: "/images/brooch.jpg",
        },
        {
          id: 2,
          name: "紫韵兰花发簪",
          designer: "墨香书生",
          imageUrl: "/images/rightsilk.jpg",
        },
        {
          id: 3,
          name: "流苏梅花耳坠",
          designer: "清风明月",
          imageUrl: "/images/earrings.jpg",
        },
        {
          id: 4,
          name: "翠玉莲花项链",
          designer: "江南烟雨",
          imageUrl: "/images/necklace.jpg",
        },
        {
          id: 5,
          name: "红绡菊花手链",
          designer: "山水有情",
          imageUrl: "/images/bracelet.jpg",
        },
        {
          id: 6,
          name: "金丝玫瑰戒指",
          designer: "云端漫步",
          imageUrl: "/images/flower-ring.jpg",
        },
        {
          id: 7,
          name: "青玉百合摆件",
          designer: "竹影清风",
          imageUrl: "/images/decoration.jpg",
        },
        {
          id: 8,
          name: "锦绣桃花香囊",
          designer: "月下独酌",
          imageUrl: "/images/sachet.jpg",
        },
      ],
      // 添加3D模型加载状态
      modelLoadState: 'idle', // 'idle', 'loading', 'success', 'error'
      modelLoadMessage: '正在连接后端API...',
      modelLoadError: '',
      modelLoadProgress: 0,
      modelLoadTimeout: null,
      mobileMenuOpen: false,
    };
  },
  mounted() {
    // 初始化
    this.initChatBot();
    
    // 从本地存储读取用户主题偏好
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      // 立即应用主题
      document.documentElement.classList.add(this.isDarkMode ? 'dark' : 'light');
      document.documentElement.classList.remove(this.isDarkMode ? 'light' : 'dark');
    } else {
      // 如果没有保存的偏好，默认使用暗色主题
      document.documentElement.classList.add('dark');
    }
    
    // 模拟5秒后花小绢发送首条问候消息
    setTimeout(() => {
      this.receiveBotMessage("你好呀！我是花小绢，绢语·华彩的品牌形象大使~有什么关于绢花工艺或者定制需求，都可以问我哦！", "greeting");
    }, 5000);
    
    // 初始化音频播放器
    this.audioPlayer = new Audio();
    // 添加iframe消息监听器
    window.addEventListener('message', this.handleIframeMessage);
  },
  beforeUnmount() {
    // 清理监听器
    window.removeEventListener('message', this.handleIframeMessage);
    // 清理超时计时器
    if (this.modelLoadTimeout) {
      clearTimeout(this.modelLoadTimeout);
    }
  },
  methods: {
    // 生成AI设计 - 使用火山引擎API
    async generateDesign() {
      this.isGenerating = true;

      try {
        // 构建提示词 - 按照火山引擎通用2.0L要求
        const prompt = `${this.designOptions.style}风格，精美的${this.designOptions.colorTheme}色${this.designOptions.flowerType}绢花，特写镜头，细致质感，精湛工艺，逼真质地，${this.designOptions.description}`;
        
        console.log("生成提示词:", prompt);
        
        // 构建请求数据
        const apiData = {
          style: this.designOptions.style,
          flowerType: this.designOptions.flowerType,
          colorTheme: this.designOptions.colorTheme,
          description: this.designOptions.description
        };
        
        // 调用后端API代理
        console.log("正在发送请求到:", `${this.apiBaseUrl}/api/generate-image`);
        const response = await axios.post(`${this.apiBaseUrl}/api/generate-image`, apiData);
        
        console.log("API响应:", response.data);
        
        // 处理API响应
        if (response.data && response.data.success) {
          // 成功获取图像URL
          const imageUrl = response.data.imageUrl;
          const rephraserResult = response.data.rephraserResult || '';
          
          // 生成描述用的风格词
          const styleDescriptions = {
            "古典": "展现传统东方美学韵味，细腻柔美",
            "现代": "融合当代设计元素，简约精致",
            "简约": "以简胜繁，线条流畅，形态纯粹",
            "奢华": "层次丰富，质感高贵，细节精美",
            "民族": "融入传统民族符号，色彩鲜明",
            "复古": "带有年代感，怀旧风情浓厚",
            "自然": "如同真花绽放，自然生动",
            "艺术": "独特创意，突破传统，艺术表现力强"
          };
          
          // 材料描述
          const materialDescriptions = [
            "采用优质桑蚕丝绸精心制作",
            "选用100%天然丝绸材质",
            "融合真丝与特殊纤维，质感更为逼真",
            "传统手工染色，色泽自然柔和"
          ];
          
          // 用途描述
          const usageDescriptions = [
            "适合作为发簪、胸针或装饰品",
            "可用于礼服点缀，增添高雅气质",
            "适合作为家居装饰或艺术收藏",
            "可作为特别礼物，传递美好祝愿"
          ];
          
          // 构建更丰富的设计说明
          const styleDescription = styleDescriptions[this.designOptions.style] || "风格独特";
          const materialDescription = materialDescriptions[Math.floor(Math.random() * materialDescriptions.length)];
          const usageDescription = usageDescriptions[Math.floor(Math.random() * usageDescriptions.length)];
          
          // 使用API返回的描述或生成自定义描述
          let description = "";
          if (rephraserResult) {
            // 使用API返回的优化描述
            description = `这是一款${this.designOptions.style}风格的${this.designOptions.colorTheme}色${this.designOptions.flowerType}绢花设计。${rephraserResult}`;
          } else {
            // 使用自定义描述
            description = `这是一款${this.designOptions.style}风格的${this.designOptions.colorTheme}色${this.designOptions.flowerType}绢花设计。${styleDescription}，${materialDescription}。${usageDescription}。每一片花瓣都经过精心裁剪和塑形，立体感强，细节丰富。`;
          }
          
          // 保存生成结果
          this.generatedDesign = {
            imageUrl: imageUrl,
            description: description,
            details: {
              style: this.designOptions.style,
              color: this.designOptions.colorTheme, 
              flowerType: this.designOptions.flowerType,
              customDescription: this.designOptions.description || "无特殊要求",
              promptUsed: prompt, // 保存使用的提示词
              requestId: response.data.requestId || '' // 保存请求ID用于追踪
            },
            createdAt: new Date().toLocaleString()
          };
          
          // 如果实际API返回了多个图像，可以存储供用户选择
          if (response.data.multipleImages && response.data.multipleImages.length > 0) {
            this.generatedVariants = response.data.multipleImages.map((url, index) => ({
              imageUrl: url,
              selected: index === 0 // 第一个默认选中
            }));
          } else {
            // 只有一个图像时
            this.generatedVariants = [
              { imageUrl: imageUrl, selected: true }
            ];
          }
          
          // 成功生成后通知花小绢
          setTimeout(() => {
            if (!this.isChatOpen) {
              this.hasNewMessage = true;
              // 只有当聊天窗口关闭时，才添加新消息提醒
              this.receiveBotMessage(`我看到您生成了一朵美丽的${this.designOptions.flowerType}绢花设计！如果您对这个设计有任何问题或需要调整，随时可以告诉我哦~`, "excited");
            }
          }, 2000);
        } else {
          // API返回错误
          console.error("API返回错误:", response.data);
          throw new Error(response.data.message || "生成图像失败");
        }
      } catch (error) {
        console.error("生成设计时出错:", error);
        console.error("错误详情:", error.response ? error.response.data : error.message);
        
        // 请求失败处理
        this.generatedDesign = {
          imageUrl: "/images/rightsilk.jpg", // 使用默认图像
          description: `由于当前API连接问题，我们提供了一个${this.designOptions.style}风格的${this.designOptions.flowerType}设计参考。您可以稍后再试或联系我们的设计师进行定制。`,
          isError: true,
          details: {
            errorMessage: error.message || "API调用失败",
            style: this.designOptions.style,
            color: this.designOptions.colorTheme,
            flowerType: this.designOptions.flowerType
          }
        };
        
        // 打开聊天窗口通知错误
        if (!this.isChatOpen) {
          this.hasNewMessage = true;
          this.receiveBotMessage("对不起，图像生成服务暂时遇到了一些问题。您可以稍后再试，或者直接联系我为您提供人工定制方案~", "sad");
        }
      } finally {
        this.isGenerating = false;
      }
    },

    // 获取随机描述文本
    getRandomDescription() {
      const descriptions = [
        "精细的丝绸材质展现出柔美质感，每一片花瓣都栩栩如生。",
        "采用传统工艺与现代审美相结合，既保留了传统绢花的精髓，又融入了现代设计元素。",
        "每一处细节都经过精心打磨，展现出匠人的用心与专注。",
        "色彩层次丰富，在不同光线下呈现出变幻的美感。",
        "可作为胸针、发饰或装饰品，多种佩戴方式满足不同场合需求。",
        "灵感源自自然之美，将花朵的灵动与丝绸的柔美完美融合。",
      ];
      return descriptions[Math.floor(Math.random() * descriptions.length)];
    },
    
    // 选择设计变体
    selectVariant(index) {
      if (!this.generatedVariants || this.generatedVariants.length === 0) return;
      
      // 更新选中状态
      this.generatedVariants.forEach((variant, i) => {
        variant.selected = (i === index);
      });
      
      // 更新主显示图片
      if (this.generatedVariants[index]) {
        this.generatedDesign.imageUrl = this.generatedVariants[index].imageUrl;
      }
    },
    
    // 用修改后的参数重新生成
    regenerateWithModifications() {
      // 弹出确认窗口
      if (confirm("确定要重新生成设计吗？您当前的设计将被替换。")) {
        // 可以调整一些参数再重新生成
        this.generateDesign();
      }
    },
    
    // 联系设计师进行定制
    contactDesigner() {
      // 打开聊天窗口
      this.isChatOpen = true;
      this.hasNewMessage = false;
      
      // 将当前设计发送给花小绢
      setTimeout(() => {
        const designInfo = `花型: ${this.designOptions.flowerType}, 颜色: ${this.designOptions.colorTheme}, 风格: ${this.designOptions.style}`;
        this.receiveBotMessage(`我看到您对这款${this.designOptions.flowerType}绢花设计感兴趣！您希望在这个基础上进行哪些调整呢？或者您有其他特殊的定制需求吗？`, "热情");
      }, 500);
    },
    
    // 花小绢聊天功能
    initChatBot() {
      // 初始化聊天机器人相关配置
      this.chatMessages = [];
      this.currentMood = "热情"; // 默认心情
      this.chatSessionId = undefined; // 会话ID，用于连续对话
    },
    
    toggleChatWindow() {
      this.isChatOpen = !this.isChatOpen;
      if (this.isChatOpen) {
        this.hasNewMessage = false;
        // 如果是首次打开对话框，添加初始消息
        if (this.chatMessages.length === 0) {
          this.receiveBotMessage("你好呀！我是花小绢，绢语·华彩的品牌形象大使~有什么关于绢花工艺或者定制需求，都可以问我哦！", "greeting");
        }
        // 关闭菜单
        this.isChatMenuOpen = false;
      }
    },
    
    // 切换聊天菜单显示/隐藏
    toggleChatMenu() {
      this.isChatMenuOpen = !this.isChatMenuOpen;
    },
    
    // 创建新的聊天会话
    createNewChat() {
      // 关闭菜单
      this.isChatMenuOpen = false;
      
      console.log("创建新会话");
      
      // 调用后端API创建新会话
      axios.post(`${this.apiBaseUrl}/api/new-chat-session`)
        .then(response => {
          if (response.data && response.data.success) {
            // 保存新的会话ID
            this.chatSessionId = response.data.sessionId;
            
            // 清空本地聊天记录显示
            this.chatMessages = [];
            
            // 发送欢迎消息
            this.receiveBotMessage("你好呀！我是花小绢，绢语·华彩的品牌形象大使~有什么关于绢花工艺或者定制需求，都可以问我哦！", "greeting");
            
            console.log("新会话创建成功, ID:", this.chatSessionId);
          } else {
            console.error("创建新会话失败:", response.data);
            this.receiveBotMessage("创建新对话时出了点小问题，请稍后再试~", "无语");
          }
        })
        .catch(error => {
          console.error("创建新会话请求出错:", error);
          this.receiveBotMessage("创建新对话时遇到了网络问题，请稍后再试~", "乞求");
        });
    },
    
    // 清除聊天历史
    clearChatHistory() {
      // 关闭菜单
      this.isChatMenuOpen = false;
      
      // 如果没有会话ID，说明还没有开始对话
      if (!this.chatSessionId) {
        this.chatMessages = [];
        this.receiveBotMessage("你好呀！我是花小绢，绢语·华彩的品牌形象大使~有什么关于绢花工艺或者定制需求，都可以问我哦！", "greeting");
        return;
      }
      
      console.log("清除聊天历史, 会话ID:", this.chatSessionId);
      
      // 调用后端API清除会话历史
      axios.post(`${this.apiBaseUrl}/api/clear-chat-history`, {
        sessionId: this.chatSessionId
      })
        .then(response => {
          if (response.data && response.data.success) {
            // 清空本地聊天记录显示
            this.chatMessages = [];
            
            // 发送欢迎消息
            this.receiveBotMessage("我已经清除了我们之前的对话记录。有什么新的问题想问我吗？", "热情");
            
            console.log("聊天历史清除成功");
          } else {
            console.error("清除聊天历史失败:", response.data);
            this.receiveBotMessage("清除对话记录时出了点小问题，请稍后再试~", "无语");
          }
        })
        .catch(error => {
          console.error("清除聊天历史请求出错:", error);
          this.receiveBotMessage("清除对话记录时遇到了网络问题，请稍后再试~", "乞求");
        });
    },
    
    // 滚动到聊天窗口底部
    scrollToBottom() {
      if (this.$refs.chatMessagesContainer) {
        this.$nextTick(() => {
          this.$refs.chatMessagesContainer.scrollTop = this.$refs.chatMessagesContainer.scrollHeight;
        });
      }
    },
    
    // 发送消息方法
    sendMessage() {
      console.log("发送消息函数被调用");
      if (!this.userInput.trim()) return;
      
      console.log("准备发送消息:", this.userInput);
      
      // 添加用户消息
      this.chatMessages.push({
        text: this.userInput,
        sender: 'user',
        timestamp: new Date()
      });
      
      // 添加自动滚动到底部
      this.scrollToBottom();
      
      const userMessage = this.userInput;
      this.userInput = "";
      
      // 模拟机器人正在输入
      this.isTyping = true;
      
      // 测试API连接性
      axios.get(`${this.apiBaseUrl}/api/test`)
        .then(response => {
          console.log("API连接测试成功:", response.data);
        })
        .catch(error => {
          console.error("API连接测试失败:", error);
        });
      
      // 调用后端AI聊天API
      const chatApiUrl = `${this.apiBaseUrl}/api/chat`;
      console.log("准备调用API:", chatApiUrl);
      console.log("发送数据:", { message: userMessage, sessionId: this.chatSessionId });
      
      // 使用fetch代替axios作为备选方法
      fetch(chatApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: this.chatSessionId
        })
      })
      .then(response => {
        console.log("收到fetch响应状态:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("fetch API响应成功:", data);
        this.isTyping = false;
        if (data && data.success) {
          // 保存会话ID用于连续对话
          this.chatSessionId = data.sessionId;
          console.log("会话ID:", this.chatSessionId);
          
          // 接收AI响应
          this.receiveBotMessage(data.response, data.mood);
        } else {
          // API错误处理
          console.error("API返回错误:", data);
          this.receiveBotMessage("抱歉，我遇到了一点小问题，请稍后再试~", "无语");
        }
      })
      .catch(error => {
        console.error("fetch聊天API调用出错:", error);
        this.isTyping = false;
        this.receiveBotMessage(`哎呀，网络似乎不太稳定，请稍后再试~ (${error.message})`, "乞求");
      });
    },
    
    receiveBotMessage(text, moodKey) {
      // 根据情绪关键字获取对应的表情
      const mood = this.moodMapping[moodKey] || moodKey;
      
      // 添加消息
      this.chatMessages.push({
        text: text,
        sender: 'bot',
        timestamp: new Date(),
        mood: mood
      });
      
      // 添加自动滚动到底部
      this.scrollToBottom();
      
      // 聊天窗口关闭时，显示通知
      if (!this.isChatOpen) {
        this.hasNewMessage = true;
      }
    },
    
    toggleAudio() {
      this.isAudioEnabled = !this.isAudioEnabled;
      if (this.isAudioEnabled) {
        // 可以播放一个提示音，表示已开启语音
        // this.audioPlayer.src = '/sounds/audio-on.mp3';
        // this.audioPlayer.play();
      }
    },
    
    playVoiceMessage(text) {
      // 实际项目中，这里应该调用语音合成API
      // 例如使用讯飞或百度的语音合成API
      // 为了简单演示，我们这里模拟一下
      console.log("播放语音消息:", text);
      
      // 模拟语音合成API调用
      // this.audioPlayer.src = `https://tts-api.example.com/synthesize?text=${encodeURIComponent(text)}&voice=female`;
      // this.audioPlayer.play();
    },
    
    // 根据消息内容选择合适的表情
    getMoodByContent(message) {
      const lowerMsg = message.toLowerCase();
      
      if (lowerMsg.includes("你好") || lowerMsg.includes("欢迎")) return "热情";
      if (lowerMsg.includes("谢谢") || lowerMsg.includes("感谢")) return "比心";
      if (lowerMsg.includes("哇") || lowerMsg.includes("amazing")) return "喜爱";
      if (lowerMsg.includes("？") || lowerMsg.includes("问题")) return "认真";
      if (lowerMsg.includes("生气") || lowerMsg.includes("不满")) return "生气";
      
      // 默认表情
      return "热情";
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      
      // 更新文档的class来实际切换主题
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      
      // 保存用户偏好到本地存储
      localStorage.setItem('theme-preference', this.isDarkMode ? 'dark' : 'light');
    },
    openDoubaoPopup() {
      window.open('https://www.doubao.com/chat/create-image', 
        '豆包AI', 
        'width=1200,height=600,menubar=no,toolbar=no');
    },
    openMuseumWindow() {
      window.open('https://www.ihchina.cn/project_details/14174', 
        '中国非遗数字博物馆-绢花', 
        'width=1400,height=600,menubar=no,toolbar=yes,scrollbars=yes');
    },
    // iframe加载完成时触发
    onIframeLoaded() {
      console.log('iframe加载完成');
      // 设置超时检测（如果60秒内没有收到模型加载成功消息，显示错误）
      this.modelLoadTimeout = setTimeout(() => {
        if (this.modelLoadState !== 'success') {
          this.modelLoadState = 'error';
          this.modelLoadError = '模型加载超时，请检查后端API是否正常运行。';
        }
      }, 60000);
    },
    
    // 处理来自iframe的消息
    handleIframeMessage(event) {
      // 简单验证消息来源（在生产环境中可能需要更严格的检查）
      try {
        const data = event.data;
        if (!data || !data.action) return;
        
        console.log('收到iframe消息:', data.action);
        
        switch (data.action) {
          case 'modelLoadStarted':
            this.modelLoadState = 'loading';
            this.modelLoadMessage = '连接后端API...';
            this.modelLoadProgress = 0;
            break;
            
          case 'modelRequestSuccess':
            this.modelLoadMessage = '成功连接API，开始加载模型...';
            this.modelLoadProgress = 5;
            break;
            
          case 'modelLoadProgress':
            this.modelLoadMessage = `加载3D模型... ${data.percent || 0}%`;
            this.modelLoadProgress = data.percent || 0;
            break;
            
          case 'modelLoadDetailProgress':
            this.modelLoadMessage = `加载3D模型... ${data.percent || 0}%（${data.loaded || '0'} / ${data.total || '0'}）`;
            this.modelLoadProgress = data.percent || 0;
            break;
            
          case 'modelLoadSuccess':
            this.modelLoadState = 'success';
            // 清除超时计时器
            if (this.modelLoadTimeout) {
              clearTimeout(this.modelLoadTimeout);
              this.modelLoadTimeout = null;
            }
            break;
            
          case 'modelLoadFailed':
          case 'modelLoadError':
            this.modelLoadState = 'error';
            this.modelLoadError = data.message || '加载模型时发生错误，请稍后重试。';
            // 清除超时计时器
            if (this.modelLoadTimeout) {
              clearTimeout(this.modelLoadTimeout);
              this.modelLoadTimeout = null;
            }
            break;
        }
      } catch (e) {
        console.error('处理iframe消息时出错:', e);
      }
    },
    
    // 重新加载模型
    reloadModel() {
      if (!this.$refs.modelIframe) return;
      
      try {
        // 重置状态
        this.modelLoadState = 'loading';
        this.modelLoadMessage = '正在重新连接后端API...';
        this.modelLoadProgress = 0;
        this.modelLoadError = '';
        
        // 发送重新加载消息给iframe
        this.$refs.modelIframe.contentWindow.postMessage({
          action: 'reloadModel'
        }, '*');
        
        // 设置新的超时
        if (this.modelLoadTimeout) {
          clearTimeout(this.modelLoadTimeout);
        }
        this.modelLoadTimeout = setTimeout(() => {
          if (this.modelLoadState !== 'success') {
            this.modelLoadState = 'error';
            this.modelLoadError = '模型加载超时，请检查后端API是否正常运行。';
          }
        }, 60000);
      } catch (e) {
        console.error('重新加载模型时出错:', e);
        this.modelLoadState = 'error';
        this.modelLoadError = '无法与3D查看器通信，请尝试刷新页面。';
      }
    },
  },
};
</script>