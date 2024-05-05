const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.IngestApi();

const apiUrlBase = 'https://api.shotstack.io/ingest/';
let apiUrl = apiUrlBase + 'stage';

if (!process.env.SHOTSTACK_KEY) {
    console.log('API Key is required. Set using: export SHOTSTACK_KEY=your_key_here');
    process.exit(1);
}

if (process.env.SHOTSTACK_CREATE_HOST) {
    apiUrl = process.env.SHOTSTACK_CREATE_HOST;
}

if (process.env.SHOTSTACK_ENV) {
    apiUrl = apiUrlBase + process.env.SHOTSTACK_ENV;
}

defaultClient.basePath = apiUrl;
DeveloperKey.apiKey = process.env.SHOTSTACK_KEY;

const size = new Shotstack.Size;
size
    .setHeight(720);

const rendition = new Shotstack.Rendition;
rendition
    .setSize(size);

const outputs = new Shotstack.Outputs;
outputs
    .setRenditions([rendition]);

const source = new Shotstack.Source;
source
    .setUrl('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/cliffs-sunset.mp4')
    .setOutputs(outputs);

api.postSource(source).then((source) => {
    const id = source.data.id
    
    console.log(`Request 'queued' with id: ${id}\n`);
    console.log('>> Now check the progress by running:');
    console.log(`>> node examples/ingest-api/status.js ${id}`);
}, (error) => {
    console.error('Request failed: ', error);
    process.exit(1);
});
