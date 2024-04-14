import { defineStore } from "pinia";
import request from "../utils/request.ts";
import { ElMessage } from "element-plus";
import init, { parse_mp3 } from "../plugin/tiny_melody_plugin.js";

export const useTagStore = defineStore("tag", {
  state: () => ({
    artist: [],
    album: [],
    title: [],
    year: [],
  }),
  actions: {
    async fetchTag() {
      try {
        const response = await request.get("/data/tag");
        this.artist = response.data.artist;
        this.album = response.data.album;
        this.title = response.data.title;
        this.year = response.data.year;
      } catch (error) {
        ElMessage.error("Error loading tag_list" + error);
      }
    },
  },
});

export const MPlayerStore = defineStore("Mplayer", {
  state: () => ({
    audioContext: null as AudioContext | null,
    audioBuffer: null as AudioBuffer | null,
    audioSource: null as AudioBufferSourceNode | null,
    gainNode: null as GainNode | null,
    isPaused: false, // 是否处于暂停状态
    timerId: null as number | null,
    duration: 0, // 音频总时长
    startTime: 0, // 播放开始时间
    currentTime: 0, // 当前播放时间
    // pauseTime: 0, // 暂停时间
    volume: 50, // 音量
  }),
  actions: {
    async Load(arrayBuffer: any) {
      // 创建 AudioContext
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      // 解码音频数据
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // 如果已有音频源，停止当前播放
      if (this.audioSource) {
        this.audioSource.stop();
      }
      // 创建新的音频源并连接到音频上下文
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);

      // 创建新的音频源并连接到音频上下文
      // if (this.audioBuffer) {
      //   this.audioSource = this.audioContext!.createBufferSource();
      //   this.audioSource.buffer = this.audioBuffer;
      //   this.audioSource.connect(this.audioContext!.destination);
      //   this.audioSource.start(); // 开始播放
      // }
      this.play();
    },
    // 播放音频
    play() {
      if (this.audioBuffer) {
        if (this.isPaused) {
          // 如果之前暂停过，从暂停的位置继续播放
          this.audioSource = this.audioContext!.createBufferSource();
          this.audioSource.buffer = this.audioBuffer;
          this.audioSource.connect(this.gainNode!);
          this.setVolume();
          this.startTime = this.audioContext!.currentTime;
          this.audioSource.start(0, this.currentTime); // 从暂停位置开始播放
          this.isPaused = false;
        } else {
          // 如果是新的播放，从头开始
          // this.startTime = this.audioContext!.currentTime;
          this.audioSource = this.audioContext!.createBufferSource();
          this.audioSource.buffer = this.audioBuffer;
          this.duration = this.audioBuffer!.duration;
          this.audioSource.connect(this.gainNode!);
          this.setVolume();
          //设定完毕,重置单曲参数
          // this.pauseTime = 0;
          this.currentTime = 0;
          this.startTime = this.audioContext!.currentTime;
          this.audioSource.start(); // 开始播放
        }
      }
      if (this.audioSource) {
        // this.startTime = this.audioContext!.currentTime;
        this.updateTime(); // 开始更新时间
      }
    },
    // 暂停播放
    pause() {
      if (!this.isPaused) {
        if (this.timerId) {
          clearInterval(this.timerId); // 停止更新时间
          this.timerId = null;
        }
        if (this.audioSource) {
          this.startTime = this.audioContext!.currentTime - this.startTime;
          this.currentTime = this.currentTime + this.startTime;
          // this.pauseTime = this.currentTime;
          this.audioSource.stop();
          this.isPaused = true;
        }
      }
    },
    // 停止播放
    stop() {
      if (this.audioSource) {
        this.audioSource.stop();
        this.audioSource = null;
        this.duration = 0;
        this.currentTime = 0;
        MplaylistStore().playAlbum = "";
        MplaylistStore().playArtist = "";
        MplaylistStore().playTitle = "";
        // this.pauseTime = 0;
        this.isPaused = false;
      }
      if (this.timerId) {
        clearInterval(this.timerId); // 停止更新时间
        this.timerId = null;
      }
    },
    //跳转到时间戳
    seek(time: number) {
      if (this.audioBuffer && this.audioSource) {
        // this.startTime = this.audioContext!.currentTime - time;
        // this.pauseTime = 0;
        this.isPaused = false;
        this.audioSource.stop(); // 停止当前播放
        // this.audioSource = this.audioContext!.createBufferSource();
        // this.audioSource.buffer = this.audioBuffer;
        // this.audioSource.connect(this.gainNode!);
        // this.gainNode!.connect(this.audioContext!.destination);
        // this.audioSource.start(0, time); // 从指定时间开始播放

        this.audioSource = this.audioContext!.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        this.audioSource.connect(this.gainNode!);
        this.setVolume();
        this.currentTime = time;
        this.startTime = this.audioContext!.currentTime;
        this.audioSource.start(0, this.currentTime); // 从暂停位置开始播放
        // this.isPaused = false;
        this.updateTime(); // 重新开始更新时间
      }
    },
    // 设置音量
    setVolume() {
      if (this.gainNode) {
        this.gainNode.gain.value = this.volume / 100; // 设置增益节点的音量
      }
    },
    // 更新当前播放时间
    updateTime() {
      if (this.duration <= this.currentTime) {
        this.audioSource = null;
        this.duration = 0;
        this.currentTime = 0;
        MplaylistStore().playAlbum = "";
        MplaylistStore().playArtist = "";
        MplaylistStore().playTitle = "";
        //播放下一首
        MplaylistStore().playnext();
        // 如果当前时间已经超过总时长，停止更新时间
        this.stop();

        return;
      }
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        if (this.audioSource && this.audioBuffer) {
          this.startTime = this.audioContext!.currentTime - this.startTime;
          this.currentTime = this.currentTime + this.startTime;
          this.startTime = this.audioContext!.currentTime;
          // 如果需要更新进度条，可以在这里调用一个方法
          // console.log("currentTime:", this.currentTime);
          // // console.log("pauseTime:", this.pauseTime);
          // console.log(
          //   "audioContext.currentTime:",
          //   this.audioContext!.currentTime
          // );
          // console.log("duration:", this.duration);
          // this.updateProgressBar(this.currentTime, this.duration);
        }
      }, 480); // 每秒更新一次时间
    },
  },
});

