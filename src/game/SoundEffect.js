import { sounds } from './sound';

const volume = 0.4;

const getSound = name => sounds[`sounds/${name}.wav`] ?? sounds[`sounds/${name}.mp3`];

const SoundEffect = {
  ambient () {
    return getSound('ambient');
  },
  deploy () {
    return getSound('deploy');
  },
  explosion () {
    return getSound('explosion');
  },
  explosion2 () {
    return getSound('explosion2');
  },
  pause () {
    return getSound('pause');
  },
  random () {
    return getSound('random');
  },
  random2 () {
    return getSound('random2');
  },
  select () {
    return getSound('select');
  },
  warning () {
    return getSound('warning');
  },
};

SoundEffect.ambient.path = 'sounds/ambient.mp3';

const whenLoaded = sounds.whenLoaded;

sounds.whenLoaded = () => {
  whenLoaded?.();

  getSound('ambient').volume = 0.1;
  getSound('ambient').loop = true;

  getSound('warning').volume = 0.5;

  getSound('pause').volume = 2.5;

  getSound('select').volume = 0.7;

  Object.keys(SoundEffect).forEach(s => {
    getSound(s).volume *= volume;
  });
};

export default SoundEffect;
