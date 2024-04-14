<template>
  <el-auto-resizer>
    <template #default="{ height, width }">
      <el-table-v2
        :columns="columns"
        :data="list_data"
        :width="width"
        :height="height"
        auto
        :row-event-handlers="{ onClick: rowClick }"
      />
    </template>
  </el-auto-resizer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Column, ElMessage } from "element-plus";
import {
  useTagStore,
  MplaylistStore,
  SetPlaylistStore,
} from "../../../../store/index.ts";

const tag = ref({
  artist: useTagStore().artist,
  album: useTagStore().album,
  title: useTagStore().title,
  year: useTagStore().year,
});

// console.log(tag.value);

let index = 0;
const tagIndex = ref(-1);
const list_create = () => ({
  index: index++,
  artist: tag.value.artist[++tagIndex.value],
  album: tag.value.album[tagIndex.value],
  title: tag.value.title[tagIndex.value],
  year: tag.value.year[tagIndex.value],
});

const list_data = ref(Array.from({ length: 0 }).map(list_create));

const columns: Column<any>[] = [
  {
    title: "Play",
    key: "index",
    width: 80,
    align: "center",
  },
  {
    key: "artist",
    title: "Artist",
    width: 200,
    dataKey: "artist",
    // align: 'center',
  },
  {
    key: "album",
    title: "Album",
    dataKey: "album",
    width: 400,
    // align: 'center',
  },
  {
    key: "title",
    title: "Title",
    width: 450,
    dataKey: "title",
    // align: 'center',
  },
  {
    key: "year",
    title: "year",
    width: 80,
    dataKey: "year",
    align: "center",
  },
];

const setPlaylistStore = SetPlaylistStore();

watch(
  [() => setPlaylistStore.start, () => setPlaylistStore.count],
  ([newStart, newCount]) => {
    // 当 start 或 count 变化时，更新 list_data
    index = 0;
    tagIndex.value = newStart - 1;
    const newListData = Array.from({ length: newCount }).map(list_create);
    list_data.value = newListData;
  },
  {
    immediate: true, // 初始执行一次 watch
  }
);

const rowClick = async (row: { rowData: { index: any } }) => {
  try {
    await setPlaylistStore.createPlaylist();

    // 等待 createPlaylist 完成后，再设置播放索引
    MplaylistStore().playIndex = row.rowData.index;

    // console.log(MplaylistStore().playIndex);

    MplaylistStore().setPlay();
    // 打印播放列表
    // console.log(setPlaylistStore.playlist);
  } catch (error) {
    // 错误处理
    ElMessage.error("创建播放列表时发生错误:" + error);
  }
};
</script>

<style scoped></style>
