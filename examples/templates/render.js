const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.EditApi();
const id = process.argv[2];

let apiUrl = 'https://api.shotstack.io/stage';

if (!id) {
  console.log(">> Please provide the UUID of the template (i.e. node examples/templates/render.js 7feabb0e-b5eb-8c5e-847d-82297dd4802a)\n");
  process.exit(1);
}

if (!process.env.SHOTSTACK_KEY) {
    console.log('API Key is required. Set using: export SHOTSTACK_KEY=your_key_here');
    process.exit(1);
}

if (process.env.SHOTSTACK_HOST) {
    apiUrl = process.env.SHOTSTACK_HOST;
}

defaultClient.basePath = apiUrl;
DeveloperKey.apiKey = process.env.SHOTSTACK_KEY;

const mergeFieldUrl = new Shotstack.MergeField;
mergeFieldUrl
    .setFind('URL')
    .setReplace('https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/footage/skater.hd.mp4');

const mergeFieldTrim = new Shotstack.MergeField;
mergeFieldTrim
    .setFind('TRIM')
    .setReplace(3);

const mergeFieldLength = new Shotstack.MergeField;
mergeFieldLength
    .setFind('LENGTH')
    .setReplace(6);

const template = new Shotstack.TemplateRender;
template
    .setId(id)
    .setMerge([
        mergeFieldUrl,
        mergeFieldTrim,
        mergeFieldLength,
    ]);

api.postTemplateRender(template).then((data) => {
    let message = data.response.message;
    let id = data.response.id
    
    console.log(message + '\n');
    console.log('>> Now check the progress of your render by running:');
    console.log('>> node examples/status.js ' + id);
}, (error) => {
    console.error('Request failed: ', error);
    process.exit(1);
});
