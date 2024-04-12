<template>
  <el-row style="height: 100%; overflow: hidden">
    <el-col :span="4" style="border-right: 2px solid var(--el-border-color)">
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
</template>

<script setup lang="ts">
import folder_tree from "./folder_tree/index.vue";
import file_list from "./file_list/index.vue";
</script>

<style scoped lang="scss"></style>
