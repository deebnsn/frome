/*-------------------------------------------------------------------------------------------------------------------
------------------------------------------------Global Functions-----------------------------------------------------------*/
var capitalizeFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } //http://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
//Used to transform the ID's of countries to an upper case first letter for display.

function is_touch_device() {
 return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}
if (is_touch_device()) {
    d3.select("#writings")
        .style("width","95%")
 }
 else{
    window.onresize = function() {
    location.reload();
}}
//A function to reload the page when the window is resized. It is used for responsiveness. The D3 is rendered again matching 
//the window size. This is not an ideal solution and should be reassessed in the future.
/*-------------------------------------------------------------------------------------------------------------------
------------------------------------------------SVG Preparations----------------------------------------------------------*/
var width = document.getElementById('vis').clientWidth;
var height = document.getElementById('vis').clientHeight;
var height2 = document.getElementById('vis2').clientHeight;
var margin = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 80,
    },
width = width - margin.left - margin.right,
height = height - margin.top - margin.bottom;
height2 = height2 - margin.top - margin.bottom;
// The dimensions and margins of the both graphs (business cycle and correlation graphs) were set with the code above.

var parseTime = d3.timeParse("%Y %b");
var formatMonth = d3.timeFormat("%b"); //tooltip parsetime
var formatYear = d3.timeFormat("%Y")
var bisectDate = d3.bisector(function(d) {
    return d.date;
}).left;
// The date is parsed. D3 does not support quarterly time formats so the data was converted into months (jan=q1, apr=q2, jul=q3, oct=q4)
// These were converted back later on for the tooltip. 

var x = d3.scaleTime().range([1, width]);
var y = d3.scaleLinear().range([height, 0]);
var xCor = d3.scaleTime().range([1, width]);
var yCor = d3.scaleLinear().range([height2, 0]);
// The scales were set for both graphs. The data would later fit into this space.

var line = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.euro12);});
var belgiumLine = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.belgium);});
var germanyLine = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.germany);});
var irelandLine = d3.line().curve(d3.curveMonotoneX).defined(function(d) {return !isNaN(d.ireland);}) //as there are missing values
    .x(function(d) {return x(d.date);}).y(function(d) {return y(d.ireland)})
var greeceLine = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.greece);});
var spainLine = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.spain);});
var franceLine = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.france);});
var italyLine = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.italy);});
var netherlandsLine = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.netherlands);});
var austriaLine = d3.line().curve(d3.curveMonotoneX).defined(function(d) {return !isNaN(d.austria);}) //as there are missing values
    .x(function(d) {return x(d.date);}).y(function(d) {return y(d.austria);});
var portugalLine = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.portugal);});
var finlandLine = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.finland);});
var luxembourgLine = d3.line().curve(d3.curveMonotoneX).x(function(d) {return x(d.date);}).y(function(d) {return y(d.luxembourg);});
/*The lines of the business cycles were defined. The code has been minified to save space. In the future I will look into how
to do this code in a loop to increase efficiency. 
There were ugly spikes with using quarterly data so the curves were smoothed with MonotoneX. MonotoneX was chosen as it involves 
low distortion of the data.
*/

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id","tooltipMain")
var tooltipCountry = d3.select("body").append("div")
    .attr("class", "tooltip")
