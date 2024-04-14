<template>
  <el-container style="height: 100vh">
    <el-main style="padding: 0 20px">
      <el-row style="height: 100%; overflow: hidden">
        <el-col
          :span="4"
          style="border-right: 2px solid var(--el-border-color)"
        >
          <div
            class="logo"
            style="
              padding-right: 20px;
              margin-top: 10px;
              padding-bottom: 10px;
              height: 8vh;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <img
              src="../../../assets/logotitle.png"
              alt="Tiny Melody Server"
              style="width: 100%"
            />
          </div>
          <el-scrollbar height="78vh">
            <folder_tree></folder_tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="20">
          <file_list></file_list>
        </el-col>
      </el-row>
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
  <playing v-show="playingPage().playingShow"></playing>
</template>

<script setup lang="ts">
import { playingPage } from "../../../store/index.ts";
import playing from "../playing/index.vue";
import folder_tree from "./folder_tree/index.vue";
import file_list from "./file_list/index.vue";
import player from "./player/index.vue";
</script>

<style scoped lang="scss"></style>
