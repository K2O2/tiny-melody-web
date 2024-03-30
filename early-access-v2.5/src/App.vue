<template>
  <div>
    <el-container>
      <el-container height="90vh">
        <el-aside width="240px" class="sidebar">
          <el-scrollbar>
            <div class="logo-container">
              <img src="./assets/logo256.png" alt="melody logo" />
              <span>Melody</span>
            </div>
            <el-menu :default-openeds="[]">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon>
                    <Folder />
                  </el-icon>
                  <span class="menu">Folder</span>
                </template>
                <el-tree
                  style="max-width: 230px; margin-left: 5px"
                  :data="folder_data"
                  :props="defaultProps"
                  accordion
                  @node-click="handleNodeClick"
                />
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>

        <el-main>
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
        </el-main>
      </el-container>
      <el-footer height="10vh" class="bplayer">
        <player :musicUrl="currentMusicUrl" @musicEnded="playNextMusic" />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { Folder } from "@element-plus/icons-vue";
import { Column, ElIcon } from "element-plus";
import { ref } from "vue";
import axios from "axios";

const currentMusicUrl = ref("");
var currentMusicIndex = ref(-1);

const fetchAndPlayMusic = (index: number) => {
  axios
    .get("/music/" + index, {
      data: index,
      responseType: "arraybuffer",
    })
    .then((response) => {
      const blob = new Blob([response.data], { type: "audio/mpeg" });

      const url = URL.createObjectURL(blob);

      currentMusicUrl.value = url;

      // console.log(url);
    })
    .catch((error) => {
      console.error(error);
    });
};

const rowClick = (row: { rowData: { index: any } }) => {
  currentMusicIndex.value = row.rowData.index;
  fetchAndPlayMusic(currentMusicIndex.value);
  // console.log("quest for" + row.rowData.index);
};

const playNextMusic = () => {
  currentMusicIndex.value++;

  fetchAndPlayMusic(currentMusicIndex.value);

  // console.log("NEXT quest for" + currentMusicIndex);
};

let folder_data: Tree[] = [];

fetch("./folder.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    folder_data = data as Tree[];
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });

let tag_album: string[] = [];
let tag_title: string[] = [];
let tag_artist: string[] = [];
let tag_year: number[] = [];

fetch("./tag.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((tag) => {
    if (
      tag &&
      typeof tag === "object" &&
      Array.isArray(tag.album) &&
      Array.isArray(tag.title) &&
      Array.isArray(tag.artist) &&
      Array.isArray(tag.year)
    ) {
      tag_album = tag.album;
      tag_title = tag.title;
      tag_artist = tag.artist;
      tag_year = tag.year;
    } else {
      throw new Error("Invalid tag data structure");
    }
  })
  .catch((error) => {
    console.error("Error reading tag.json:", error);
  });

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
  start: "start",
  count: "count",
};

let tagIndex = -1;

const list_create = () => ({
  index: `${++tagIndex}`,
  artist: tag_artist[tagIndex],
  album: tag_album[tagIndex],
  title: tag_title[tagIndex],
  year: tag_year[tagIndex],
});

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

const list_data = ref(Array.from({ length: 0 }).map(list_create));
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