var tooltipEurozone = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("font-size","12px")
var tooltipCor = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltipCor")
/*The different tooltips were created. All are only displayed on certain mouse events. tooltip is the tooltip that displays
the correlation between the two lines at a date speified by the mouse position. tooltipCountry is the display of the country
relevant to a line that has been hovered over. tooltipEurozone is a short explanation of what Eurozone12 means and is displayed
when the user hovers over the blue Eurozone12 label. tooltipCor is a short explanation of the correlation line and is displayed
when the user hovers over the correlation line on svg2.
*/
var svg = d3.select("#vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
// The svg object is appended to the body of the page and a 'group' element is appended to the'svg',
// The 'group' element is moved to the top left margin.

/*-------------------------------------------------------------------------------------------------------------------
------------------------------------------------SVG 1 Creation----------------------------------------------------------*/

d3.csv("cycleData.csv", function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.euro12 = +d.euro12;
        d.belgium = +d.belgium;
        d.germany = +d.germany;
        d.ireland = +d.ireland;
        d.greece = +d.greece;
        d.spain = +d.spain;
        d.france = +d.france;
        d.italy = +d.italy;
        d.netherlands = +d.netherlands;
        d.austria = +d.austria;
        d.portugal = +d.portugal;
        d.finland = +d.finland;
        d.luxembourg = +d.luxembourg;

        d.belgiumCor = +d.belgiumCor;
        d.germanyCor = +d.germanyCor;
        d.irelandCor = +d.irelandCor;
        d.greeceCor = +d.greeceCor;
        d.spainCor = +d.spainCor;
        d.franceCor = +d.franceCor;
        d.italyCor = +d.italyCor;
        d.netherlandsCor = +d.netherlandsCor;
        d.austriaCor = +d.austriaCor;
        d.portugalCor = +d.portugalCor;
        d.finlandCor = +d.finlandCor;
        d.luxembourgCor = +d.luxembourgCor;

        d.euro12Mbelgium = +d.euro12Mbelgium;
        d.euro12Mgermany = +d.euro12Mgermany;
        d.euro12Mireland = +d.euro12Mireland;
        d.euro12Mgreece = +d.euro12Mgreece;
        d.euro12Mspain = +d.euro12Mspain;
        d.euro12Mfrance = +d.euro12Mfrance;
        d.euro12Mitaly = +d.euro12Mitaly;
        d.euro12Mnetherlands = +d.euro12Mnetherlands;
        d.euro12Maustria = +d.euro12Maustria;
        d.euro12Mportugal = +d.euro12Mportugal;
        d.euro120Mfinland = +d.euro12Mfinland;
        d.euro12Mluxembourg = +d.euro12Mluxembourg;
    });
    // Data is retrieved and formatted to numerical values. (There is probably a more efficient way of doing this)
  
    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));
    y.domain([d3.min(data, function(d) {
        return Math.min(d.euro12, d.ireland);
    }) - 0.01, d3.max(data, function(d) {
        return Math.max(d.euro12, d.ireland); //math.max and min to ensure data remains in plot 
    }) + 0.01]);
    // The range of the data is scaled to fit into the axis. Ireland has the highest max and lowest min so adding other 
    // countries is not necessary. I would make this code more flexible if new data were to be added.

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(4));
    // The Y Axis is added. Only 4 ticks as the HP filtered and logged business cycle value is not of real interest. 

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axis")
        .attr("id", "xaxis")
        .call(d3.axisBottom(x))
    // The X Axis is added.

    svg.append("text")
        .attr("x", (width / 2.2))
        .attr("y", height + margin.bottom / 1.5)
        .attr("class", "labels")
        .attr("id", "Year")
        .style("text-anchor", "middle")
        .text("Year");
    // Label for the x axis. Positioned in between two years to save space.

    svg.append("text")
        .attr("x", margin.left + (width / 4))
        .attr("y", 0 + margin.top)
        .attr("class", "labels")
        .attr("id", "title")
        .style("font-size", "36px")
        .text("Eurozone Business Cycles. Out of Sync?")
    // Title of the visualisation is added.

    if (width < 825) {
        svg.select("#Year")
            .attr("x", 0 - margin.left / 2)
        svg.select("#xaxis")
            .call(d3.axisBottom(x).ticks(4))
        svg.select("#title")
            .style("font-size", "24px")
    };
     if (width < 450) {
        svg.select("#title")
            .style("font-size", "20px")
        	.style("font-weight","bold")
    };

    // For responsiveness. Reduce ticks (amount of years shown) on x axis if screen size small. Also reduces title size and
    // moves x axis label to bottom left (for space saving).

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1.75em")
        .attr("class", "labels")
        .text("GDP Business Cycle (HP Filter)")
    //y axis label

    svg.append("text")
        .attr("transform", "translate(" + width / 2 + "," + height / 9 + ")")
        .attr("class", "labels")
        .attr("id", "author")
        .text("By David Benson")
     //Author. Set as anonymous for marking purposes.

    var markerA = svg.append('circle')
        .attr('r', 7)
        .attr('class', 'marker');
    var markerB = svg.append('circle')
        .attr('r', 7)
        .attr('class', 'marker');
    var markerCor = svg2.append('circle')
        .attr('r', 7)
        .attr('class', 'marker');
    /* The markers used. Marker A is a circle attached to the Euro12 minus a country line. Marker B is a circle attached to a
    country's line. markerCor a circle attached to the correlation line of svg2. These are displayed when on the click of 
    a country's line or the selection of a country from the drop-drown (select/option) element. They follow mouse movement. */

    var rectangle =
        svg.append("rect")
        .attr("width", width)
        .attr("height", height + margin.bottom)
        .attr("id", "underlay")
        .style("opacity", 0)
    var rectangleCor =
        svg2.selectAll("rect") //before lines so behind hem
        .data(data)
        .enter().append("rect")
        .attr("width", width)
        .attr("height", height2)
        .attr("id", "underlay")
        .style("opacity", 0)
