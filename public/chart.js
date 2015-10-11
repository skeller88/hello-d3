alert('foo')
//d3.select($window).on('resize', drawChart);
//
//function drawChart() {
//    if (d3.select('svg.sk-career-chart')) d3.select('svg.sk-career-chart').remove();
//
//    /* DIMENSIONS */
//
//    //svg
//    var sh = element.height();
//    var sw = element.width();
//
//    //chart
//    var margin = {top: 20, right: 15, bottom: 15, left: 15};
//    var padding = {top: 0, right: 0, bottom: 40, left: 50};
//
//    var w = sw - margin.left - margin.right;
//    var h = sh - margin.top - margin.bottom;
//    var iw = w - padding.left - padding.right;
//    var ih = h - padding.top - padding.bottom;
//
//    //bubbles
//    var rmin = 4;
//    var rmax = 15;
//
//    //tooltip height
//    var tth = 28;
//
//    //Margin between labels and chart axes
//    var yLabelP = 45;
//
//    //Margin between legend and chart axes
//    var xLegendP = 85;
//    var yLegendP = 35;
//
//    var xlabel = "Projected Job Growth: 2012-2022 (%)";
//    var ylabel = "Median Annual Salary: 2012 (thousands)";
//    var rlabel = "# Employed: 2012 (thousands)";
//    var legendText = "Legend";
//
//    /* SCALES */
//
//    //career_percent_emp_change in %
//    var xScale = d3.scale.linear()
//        .domain([-40, 60])
//        .range([0, iw]);
//
//    //career_med_ann_wage in $1000s
//    var yScale = d3.scale.linear()
//        .domain([15, 190])
//        .range([ih, 0]);
//
//    var xAxis = d3.svg.axis()
//        .scale(xScale)
//        .orient('bottom');
//
//    var yAxis = d3.svg.axis()
//        .scale(yScale)
//        .orient('left');
//
//    /* DRAW CHART */
//
//    var tip = d3.tip()
//        .attr('class', 'sk-tooltip-chart')
//        .offset([-17, -12])
//        .html(function (d) {
//
//            return '<h4 class="sk-career-name">' + d.career_name + '</h4>' +
//                '<div >' +
//                '<span class="sk-tooltip-label">People employed: </span><span class="sk-tooltip-data">' + $filter('number')(d.career_2012_emp * 1000) + '</span>' +
//                '</div>' +
//                '<div class="sk-emp-change">' +
//                '<span class="sk-tooltip-label">Expected change in demand: </span><span class="sk-tooltip-data">' + d.career_percent_emp_change + '%</span>' +
//                '</div>' +
//                '<div>' +
//                '<span class="sk-tooltip-label">Annual wage: </span><span class="sk-tooltip-data">$' + $filter('number')(d.career_med_ann_wage) + '</span>' +
//                '</div>'
//        })
//
//    var svg = d3.select(element[0])
//        .append('svg')
//        .classed('sk-chart-svg sk-career-chart', true);
//
//    svg.call(tip);
//
//    var outerChart = svg.append('g')
//        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
//
//    var innerChart = outerChart.append('g')
//        .attr('class', 'innerChart')
//        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');
//
//    //axes
//    innerChart.append('g')
//        .attr('class', 'axis')
//        .attr('transform', 'translate(0,' + (ih) + ')')
//        .call(xAxis);
//
//    innerChart.append('g')
//        .attr('class', 'axis')
//        .attr('transform', 'translate(0,0)')
//        .call(yAxis);
//
//    //labels - clearer to append to outerChart instead?
//    innerChart.append('text')
//        .classed('x-label label', true)
//        .attr('transform', 'translate(' + (iw / 2) + ',' + (h) + ')')
//        .text(xlabel);
//
//    innerChart.append('text')
//        .classed('y-label label', true)
//        .attr('transform', 'translate(' + (0 - yLabelP) + ',' + (ih / 2) + ') rotate(-90)')
//        .text(ylabel);
//
//    var legend = innerChart.append('g')
//        .attr('transform', 'translate(' + (iw - xLegendP) + ',' + (yLegendP) + ')')
//
//    function updateGraph() {
//        //add data
//        var circles = innerChart.selectAll('circle')
//            .data(scope.selectedCareersData, function (d) {
//                return d.career_name;
//            })
//
//        circles.enter().append('circle')
//            .attr("class", function (d, i) {
//                return 'sk-data-point' + ' ' + 'sk-data-point-num-' + i;
//            })
//            .attr('cx', function (d) {
//                return xScale(d.career_percent_emp_change);
//            })
//            .attr('cy', function (d) {
//                return yScale(d.career_med_ann_wage / 1000);
//            })
//            .attr('r', 0)
//            .attr('opacity', 0)
//            .on('mouseover', tip.show)
//            .on('mouseout', tip.hide)
//            .transition()
//            .delay(function (d, i) {
//                return i * 100;
//            })
//            .duration(500)
//            .attr('r', function (d) {
//                return d3Scales.bubbleRadiusScale(d.career_2012_emp);
//            })
//            .attr('opacity', function (d) {
//                return d3Scales.bubbleOpacityScale(d.career_2012_emp);
//            });
//
//        circles
//            .attr("class", function (d, i) {
//                return 'sk-data-point' + ' ' + 'sk-data-point-num-' + i;
//            })
//
//
//        circles.exit().transition()
//            .duration(500)
//            .attr('r', 0)
//            .remove();
//    }

    //Eliminating the labels removes chart clutter for now. May add the labels back at some point
    //if the labels could be set to the first few letters of the career name without cluttering the chart.

    // var labels = innerChart.selectAll('text.sk-career-bubble-label')
    //     .data(scope.selectedCareersData, function(d) { return d.career_name; })

    // labels.enter().append('text')
    //     .classed('sk-career-bubble-label', true)
    //     .attr('text-anchor', 'middle')
    //     .text(function(d, i){ return alphabet[i]; })
    //     .attr('x', function(d) { return xScale(d.career_percent_emp_change); })
    //     //2 is arbitrary distance to provide space between bubble and label
    //     .attr('y', function(d) { return yScale(d.career_med_ann_wage/1000) - d3Scales.bubbleRadiusScale(d.career_2012_emp) - 2; })
    //     .attr('opacity', 0)
    //     .transition()
    //       .delay(function(d, i) { return i * 100; })
    //       .duration(1000)
    //       .attr('opacity', function(d) { return d3Scales.bubbleOpacityScale(d.career_2012_emp)});

    // labels.text(function(d, i){ return alphabet[i]; })

    // labels.exit().transition()
    //     .duration(500)
    //     .attr('opacity', 0)
    //     .remove();
//}