# Shotstack Node Examples

- **text.js** -
    Create a HELLO WORLD video title against black background with a zoom in motion effect and soundtrack.

- **images.js** -
    Takes an array of image URLs and creates a video with a soundtrack and simple zoom in effect.

- **titles.js** -
    Create a video to demo titles using the available preset font styles, a soundtrack, zoom in motion effect and 
    wipe right transition.
    
- **filters.js** -
    Applies filters to a video clip, including a title with the name of the filter and a soundtrack.
    
- **status.js** -
    Shows the status of a render task and the output video URL. Run this after running one of the render examples.
    
### Installation

Install the required dependencies including the [Shotstack Node SDK](https://www.npmjs.com/package/shotstack-sdk)

```bash
npm install
```

### Set your API key

The demos use the **staging** endpoint by default so use your provided **staging** key:

```bash
export SHOTSTACK_KEY=your_key_here
```

Windows users (Command Prompt):

```bash
set SHOTSTACK_KEY=your_key_here
```

You can [get an API key](http://shotstack.io/?utm_source=github&utm_medium=demos&utm_campaign=node_sdk) via the Shotstack web site.

### Run an example

The examples directory includes a number of examples demonstrating the capabilities of the 
Shotstack API.

To run the images example:

```bash
node examples/images.js
```
