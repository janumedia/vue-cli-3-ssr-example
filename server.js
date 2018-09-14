const express = require('express');
const server = express();
const path = require('path');

const { createBundleRenderer } = require('vue-server-renderer');
const serverBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: require('fs').readFileSync('./src/index.template.html', 'utf-8'),
    clientManifest
})

server.use('/js', express.static(path.join(__dirname, './dist/js')));
server.use('/css', express.static(path.join(__dirname, './dist/css')));
server.use(express.static('static'));

server.get('*', (req, res) => {
    const ctx = {
        url: req.url,
        title: 'Vue SSR Example',
        meta: `<meta data-n-head content="SSR Page" name="application-name">`
    };
    renderer.renderToString(ctx, (err, html) => {
        if(err) {
            res.status(500).end('Internal Server Error');
            return;
        };
        res.status(200);
        res.end(html)
    })
});

server.listen(8080); 