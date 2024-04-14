<template>
  <div>
    <el-tree
      style="max-width: 100%; margin-left: -5px"
      :data="folderData"
      :props="defaultProps"
      accordion
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script setup lang="ts">
import request from "../../../../utils/request";
import { onMounted, nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import { SetPlaylistStore } from "../../../../store/index.ts";

interface Tree {
  start: number;
  count: number;
}

const defaultProps = {
  start: "start",
  count: "count",
};

const folderData = ref<Tree[]>([]);

onMounted(async () => {
  try {
    const response = await request.get("/data/folder");
    folderData.value = response.data;
    // 等待下一个 DOM 更新周期
    await nextTick();
  } catch (error) {
    ElMessage.error("Error loading folder_data" + error);
  }
});

const handleNodeClick = (folderData: Tree) => {
  const { start, count } = folderData;
  SetPlaylistStore().start = start;
  SetPlaylistStore().count = count;
  // console.log(start, count);
};
</script>

<style scoped></style>
