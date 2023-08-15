const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.EditApi();
const id = process.argv[2];

let apiUrl = 'https://api.shotstack.io/stage';

if (!id) {
  console.log(">> Please provide the UUID of the template (i.e. node examples/templates/template.js 7feabb0e-b5eb-8c5e-847d-82297dd4802a)\n");
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

api.getTemplate(id).then((data) => {
    console.log(JSON.stringify(data.response, null, 2));
}, (error) => {
    console.error('Request failed: ', error);
    process.exit(1);
});
