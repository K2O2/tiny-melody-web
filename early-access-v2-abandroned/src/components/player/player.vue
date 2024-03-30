<template>
    <div class="music-player">
      <audio ref="audioPlayer" controls :src="musicUrl">
        您的浏览器不支持 audio 元素。
      </audio>
      <!-- <button @click="togglePlay">播放/暂停</button> -->
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    musicUrl: {
      type: String,
      default: '../../public/水瀬いのり (水濑祈) - 風色Letter (风色信).mp3'
    }
  });
  
  const audioPlayer = ref(null);
  
  function togglePlay() {
    if (audioPlayer.value.paused) {
      audioPlayer.value.play();
    } else {
      audioPlayer.value.pause();
    }
  }
  
  // 监听音乐URL的变化，当有新的音乐文件时，自动暂停当前播放并加载新的音乐文件
  watch(() => props.musicUrl, (newUrl) => {
  if (audioPlayer.value && newUrl) {
    audioPlayer.value.pause();
    audioPlayer.value.src = newUrl;
    audioPlayer.value.load();

    // 等待音频元数据加载完毕后再尝试播放
    audioPlayer.value.addEventListener('loadedmetadata', () => {
      audioPlayer.value.play().catch(error => {
        // 处理播放错误，例如用户尚未与页面交互
        console.error("自动播放失败:", error);
      });
    });
  }
});
  </script>
  
  <style scoped>
  .music-player {
    /* 添加您的样式 */
    
  }
  </style>
  
