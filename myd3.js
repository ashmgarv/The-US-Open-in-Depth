var winners = [];
var points = [];
var years = [2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014];
var playerJourney = [];
var winnersList = [];

//Global variables for the final visualization
var chartWidth = 525;
var chartHeight = 400;

var barWidth = ((chartWidth - 20) / 5) - 30;

var xScale = d3.scaleLinear()
.domain([0,8])
.range([10,chartWidth - 20]);

var finalXPositions = [];
var curPos = 0;
finalXPositions.push(curPos);
for(var k = 0; k<5;k++){
   finalXPositions.push(curPos +  barWidth + 20);
   curPos += barWidth + 20;
}

var yScale =  d3.scaleLinear()
.domain([0,300])
.range([10,chartHeight - 20]);

//Div for tooltip
var tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var tooltipView = d3.select("body").append("div")	
.attr("class", "tooltipView")				
.style("opacity", 0);

var tooltipFinalView = d3.select("body").append("div")	
.attr("class", "tooltipFinalView")				
.style("opacity", 0);

addPlayerJourney("Journey of a Player")

function addPlayerJourney(text){
    d3.select(".playerJourney")
    .append("p")	
    .attr("class", "journeyText")
    .append("text")
    .text(text);
}

//Code to load the data needed for manipulation
$.when(d3.csv("10yearAUSOpenMatches.csv", function(data) {
    if(data.round == "Final" || data.round == "quarter" || data.round == "semi"){
        var val = { key: data.matchnum, value: data.winner};
        this.winners.push({
            key: val,
            value: data.round
        });
        winnersList.push(data.winner);
        var newVal = { key: data.matchnum, value: data.year};
        points.push({
            key: newVal,
            value: data.total1
        });
    }

    if(winnersList.includes(data.player1) || winnersList.includes(data.player2))
    {
        playerJourney.push(data);
    }
}))
.then(function(){createOverview();})

function createOverview()
{
    var spWidth = 800;
    var spHeight = 400;

    var radMax = d3.max(points,function(data){ return parseInt(data.value) });
    var radMin = d3.min(points,function(data){ return parseInt(data.value) });

    var spXScale = d3.scaleLinear()
    .domain([2004,2014])
    .range([40,spWidth-40]);

    var spRadScale = d3.scaleLinear()
    .domain([radMin,radMax])
    .range([0,(spWidth/22)]); 

    var spYScale = d3.scaleLinear()
    .domain([0,10])
    .range([50,spHeight]);

    var i = 0;
    var j = 0;
    var k = 0;

    var yPositions = [350,300,250,200,150,100,50];

    var t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);
    var duration = 1500;

    years.forEach(year => { 
        
        k = 0;
        i += 7;
        while(j < i)
        {
            var spCircle = d3.select(".scatter-plot")
            .append("circle");

            spCircle.attr("cx",0)
            .attr("my-matchnum",winners[i-k-1].key.key)
            .attr("match-winner",winners[i-k-1].key.value)
            .attr("match-year",year)
            .attr("is-clicked",false)
            .attr("match-round",winners[i-k-1].value)
            .attr("r", 0)
            .attr("cy", 0)
            .attr("fill", getRandomColor())
            .attr("stroke","white")
            .attr("stroke-width","2")
            .on("mouseover", onOverviewMouseOver)
            .on("mouseout", onOverviewMouseOut)
            .on("click",onOverviewElementClicked);

            spCircle.transition()
            .duration(duration)
            .attr("cx",spXScale(year))
            .attr("r", spRadScale(points[i-k-1].value))
            .attr("cy", yPositions[k])
            .attr("fill", getRandomColor())
            .attr("stroke","black")
            .attr("stroke-width","2");
            
            j++;
            k++
            duration += 100;
        }
    })
}

function onOverviewMouseOver(d, i) {
   var thisCircle = this;
   d3.selectAll("circle").style("opacity","0.3");
   d3.select(thisCircle).style("opacity","1");
   
   tooltip.transition()		
   .duration(200)		
   .style("opacity", .9);		
   tooltip.html("<b>" + thisCircle.attributes[2].nodeValue+  "</b>" + "<br/>"  + thisCircle.attributes[5].nodeValue)	
   .style("left", (d3.event.pageX) + "px")		
   .style("top", (d3.event.pageY - 28) + "px");	
}				



function onOverviewMouseOut(d, i) {
    d3.selectAll("circle").style("opacity","1");
    tooltip.transition()		
    .duration(500)		
    .style("opacity", 0);	
}

