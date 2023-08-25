window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

const audio_ctx = new AudioContext();
let filter, analyser;
let firstTime = true;

const start = async () => {
    const audio = document.getElementById("my_audio");
    audio.preservesPitch = false;
    // audio.volume = 0.5;
    audio.crossOrigin = "anonymous";
    audio.loop = true;
    // audio.currentTime = 32;
    const audioSrc = audio_ctx.createMediaElementSource(audio);

    filter = audio_ctx.createBiquadFilter();
    analyser = audio_ctx.createAnalyser();

    filter.type = "lowpass";
    filter.frequency.value = 80;
    filter.Q = 50;

    audioSrc.connect(filter);
    filter.connect(analyser);
    analyser.connect(audio_ctx.destination);

    const canvas = document.getElementById("canvas-visualizer"),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 10,
        gap = 2,
        capHeight = 2,
        capStyle = "#fff",
        meterNum = 800 / (10 + 2),
        capYPositionArray = [];

    const visualizer_canvas_ctx = canvas.getContext("2d");
    var gradient = visualizer_canvas_ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, "purple");
    gradient.addColorStop(0, "blue");

    const renderVisualizer = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const step = Math.round(array.length / meterNum);
        visualizer_canvas_ctx.clearRect(0, 0, cwidth, cheight);
        for (let i = 0; i < meterNum; i++) {
            const value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) capYPositionArray.push(value);
            visualizer_canvas_ctx.fillStyle = capStyle;
            if (value < capYPositionArray[i]) {
                visualizer_canvas_ctx.fillRect(
                    i * 12,
                    cheight - --capYPositionArray[i],
                    meterWidth,
                    capHeight
                );
            }
            else {
                visualizer_canvas_ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            }
            visualizer_canvas_ctx.fillStyle = gradient;
            visualizer_canvas_ctx.fillRect(
                i * 12,
                cheight - value + capHeight,
                meterWidth,
                cheight
            );
        }
        requestAnimationFrame(renderVisualizer);
    }
    renderVisualizer();
};

const progressBarScroll = () => {
    const linear = (m, x, c) => m * x + c;
    const exp = x => a * Math.pow(4, b * x) + 200;

    const m = (20000 - 80) / 100;
    const a = 0.91;
    const b = 0.1;

    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    if (filter) filter.frequency.value = Math.min(exp(scrolled), 20000);
    document.getElementById("progressBar").style.width = scrolled + "%";
};

const handleClick = () => {
    // if (firstTime) {
    //     var headphone = document.querySelectorAll(".headphone");
    //     headphone[1].innerHTML = "Scroll to reveal music!<br/> Headphones recommended!";
    //     setTimeout(() => { headphone.forEach(elm => { elm.style.opacity = 0; }) }, 3000);
    //     setTimeout(() => { headphone.forEach(elm => { elm.style.display = "none"; }) }, 4000);
    //     firstTime = false;
    // }
    if (audio_ctx.state === "suspended") audio_ctx.resume();
    let audio = document.getElementById("my_audio");
    if (audio.paused) audio.play();
    else audio.pause();
};
