const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.EditApi();

let apiUrl = 'https://api.shotstack.io/stage';

if (!process.env.SHOTSTACK_KEY) {
    console.log('API Key is required. Set using: export SHOTSTACK_KEY=your_key_here');
    process.exit(1);
}

if (process.env.SHOTSTACK_HOST) {
    apiUrl = process.env.SHOTSTACK_HOST;
}

defaultClient.basePath = apiUrl;
DeveloperKey.apiKey = process.env.SHOTSTACK_KEY;

const VIDEO_WIDTH = 1024;
const PROGRESS_BAR_SEGMENTS = VIDEO_WIDTH / 4;
const VIDEO_DURATION = 8;

const progressBarClips = [];

for (let part = 0; part < PROGRESS_BAR_SEGMENTS; part++) {
    if (part === 0) {
        continue;
    }

    const width = VIDEO_WIDTH / (PROGRESS_BAR_SEGMENTS - 1) * part;
    
    const clipLength = VIDEO_DURATION / PROGRESS_BAR_SEGMENTS;
    const clipStart = part / PROGRESS_BAR_SEGMENTS * VIDEO_DURATION;

    const progressBarAsset = new Shotstack.HtmlAsset;
    progressBarAsset
        .setHtml('<p>&nbsp;</p>')
        .setBackground('#25d3d0')
        .setWidth(width)
        .setHeight(16);

    const progressBarClip = new Shotstack.Clip;
    progressBarClip
        .setAsset(progressBarAsset)
        .setStart(clipStart)
        .setLength(clipLength)
        .setPosition('topLeft');

    progressBarClips.push(progressBarClip);
}

const progressBarTrack = new Shotstack.Track;
progressBarTrack.setClips(progressBarClips);

const videoAsset = new Shotstack.VideoAsset;
videoAsset
    .setSrc('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/city-timelapse.mp4');

const videoClip = new Shotstack.Clip;
videoClip
    .setAsset(videoAsset)
    .setStart(0)
    .setLength(VIDEO_DURATION);

const videoTrack = new Shotstack.Track;
videoTrack.setClips([videoClip]);

const timeline = new Shotstack.Timeline;
timeline.setTracks([progressBarTrack, videoTrack]);

const output = new Shotstack.Output;
output
    .setFormat('mp4')
    .setResolution('sd');

const edit = new Shotstack.Edit;
edit
    .setTimeline(timeline)
    .setOutput(output);

api.postRender(edit).then((data) => {
    const message = data.response.message;
    const id = data.response.id
    
    console.log(message + '\n');
    console.log('>> Now check the progress of your render by running:');
    console.log('>> node examples/status.js ' + id);

}, (error) => {
    console.error('Request failed: ', error);
    process.exit(1);
});
