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

let videoAsset1 = new Shotstack.VideoAsset;
videoAsset1
    .setSrc('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/shore-overhead.mp4')

let videoAsset2 = new Shotstack.VideoAsset;
videoAsset2
    .setSrc('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/cliffs-sunset.mp4')

let videoAsset3 = new Shotstack.VideoAsset;
videoAsset3
    .setSrc('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/tree.mp4')

let videoClip1 = new Shotstack.Clip;
videoClip1
    .setAsset(videoAsset1)
    .setStart(0)
    .setLength('auto');
    
let videoClip2 = new Shotstack.Clip;
videoClip2
    .setAsset(videoAsset2)
    .setStart('auto')
    .setLength('auto');

let videoClip3 = new Shotstack.Clip;
videoClip3
    .setAsset(videoAsset3)
    .setStart('auto')
    .setLength('auto');

let track = new Shotstack.Track;
track.setClips([videoClip1, videoClip2, videoClip3]);

let timeline = new Shotstack.Timeline;
timeline.setTracks([track]);

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
