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

const ONE_FRAME = 1/25;

// Setup the main background clip
let backgroundAsset = new Shotstack.VideoAsset;
backgroundAsset
    .setSrc('https://shotstack-pubic-files.s3-ap-southeast-2.amazonaws.com/examples/picture-in-picture/code.mp4');

let backgroundClip = new Shotstack.Clip;
backgroundClip
    .setAsset(backgroundAsset)
    .setStart(5)
    .setLength(10);

let backgroundTrack = new Shotstack.Track;
backgroundTrack
    .setClips([backgroundClip]);

// Setup the overlay picture in picture clip
// 1. Full screen
let overlayAsset1 = new Shotstack.VideoAsset;
overlayAsset1
    .setSrc('https://shotstack-pubic-files.s3-ap-southeast-2.amazonaws.com/examples/picture-in-picture/commentary.mp4')
    .setVolume(1);

let overlayClip1 = new Shotstack.Clip;
overlayClip1
    .setAsset(overlayAsset1)
    .setStart(0)
    .setLength(5 - ONE_FRAME);

// 2. Bottom right picture in picture after 5 seconds
let overlayAsset2 = new Shotstack.VideoAsset;
overlayAsset2
    .setSrc('https://shotstack-pubic-files.s3-ap-southeast-2.amazonaws.com/examples/picture-in-picture/commentary.mp4')
    .setVolume(1)
    .setTrim(5);

let overlayClip2 = new Shotstack.Clip;
overlayClip2
    .setAsset(overlayAsset2)
    .setStart(5)
    .setLength(5 - ONE_FRAME)
    .setScale(0.35)
    .setPosition('bottomRight');

// 3. Top right picture in picture after 10 seconds
let overlayAsset3 = new Shotstack.VideoAsset;
overlayAsset3
    .setSrc('https://shotstack-pubic-files.s3-ap-southeast-2.amazonaws.com/examples/picture-in-picture/commentary.mp4')
    .setVolume(1)
    .setTrim(10);

let overlayClip3 = new Shotstack.Clip;
overlayClip3
    .setAsset(overlayAsset3)
    .setStart(10)
    .setLength(2.5 - ONE_FRAME)
    .setScale(0.35)
    .setPosition('topRight');

// 4. Small bottom right picture in picture after 12.5 seconds
let overlayAsset4 = new Shotstack.VideoAsset;
overlayAsset4
    .setSrc('https://shotstack-pubic-files.s3-ap-southeast-2.amazonaws.com/examples/picture-in-picture/commentary.mp4')
    .setVolume(1)
    .setTrim(12.5);

let overlayClip4 = new Shotstack.Clip;
overlayClip4
    .setAsset(overlayAsset4)
    .setStart(12.5)
    .setLength(2.5)
    .setScale(0.25)
    .setPosition('topRight');

// Add overlays to a track
let overlayTrack = new Shotstack.Track;
overlayTrack
    .setClips([overlayClip1, overlayClip2, overlayClip3, overlayClip4]);

// Setup the timeline and add the overlay track above the background track
let timeline = new Shotstack.Timeline;
timeline
    .setBackground('#000000')
    .setTracks([
        overlayTrack,
        backgroundTrack
    ]);

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
