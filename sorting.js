let width = 900;
let height = 600;

let NUMBER_OF_BARS = 41;
let count = 1 + 50;
let durationTime = 100 / NUMBER_OF_BARS;
let array = d3.shuffle(d3.range(1, NUMBER_OF_BARS));
let unsortedArray = [...array];
let sortedArray = [];

let barWidth = width / NUMBER_OF_BARS;

let xAxis = d3.scaleLinear().domain([0, NUMBER_OF_BARS]).range([0, width]);


let svg = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g');

let xScale = d3.scaleBand()
                .domain(d3.range(unsortedArray.length))
                .rangeRound([0, width])
                .paddingInner(0.05);

let yScale = d3.scaleLinear()
                .domain([0, d3.max(unsortedArray)])
                .range([0, height]);

let rects = svg.append('g')
                .attr('transform', 'translate(' + barWidth + ", 2)")
                .selectAll('rect')
                .data(unsortedArray)
                .enter()
                .append('rect')


let labels = svg.selectAll('text')
                .data(unsortedArray)
                .enter()
                .append('text')
    

labels.attr('id', function(d) { return 'text'})
        .attr('transform', function(d, i) { return 'translate(' + xAxis(i) + ',0)'})
        .html(function(d) { return d; })
   

rects.attr('id', function(d) {return 'rect' + d})
    .attr('transform', function(d, i) {return 'translate(' + (xAxis(i) - barWidth) + ', 0)'})
    .attr('width', barWidth * 0.95)
    .attr('height', function(d) {return d * (barWidth - 6)})
    .attr('x', function(d, i) {
        return barWidth;
    })
    .attr('y', function(d) {
        return height - yScale(d);
    })
    .attr('fill', function(d) {
        return "blue";
    });

function resetArray() {
    unsortedArray = [...array];
    sortedArray = [];

    labels.attr('class', '')
        .data(unsortedArray)
        .enter()
        .append('text')
        .text(function (d) {
            return d;
        })
        .transition()
        .duration(300)
        .attr('transform', function(d, i) { return 'translate(' + (xAxis(i)) + ', 0)'})

    rects.attr('class', '')
        .transition()
        .delay(function(d, i) {
            return (i / unsortedArray.length) * 700;
        })
        .duration(300)
        .ease(d3.easeLinear)
        .attr('transform', function(d, i) { return 'translate(' + (xAxis(i - 1)) + ', 0)'})
        .attr('fill', function(d) {
            return 'blue';
        })
}

function insertionSort() {
    let key = unsortedArray.shift();
    sortedArray.push(key);

    reArrange(sortedArray.length - 1);

    function reArrange(n) {
        d3.selectAll('rect').attr('class', '');
        d3.select('#rect' + key)
            .attr('class', 'testing')
            .attr('fill', function(d) {
                return 'green'
            });
        
        if ((n >= 0) && sortedArray[n - 1] > key) {
            d3.timeout(function () {
                sortedArray.splice(n, 1);
                sortedArray.splice(n - 1, 0 , key);

                slide(sortedArray[n], n);
                slide(sortedArray[n - 1], n - 1);

                reArrange(--n);
            }, 50);
        } else if (unsortedArray.length) {
            d3.timeout(function () { insertionSort()}, durationTime);
        } else {
            return d3.selectAll('rect').attr('class', '');
        }
    }
}

function slide(d, i) {
    d3.select('#text' + d) 
        .transition()
        .duration(300)
        .attr('transform', function(d) { return 'translate(' + (xAxis(i)) + ', 0)'})
        

    d3.select('#rect' + d)
        .transition()
        .duration(300)
        .ease(d3.easeLinear)
        .attr('transform', function(d) { return 'translate(' + (xAxis(i - 1)) + ', 0)'})
}