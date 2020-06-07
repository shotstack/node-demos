const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.EndpointsApi();

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

const styles = [
    'minimal',
    'blockbuster',
    'vogue',
    'sketchy',
    'skinny',
    'chunk',
    'chunkLight',
    'marker',
    'future',
    'subtitle'
];

let clips = [];
let start = 0;
const length = 3;

let soundtrack = new Shotstack.Soundtrack;
soundtrack
    .setSrc('https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/dreams.mp3')
    .setEffect('fadeInFadeOut');

styles.forEach((style) => {
    let title = new Shotstack.TitleAsset;
    title
        .setStyle(style)
        .setText(style)
        .setSize('small');

    let transition = new Shotstack.Transition;
    transition
        .setIn('fade')
        .setOut('fade');

    let clip = new Shotstack.Clip;
    clip
        .setAsset(title)
        .setStart(start)
        .setLength(length)
        .setTransition(transition)
        .setEffect('zoomIn');

    start = start + length;
    clips.push(clip);
});

let track = new Shotstack.Track;
track
    .setClips(clips);

let timeline = new Shotstack.Timeline;
timeline
    .setBackground('#000000')
    .setSoundtrack(soundtrack)
    .setTracks([track]);

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
