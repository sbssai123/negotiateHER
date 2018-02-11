module.exports = function (router) {

    const path = require('path');

    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/../src/views/index.html'));
    });

    // router.get('/sample', (req, res) => {
    //     res.sendFile(path.join(__dirname + '/../src/views/Sample.html'));
    // });
  
    router.get('/data/salary_gender', (req, res) => {
        res.sendFile(path.join(__dirname + '/../src/data/salary_gender.json'));
    });
    router.get('/data/salary_occupation', (req, res) => {
        res.sendFile(path.join(__dirname + '/../src/data/salary_occupation.json'));
    });
    router.get('/simulation', (req, res) => {
        res.sendFile(path.join(__dirname + '/../src/views/simulation.html'));
    });

    router.get('/webcam', (req, res) => {
        res.sendFile(path.join(__dirname + '/../src/views/webcam.html'));
    });
}
