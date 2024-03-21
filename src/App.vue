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
                <el-tree style="max-width: 230px; margin-left: 5px;" :data="folder_data" :props="defaultProps" accordion
                  @node-click="handleNodeClick" />
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

          <el-auto-resizer>
            <template #default="{ height, width }">
              <el-table-v2 :columns="columns" :data="list_data" :width="width" :height="height" auto
                :row-event-handlers="{ onClick: rowClick }" />
            </template>
          </el-auto-resizer>

        </el-main>
      </el-container>
      <el-footer height="10vh" class="bplayer">
        <span>Player</span>
      </el-footer>
    </el-container>
  </div>

</template>

<script setup lang="ts">
import { Eleme, Folder, Tickets, Setting } from '@element-plus/icons-vue';
import {
  Column,
  ElIcon,
} from 'element-plus'
// import folder from './components/data/folder.json';
// import tag from './components/data/tag.json';
import { ref } from 'vue';
import { RowEventHandlerParams } from 'element-plus/lib/components/table-v2/src/row.js';
import axios from 'axios';

// 读取 folder.json 文件
let folder_data: Tree[] = [];

// 使用fetch API读取JSON文件
fetch('./folder.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // 将解析后的JSON数据赋值给全局变量
    folder_data = data as Tree[];
    // 现在，您可以在网页的任何地方使用folder_data变量了
    // console.log(folder_data);
    // ...进行下一步操作
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

  // 声明全局变量为数组类型
let tag_album: string[] = [];
let tag_title: string[] = [];
let tag_artist: string[] = [];
let tag_year: number[] = [];

// 读取 tag.json 文件
fetch('./tag.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(tag => {
    // 确保tag对象包含所需的属性，并且它们都是数组
    if (tag && typeof tag === 'object' && Array.isArray(tag.album) && Array.isArray(tag.title) && Array.isArray(tag.artist) && Array.isArray(tag.year)) {
      tag_album = tag.album;
      tag_title = tag.title;
      tag_artist = tag.artist;
      tag_year = tag.year;

    } else {
      throw new Error('Invalid tag data structure');
    }
  })
  .catch(error => {
    console.error('Error reading tag.json:', error);
  });


const rowClick = (row: RowEventHandlerParams) => {
  console.log(row.rowData.index)

  axios.post('/api', { data: row.rowData.index })
    .then(response => {
      // 处理响应数据
      console.log(response.data);
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}

interface Tree {
  start: number;
  count: number;
}

const handleNodeClick = (folderData: Tree) => {

  const { start, count } = folderData;
  console.log(start, count);

  tagIndex = start - 1;

  const newListData = Array.from({ length: count }).map(list_create);
  list_data.value = newListData;

};

const defaultProps = {
  start: 'start',
  count: 'count',
};

let tagIndex = -1;

const list_create = () => (
  {
    index: `${++tagIndex}`,
    artist: tag_artist[tagIndex],
    album: tag_album[tagIndex],
    title: tag_title[tagIndex],
    year: tag_year[tagIndex],
  }
)


const columns: Column<any>[] =
  [
    {
      title: 'Play',
      key: 'index',
      width: 80,
      align: 'center',
    },
    {
      key: 'artist',
      title: 'Artist',
      width: 200,
      dataKey: 'artist',
      // align: 'center',
    }, {
      key: 'album',
      title: 'Album',
      dataKey: 'album',
      width: 400,
      // align: 'center',
    }, {
      key: 'title',
      title: 'Title',
      width: 450,
      dataKey: 'title',
      // align: 'center',
    }, {
      key: 'year',
      title: 'year',
      width: 80,
      dataKey: 'year',
      align: 'center',
    }
  ];

const list_data = ref(Array.from({ length: 0 }).map(list_create))
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

  span {
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