export const MplaylistStore = defineStore("Mplayerlist", {
  state: () => ({
    playIndex: 0,
    playMethod: 0, // 播放模式，0为顺序播放，1为随机播放，2为单曲循环
    playArtist: "",
    playAlbum: "",
    playTitle: "",
    playCover: "",
    playLyric: "",
  }),
  actions: {
    async setPlay() {
      const index = SetPlaylistStore().playlist[this.playIndex];
      if (index >= 0) {
        // this.playIndex = index;
        try {
          // 假设请求的 API 返回的是 mpeg/audio 类型
          const response = await request.get(`/index/${index}`, {
            responseType: "arraybuffer", // 请求数组缓冲区类型的响应
          });
          const uint8Array = new Uint8Array(response.data);
          //加载封面和歌词
          await init();
          const parsedData = parse_mp3(uint8Array);
          // console.log(parsedData);
          const result = JSON.parse(parsedData);
          // console.log(result);
          this.playCover = result.cover;
          this.playLyric = result.lyrics;
          // console.log("cover" + this.playCover);
          // console.log("lyric" + this.playLyric);
          //获取对应的元数据
          this.playArtist = useTagStore().artist[index];
          this.playAlbum = useTagStore().album[index];
          this.playTitle = useTagStore().title[index];

          // 加载音频文件
          await MPlayerStore().Load(response.data);
        } catch (error) {
          console.error(error);
          ElMessage.error("加载文件时出错：" + error);
        }
      }
    },
    playnext() {
      switch (this.playMethod) {
        case 0:
          if (this.playIndex < SetPlaylistStore().playlist.length - 1) {
            this.playIndex++;
          } else {
            this.playIndex = 0;
          }
          this.setPlay();
          break;
        case 1:
          const index = Math.floor(
            Math.random() * SetPlaylistStore().playlist.length
          );
          this.playIndex = index;
          this.setPlay();
          break;
        case 2:
          this.setPlay();
          break;
      }
    },
    playprev() {
      switch (this.playMethod) {
        case 0:
          if (this.playIndex > 0) {
            this.playIndex--;
          } else {
            this.playIndex = SetPlaylistStore().playlist.length - 1;
          }
          this.setPlay();
          break;
        case 1:
          const index = Math.floor(
            Math.random() * SetPlaylistStore().playlist.length
          );
          this.playIndex = index;
          this.setPlay();
          break;
        case 2:
          this.setPlay();
          break;
      }
    },
  },
});

export const SetPlaylistStore = defineStore("setPlaylist", {
  state: () => ({
    start: 0,
    count: 0,
    playlist: [0],
  }),
  actions: {
    async createPlaylist() {
      // 确保传入的参数是有效的
      if (this.start < 0 || this.count <= 0) {
        ElMessage.error("Invalid parameters for creating playlist");
        return;
      }

      // 创建一个空白的播放列表数组
      const playlist = [];

      // 根据指定的开始位置和数量填充播放列表
      for (let i = this.start; i < this.start + this.count; i++) {
        // 假设每个索引对应一个音乐文件的路径
        // 这里可以使用异步操作获取实际的音乐文件信息
        playlist.push(i);
      }

      // 更新状态中的播放列表
      this.playlist = playlist;
    },
  },
});
