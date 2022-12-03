class AudioOptions {
  constructor(el, props) {
    this.el = el;
    this.props = props;
    this.dom = {
      audioElement: this.props.audioElement,
      playbackSelect: this.el.querySelector('.audio-player__options-select'),
      optionsBtn: this.el.querySelector('.audio-player__options-btn'),
      optionsMenu: this.el.querySelector('.audio-player__options-menu'),
      downloadBtn: this.el.querySelector('.audio-player__download-btn'),
    };
    this.isAudioReady = false;
    this.playbackRate = 1;
    this.checkAudioState();
    this.addListeners();
  }

  addListeners() {
    this.dom.optionsBtn.addEventListener(
      'click',
      this.handleOptionsClick.bind(this)
    );
    this.dom.playbackSelect.addEventListener(
      'change',
      this.handlePlaybackChange.bind(this)
    );
    window.addEventListener('click', this.handleWindowClick.bind(this));
  }

  checkAudioState() {
    if (this.dom.audioElement.readyState > 0) {
      this.dom.downloadBtn.setAttribute('href', this.dom.audioElement.src);
      this.isAudioReady = true;
    } else {
      this.dom.audioElement.addEventListener('loadedmetadata', () => {
        this.dom.downloadBtn.setAttribute('href', this.dom.audioElement.src);
        this.isAudioReady = true;
      });
    }
  }

  handleWindowClick(e) {
    if (!this.dom.optionsMenu.contains(e.target)) {
      this.dom.optionsMenu.classList.remove('expanded');
    }
  }

  handleOptionsClick(e) {
    e.stopPropagation();
    this.dom.optionsMenu.classList.add('expanded');
  }

  handlePlaybackChange(e) {
    if (this.isAudioReady) {
      this.playbackRate = e.target.value;
      this.dom.audioElement.playbackRate = this.playbackRate;
    }
  }
}

export default AudioOptions;