function onOverviewElementClicked(d, i) {

    var journetText = d3.select(".journeyText")
    .remove();
    

    var newJourneyText = "Journey of "+this.attributes[2].nodeValue + " in the US Open "+this.attributes[3].nodeValue;
    addPlayerJourney(newJourneyText);

    //Get rid of the previous rectangles
    d3.select(".event-sequence")
    .selectAll("rect")
    .remove("rect");

    d3.select(".finalVisialization")
    .selectAll("rect")
    .remove();

    var matchesToShow = [];
    playerJourney.forEach(match=>{
        if((match.player1 == this.attributes[2].nodeValue || match.player1 == this.attributes[2].nodeValue) && match.year == this.attributes[3].nodeValue)
        {
            matchesToShow.push(match);
        }
    })
    

    var xPositions = [];
    var initialPos = 20;
    xPositions.push(initialPos);
    matchesToShow.forEach(match =>{
        xPositions.push(initialPos + 70);
        initialPos += 70;
    })

    var matchNum = 0;
    var yAttr = 50;

    matchesToShow.forEach(playerMatch => {
        var spEvent = d3.select(".event-sequence")
        .append("rect");
        
        spEvent.attr("y",0)
        .attr("x", 0)
        .attr("width",0)
        .attr("height",0)
        .attr("fill", getRandomColor())
        .attr("stroke","white")
        .attr("stroke-width","0")
        .attr("score",playerMatch.results)
        .on("mouseover",onViewMouseOver)
        .on("mouseout",onViewMouseOut)
        .on("click",onViewMouseClick);

        spEvent.transition()
        .duration(1700)
        .attr("y",yAttr)
        .attr("x", (xPositions[matchNum]))
        .attr("width",60)
        .attr("height",40)
        .attr("fill", getRandomColor())
        .attr("stroke","black")
        .attr("stroke-width","2");
        
        if(playerMatch.winner == this.attributes[2].nodeValue){
            spEvent.attr("is-Winner",true);
            spEvent.attr("tooltip-text", playerMatch.player2);
        }
        else{
            spEvent.attr("is-Winner",false);
            spEvent.attr("tooltip-text",playerMatch.winner);
        }

        spEvent.attr("break",playerMatch.break1)
        .attr("return",playerMatch.return1)
        .attr("total",playerMatch.total1)
        .attr("winner",playerMatch.winner1)
        .attr("error",playerMatch.error1)
        .attr("net",playerMatch.net1)
        
        yAttr += 50;
        matchNum++;
    });
}

function onViewMouseOver(){
    d3.select(".event-sequence").selectAll("rect").style("opacity","0.3");
    d3.select(this).style("opacity","1");
    var thisRect = this;
    tooltipView.transition()		
    .duration(200)		
    .style("opacity", .9);		
    tooltipView.html("Beat " + "<b>" + thisRect.attributes[9].nodeValue+  "</b>" + "<br/>" +thisRect.attributes[7].nodeValue)	
    .style("left", (d3.event.pageX) + "px")		
    .style("top", (d3.event.pageY - 28) + "px");	
}

function onViewMouseOut(){
    d3.select(".event-sequence").selectAll("rect").style("opacity","1");
    tooltipView.transition()		
    .duration(500)		
    .style("opacity", 0);	
}

function onViewMouseClick(){
    var finalViz = d3.select(".finalVisialization");
    finalViz.selectAll("rect")
    .remove();

    var modBreak = this.attributes[10].nodeValue.replace('%','');
    var modreturn = this.attributes[11].nodeValue.replace('%','');
    var modNet = this.attributes[15].nodeValue.replace('%','');
    
    var i = 0;

    var rect = finalViz.append("rect");
    addBars(rect, modBreak, i)
    i++;
    
    var rect1 = finalViz.append("rect");
    addBars(rect1, modreturn, i);
    i++;
    
    var rect2 = finalViz.append("rect");
    addBars(rect2, this.attributes[12].nodeValue, i);
    i++;
    
    var rect3 = finalViz.append("rect");
    addBars(rect3, this.attributes[13].nodeValue, i);
    i++;

    var rect4 = finalViz.append("rect");
    addBars(rect4, this.attributes[14].nodeValue, i);
    i++;
    
    var rect5 = finalViz.append("rect");
    addBars(rect5, modNet, i);
}

function addBars(rect, yVal, xVal, isfs)
{
    rect.attr("y",0)
    .attr("x", 0)
    .attr("width",0)
    .attr("height",0)
    .attr("fill", getRandomColor())
    .attr("stroke","black")
    .attr("stroke-width","2")
    .attr("valToShow",yVal)
    .on("mouseover",finalViewOver)
    .on("mouseout",finalViewOut);

    rect.transition()
    .duration(1500)
    .attr("y",chartHeight -  yScale(yVal))
    .attr("x", finalXPositions[xVal])
    .attr("width",barWidth)
    .attr("height",yScale(yVal))
    .attr("fill", getRandomColor())
    .attr("stroke","black")
    .attr("stroke-width","2");
}

function finalViewOver(){
    d3.select(".finalVisialization").selectAll("rect").style("opacity","0.3");
    d3.select(this).style("opacity","1");
    var thisRect = this;
    tooltipFinalView.transition()		
    .duration(200)		
    .style("opacity", .9);		
    tooltipFinalView.html("<b>"+ thisRect.attributes[7].nodeValue+  "</b>")	
    .style("left", (d3.event.pageX) + "px")		
    .style("top", (d3.event.pageY - 28) + "px");
}

function finalViewOut(){
    d3.select(".finalVisialization").selectAll("rect").style("opacity","1");
    tooltipFinalView.transition()		
    .duration(500)		
    .style("opacity", 0);	
}
//Copied code from https://stackoverflow.com/questions/30469755/why-a-variable-defined-global-is-undefined
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

    