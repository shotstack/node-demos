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

const VIDEO_DURATION = 10;
const COUNTER_START = 1;
const COUNTER_DISPLAY_DURATION = 1;

const counterArray = [];

for (let counter = COUNTER_START; counter <= VIDEO_DURATION; counter++) {
    const start = counter;

    const htmlAsset = new Shotstack.HtmlAsset;
    htmlAsset
        .setHtml(`<p>${counter}</p>`)
        .setCss('p { font-size: 200px; color: #25d3d0; font-family: "Montserrat ExtraBold"; }')
        .setWidth(400)
        .setHeight(400);

    const htmlClip = new Shotstack.Clip;
    htmlClip
        .setAsset(htmlAsset)
        .setStart(start)
        .setLength(COUNTER_DISPLAY_DURATION);

    counterArray.push(htmlClip);
}

const track = new Shotstack.Track;
track
    .setClips(counterArray);

const timeline = new Shotstack.Timeline;
timeline
    .setTracks([track])
    .setBackground('#2b2b2b');

const output = new Shotstack.Output;
output
    .setFormat('mp4')
    .setResolution('hd');

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
