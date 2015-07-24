/**
 *
 **/
function tee(message) {
  console.log(message);

  function logDate() {
    var d = new Date();

    var format = 'hh:mm:ss.SSS';
    format = format.replace(/hh/g, ('0' + d.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + d.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + d.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
      var milliSeconds = ('00' + d.getMilliseconds()).slice(-3);
      var length = format.match(/S/g).length;
      for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
  }
  $("#txta-event-message").append(logDate() + " " + message + "\n");
  $("#txta-event-message").scrollTop($("#txta-event-message")[0].scrollHeight);

}

// transition の callback;
// http://shimz.me/blog/d3-js/4100
// http://stackoverflow.com/questions/10692100/invoke-a-callback-at-the-end-of-a-transition

/**
 *
 */
function startReportingService() {

  var report = function() {

    var reportObj = createReport();
    moveReport(reportObj);
    executeReport(reportObj);
  };



  intervalId = setInterval(report, INTERVAL);
}


function createReport() {
  var reportObj = svg.select("g#georepo")
    .append("circle")
    .attr({
      "r": 10,
      "fill": "#ad25a4"
    });

  return reportObj
}

function moveReport(reportObj) {

  reportObj
    .transition()
    .duration(500)
    .attr("transform", "translate(50, 50)")
    .transition()
    .duration(500)
    .attr("transform", "translate(100, 50)")
    .transition()
    .duration(500)
    .attr("transform", "translate(150, 50)")
    .transition()
    .duration(500)
    .attr("transform", "translate(200, 50)")
    .transition()
    .duration(500)
    .attr("transform", function(d) {
      createRipple();
      return "translate(" + projection([141.935, 45.52]) + ")";
    })
    .transition()
    .duration(500)
    .attr("fill", "#ff00ff")
    .remove();

  console.log("moveReport:" + reportObj);

}

function executeReport(reportObj) {
  console.log("executeReport:" + reportObj);

  // reportObj.


  // createRipple(reportObj);

}


/**
 *
 */
function createRipple() {
  console.log("createRipple:");

  var i = 0;

  svg.select("g#georepo")
    .append("circle")
    // .attr("cx", m[0])
    // .attr("cy", m[1])
    .attr("r", 1e-6)
    // .attr("cx", function() {
    //   console.log(reportObj);
    //   // reportObj.attr("cx")
    //   return 100;
    // })
    // .attr("cy", reportObj.attr("cy"))
    .style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
    .style("stroke-opacity", 1)
    .transition()
    .duration(500)
    .ease(Math.sqrt)
    .attr("r", 100)
    .style("stroke-opacity", 1e-6)
    .remove();

}

//
// function testDis() {
//
//   var i = 0;
//
//
//
//
//   wave = svg.select("g#georepo")
//     .append("circle")
//     // .attr("cx", m[0])
//     // .attr("cy", m[1])
//     .attr("r", 1e-6)
//     .style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
//     .style("stroke-opacity", 1);
//   //
//   // .selectAll("circle")
//   //
//   //   .data(data, function(d) {
//   //     return d;
//   //   })
//   //   .enter()
//   //   .append("circle")
//   //   .attr({
//   //     "r": 10,
//   //     "fill": "#ad25a4"
//   //   });
// }
//
// function move() {
//
//   testDis();
//   // svg.select("g#georepo").selectAll("circle")
//   //   .data(data, function(d) {
//   //     return d;
//   //   })
//   ball
//     .transition()
//     .duration(500)
//     .attr("transform", "translate(50, 50)")
//     .transition()
//     .duration(500)
//     .attr("transform", "translate(100, 50)")
//     .transition()
//     .duration(500)
//     .attr("transform", "translate(150, 50)")
//     .transition()
//     .duration(500)
//     .attr("transform", "translate(200, 50)")
//     .transition()
//     .duration(500)
//     .attr("transform", function(d) {
//       return "translate(" + projection([141.935, 45.52]) + ")";
//     })
//     .transition()
//     .duration(500)
//     .attr("fill", "#ff00ff")
//     .remove();
//
//   wave.transition()
//     .duration(500)
//     .ease(Math.sqrt)
//     .attr("r", 100)
//     .style("stroke-opacity", 1e-6)
//     .remove();
//
// }
