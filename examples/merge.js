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

const soundtrack = new Shotstack.Soundtrack;
soundtrack
    .setSrc('https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/disco.mp3')
    .setEffect('fadeInFadeOut');

const titleAsset = new Shotstack.TitleAsset;
titleAsset
    .setStyle('minimal')
    .setText('Hello {{NAME}}')
    .setSize('x-small');

const title = new Shotstack.Clip;
title
    .setAsset(titleAsset)
    .setStart(0)
    .setLength(5)
    .setEffect('zoomIn');

const track = new Shotstack.Track;
track
    .setClips([title]);

const timeline = new Shotstack.Timeline;
timeline
    .setBackground('#000000')
    .setSoundtrack(soundtrack)
    .setTracks([track]);

const output = new Shotstack.Output;
output
    .setFormat('mp4')
    .setResolution('sd');

const mergeField = new Shotstack.MergeField;
mergeField
    .setFind('NAME')
    .setReplace('Jane');

const edit = new Shotstack.Edit;
edit
    .setTimeline(timeline)
    .setOutput(output)
    .setMerge([
        mergeField
    ]);

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
