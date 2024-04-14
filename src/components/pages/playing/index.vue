<template>
  <div class="container">
    <!-- <div>{{ lyrics }}</div> -->
    <div class="background"></div>
    <div class="main">
      <el-row>
        <el-col :span="11">
          <div class="left">
            <div style="position: absolute; top: 2vw; left: 2vw">
              <el-button
                :icon="Close"
                size="large"
                circle
                @click="playinghide"
              ></el-button>
            </div>
            <!-- <button @click="playinghide"></button> -->
            <div class="cover" style="margin-top: 18vh">
              <el-image
                :src="coverUrl"
                style="height: 100%; width: 100%; overflow: hidden"
                fit="cover"
              >
                <template #error>
                  <img
                    src="../../../assets/logo256.png"
                    style="height: 100%"
                  /> </template
              ></el-image>
            </div>
            <div class="info" style="margin-top: 4vh">
              <div
                style="
                  font-size: 24px;
                  width: 28vw;
                  text-align: center;
                  font-weight: 500;
                "
              >
                {{ MplaylistStore().playTitle }}
              </div>
              <div
                style="
                  font-size: 20px;
                  width: 28vw;
                  text-align: center;
                  font-weight: 400;
                  margin-top: 1.5vh;
                "
              >
                {{ MplaylistStore().playArtist }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="13">
          <div class="lyrics">
            <div
              class="lyrics-container"
              :style="{
                transform: `translateY(calc(${-currentLine * 40}px + 40vh))`,
              }"
            >
              <div
                v-for="(lyric, index) in arrays.contentArray"
                :key="index"
                :ref="`${index}`"
                class="lyric-line"
                :class="{ selected: index === currentLine }"
              >
                {{ lyric }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Close } from "@element-plus/icons-vue";
import { computed, ref, watch } from "vue";
import {
  MPlayerStore,
  MplaylistStore,
  playingPage,
} from "../../../store/index.ts";
// const lyrics = MplaylistStore().playLyric;
var arrays = {
  startTimeArray: [0],
  contentArray: [""],
};
// 封面图,监听 playCover 的变化
const coverUrl = ref("data:image/jpeg;base64," + MplaylistStore().playCover);
const playCover = computed(() => MplaylistStore().playCover);
watch(playCover, (newValue) => {
  coverUrl.value = "data:image/jpeg;base64," + newValue;
});

// 歌词,监听 playLyric 的变化
const playLyric = computed(() => MplaylistStore().playLyric);
watch(playLyric, (newValue) => {
  arrays = lyricsToArrays(newValue);
  // console.log("歌词转换后的数组:", arrays);
  // console.log("歌词转换后的数组:", arrays.startTimeArray);
  // console.log("歌词转换后的数组:", arrays.contentArray);
});

const playinghide = () => {
  playingPage().playingShow = false;
};

const currentTime = computed(() => MPlayerStore().currentTime);
const currentLine = ref(0);
// const totalLine = ref(arrays.startTimeArray.length);

// 监听 currentTime 的变化

watch(currentTime, (newValue) => {
  //确认播放到哪一行
  for (let i = 0; i < arrays.startTimeArray.length - 1; i++) {
    if (
      newValue >= arrays.startTimeArray[i] &&
      newValue < arrays.startTimeArray[i + 1]
    ) {
      currentLine.value = i;
      break;
    }
  }
  // console.log("当前行:", currentLine.value);
  //选中对应的一行
});

// console.log("起始时间数组:", arrays.startTimeArray);
// console.log("歌词内容数组:", arrays.contentArray);

// 时间转换函数
function timeToSeconds(time: string) {
  var parts = time.split(":");
  var minutes = parseInt(parts[0], 10);
  var seconds = parseFloat(parts[1]);
  var totalSeconds = minutes * 60 + seconds;
  return totalSeconds;
}

// 歌词转换函数
function lyricsToArrays(lyrics: string) {
  var lines = lyrics.split("\n"); // 分割歌词为每行
  var startTimeArray = [];
  var contentArray = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var match = line.match(/\[(\d+:\d+\.\d+)\](.*)/);
    if (match) {
      var timeTag = match[1];
      var content = match[2].trim();
      var startTime = timeToSeconds(timeTag);

      startTimeArray.push(startTime);
      contentArray.push(content);
    }
  }

  startTimeArray.push(MPlayerStore().duration);
  return {
    startTimeArray: startTimeArray,
    contentArray: contentArray,
  };
}
</script>

<style scoped>
.container {
  /* visibility: hidden; */
  transition: all 0.5s ease-in-out;
}
.background {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  overflow: hidden;
  /* filter: blur(50px); */
}
.main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;

  .left {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;
    height: 100vh;
    .cover {
      height: 50vh;
      width: 50vh;
      border-radius: 2%;
      box-shadow: 0 0 15px #000;
      overflow: hidden;
    }
  }
  .lyrics {
    display: flex;
    /* justify-content: center; */
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.8) 20%,
      rgba(0, 0, 0, 1) 30%,
      rgba(0, 0, 0, 1) 70%,
      rgba(0, 0, 0, 0.3) 80%,
      rgba(0, 0, 0, 0) 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.8) 20%,
      rgba(0, 0, 0, 1) 30%,
      rgba(0, 0, 0, 1) 70%,
      rgba(0, 0, 0, 0.4) 80%,
      rgba(0, 0, 0, 0) 100%
    );
  }
}
.lyrics-container {
  transition: transform 0.5s ease-in-out; /* 平滑滚动效果 */
}
.lyric-line {
  height: 40px; /* 假设每行歌词高度为24px */
  font-size: 20px;
  font-weight: 300;
  text-align: 40px;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
}
.selected {
  color: #ff7e9e;
  text-shadow: 0 0 3px #e8dfb5;
  font-weight: 500 !important;
  font-size: 32px !important;

  margin-bottom: 12px;
  /* animation: line0 0.2s ease-in-out; */
}
</style>
