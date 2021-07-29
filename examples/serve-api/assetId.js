const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.ServeApi();
const id = process.argv[2];

let apiUrl = 'https://api.shotstack.io/serve/stage';

if (!process.env.SHOTSTACK_KEY) {
    console.log('API Key is required. Set using: export SHOTSTACK_KEY=your_key_here');
    process.exit(1);
}

if (process.env.SHOTSTACK_SERVE_HOST) {
    apiUrl = process.env.SHOTSTACK_SERVE_HOST;
}

defaultClient.basePath = apiUrl;
DeveloperKey.apiKey = process.env.SHOTSTACK_KEY;

api.getAsset(id).then((asset) => {
    const status = asset.data.attributes.status;
    console.log('Status: ' + status.toUpperCase() + '\n');

    if (status === 'ready') {
        console.log('>> Asset CDN URL: ' + asset.data.attributes.url);
        console.log('>> Asset ID: ' + asset.data.attributes.id);
        console.log('>> Render ID: ' + asset.data.attributes.renderId);
    } else if (status == 'failed') {
        console.log('>> Something went wrong, asset could not be copied.');
    } else {
        console.log('>> Copying in progress, please try again in a few seconds.');
    }
}, (error) => {
    console.error('Request failed or not found: ', error);
    process.exit(1);
});
