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

const videoAsset = new Shotstack.VideoAsset;
videoAsset
    .setSrc('{{ URL }}')
    .setTrim('{{ TRIM }}');

const videoClip = new Shotstack.Clip;
videoClip
    .setAsset(videoAsset)
    .setStart(0)
    .setLength('{{ LENGTH }}');

const track = new Shotstack.Track;
track.setClips([videoClip]);

const timeline = new Shotstack.Timeline;
timeline.setTracks([track]);

const output = new Shotstack.Output;
output
    .setFormat('mp4')
    .setResolution('sd');

const edit = new Shotstack.Edit;
edit
    .setTimeline(timeline)
    .setOutput(output);

const template = new Shotstack.Template;
template
    .setName('Trim Template')
    .setTemplate(edit);

api.postTemplate(template).then((data) => {
    let message = data.response.message;
    let id = data.response.id
    
    console.log(message + '\n');
    console.log('>> Now render the template using the id:');
    console.log('>> node examples/templates/render.js ' + id);

}, (error) => {
    console.error('Request failed: ', error);
    process.exit(1);
});
