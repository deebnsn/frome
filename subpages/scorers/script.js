var svg = d3.select("svg"),
    margin = {
        top: 70,
        right: 80,
        bottom: 50,
        left: 70,
    },
    width = document.getElementById('vis').clientWidth - margin.left - margin.right,
    height = document.getElementById('vis').clientHeight - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .defined(function(d) {
        return !isNaN(d.goals);
    })
    .x(function(d) {
        return x(d.date);
    })
    .y(function(d) {
        return y(d.goals);
    });

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")


d3.csv("scorers.csv", type, function(error, data) {
    if (error) throw error;

    var scorers = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {
                    date: d.date,
                    goals: d[id]
                };
            })
        };
    });


    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));

    y.domain([
        0,
        d3.max(scorers, function(c) {
            return d3.max(c.values, function(d) {
                return d.goals;
            });
        })
    ]);

    z.domain(scorers.map(function(c) {
        return c.id;
    }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Goals");

    var scorer = g.selectAll(".scorer")
        .data(scorers)
        .enter().append("g")
        .attr("class", "scorer");

    scorer.append("path")
        .attr("class", "line")
        .attr("id", function(d) {
            return d.id;
        })
        .attr("d", function(d) {
            return line(d.values);
        });



    d3.select("[id='Jimmy Greaves (357)']")
        .attr("class", "jimmy")

    svg.append("text")
        .attr("x", margin.left + (width / 1.52))
        .attr("y", margin.top)
        .attr("id", "jimmyLabel")
        .text("Jimmy Greaves (357)")
    svg.append("text")
        .attr("id","title")
        .attr("x", margin.left + (width / 15))
        .attr("y", margin.top/1.5)
        .text("Goalscorers in the English")
   var titleTop = svg.append("text")
        .attr("id","title")
        .attr("x", margin.left + (width / 15))
        .attr("y", margin.top + 10)
        .text("Top Flight (1988-2015)")
   var author = svg.append("text")
        .attr("id","author")
        .attr("x", margin.left + (width / 14.3))
        .attr("y", margin.top + 35)
        .text("By David Benson")
        
 if (width<600){
    titleTop.attr("y", margin.top)
    author.attr("y",margin.top+20)
 }




    var lines = d3.selectAll(".line");

    lines.on("mousemove", function() {



        tooltip
            .text(this.id)
            .style("display", "block")
            .style("left", (d3.event.pageX) + 20 + "px")
            .style("top", (d3.event.pageY - 40) + "px")
            .transition()
            .duration(500);

    });
    lines.on("mouseout", function() {
        tooltip
            .style("display", "none")
    });


});

function type(d, _, columns) {
    d.date = parseTime(d.date);
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
}



function is_touch_device() {
 return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}

if (is_touch_device()) {

	d3.select("#vis").style("height","70vh")
 }
 else{
 	window.onresize = function() {
    location.reload();
}

 }

;