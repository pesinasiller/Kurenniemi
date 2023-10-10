import createAudioNodes from "./createAudioNodes";
import { map } from "./utils";

class Kurenniemi {
  constructor() {
    this.myNodes = {};
    this.users = {};
  }

  setMyNodes(audioContext, synthData) {
    const audioNodes = createAudioNodes(synthData, audioContext);
    const { osc, gain } = audioNodes;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(audioContext.destination);
    this.audioContext = audioContext;
    this.myNodes = audioNodes;
  }

  updateMyFrequency(frequency) {
    if (!Object.keys(this.myNodes).length) return;
    this.myNodes.osc.frequency.value = frequency;
  }

  updateMyModulation(modulation) {
    if (!Object.keys(this.myNodes).length) return;
    this.myNodes.gain.gain.value = map(modulation, 2, 3000, 0.1, 0.5);
  }

  addUser(synthData) {
    if (this.users[synthData.connectionKey]) return;

    const audioNodes = createAudioNodes(synthData, this.audioContext);

    const { osc, gain } = audioNodes;
    gain.value = 0.1;
    osc.connect(gain);
    gain.connect(this.myNodes.osc.frequency);

    this.users[synthData.connectionKey] = audioNodes;
  }

  removeUser(connectionKey) {
    const audioNodes = this.users[connectionKey];
    if (audioNodes) {
      audioNodes.osc.stop();
      audioNodes.osc.disconnect();
      audioNodes.gain.disconnect();
      delete audioNodes.osc;
      delete audioNodes.gain;
    }
    delete this.users[connectionKey];
  }

  updateUserFrequency(connectionKey, frequency) {
    if (!this.users[connectionKey]) return;
    this.users[connectionKey].osc.frequency.value = frequency;
  }

  updateUserModulation(connectionKey, modulation) {
    if (!this.users[connectionKey]) return;
    this.users[connectionKey].gain.gain.value = modulation;
  }
}

export default Kurenniemi;
