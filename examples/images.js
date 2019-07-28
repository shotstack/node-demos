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

const images = [
    'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/examples/images/pexels/pexels-photo-712850.jpeg',
    'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/examples/images/pexels/pexels-photo-867452.jpeg',
    'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/examples/images/pexels/pexels-photo-752036.jpeg',
    'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/examples/images/pexels/pexels-photo-572487.jpeg',
    'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/examples/images/pexels/pexels-photo-114977.jpeg',
    'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/examples/images/pexels/pexels-photo-347143.jpeg',
    'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/examples/images/pexels/pexels-photo-206290.jpeg',
    'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/examples/images/pexels/pexels-photo-940301.jpeg',
    'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/examples/images/pexels/pexels-photo-266583.jpeg',
    'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/examples/images/pexels/pexels-photo-539432.jpeg'
];

let clips = [];
let start = 0;
const length = 1.5;

let soundtrack = new Shotstack.Soundtrack;
soundtrack
    .setSrc('https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/gangsta.mp3')
    .setEffect('fadeInFadeOut');

images.forEach((image) => {
    let imageAsset = new Shotstack.ImageAsset;
    imageAsset
        .setSrc(image);

    let clip = new Shotstack.Clip;
    clip
        .setAsset(imageAsset)
        .setStart(start)
        .setLength(length)
        .setEffect('zoomIn');

    start = start + length;
    clips.push(clip)
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
