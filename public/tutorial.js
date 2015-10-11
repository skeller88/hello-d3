var dataset = [ 5, 10, 15, 20, 25 ];
var divs = d3.select("body").selectAll("div");

// Before calling enter, placeholder will be:
// 0: [undefined x 5]
// enter: function(){}
// exit: function(){}
var placeholder = divs.data(dataset);

// Has an object at index 0, which is:
// 0: [Object x 5], each object has __data__: <data-bound-to-obj>
// parentNode: body
// update: [undefined x 5]
var created = placeholder.enter();

created.append('div')
    .attr('class', 'bar')
    .style('height', function (d) {
       return d + 'px';
    })
    .style('margin-right', '2px');
