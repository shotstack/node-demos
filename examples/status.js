const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.EditApi();
const id = process.argv[2];

if (!id) {
  console.log(">> Please provide the UUID of the render task (i.e. node examples/status.js 2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7)\n");
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

api.getRender(id, { data: false, merged: true }).then((data) => {
    let status = data.response.status;
    let url = data.response.url;

    console.log('Status: ' + status.toUpperCase() + '\n');

    if (status == 'done') {
        console.log('>> Asset URL: ' + url);
    } else if (status == 'failed') {
        console.log('>> Something went wrong, rendering has terminated and will not continue.');
    } else {
        console.log('>> Rendering in progress, please try again shortly.\n>> Note: Rendering may take up to 1 minute to complete.');
    }
}, (error) => {
    console.error('Request failed or not found: ', error);
    process.exit(1);
});
