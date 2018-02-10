module.exports = function (router) {

    const path = require('path');

    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/../src/views/index.html'));
    });
}