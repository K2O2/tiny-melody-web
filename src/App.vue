<template>
  <!-- 上下布局,上方路由,下方player -->
  <el-container style="height: 100vh">
    <el-main style="padding: 0 20px">
      <router-view></router-view>
    </el-main>
    <!-- footer固定到最下方 -->
    <el-footer
      style="
        width: 100vw;
        bottom: 0;
        border-top: 2px solid var(--el-border-color);
        height: 11vh;
      "
    >
      <!-- 播放器 -->
      <player></player>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
