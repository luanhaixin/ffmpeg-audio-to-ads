import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// DOM 元素
const message = document.getElementById('message');
const audio = document.getElementById('output-audio');
const uploader = document.getElementById('uploader');
const downloadBtn = document.getElementById('downloadBtn');
const fileName = document.getElementById('fileName');
const processBtn = document.getElementById('processBtn');
const rangeSlider = document.getElementById('rangeSlider');
const silenceStartSlider = document.getElementById('silenceStartSlider');
const silenceEndSlider = document.getElementById('silenceEndSlider');

console.log("是个应急项目，代码稍显简陋，先能用着")
// 全局变量
let currentFile = null;
let startTime = 0;
let endTime = 10;
let silenceStart = 0;
let silenceEnd = 0;
let audioInfo = {};

const ffmpeg = new FFmpeg();
const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';

// 加载 FFmpeg 核心文件
async function loadFFmpeg() {
    message.innerText = '⏳ 正在加载 FFmpeg 核心文件，请等待加载完成后使用...';
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    message.innerText = '✅ FFmpeg 加载完成，请上传文件';
}

// 初始化滑块控件
function initSliders() {
    noUiSlider.create(rangeSlider, {
        start: [0, 0],
        connect: true,
        range: { min: 0, max: 10 },
        step: 0.1,
        tooltips: [true, true],
        format: {
            to: (v) => v.toFixed(1) + "s",
            from: (v) => parseFloat(v)
        },
    });
    rangeSlider.noUiSlider.on('update', (values) => {
        startTime = parseFloat(values[0]);
        endTime = parseFloat(values[1]);
    });

    noUiSlider.create(silenceStartSlider, {
        start: [0],
        connect: 'lower',
        step: 0.1,
        range: { min: 0, max: 120 },
        tooltips: true,
        format: {
            to: (v) => v.toFixed(1) + "s",
            from: (v) => parseFloat(v),
        },
    });
    silenceStartSlider.noUiSlider.on('update', (values) => {
        silenceStart = parseFloat(values[0]);
    });

    noUiSlider.create(silenceEndSlider, {
        start: [0],
        connect: 'lower',
        step: 0.1,
        range: { min: 0, max: 120 },
        tooltips: true,
        format: {
            to: (v) => v.toFixed(1) + "s",
            from: (v) => parseFloat(v),
        },
    });
    silenceEndSlider.noUiSlider.on('update', (values) => {
        silenceEnd = parseFloat(values[0]);
    });
}

// 获取音频信息
async function getAudioInfoFromVideo(file) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => resolve({ duration: video.duration });
        video.onerror = () => reject(new Error("无法解析视频文件"));
        video.src = URL.createObjectURL(file);
    });
}

async function getDetailedAudioInfo(file, ffmpeg) {
    try {
        // Step 1: 写入文件
        await ffmpeg.writeFile(file.name, await fetchFile(file));

        // Step 2: 提取音频轨道
        await ffmpeg.exec([
            '-i', file.name,
            '-vn', // 去掉视频
            '-acodec', 'pcm_s16le', // 使用无损格式方便解析
            '-ar', '44100',
            '-ac', '2',
            'audio_track.wav',
        ]);

        // Step 3: 读取提取后的音频
        const audioData = await ffmpeg.readFile('audio_track.wav');
        const blob = new Blob([audioData.buffer], { type: 'audio/wav' });

        // Step 4: 用 AudioContext 获取信息
        const context = new AudioContext();
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);

        return {
            sampleRate: audioBuffer.sampleRate,
            channels: audioBuffer.numberOfChannels,
            duration: audioBuffer.duration,
            length: audioBuffer.length,
        };
    } catch (err) {
        console.error("获取音频详细信息失败：", err);
        return null;
    }
}


// 更新滑块最大值
function updateRangeSlider(duration) {
    rangeSlider.noUiSlider.updateOptions({
        range: { min: 0, max: duration },
        start: [0, duration],
    });
}

// 下载按钮逻辑
downloadBtn.onclick = () => {
    if (!audio.src) {
        alert("还没有生成音频！");
        return;
    }
    // 生成5位随机字符串
    const randomHash = Math.random().toString(36).substring(2, 7);

    const a = document.createElement('a');
    a.href = audio.src;
    a.download = `output_audio_${randomHash}.mp3`; // 如 output_audio_k8f3z.mp3
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};


// 上传监听
uploader.addEventListener('change', async (e) => {
    if (uploader.files.length > 0) {
        currentFile = e.target.files[0];
        fileName.textContent = currentFile.name;

        audioInfo = await getDetailedAudioInfo(currentFile, ffmpeg);
        console.log(audioInfo)
        if (!audioInfo) {
            alert("无法解析音频信息");
            return;
        } else {
            updateRangeSlider(audioInfo.duration);
            processBtn.disabled = false;
            downloadBtn.disabled = true;
            audio.style.display = 'none';
        }

    } else {
        fileName.textContent = '未选择文件';
    }
});

// 处理音频逻辑
processBtn.addEventListener('click', async () => {
    if (!currentFile) {
        alert('请先上传文件');
        return;
    }

    message.innerText = '处理中，请稍候...';
    processBtn.disabled = true;
    audio.style.display = 'none';

    await ffmpeg.writeFile(currentFile.name, await fetchFile(currentFile));

    message.innerText = '⏳ 正在分析音频参数...';

    const sampleRate = audioInfo.sampleRate || 44100;
    const channelLayout = audioInfo.channels === 1 ? 'mono' : 'stereo';

    message.innerText = '⏳ 正在截取音频片段...';
    await ffmpeg.exec([
        '-i', currentFile.name,
        '-ss', startTime.toString(),
        '-to', endTime.toString(),
        '-map', 'a',
        '-q:a', '0',
        'segment.mp3',
    ]);

    if (silenceStart > 0) {
        message.innerText = '⏳ 生成开头静音...';
        await ffmpeg.exec([
            '-f', 'lavfi',
            '-i', `anullsrc=r=${sampleRate}:cl=${channelLayout}`,
            '-t', silenceStart.toString(),
            '-q:a', '0',
            'silence_start.mp3',
        ]);
    }

    if (silenceEnd > 0) {
        message.innerText = '⏳ 生成结尾静音...';
        await ffmpeg.exec([
            '-f', 'lavfi',
            '-i', `anullsrc=r=${sampleRate}:cl=${channelLayout}`,
            '-t', silenceEnd.toString(),
            '-q:a', '0',
            'silence_end.mp3',
        ]);
    }

    message.innerText = '⏳ 拼接音频中...';
    const concatList = [];
    if (silenceStart > 0) concatList.push("file 'silence_start.mp3'");
    concatList.push("file 'segment.mp3'");
    if (silenceEnd > 0) concatList.push("file 'silence_end.mp3'");

    await ffmpeg.writeFile('concat_list.txt', new TextEncoder().encode(concatList.join('\n')));
    await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'concat_list.txt',
        '-c:a', 'libmp3lame',
        '-q:a', '2',
        'output.mp3',
    ]);

    message.innerText = '⏳ 读取输出文件...';
    const data = await ffmpeg.readFile('output.mp3');
    const blob = new Blob([data.buffer], { type: 'audio/mpeg' });

    audio.src = URL.createObjectURL(blob);
    audio.style.display = 'block';
    document.getElementById('audioContainer').style.display = 'block';

    message.innerText = '✅ 处理完成，可以播放或下载音频了';
    processBtn.disabled = false;
    downloadBtn.disabled = false;
});

// 初始化
loadFFmpeg();
initSliders();
