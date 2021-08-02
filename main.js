async function init() {
    // set the dimensions and margins of the graph
    var width = 600;
    var height = 600;
    var margin = 50;

    var x = d3.scaleLog()
        .base(10)
        .domain([10,150])
        .range([0, width]);

    var y = d3.scaleLog()
        .domain([10,150])
        .range([width, 0]);

    var xAxisFirst = d3.axisBottom(x)
    .tickValues([10,20,50,100])
    .tickFormat(d3.format("~s"));

    var yAxisFirst = d3.axisLeft(y)
    .tickValues([10,20,50,100])
    .tickFormat(d3.format("~s"));

    const colorLegendG = d3.select("body").append('g')
        .attr('transform', `translate(${innerWidth + 60}, 150)`);

    const colorValue = d => d.Fuel;

    const colorScale = d3.scaleOrdinal()
        .range(d3.schemeSet1);

    //Read the data
    const data = await d3.csv("https://flunky.github.io/cars2017.csv");

    var keys = [];

    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    
    // Chart with avg highway mpg and avg city mpg
    // Add dots
    d3.select(".first-chart").append('g')
        .attr("transform", "translate(50,50)")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "cir")
        .attr("cx", function (d,i) { keys[i] = d.Fuel; return x(d.AverageCityMPG); } )
        .attr("cy", function (d) { return y(d.AverageHighwayMPG); } )
        .attr("r", function (d) { return 2 + parseInt(d.EngineCylinders);})
        .attr('fill', d => colorScale(colorValue(d)))
        .attr('fill-opacity', 0.6)
        .on("mouseover", function(d) {	
            div.selectAll("*").remove();	
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.text("Make: " + d.Make)
                .style("left", (x(d.AverageCityMPG) + margin) + "px")		
                .style("top", (y(d.AverageHighwayMPG) + margin) + "px");
        })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
        .on('click', function(d,i){
            d3.select(".pop-up").selectAll("*").remove();

            d3.select(".pop-up").append('g')
                .append("div")
                .attr("x", 10)
                .attr("y", 70)
                .style("width", "20px")
                .style("width", "20px")
                .attr("class", "close")
                .attr("width", "20px")
                .attr("height", "20px")
                .style("background-color", "white")
                .style("text-align", "center")
                .style("margin-left", "90%")
                .style("margin-bottom", "10px")
                .text("X")
                .on('click', function(d,i){
                    d3.select(".pop-up").style("display","none");
                });
            
            d3.select(".pop-up").append('g')
                .attr("class", "pop-up-header")
                .attr("x", 300)
                .attr("y", 300)
                .attr("dy", "0em")
                .text("Detailed Information")
                .style("color","black")
                .style("display","block");

            d3.select(".pop-up").append('g')
                .attr("x", 300)
                .attr("y", 300)
                .attr("dy", "1em")
                .text("Make: " + d.Make)
                .style("color","black")
                .style("display","block");

            d3.select(".pop-up").append('g')
                .attr("x", 300)
                .attr("y", 300)
                .attr("dy", "2em")
                .text("Fuel: " + d.Fuel)
                .style("color","black")
                .style("display","block");

            d3.select(".pop-up").append('g')
                .attr("x", 300)
                .attr("y", 300)
                .attr("dy", "3em")
                .text("Engine Cylinders: " + d.EngineCylinders)
                .style("color","black")
                .style("display","block");

            d3.select(".pop-up").append('g')
                .attr("x", 300)
                .attr("y", 300)
                .attr("dy", "4em")
                .text("Average Highway MPG: " + d.AverageHighwayMPG)
                .style("color","black")
                .style("display","block");

            d3.select(".pop-up").append('g')
                .attr("x", 300)
                .attr("y", 300)
                .attr("dy", "5em")
                .text("Average City MPG: " + d.AverageCityMPG)
                .style("color","black")
                .style("display","block");

            d3.select(".pop-up").style("display","block");

            d3.select(".second-chart").selectAll("*").remove();

            var height = 400;
            var xTemp = d3.scaleBand().domain([d.Make]).range([0,100]);
            var yTemp = d3.scaleLinear().domain([0,150]).range([height,0]);

            d3.select(".second-chart")
                .append('g')
                .attr("transform", "translate(50,50)")
                .attr('fill', colorScale(colorValue(d)))
                .selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", yTemp(d.AverageHighwayMPG))
                .attr("width", xTemp.bandwidth())
                .attr("height", height - yTemp(d.AverageHighwayMPG));
                

            d3.select(".second-chart")
                .attr("width", "300px")
                .attr("height", height + 2*margin);

            d3.select(".second-chart")
                .append("g")
                    .attr("transform", "translate(" + margin + "," + margin + ")")
                    .call(d3.axisLeft(yTemp));
                    
            d3.select(".second-chart")
                .append("g")
                    .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
                    .call(d3.axisBottom(xTemp));

            d3.select(".second-chart")
                .append("text")
                .attr("class", "x-label")
                .attr("text-anchor", "end")
                .attr("x", width - 500)
                .attr("y", height + 100)
                .text("Make");
        
            d3.select(".second-chart")
                .append("text")
                .attr("class", "y-label")
                .attr("text-anchor", "end")
                .attr("y", 0)
                .attr("dy", ".75em")
                .attr("transform", "translate(0,150)rotate(-90)")
                .text("Average Hwy MPG");

            d3.select(".second-chart").style("display","inline-block");

            d3.select(".third-chart").selectAll("*").remove();

            var height = 400;
            var xTemp = d3.scaleBand().domain([d.Make]).range([0,100]);
            var yTemp = d3.scaleLinear().domain([0,150]).range([height,0]);

            d3.select(".third-chart")
                .append('g')
                .attr("transform", "translate(50,50)")
                .attr('fill', colorScale(colorValue(d)))
                .selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", yTemp(d.AverageCityMPG))
                .attr("width", xTemp.bandwidth())
                .attr("height", height - yTemp(d.AverageCityMPG));

            d3.select(".third-chart")
                .attr("width", "300px")
                .attr("height", height + 2*margin);

            d3.select(".third-chart")
                .append("g")
                    .attr("transform", "translate(" + margin + "," + margin + ")")
                    .call(d3.axisLeft(yTemp));
                    
            d3.select(".third-chart")
                .append("g")
                    .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
                    .call(d3.axisBottom(xTemp));

            d3.select(".third-chart")
                .append("text")
                .attr("class", "x-label")
                .attr("text-anchor", "end")
                .attr("x", width - 500)
                .attr("y", height + 100)
                .text("Make");
        
            d3.select(".third-chart")
                .append("text")
                .attr("class", "y-label")
                .attr("text-anchor", "end")
                .attr("y", 0)
                .attr("dy", ".75em")
                .attr("transform", "translate(0,150)rotate(-90)")
                .text("Average City MPG");

            d3.select(".third-chart").style("display","inline-block");
        });
    
    var uniqueKeys = [];
    $.each(keys, function(i, el){
        if($.inArray(el, uniqueKeys) === -1) uniqueKeys.push(el);
    });

    var color = d3.scaleOrdinal()
        .range(d3.schemeSet1);
    
    d3.select(".legend").append("g")
        .append("text")
        .text("Fuel Type")
        .attr("x", 10)
        .attr("y", 70)
        .style("font-size","18px")
        .style("font-weight","bold");

    // Add one dot in the legend for each name.
    d3.select(".legend").selectAll("mydots")
    .data(uniqueKeys)
    .enter()
    .append("circle")
        .attr("cx", 20)
        .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return color(d)});

    // Add one dot in the legend for each name.
    d3.select(".legend").selectAll("mylabels")
    .data(uniqueKeys)
    .enter()
    .append("text")
        .attr("x", 40)
        .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

    d3.select(".first-chart")
        .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")")
            .call(yAxisFirst);

    d3.select(".first-chart")
        .append("g")
            .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
            .call(xAxisFirst);
    
    d3.select(".first-chart")
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - 75)
        .attr("y", height + 100)
        .text("Average City MPG");

    d3.select(".first-chart")
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(0,150)rotate(-90)")
        .text("Average Highway MPG");
}