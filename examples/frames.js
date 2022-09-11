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

const DURATION = 120;
const FPS = 25;

const framesArray = [];

for (let frame = 0; frame < DURATION * FPS + 1; frame++) {
    const singleFrameDuration = 1 / FPS;
    const titleAsset = new Shotstack.TitleAsset;
    titleAsset
        .setStyle('chunk')
        .setText(`${frame + 1}`)
        .setSize('x-large');

    const titleClip = new Shotstack.Clip;
    titleClip
        .setAsset(titleAsset)
        .setStart(singleFrameDuration * frame)
        .setLength(0.01); // Setting to 0.01 ensure only one frame will be used

    framesArray.push(titleClip);
}

const track = new Shotstack.Track;
track
    .setClips(framesArray);

const timeline = new Shotstack.Timeline;
timeline
    .setTracks([track]);

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
