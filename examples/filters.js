const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.DefaultApi()

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

const filters = [
    'original',
    'boost',
    'contrast',
    'muted',
    'darken',
    'lighten',
    'greyscale',
    'negative',
];

let videoClips = [];
let titleClips = [];
let start = 0;
let length = 3;
let trim = 0;
let end = length;

let soundtrack = new Shotstack.Soundtrack;
soundtrack
    .setSrc('https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/freeflow.mp3')
    .setEffect('fadeInFadeOut');

filters.forEach((filter) => {
    // Video clips
    let videoAsset = new Shotstack.VideoAsset;
    videoAsset
        .setSrc('https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/footage/skater.hd.mp4')
        .setTrim(trim);

    let videoClip = new Shotstack.Clip;
    videoClip
        .setAsset(videoAsset)
        .setStart(start)
        .setLength(length)

    if (filter !== 'original') {
        let videoTransition = new Shotstack.Transition;
        videoTransition
            .setIn('wipeRight');

        videoClip
            .setTransition(videoTransition)
            .setFilter(filter)
            .setLength(length + 1)
    }

    videoClips.push(videoClip);

    // Title clips
    let titleTransition = new Shotstack.Transition;
    titleTransition
        .setIn('fade')
        .setOut('fade');

    let titleAsset = new Shotstack.TitleAsset;
    titleAsset
        .setText(filter)
        .setStyle('minimal');

    let titleClip = new Shotstack.Clip;
    titleClip
        .setAsset(titleAsset)
        .setLength(length - (start === 0 ? 1 : 0))
        .setStart(start)
        .setTransition(titleTransition);

    titleClips.push(titleClip);

    trim = end - 1;
    end = trim + length + 1;
    start = trim;
});

let track1 = new Shotstack.Track;
track1
    .setClips(titleClips);

let track2 = new Shotstack.Track;
track2
    .setClips(videoClips);

let timeline = new Shotstack.Timeline;
timeline
    .setBackground('#000000')
    .setSoundtrack(soundtrack)
    .setTracks([track1, track2]);

let output = new Shotstack.Output;
output
    .setFormat('mp4')
    .setResolution('sd');

let edit = new Shotstack.Edit;
edit
    .setTimeline(timeline)
    .setOutput(output);

api.postRender(edit).then((data) => {
    let message = data.response.message;
    let id = data.response.id
    
    console.log(message + '\n');
    console.log('>> Now check the progress of your render by running:');
    console.log('>> node examples/status.js ' + id);

}, (error) => {
    console.error('Request failed: ', error);
    process.exit(1);
});
