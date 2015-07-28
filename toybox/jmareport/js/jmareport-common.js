/**
 * bind closure.
 **/
function bind(f, o) {
  return function() {
    return f.apply(o);
  };
}

/**
 *
 **/
function formatLogDate() {
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

/**
 *
 **/
function teeEvent(message) {
  console.log(message);

  $("#txta-event-message").append(formatLogDate() + " " + message + "\n");
  $("#txta-event-message").scrollTop($("#txta-event-message")[0].scrollHeight);
}


/**
 *
 **/
function teeReport(message) {
  console.log(message);

  $("#txta-report-message").append(formatLogDate() + " " + message + "\n");
  $("#txta-report-message").scrollTop($("#txta-report-message")[0].scrollHeight);
}


/**
 *  interval main.
 */
function startReportingService() {
  console.log("start function startReportingService()");

  rippleColor = 0;
  dataRep = [];
  intervalId = setInterval(executeReporting, INTERVAL);

  console.log("end function startReportingService()");
}


/**
 *
 */
function executeReporting() {

  fetchReport();

  if (dataRep.length < 0) {
    return;
  }
  drawReporting(dataRep.pop());

}


/**
 *
 */
function fetchReport() {

  d3.json("headline.json", function(error, data) {
    if (error != null) {
      console.log(err);
      return;
    }
    console.log(data);
    for (var i = 0; i < data.data.length; i++) {
      dataRep.push(data.data[i]);
    }
  });
}


/**
 *
 */
function drawReporting(report) {

  var reportObj = svg.select("g#georepo")
    .datum(report, function(d) {
      return d;
    })
    .append("circle")
    .attr({
      "class": "report",
      "r": REPORT_FIG.R,
      "fill": "#ad25a4",
      "transform": function(d) {
        return "translate(" + (AREA.W - REPORT_FIG.R) + ", " + REPORT_FIG.R + ")";
      }
    });


  // move report circle.
  reportObj
    .transition()
    .duration(REPORT_FIG.DURATION)
    .attr("transform", "translate(" + (AREA.W - 30) + ", " + REPORT_FIG.R + ")")
    .transition()
    .duration(REPORT_FIG.DURATION)
    .attr("transform", "translate(" + (AREA.W - 60) + ", " + REPORT_FIG.R + ")")
    .transition()
    .duration(REPORT_FIG.DURATION)
    .attr("transform", "translate(" + (AREA.W - 90) + ", " + REPORT_FIG.R + ")")
    .transition()
    .duration(REPORT_FIG.DURATION)
    .attr("transform", "translate(" + (AREA.W - 120) + ", " + REPORT_FIG.R + ")")
    .transition()
    .duration(REPORT_FIG.DURATION)
    .attr("transform", "translate(" + (AREA.W - 150) + ", " + REPORT_FIG.R + ")")
    .transition()
    .duration(REPORT_FIG.DURATION)
    .attr("transform", "translate(" + (AREA.W - 180) + ", " + REPORT_FIG.R + ")")
    .transition()
    .duration(REPORT_FIG.DURATION)
    .attr("transform", function(d) {
      return "translate(" + projection([141.935, 45.52]) + ")";
    })
    .each("end", bind(transend, reportObj))
    .transition()
    .duration(REPORT_FIG.DURATION)
    .attr("fill", "#ff00ff")
    .remove();

}



/**
 * callback at the end of tansition report circle.
 */
function transend() {
  console.log("start function transend.");

  showReport(this);
  createRipple(this);

  console.log("end function transend.");
}


/**
 *
 **/
function showReport(pCircle) {

  teeReport(pCircle);

}

/**
 *
 **/
function createRipple(pCircle) {

  for (var i = 0; i < RIPPLE_FIG.MULT; i++) {
    svg.select("g#georepo")
      .append("circle")
      .attr({
        "class": "ripple",
        "r": RIPPLE_FIG.R,
        "transform": function(d) {
          return pCircle.attr("transform");
        }
      })
      .style("stroke", d3.hsl((rippleColor = (rippleColor + 1) % 360), 1, .5))
      // .style("stroke-opacity", 1)
      .transition()
      .duration(function() {
        return i * RIPPLE_FIG.DURATION;
      })
      .ease(Math.sqrt)
      .attr("r", RIPPLE_FIG.R_M)
      // .style("stroke-opacity", RIPPLE.R)
      .remove();
  }
}


// function createReport() {
//   var reportObj = svg.select("g#georepo")
//     .append("circle")
//     .attr({
//       "r": 10,
//       "fill": "#ad25a4"
//     });
//
//   return reportObj
// }
//
// function moveReport(reportObj) {
//
//   reportObj
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
//       createRipple();
//       return "translate(" + projection([141.935, 45.52]) + ")";
//     })
//     .transition()
//     .duration(500)
//     .attr("fill", "#ff00ff")
//     .remove();
//
//   console.log("moveReport:" + reportObj);
//
// }
//
// function executeReport(reportObj) {
//   console.log("executeReport:" + reportObj);
//
//   // reportObj.
//
//
//   // createRipple(reportObj);
//
// }
//
//
// /**
//  *
//  */
// function createRipple() {
//   console.log("createRipple:");
//
//   var i = 0;
//
//   svg.select("g#georepo")
//     .append("circle")
//     // .attr("cx", m[0])
//     // .attr("cy", m[1])
//     .attr("r", 1e-6)
//     // .attr("cx", function() {
//     //   console.log(reportObj);
//     //   // reportObj.attr("cx")
//     //   return 100;
//     // })
//     // .attr("cy", reportObj.attr("cy"))
//     .style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
//     .style("stroke-opacity", 1)
//     .transition()
//     .duration(500)
//     .ease(Math.sqrt)
//     .attr("r", 100)
//     .style("stroke-opacity", 1e-6)
//     .remove();
//
// }

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
