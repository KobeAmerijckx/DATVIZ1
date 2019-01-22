$(document).ready(function () {
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var audioElement = document.getElementById('audio');
    var audioSrc = audioCtx.createMediaElementSource(audioElement);
    var analyser = audioCtx.createAnalyser();

    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    var data = new Uint8Array(200);

    renderFrame();

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        analyser.getByteFrequencyData(data);
        var margin = {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50
            },
            width = window.innerWidth - margin.left - margin.right*4,
            height = window.innerHeight - margin.top - margin.bottom*4;
        var n = data.length;
        var xScale = d3.scaleLinear()
            .domain([0, n - 1])
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([0, 300])
            .range([height, 0]);
        var line = d3.line()
            .x(function (d, i) {
                return xScale(i);
            })
            .y(function (d) {
                return yScale(d.y);
            })
        var dataset = d3.range(n).map(function (d) {
            return {
                "y": data[d]
            }
        });
        console.log(dataset)
        $("svg").remove();
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale));
        svg.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("d", line);
        svg.selectAll(".dot")
            .data(dataset)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d, i) {
                return xScale(i)
            })
            .attr("cy", function (d) {
                return yScale(d.y)
            })
            .attr("r", 5);
    }
});
