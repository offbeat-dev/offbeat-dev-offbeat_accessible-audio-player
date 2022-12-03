class VolumeControl {
  constructor(el, props) {
    this.el = el;
    this.props = props;
    this.dom = {
      trackProgress: this.el.parentNode.querySelector(
        '.audio-player__track-progress'
      ),
      audioElement: this.props.audioElement,
      volumeLevel: this.el.querySelector('.audio-player__volume-level'),
      volumeBtn: this.el.querySelector('.audio-player__volume-btn'),
      volumeIcon: this.el.querySelector('.audio-player__volume-icon'),
      muteIcon: this.el.querySelector('.audio-player__mute-icon'),
    };
    this.isAudioReady = false;
    this.checkAudioState();
    this.addListeners();
  }

  addListeners() {
    this.dom.volumeLevel.addEventListener(
      'input',
      this.handleValueChange.bind(this)
    );
    this.dom.volumeLevel.addEventListener(
      'change',
      this.handleValueChange.bind(this)
    );
    this.dom.volumeLevel.addEventListener(
      'blur',
      this.handleControlBlur.bind(this)
    );
    this.dom.volumeBtn.addEventListener(
      'blur',
      this.handleControlBlur.bind(this)
    );
    this.el.addEventListener('mouseleave', this.handleControlBlur.bind(this));
    this.dom.volumeLevel.addEventListener(
      'focus',
      this.handleControlFocus.bind(this)
    );
    this.dom.volumeBtn.addEventListener(
      'focus',
      this.handleControlFocus.bind(this)
    );
    this.dom.volumeBtn.addEventListener(
      'mouseenter',
      this.handleControlFocus.bind(this)
    );
    this.dom.volumeBtn.addEventListener(
      'click',
      this.handleMuteUnmuteBtn.bind(this)
    );
  }

  checkAudioState() {
    if (this.dom.audioElement.readyState > 0) {
      this.audioReady = true;
      this.setVolume();
    } else {
      this.dom.audioElement.addEventListener('loadedmetadata', () => {
        this.audioReady = true;
        this.setVolume();
      });
    }
  }

  setVolume() {
    this.dom.audioElement.volume = this.dom.volumeLevel.value / 100;
    this.dom.audioElement.volume === 0 ? this.muteAudio() : this.unmuteAudio();
    this.dom.volumeLevel.setAttribute(
      'aria-valuenow',
      this.dom.volumeLevel.value
    );
    this.setVolumeStyle();
  }

  setVolumeStyle() {
    this.volumePercent = this.dom.volumeLevel.value;
    this.el.style.setProperty('--volume-percent', `${this.volumePercent}%`);
  }

  muteAudio() {
    this.dom.audioElement.muted = true;
    this.dom.volumeIcon.style.display = 'none';
    this.dom.muteIcon.style.display = 'inline-flex';
  }

  unmuteAudio() {
    this.dom.audioElement.muted = false;
    if (this.dom.audioElement.volume < 0.1) {
      this.dom.volumeLevel.value = 0.1 * 100;
      this.setVolume();
    }
    this.dom.muteIcon.style.display = 'none';
    this.dom.volumeIcon.style.display = 'inline-flex';
  }

  handleControlFocus() {
    this.el.classList.add('expanded');
    this.dom.trackProgress.classList.add('volume-control-expanded');
  }

  handleControlBlur() {
    this.el.classList.remove('expanded');
    this.dom.trackProgress.classList.remove('volume-control-expanded');
  }

  handleValueChange() {
    if (this.audioReady) {
      this.setVolume();
    }
    this.setVolumeStyle();
  }

  handleMuteUnmuteBtn() {
    if (this.audioReady) {
      if (this.dom.audioElement.muted === true) this.unmuteAudio();
      else this.muteAudio();
    }
  }
}

export default VolumeControl;