/* rectangle is created to go underneath the following elements. rectangleCor is created to go on svg2 when a country is
selected. They are invisible and are used to track mouse movings so that the tooltip displaying correlation and the markers
are positioned correctly.   */

    svg.append("text")
        .attr("transform", "translate(" + width / 9.5 + "," + height / 4.75 + ")")
        .attr("dy", ".35em")
        .attr("id", "eurozoneLabel")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Eurozone 12");
    //The Eurozone12 label is appended. This changes when a country is selected.

    if (height < 300) {
        svg.select("#author")
            .attr("transform", "translate(" + width / 2 + "," + height / 6 + ")")
        svg.select("#eurozoneLabel")
            .attr("transform", "translate(" + width / 9.5 + "," + height / 4 + ")")
    };
    //some small responsiveness changes when the height of the svg is very low.

    var euro12 = svg.append("path").data([data]).attr("id", "euro12").attr("d", line)
    var ireland = svg.append("path").data([data]).attr("class", "line").attr("id", "ireland").attr("d", irelandLine);
    var germany = svg.append("path").data([data]).attr("class", "line").attr("id", "germany").attr("d", germanyLine);
    var belgium = svg.append("path").data([data]).attr("class", "line").attr("id", "belgium").attr("d", belgiumLine);
    var greece = svg.append("path").data([data]).attr("class", "line").attr("id", "greece").attr("d", greeceLine);
    var spain = svg.append("path").data([data]).attr("class", "line").attr("id", "spain").attr("d", spainLine);
    var france = svg.append("path").data([data]).attr("class", "line").attr("id", "france").attr("d", franceLine);
    var italy = svg.append("path").data([data]).attr("class", "line").attr("id", "italy").attr("d", italyLine);
    var netherlands = svg.append("path").data([data]).attr("class", "line").attr("id", "netherlands").attr("d", netherlandsLine);
    var austria = svg.append("path").data([data]).attr("class", "line").attr("id", "austria").attr("d", austriaLine);
    var portugal = svg.append("path").data([data]).attr("class", "line").attr("id", "portugal").attr("d", portugalLine);
    var finland = svg.append("path").data([data]).attr("class", "line").attr("id", "finland").attr("d", finlandLine);
    var luxembourg = svg.append("path").data([data]).attr("class", "line").attr("id", "luxembourg").attr("d", luxembourgLine);
    //The appending of the path elements linked to the appropriate data selected from the line variables. The code has been
    //minified to save space. The id of each path is the country of each line. This is important as the ID's are used to
    //in many of the interactive functions below.

