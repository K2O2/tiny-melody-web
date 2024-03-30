<template>
  <div>
    <el-container>
      <el-container height="90vh">
        <el-aside width="240px" class="sidebar">
          <el-scrollbar>
            <div class="logo-container">
              <img src="./assets/logo256.png" alt="melody logo">
              <span>Melody</span>
            </div>
            <el-menu :default-openeds="[]">
              <el-menu-item index="1">
                <template #title>
                  <el-icon>
                    <Eleme />
                  </el-icon>
                  <span class="menu">Song</span>
                </template>
              </el-menu-item>
              <el-menu-item index="2">
                <template #title>
                  <el-icon>
                    <Tickets />
                  </el-icon>
                  <span class="menu">Lists</span>
                </template>
              </el-menu-item>
              <el-sub-menu index="3">
                <template #title>
                  <el-icon>
                    <Folder />
                  </el-icon>
                  <span class="menu">Folder</span>
                </template>
                <el-tree style="max-width: 230px; margin-left: 10px;" :data="folder_data" :props="defaultProps"
                  accordion @node-click="handleNodeClick" />
              </el-sub-menu>
              <el-menu-item index="4">
                <template #title>
                  <el-icon>
                    <Setting />
                  </el-icon>
                  <span class="menu">Setting</span>
                </template>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </el-aside>

        <el-main>
          <div style="height: 100%; width: 100%;">
            <el-auto-resizer>
              <template #default="{ height, width }">
                <el-table-v2 :columns="columns" :data="data" :width="width" :height="height" fixed/>
              </template>
            </el-auto-resizer>
          </div>
        </el-main>
      </el-container>
      <el-footer height="10vh" class="bplayer">
        <span>Player</span>
      </el-footer>
    </el-container>
  </div>

</template>

<script setup lang="ts">
import { Eleme, Folder, Tickets } from '@element-plus/icons-vue';
import folder from '@/components/data/folder.json';
import tag from '@/components/data/tag.json';
import { ref } from 'vue';

const tag_album = tag.album;
const tag_title = tag.title;
const tag_artist = tag.artist;
const tag_year = tag.year;

// console.log(tag_album)

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => {
    const variableName = getVariableNameByColumnIndex(columnIndex);
    const variableWidth = getVariableWidth(columnIndex);
    return {
      ...props,
      key: `${prefix}${columnIndex}`,
      dataKey: `${prefix}${columnIndex}`,
      title: variableName,
      width: variableWidth,
    };
  });

  const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-',
  start = 0,
  count = length
) =>
  Array.from({ length: count }).map((_, rowIndex) => {
    const tagIndex = (start + rowIndex) % tag_album.length;
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = getDataByColumn(columnIndex, tagIndex);
        return rowData;
      },
      { id: `${prefix}${start + rowIndex}`, parentId: null }
    );
  }).slice(0, count);

// 根据列索引和tag索引获取数据的辅助函数
const getDataByColumn = (columnIndex: number, tagIndex: number) => {
  switch (columnIndex) {
    case 0:
      return tag_artist[tagIndex];
    case 1:
      return tag_album[tagIndex];
    case 2:
      return tag_title[tagIndex];
    case 3:
      return tag_year[tagIndex];
    default:
      return '';
  }
};

// 根据列索引获取变量名称的辅助函数
const getVariableNameByColumnIndex = (columnIndex: number) => {
  switch (columnIndex) {
    case 0:
      return 'Artist';
    case 1:
      return 'Album';
    case 2:
      return 'Title';
    case 3:
      return 'Year';
    default:
      return '';
  }
};

const getVariableWidth = (columnIndex: number) => {
  switch (columnIndex) {
    case 0:
      return 300;
    case 1:
      return 400;
    case 2:
      return 450;
    case 3:
      return 80;
    default:
      return;
  }
};

const columns = generateColumns(4);
const data = ref(generateData(columns));

interface Tree {
  start: number;
  count: number;
}

const handleNodeClick = (folderData: Tree) => {
  // 从点击的folderData中提取start和count的值
  const { start, count } = folderData;
  // console.log(start, count);

  // 根据start和count更新data数组的子集
  const newData = generateData(columns, count, 'row-',start,count);

  // 使用新数据更新data变量
  data.value = newData;
};

const folder_data: Tree[] = folder;
const defaultProps = {
  start: 'start',
  count: 'count',
};
</script>

<style scoped lang="scss">
.logo-container {
  display: flex;
  height: 10vh;
  align-items: center;
  justify-content: center;

  img {
    height: 7vh;
  }

  span {
    margin-left: 0.5vw;
    margin-right: 0.5vw;
    font-size: 4.5vh;
    color: pink;
  }
}

.bplayer {
  display: flex;
  width: 100%;
  bottom: 0;
  position: fixed;
  justify-items: center;
  align-items: center;
  // background-color: aquamarine;
  border-top: 2px solid var(--el-border-color);
  span{
    font-size: 20px;
  }
}

.sidebar {
  overflow: hidden;
  height: 90vh;
  // background-color: azure;
  border-right: 2px solid var(--el-border-color);
}

.menu {
  font-size: 16px;
}
</style>