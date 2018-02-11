module.exports = function (router) {

    const path = require('path');

    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/../src/views/index.html'));
    });

    router.get('/sample', (req, res) => {
        res.sendFile(path.join(__dirname + '/../src/views/Sample.html'));
    });

    router.get('/webcam', (req, res) => {
            res.sendFile(path.join(__dirname + '/../src/views/webcam.html'));
    });
}