/*-------------------------------------------------------------------------------------------------------------------
------------------------------------------------SVG 1 & 2 Interactivity----------------------------------------------------------*/
    var selector = svg.append("foreignObject")
        .attr("transform", "translate(" + width / 9.5 + "," + height / 7.5 + ")")
        .attr("height", "30px")
        .attr("width", "150px")
        .style("padding", "0px")
        .style("margin", "0px")
        .append("xhtml")
        .html('<select id="inds"><option id="starter" value="selectA" class="selection" >Select A Country</option><option class = "selection" value="belgium">Belgium</option><option class = "selection" value="germany">Germany</option><option class = "selection" value="ireland">Ireland</option><option class = "selection" value="greece">Greece</option><option class = "selection" value="spain">Spain</option><option class = "selection" value="france">France</option><option class = "selection" value="italy">Italy</option><option class = "selection" value="netherlands">Netherlands</option><option class = "selection" value="austria">Austria</option><option class = "selection" value="portugal">Portugal</option><option class = "selection" value="finland">Finland</option><option class = "selection" value="luxembourg">Luxembourg</option>')
    /*A html element inserted into the svg via a foreignObject. This object is the drop-down menu where the user can select a country. 
    It was inserted into the svg as it allows it to be position appropriately in relation to other elements in the svg. The width and height
    attributes are used as they are necessary in some browsers. The selected property of a country options is created when a country is selected
    from the menu or when a user selects a line.  
    */

    var eurozone = d3.select("#eurozoneLabel")
    eurozone.on("mousemove", function() {
        tooltipEurozone
            .style("display", "inherit")
            .text("The original 12 members of the Eurozone")
            .style("left", (d3.event.pageX + 70) + "px")
            .style("top", (d3.event.pageY + 12) + "px")
    })
    eurozone.on("mouseout", function() {
        tooltipEurozone
            .style("display", "none")
    })
    //The eurozone 12 label in blue is selected and a mouse move event attached. This displays a tooltip.

    var lines = svg.selectAll(".line")
        .data(data)
    //All the country lines are selected and given a variable name which can be used for a click event.

    lines.on("mousemove", function() {
        tooltipCountry
            .style("display", "inherit")
            .style("left", (d3.event.pageX) - 10 + "px")
            .style("top", (d3.event.pageY + 25) + "px")
            .text(capitalizeFirstLetter(this.id));
    })   
    lines.on("mouseout", function() {
        tooltipCountry
            .style('display', 'none')
    })
    //A hover event. When the mouse moves over any of the lines, a tooltip is shown to label which country that line represents.

    lines.on("click", function() {
        d3.selectAll(".selection").property("selected", false)
        d3.selectAll("[value=" + this.id + "]").property("selected", true)
        //When line is clicked, all options on drop down menu are deselected. Then the relevant country appears as selected.
        // this.id is retrieves the country name of the line selected. 

        var euroz = d3.select("#euro12")
            .data(euro12)
        euroz
            .exit().remove()
        //The Eurozone12 line is removed once a county line has been selected as it will be replaced by the Eurozone minus country line.

        minusCountry = "euro12M" + this.id;
        var linea = d3.line()
            .defined(function(d) {
                return !isNaN(d[minusCountry]);
            }) //as there are missing values
            .curve(d3.curveMonotoneX)
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y(d[minusCountry]);
            });
        var newEuro = d3.selectAll("path")
            .data([data])
            .attr("d", linea)
            .attr("id", "newEuro")
        //The Eurozone minus country line is created. Different data is imported depending 
        //on which country line is selected.

        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(4));
        //y axis dissapears for a reason I can't work out. I recreate it here.

        svg.selectAll(".lineSelected").attr("class", "line");
        d3.select(this).attr("class", "lineSelected");
        //different styling is given to the lines selected. e.g. gold not grey.

        d3.select("#vis2").style("display", "inherit");
        svg2.selectAll(".lineSelected").attr("class", "noline");
        //svg2 is displayed on click of country line and any already showing correlation line
        // removed via display none on the noline css class.

        country = this.id;
        countryCor = this.id + "Cor";
        //global variables created for future use. id of line is the country selected.

        var lineaCor = d3.line()
            .curve(d3.curveMonotoneX)
            .defined(function(d) {
                return !isNaN(d[countryCor]);
            }) //as there are missing values
            .x(function(d) {
                return xCor(d.date);
            })
            .y(function(d) {
                return yCor(d[countryCor]);
            });
        var newCor = svg2.append("path")
            .data([data])
            .attr("class", "lineSelected")
            .attr("id", country)
            .attr("d", lineaCor);
        // Correlation line created in svg2 relevant to the country selected. Retrieves the correlation data information.

        newCor.on("mousemove", function() {
            tooltipCor
                .style("display", "inherit")
                .style("left", (d3.event.pageX) - 10 + "px")
                .style("top", (d3.event.pageY + 25) + "px")
                .text("Rolling correlation (11 quarters) between " + capitalizeFirstLetter(this.id) + " and the 12 Eurozone countries minus " + capitalizeFirstLetter(this.id));
        })
        newCor.on("mouseout", function() {
            tooltipCor
                .style('display', 'none')
        })
        //tooltip previously created is displayed when user hovers over correlation line.

        svg.select("#eurozoneLabel")
            .text("Eurozone 12 (minus " + capitalizeFirstLetter(this.id) + ")");
        eurozone.on("mousemove", function() {
            tooltipEurozone
                .style("display", "inherit")
                .text("The original 12 members of the Eurozone (minus " + capitalizeFirstLetter(country) + ")")
                .style("left", (d3.event.pageX + 70) + "px")
                .style("top", (d3.event.pageY + 12) + "px")
        })
        //Alters the blue Eurozone12 label to include the minus Country line reference.

        rectangle.on("mousemove", function(d) {
            var mouse = d3.mouse(this);
            var mouseDate = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, mouseDate, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = mouseDate - d0.date > d1.date - mouseDate ? d1 : d0
                /* https://bl.ocks.org/mbostock/3902569*/
                //http://bl.ocks.org/zoopoetics/7684278
        //Retrieve the date according to the position of the mouse.         
            var displayYear = formatYear(d.date);
            var displayMonth = formatMonth(d.date); 
            if (displayMonth == "Jan") {
                var displayQuarter = "Q1"
            } else if (displayMonth == "Apr") {
                var displayQuarter = "Q2"
            } else if (displayMonth == "Jul") {
                var displayQuarter = "Q3"
            } else {
                var displayQuarter = "Q4"
            }
        //convert month to quarter for tooltip display.
            if (isNaN(d[countryCor])) {
                tooltip
                    .style('display', 'none')
                markerA
                    .style('display', 'none')
                markerB
                    .style('display', 'none')
                markerCor
                    .style('display', 'none')
            } else {
                tooltip
                    .style('display', 'inherit')
                    .style("left", (d3.event.pageX) - 10 + "px")
                    .style("top", (d3.event.pageY + 25) + "px")
                    .text(displayYear + " " + displayQuarter + " " + "Correlation = " + d[countryCor]);
                markerA
                    .style('display', 'inherit')
                    .attr('cx', mouse[0])
                    .attr('cy', y(d[minusCountry]))
                markerB
                    .style('display', 'inherit')
                    .style('stroke', 'gold')
                    .attr('cx', mouse[0])
                    .attr('cy', y(d[country]));
                markerCor
                    .style('display', 'inherit')
                    .style('stroke', 'gold')
                    .attr('cx', mouse[0])
                    .attr('cy', yCor(d[countryCor]));
            }
        })
        .on("mouseout", function(d) {
            markerA
                .style('display', 'none');
            markerB
                .style('display', 'none')
            markerCor
                .style('display', 'none')
            tooltip
                .style('display', 'none')
        });
        //The tooltip and line markers are displayed based on the mouse position. Each marker is attached to
        //a different line. When the mouse leaves the SVG the tooltip and markers dissapear.

        rectangleCor.on("mousemove", function(d) {
            var mouse = d3.mouse(this);
            var mouseDate = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, mouseDate, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = mouseDate - d0.date > d1.date - mouseDate ? d1 : d0    /* https://bl.ocks.org/mbostock/3902569*/
            var displayYear = formatYear(d.date);
            var displayMonth = formatMonth(d.date); //convert month to quarter
            if (displayMonth == "Jan") {
                var displayQuarter = "Q1"
            } else if (displayMonth == "Apr") {
                var displayQuarter = "Q2"
            } else if (displayMonth == "Jul") {
                var displayQuarter = "Q3"
            } else {
                var displayQuarter = "Q4"
            }
            //http://bl.ocks.org/zoopoetics/7684278
            if (isNaN(d[countryCor])) {
                tooltip
                    .style('display', 'none')
                markerA
                    .style('display', 'none')
                markerB
                    .style('display', 'none')
                markerCor
                    .style('display', 'none')
            } else {
                tooltip
                    .style('display', 'inherit')
                    .style("left", (d3.event.pageX) - 10 + "px")
                    .style("top", (d3.event.pageY + 25) + "px")
                    .text(displayQuarter + " " + displayYear + " " + "Correlation = " + d[countryCor]);
                markerA
                    .style('display', 'inherit')
                    .attr('cx', mouse[0])
                    .attr('cy', y(d[minusCountry]))

                markerB
                    .style('display', 'inherit')
                    .style('stroke', 'gold')
                    .attr('cx', mouse[0])
                    .attr('cy', y(d[country]));
                markerCor
                    .style('display', 'inherit')
                    .style('stroke', 'gold')
                    .attr('cx', mouse[0])
                    .attr('cy', yCor(d[countryCor]));
            }
        })
        .on("mouseout", function(d) {
            markerA
                .style('display', 'none');
            markerB
                .style('display', 'none')
            markerCor
                .style('display', 'none')
            tooltip
                .style('display', 'none')
        });
        //The same functions are perfomed for SVG2
    });
    //The above functions are related to the clicking of a line.

    d3.select("#inds")
        .on("change", function() {
        	if (this.value=="selectA"){
        		location.reload();
        	}
        	else{
            d3.select("#" + this.value).dispatch("click");
            //https://github.com/d3/d3-selection#selection_dispatch
        }
        });
	/*When the drop down menu changes to a country a click function is performed on the line of that country.
    This activates the above functions related to a click of a line. If it changes to the original select a country
    option, the page reloads to revert back to the original view.*/
});

