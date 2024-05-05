const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.CreateApi();

const apiUrlBase = 'https://api.shotstack.io/create/';
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

const textToImage = new Shotstack.ShotstackTextToImageOptions;
textToImage.setWidth(1024).setHeight(1024).setPrompt('A realistic photo of the planet Mars with a black outer space background');

const generatedAsset = new Shotstack.ShotstackGeneratedAsset;
generatedAsset.setOptions(textToImage);

api.postGenerateAsset(generatedAsset).then((asset) => {
    const status = asset.data.attributes.status;
    const id = asset.data.id
    
    console.log(`Request '${status}' with id: ${id}\n`);
    console.log('>> Now check the progress of image by running:');
    console.log(`>> node examples/create-api/status.js ${id}`);
}, (error) => {
    console.error('Request failed: ', error);
    process.exit(1);
});
