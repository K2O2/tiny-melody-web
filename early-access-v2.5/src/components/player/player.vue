<template>
  <div class="music-player">
    <audio ref="audioPlayer" controls :src="musicUrl" @ended="handleEnded">
      audio is not support in your brower
    </audio>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["musicEnded"]);

const props = defineProps({
  musicUrl: {
    type: String,
    default: "",
  },
});

const audioPlayer = ref(null);

function handleEnded() {
  emit("musicEnded");
}

watch(
  () => props.musicUrl,
  (newUrl) => {
    if (audioPlayer.value && newUrl) {
      audioPlayer.value.pause();
      audioPlayer.value.src = newUrl;
      audioPlayer.value.load();

      audioPlayer.value.addEventListener("loadedmetadata", () => {
        audioPlayer.value.play().catch((error) => {
          console.error("Auto Play Fail:", error);
        });
      });
    }
  }
);
</script>

<style scoped></style>
