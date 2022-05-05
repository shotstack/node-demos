const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.EditApi();
const url = process.argv[2];

if (!url) {
    console.log(">> Please provide the URL to a media file to inspect (i.e. node examples/probe.js https://github.com/shotstack/test-media/raw/main/captioning/scott-ko.mp4)\n");
    process.exit(1);
}

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

api.probe(url).then((data) => {
    data.response.metadata.streams.forEach(stream => {
        if (stream.codec_type === 'video') {
            console.log('Example settings for: ' + data.response.metadata.format.filename);
            console.log('Width: ' + stream.width + 'px');
            console.log('Height: ' + stream.height + 'px');
            console.log('Framerate: ' + stream.r_frame_rate + ' fps');
            console.log('Duration: ' + stream.duration + ' secs');
        }
    });
}, (error) => {
    console.error('Request failed or not found: ', error);
    process.exit(1);
});
