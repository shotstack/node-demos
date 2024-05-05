const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.CreateApi();

const apiUrlBase = 'https://api.shotstack.io/create/';
let apiUrl = apiUrlBase + 'stage';

const id = process.argv[2];

if (!id) {
  console.log(">> Please provide the UUID of the asset generation task (i.e. node examples/create-api/status.js 01gx3-2827k-dxmpz-x5n32-chw4oq)\n");
  process.exit(1);
}

if (!process.env.SHOTSTACK_KEY) {
    console.log('API Key is required. Set using: export SHOTSTACK_KEY=your_key_here');
    process.exit(1);
}

if (process.env.SHOTSTACK_HOST) {
    apiUrl = process.env.SHOTSTACK_HOST;
}

if (process.env.SHOTSTACK_ENV) {
    apiUrl = apiUrlBase + process.env.SHOTSTACK_ENV;
}

defaultClient.basePath = apiUrl;
DeveloperKey.apiKey = process.env.SHOTSTACK_KEY;

api.getGeneratedAsset(id).then((asset) => {
    const status = asset.data.attributes.status;

    console.log(`Status: '${status}'\n`);

    if (status == 'done') {
        console.log(`>> Asset URL: ${asset.data.attributes.url}`);
    } else if (status == 'failed') {
        console.log('>> Something went wrong, rendering has terminated and will not continue.');
    } else {
        console.log('>> Processing in progress, please try again shortly.\n>> Note: Processing may take some time to complete.');
    }
}, (error) => {
    console.error('Request failed or not found: ', error);
    process.exit(1);
});
