<template>
  <!-- <div>player</div> -->
  <el-row style="height: 100%">
    <el-col :span="4">
      <div class="playcontrol">
        <el-button
          @click="MplaylistStore().playprev()"
          :icon="CaretLeft"
          size="large"
          circle
        />
        <el-button
          :disabled="playButtonDisabled"
          type="primary"
          :class="{ playing: MPlayerStore().isPaused }"
          :icon="playicon"
          @click="togglePlay"
          size="large"
          circle
        />
        <el-button
          @click="MplaylistStore().playnext()"
          :icon="CaretRight"
          size="large"
          circle
        /></div
    ></el-col>
    <el-col :span="14">
      <div style="display: flex; justify-content: center; align-items: center">
        <div class="cover">
          <el-image :src="coverUrl" fit="cover">
            <template #error>
              <img
                src="../../../../assets/logo256.png"
                style="height: 9vh; margin-top: 4px; margin-left: 2px"
              />
            </template>
          </el-image>
          <button @click="playing" class="playingPage"></button>
        </div>
        <div class="playbar">
          <div class="up">
            <div class="song-info">
              <el-text style="width: 40vw" size="large" truncated>
                {{ MplaylistStore().playArtist }}
                -
                {{ MplaylistStore().playAlbum }}
                -
                {{ MplaylistStore().playTitle }}
              </el-text>
            </div>
            <div>
              <span>{{ formattedCurrentTime }}</span>
              <span>/</span>
              <span>{{ formattedDuration }}</span>
            </div>
          </div>
          <div class="down">
            <el-slider
              style="
                .el-slider__bar {
                  visibility: hidden;
                }
              "
              v-model="progress"
              :show-tooltip="false"
              @change="seek"
              :max="MPlayerStore().duration"
            />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="2">
      <div class="modecontrol">
        <el-button
          @click="MPlayerStore().stop"
          size="large"
          :icon="Remove"
          circle
        />
        <el-button
          @click="changePlayMode"
          size="large"
          :icon="PlayModeIcon"
          circle
        />
      </div>
    </el-col>
    <el-col :span="4">
      <div class="volume">
        <el-icon><Headset /></el-icon>
        <el-slider
          style="margin-left: 10px"
          v-model="MPlayerStore().volume"
          @input="updateVolume"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {
  VideoPause,
  VideoPlay,
  CaretLeft,
  CaretRight,
  Remove,
  RefreshLeft,
  Refresh,
  MagicStick,
  Headset,
} from "@element-plus/icons-vue";
import { computed, ref, shallowRef, watch } from "vue";
import {
  MplaylistStore,
  MPlayerStore,
  playingPage,
} from "../../../../store/index.ts";
import { ElNotification } from "element-plus";
// import { useRouter } from "vue-router";
// 封面图,监听 playCover 的变化
const coverUrl = ref("data:image/jpeg;base64," + MplaylistStore().playCover);
const playCover = computed(() => MplaylistStore().playCover);
watch(playCover, (newValue) => {
  coverUrl.value = "data:image/jpeg;base64," + newValue;
});
// const $router = useRouter();
// const coverUrl = ref("data:image/jpeg;base64," + MplaylistStore().playCover);
const playing = () => {
  // $router.push("/playing");
  playingPage().playingShow = true;
};
// 播放模式图标
const PlayModeIcon = computed(() => {
  switch (MplaylistStore().playMethod) {
    case 2:
      return RefreshLeft;
    case 0:
      return Refresh;
    case 1:
      return MagicStick;
  }
});
// 方法，用于显示播放模式提示信息
const showPlayModeMessage = (playMethod: number) => {
  let message = "";
  switch (playMethod) {
    case 0:
      message = "顺序播放";
      break;
    case 1:
      message = "随机播放";
      break;
    case 2:
      message = "单曲循环";
      break;
  }
  ElNotification.info(message);
};

// 方法，用于切换播放模式
const changePlayMode = () => {
  playMode.value = (playMode.value + 1) % 3; // 循环切换播放模式
};
// 播放模式
const playMode = ref(0);

// 监听 playMode 的变化
watch(
  playMode,
  (newValue) => {
    MplaylistStore().playMethod = newValue;
    showPlayModeMessage(newValue);
  },
  { immediate: true }
);

// 播放按钮的 disabled 状态
const playButtonDisabled = ref(true);
const playicon = shallowRef(VideoPlay);
// 监听 audioSource 的变化
watch(
  () => MPlayerStore().audioSource,
  (newValue) => {
    playButtonDisabled.value = newValue === null;
  },
  { immediate: true }
);

const togglePlay = () => {
  if (MPlayerStore().isPaused) {
    MPlayerStore().play();
  } else {
    MPlayerStore().pause();
  }
};

watch(
  () => MPlayerStore().isPaused,
  (newValue) => {
    if (newValue) {
      playicon.value = VideoPlay;
    } else {
      playicon.value = VideoPause;
    }
  },
  { immediate: true }
);
// 计算属性，用于绑定滑块值的当前播放进度
const progress = computed({
  get: () => MPlayerStore().currentTime,
  set: (value) => {
    MPlayerStore().seek(value);
  },
});

// 方法，用于在滑块值变化时跳转到指定的时间戳
const seek = (value: number) => {
  MPlayerStore().seek(value);
};

function updateVolume(value: number) {
  // 将音量值从 0 到 100 的范围转换回 0 到 1 的范围
  MPlayerStore().volume = value;
  MPlayerStore().setVolume();
}
// 格式化时间的方法
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

// 计算属性，用于格式化的当前播放时间
const formattedCurrentTime = computed(() => {
  return formatTime(MPlayerStore().currentTime);
});

// 计算属性，用于格式化的歌曲全长
const formattedDuration = computed(() => {
  return formatTime(MPlayerStore().duration);
});
</script>

<style scoped lang="scss">
.container {
  justify-content: center;
  align-items: center;
  height: 95%;
  width: 100%;
}
.playcontrol {
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.cover {
  height: 10vh;
  width: 10vh;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 0.5vh;
}
.playbar {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 88%;
  .up {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .down {
    margin-top: 2px;
    width: 100%;
  }
}
.modecontrol {
  display: flex;
  justify-content: center;
  margin-left: 8px;
  align-items: center;
  height: 100%;
  width: 100%;
}
.volume {
  margin-left: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 60%;
}
.playingPage {
  position: absolute;
  height: 10vh;
  width: 10vh;
  z-index: 100;
  left: 16.42vw;
  border-radius: 50%;
  border: 0;
  background-color: rgba(0, 0, 0, 0);
  transition-duration: 0.2s;
}
.playingPage:hover {
  background-color: rgba(0, 0, 0, 0.15);
}
</style>
