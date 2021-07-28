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

// Border - top layer (track1)
let borderAsset = new Shotstack.ImageAsset;
borderAsset
    .setSrc('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/borders/80s-acid-pink-square.png');

let borderClip = new Shotstack.Clip;
borderClip
    .setAsset(borderAsset)
    .setStart(0)
    .setLength(1);

let track1 = new Shotstack.Track;
track1
    .setClips([borderClip]);

// Background image - bottom layer (track2)
let imageAsset = new Shotstack.ImageAsset;
imageAsset
    .setSrc('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/images/dolphins.jpg');

let imageClip = new Shotstack.Clip;
imageClip
    .setAsset(imageAsset)
    .setStart(0)
    .setLength(1);

let track2 = new Shotstack.Track;
track2
    .setClips([imageClip]);

 // Put track1 first to go above track2
let timeline = new Shotstack.Timeline;
timeline
    .setBackground('#000000')
    .setTracks([
        track1,
        track2
    ]);

let output = new Shotstack.Output;
output
    .setFormat('jpg')
    .setQuality('high')
    .setSize((new Shotstack.Size)
        .setWidth(1000)
        .setHeight(1000)
    );

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
