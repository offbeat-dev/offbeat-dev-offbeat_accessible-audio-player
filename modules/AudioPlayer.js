import VolumeControl from './VolumeControl';
import AudioOptions from './AudioOptions';

class AudioPlayer {
  constructor(el) {
    this.el = el;
    this.dom = {
      progressTrack: this.el.querySelector('.audio-player__track-progress'),
      audioElement: this.el.querySelector('audio'),
      playPauseBtn: this.el.querySelector('.audio-player__play-pause-btn'),
      playIcon: this.el.querySelector('.cta-decorator--play'),
      pauseIcon: this.el.querySelector('.cta-decorator--pause'),
      currentTime: this.el.querySelector('.audio-player__current-time'),
      totalTime: this.el.querySelector('.audio-player__total-time'),
      volumeControl: this.el.querySelector('.audio-player__volume-control'),
      audioOptions: this.el.querySelector('.audio-player__options'),
    };

    this.audioReady = false;
    this.audioSource = this.el.dataset.audioSource;
    this.dom.audioElement.src = this.audioSource;
    this.progressPercent = 0;
    this.dom.progressTrack.value = 0;
    this.dom.progressTrack.setAttribute(
      'aria-valuenow',
      this.dom.progressTrack.value
    );
    this.setProgressStyle();
    this.checkAudioState();
    this.addListeners();
  }

  addListeners() {
    this.dom.progressTrack.addEventListener(
      'input',
      this.handleValueChange.bind(this)
    );
    this.dom.progressTrack.addEventListener(
      'change',
      this.handleValueChange.bind(this)
    );
    this.dom.playPauseBtn.addEventListener(
      'click',
      this.handlePlayPauseBtn.bind(this)
    );
    this.dom.audioElement.addEventListener(
      'ended',
      this.handleAudioEnded.bind(this)
    );
  }

  checkAudioState() {
    if (this.dom.audioElement.readyState > 0) {
      this.audioReady = true;
      this.pauseAudio();
      this.setDuration();
      this.initVolumeControl();
      this.initAudioOptions();
    } else {
      this.dom.audioElement.addEventListener('loadedmetadata', () => {
        this.audioReady = true;
        this.pauseAudio();
        this.setDuration();
        this.initVolumeControl();
        this.initAudioOptions();
      });
    }
  }

  initVolumeControl() {
    new VolumeControl(this.dom.volumeControl, {
      audioElement: this.dom.audioElement,
    });
  }

  initAudioOptions() {
    new AudioOptions(this.dom.audioOptions, {
      audioElement: this.dom.audioElement,
    });
  }

  setDuration() {
    this.dom.totalTime.textContent = this.calculateTime(
      this.dom.audioElement.duration
    );
    this.dom.progressTrack.setAttribute(
      'aria-valuetext',
      `${this.dom.currentTime.textContent}/${this.dom.totalTime.textContent}`
    );
  }

  calculateTime(ellapsedTime) {
    const minutes = Math.floor(ellapsedTime / 60);
    const seconds = Math.floor(ellapsedTime % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  }

  setProgressStyle() {
    this.progressPercent = this.dom.progressTrack.value;
    this.el.style.setProperty('--progress-percent', `${this.progressPercent}%`);
  }

  progressUpdate() {
    this.progressPercent = Math.floor(
      (this.dom.audioElement.currentTime / this.dom.audioElement.duration) * 100
    );
    this.dom.progressTrack.value = this.progressPercent;
    this.dom.progressTrack.setAttribute(
      'aria-valuenow',
      this.dom.progressTrack.value
    );
    this.el.style.setProperty('--progress-percent', `${this.progressPercent}%`);
    this.dom.currentTime.textContent = this.calculateTime(
      this.dom.audioElement.currentTime
    );
    this.dom.progressTrack.setAttribute(
      'aria-valuetext',
      `${this.dom.currentTime.textContent}/${this.dom.totalTime.textContent}`
    );
    this.raf = requestAnimationFrame(() => this.progressUpdate());
  }

  playAudio() {
    this.dom.audioElement.play();
    this.dom.playIcon.style.display = 'none';
    this.dom.pauseIcon.style.display = 'inline-flex';
    requestAnimationFrame(() => this.progressUpdate());
  }

  pauseAudio() {
    this.dom.audioElement.pause();
    this.dom.pauseIcon.style.display = 'none';
    this.dom.playIcon.style.display = 'inline-flex';
    cancelAnimationFrame(this.raf);
  }

  handleValueChange() {
    if (this.audioReady) {
      this.dom.audioElement.currentTime = Math.floor(
        (this.dom.progressTrack.value / 100) * this.dom.audioElement.duration
      );
      this.dom.currentTime.textContent = this.calculateTime(
        this.dom.audioElement.currentTime
      );
      this.dom.progressTrack.setAttribute(
        'aria-valuetext',
        `${this.dom.currentTime.textContent}/${this.dom.totalTime.textContent}`
      );
    }
    this.setProgressStyle();
  }

  handlePlayPauseBtn() {
    if (this.audioReady) {
      if (this.dom.audioElement.paused) this.playAudio();
      else this.pauseAudio();
    }
  }

  handleAudioEnded() {
    this.pauseAudio();
  }
}

export default AudioPlayer;
