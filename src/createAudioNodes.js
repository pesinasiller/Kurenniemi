const createAudioNodes = (synthData, audioContext) => {
  const { frequency } = synthData;
  const osc = audioContext.createOscillator();
  osc.type = ["sine", "square", "sawtooth", "triangle"][
    Math.floor(Math.random() * 4)
  ];
  osc.frequency.value = frequency;
  osc.start();
  const gain = audioContext.createGain();
  gain.gain.value = 3000;
  osc.connect(gain);
  return { osc, gain };
};

export default createAudioNodes;
