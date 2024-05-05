const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.IngestApi();

const apiUrlBase = 'https://api.shotstack.io/ingest/';
let apiUrl = apiUrlBase + 'stage';

const id = process.argv[2];

if (!id) {
  console.log(">> Please provide the UUID of the ingest task (i.e. node examples/ingest-api/status.js zzy7wxvy-1h1e-vt4j-kn0y-3qn7kj1hocpw)\n");
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

api.getSource(id).then((source) => {
    const status = source.data.attributes.outputs.renditions[0].status;

    console.log(`Status: '${status}'\n`);

    if (status == 'ready') {
        console.log(`>> Source URL: ${source.data.attributes.source}`);
        console.log(`>> Rendition URL: ${source.data.attributes.outputs.renditions[0].url}`);
    } else if (status == 'failed') {
        console.log('>> Something went wrong, processing has terminated and will not continue.');
    } else {
        console.log('>> Processing in progress, please try again shortly.\n>> Note: Processing may take some time to complete.');
    }
}, (error) => {
    console.error('Request failed or not found: ', error);
    process.exit(1);
});
