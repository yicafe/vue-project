<template>
  <div class="max-w-lg p-4 mx-auto bg-white rounded-lg shadow-lg">
    <!-- Header -->
    <div class="flex items-center">
      <img src="https://via.placeholder.com/40" alt="avatar" class="w-10 h-10 rounded-full" />
      <div class="ml-3">
        <div class="flex items-center">
          <span class="text-sm font-bold">昵称</span>
          <span class="ml-1 text-xs text-yellow-500">💛</span>
        </div>
        <p class="text-xs text-gray-500">9小时前 歌手</p>
      </div>
      <button class="px-3 py-1 ml-auto text-sm text-orange-500 border border-orange-500 rounded-full">
        +关注
      </button>
    </div>

    <!-- Content -->
    <div class="mt-4">
      <p class="text-sm leading-relaxed text-gray-800">
        来算算多久没有单独合照过了这位朋友？哈哈哈
        开心开心
        <a href="#" class="text-blue-500">@卡布叻_周深</a>
        <br />
        <span class="text-blue-500">#张碧晨DayDayUP##七号打歌中心#</span>
      </p>
    </div>

    <!-- Media -->
    <div class="mt-3">
      <div class="relative aspect-w-20 aspect-h-9">
        <!-- Bilibili Video -->
        <iframe
          src="//player.bilibili.com/player.html?isOutside=true&aid=113673238548600&bvid=BV19wkwYBEMt&cid=27404075215&p=1"
          frameborder="0" allowfullscreen class="w-full h-full rounded-lg"></iframe>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between mt-4 text-sm text-gray-500">
      <div class="flex items-center space-x-2">
        <button class="flex items-center space-x-1">
          <span>👍</span>
          <span>13.1万</span>
        </button>
        <button class="flex items-center space-x-1">
          <span>💬</span>
          <span>1.4万</span>
        </button>
        <button class="flex items-center space-x-1">
          <span>🔗</span>
          <span>5.3万</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WeiboPost",
};

</script>

<style>
/* 可根据需求添加全局或局部样式 */
</style>
