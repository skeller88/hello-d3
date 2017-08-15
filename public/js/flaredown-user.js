// Chart settings
var width = 480;
var height = 320;
var outerMargin = {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15
};

var chartTitleMargin = 5;
var innerWidth = width - outerMargin.left - outerMargin.right;
var innerHeight = height - outerMargin.top - outerMargin.bottom;

var MAX_POINTS = 5;
var MIN_POINTS = 0;

console.log(userData);

/**
 *
 * @param rawData
 */
function chartSingleGroupCounts(rawData) {
    drawRankChart({baselineData: rawData}, chartOptions);
}

/**
 * Chart difference between two groups in counts of symptoms, conditions, or treatments.
 * @param rawData {object} the two groups of data wrapped in an object
 * @param field {string} 'sex', 'age'
 * @param baselineName {string} baseline group name
 * @param comparisonName {string} group to compare against baseline
 * @param binSize {int} size of histogram bin
 */
function chartBetweenGroupCounts(rawData, field, baselineName, comparisonName, binSize) {
    console.log('Comparing', comparisonName, 'against', baselineName, 'baseline');

    var mungedData = mungeSegmentedData(rawData, field, baselineName, comparisonName);

    drawRankChart(mungedData, baselineName, comparisonName);
}

/**
 *
 * @param data -
 *  {'top_conditions: [
 *      {"groupBy": {"sex": "female"},
 *      "values": [{"_id": 0,  "count": 94}, ...]
 *  }], ...}
 * @param field
 * @param baselineName
 * @param comparisonName
 * @returns {{baselineData: (*|values|fixture.values|data.values), comparisonData: (*|values|fixture.values|data.values), chartTypeName: *}}
 */
function mungeSegmentedData(data, field, baselineName, comparisonName) {
    var firstGroupName = data[0].groupBy[field];
    var secondGroupName = data[1].groupBy[field];

    if (firstGroupName === baselineName && secondGroupName === comparisonName) {
        var baselineData = data[0].values;
        var comparisonData = data[1].values;
    } else if (firstGroupName === comparisonName && secondGroupName === baselineName) {
        var baselineData = data[1].values;
        var comparisonData = data[0].values;
    } else {
        console.error('Expected baseline group name and comparison group name do not match the data\'s group names.');
    }

    return {
        baselineData: baselineData,
        comparisonData: comparisonData,
        chartTypeName: 'conditions'
    }
}

function drawChart(data) {

    // Scale for the placement of the bars
    var xScale = d3.time.scale()
        .range([outerMargin.left, innerWidth]);

    var yScale = d3.scale.linear()
        .range([innerHeight, outerMargin.top]);

    var trackableLine = d3.svg.line()
        .x(function(d){ return xScale(d.date * 1000); })
        .y(function(d) {
            return yScale(d.points);
        });

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr("transform", "translate(" + outerMargin.left + "," + outerMargin.top + ")")

    var squareGroup1 = svg.selectAll(".square")
        .data(data)
        .enter().append("rect")
        .attr("class", 'square')
        .attr('x', function(d) {
            return xPositionScale(d.bin);
        })
        .attr("y", function(d) { return yScale(Math.max(0, d.diff)); })
        .attr('width', renderedBinWidth)
        .attr("height", function(d) { return Math.abs(yScale(d.diff) - yScale(0)); });

    if (isBetweenGroupComparison) {
        var squareGroup2 = svg.selectAll(".square")
            .data(data[1])
            .enter().append("rect")
            .attr("class", 'square')
            .attr('x', function(d) {
                return xPositionScale(d.bin);
            })
            .attr("y", function(d) { return yScale(Math.max(0, d.diff)); })
            .attr('width', renderedBinWidth)
            .attr("height", function(d) { return Math.abs(yScale(d.diff) - yScale(0)); });
    }

    svg.append("line")
        .attr("class", "baseline")
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("x1", outerMargin.left)
        .attr("x2", width - outerMargin.right);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (height - outerMargin.bottom) + ")")
        .call(xAxis)
        .append('text')
        .attr('class', 'x-label label')
        .attr('transform', 'translate(' + (innerWidth/2 - outerMargin.left) + ',' + (outerMargin.bottom + axisLabelMargin.x) + ')')
        .text(xLabel);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (outerMargin.left) + ", 0)")
        .call(yAxis)
        .append('text')
        .attr('class', 'y-label label')
        .attr('transform', 'translate(' + -(outerMargin.left + axisLabelMargin.y) +',' + (height/2 + outerMargin.top) + ') rotate(' + (-90) + ')')
        .text(yLabel);

    // Chart title.
    // Example: "Number of conditions"
    svg.append('text')
        .attr("text-anchor", "middle")
        .attr('transform', 'translate(' + (innerWidth/2) + ', ' + chartTitleMargin + ')')
        .text(title);
}


/**
 *
 * @param rawData [{'n_conditions': {}}, {'n_treatments: {}}]
 * @param category {string} 'n_conditions'
 * @returns {*}
 */
function getCategoryData(rawData, category) {
    for (var i = 0; i < rawData.length; i++) {
        var keys = Object.keys(rawData[i]);
        if (keys.length && keys[0] === category) {
            return rawData[i];
        }
    }
    return null;
}

/**
 *
 * @param dataObj - {'top_conditions':[], 'n_conditions':[], ...}
 * @returns string
 */
function getChartType(dataObj) {
    var chartTypes = [
        'n_conditions',
        'n_symptoms',
        'n_treatments'
    ];

    for (var i = 0; i < chartTypes.length; i++) {
        if (dataObj[chartTypes[i]] != undefined) {
            return chartTypes[i];
        }
    }
    return null;
}

function getChartName(chartType) {
    var chartTypeToNameMap = {
        'n_conditions': 'conditions',
        'n_symptoms': 'symptoms',
        'n_treatments': 'treatments'
    };

    return chartTypeToNameMap[chartType];
}

//chartSingleGroupCounts(singleGroupData, 'n_conditions', 1);
//chartSingleGroupCounts(singleGroupData, 'n_symptoms', 1);
//chartSingleGroupCounts(singleGroupData, 'n_treatments', 1);
chartBetweenGroupCounts(segmentedData[0].top_conditions, 'sex', 'male', 'female');
chartBetweenGroupCounts(segmentedData[2].top_symptoms, 'sex', 'male', 'female');
chartBetweenGroupCounts(segmentedData[4].top_treatments, 'sex', 'male', 'female');

//chartBetweenGroupCounts(data[1], 'sex', 'female', 'male');
//chartBetweenGroupCounts(data[3], 'sex', 'female', 'male');
//chartBetweenGroupCounts(data[5], 'sex', 'female', 'male');