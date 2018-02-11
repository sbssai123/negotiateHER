module.exports = function (router) {

    const path = require('path');

    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/../src/views/index.html'));
    });

    router.get('/sample', (req, res) => {
        res.sendFile(path.join(__dirname + '/../src/views/Sample.html'));
    });
}



var data = [30, 86, 168, 281, 303, 365];

d3.select(".chart")
  .selectAll("div")
  .data(data)
    .enter()
    .append("div")
    .style("width", function(d) { return d + 'px' })
    .text(function(d) { return '$ ' + d; });