/*-------------------------------------------------------------------------------------------------------------------
------------------------------------------------SVG 2 Creation----------------------------------------------------------*/
d3.select("#vis2")
    .style("display", "none")
//The second vis is hidden until activation from a country seleciton in SVG 1.

var svg2 = d3.select("#vis2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
//SVG2 is appended to the vis2 div and positioned.


d3.csv("cycleData.csv", function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.belgiumCor = +d.belgiumCor;
        d.germanyCor = +d.germanyCor;
        d.irelandCor = +d.irelandCor;
        d.greeceCor = +d.greeceCor
        d.spainCor = +d.spainCor
        d.franceCor = +d.franceCor
        d.italyCor = +d.italyCor
        d.netherlandsCor = +d.netherlandsCor
        d.austriaCor = +d.austriaCor
        d.portugalCor = +d.portugalCor
        d.finlandCor = +d.finlandCor
        d.luxembourgCor = +d.luxembourgCor
    });
    // Correlation data is retrieved and numerically formatted.

    xCor.domain(d3.extent(data, function(d) {
        return d.date;
    }));
    yCor.domain([-1, 1]);
    // Range of the data scaled. Y axis -1 to 1 as that is the range of Pearson's R (correlation measure)

    var y_axis = svg2.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yCor).ticks(4));
    var markerA = svg.append('circle')
        .attr('r', 7)
        .attr('class', 'marker');
    var markerB = svg.append('circle')
        .attr('r', 7)
        .attr('class', 'marker');
    var markerCor = svg2.append('circle')
        .attr('r', 7)
        .attr('class', 'marker');
    var rectangleCor =
        svg2.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("width", width)
        .attr("height", height2)
        .attr("id", "underlay")
        .style("opacity", 0) 
    svg2.append("text")
        .attr("x", (width / 2.2))
        .attr("y", height2 + margin.bottom / 1.5)
        .attr("class", "labels")
        .attr("id", "Year")
        .style("text-anchor", "middle")
        .text("Year");
    svg2.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .attr("class", "axis")
        .attr("id", "xaxis")
        .call(d3.axisBottom(x))
    svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height2 / 2))
        .attr("dy", "1.5em")
        .attr("class", "labels")
        .text("Correlation")
    svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height2 / 2))
        .attr("dy", "3em")
        .attr("class", "labels")
        .style("font-size", "12px")
        .text("(Rolling)")
    //Similar to SVG1, the important elements are appended.

    if (width < 700) {
        svg2.select("#Year")
            .attr("x", 0 - margin.left / 2)
        svg2.select("#xaxis")
            .call(d3.axisBottom(x).ticks(4))
    };
    //small amount of responsive design, where the x axis is altered to fit better when window size is small.
});