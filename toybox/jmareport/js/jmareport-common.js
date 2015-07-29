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
 *
 **/
function getPostionFromOfficeName(name) {

  if (name == null) {
    return null;
  }

  // TODO
  for (var i = 0; i < dataGeoObs.features.length; i++) {
    for (var j = 0; j < dataM.classes.length; j++) {
      if (dataGeoObs.features[i].properties.class === dataM.classes[j].id) {
        if (name === dataGeoObs.features[i].properties.name + dataM.classes[j].name) {
          return dataGeoObs.features[i].geometry.coordinates;
        }
      }
    }
  }

  return null;
}


/**
 *
 **/
function getPositionFromTransform(str) {

  if (str == null) {
    return null;
  }

  var pos = [];
  pos.push(parseInt(str.substring(str.indexOf("(") + 1, str.indexOf(","))));
  pos.push(parseInt(str.substring(str.indexOf(",") + 1, str.indexOf(")"))));

  return pos;
}


/**
 *
 **/
function getDescPosition(tStr, width) {

  pos = getPositionFromTransform(tStr);

  var x, y;
  if (pos[0] < AREA.W - width) {
    x = pos[0] + DESCRIPTION_FIG.POS_MARGIN_W;
  } else {
    x = pos[0] - width - DESCRIPTION_FIG.POS_MARGIN_W;
  }

  if (pos[1] < AREA.H - DESCRIPTION_FIG.HEIGHT) {
    y = pos[1] + DESCRIPTION_FIG.POS_MARGIN_H;
  } else {
    y = pos[1] - DESCRIPTION_FIG.HEIGHT - DESCRIPTION_FIG.POS_MARGIN_H;
  }

  return [x, y];
}



/** ============================================================================
 *
 *
 * ========================================================================= */
/**
 * stop + clear interval
 */
function stopReportingService() {
  clearInterval(intervalId);
  intervalId = 0;
}

/**
 *  start interval .
 */
function startReportingService() {
  console.log("start function startReportingService()");

  if (intervalId != 0) {
    console.log("service is already running.");
    return;
  }

  rippleColor = 0;
  intervalId = setInterval(executeReporting, INTERVAL);

  console.log("end function startReportingService()");
}


/**
 *
 */
function executeReporting() {

  fetchReport();

  if (dataRep.length > 0) {
    drawReporting(dataRep.shift());
    return;
  }
}


/**
 *
 */
function fetchReport() {

  d3.json("data.json", function(error, data) {
    if (error != null) {
      console.log(err);
      return;
    }
    console.log(data);
    for (var i = 0; i < data.data.length; i++) {
      teeReport("fetch: " + data.data[i].detail.control.editorialOffice + " " + data.data[i].title);
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
      return d.link;
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
    .attr("r", 5)
    .attr("transform", function(d) {
      var position = getPostionFromOfficeName(d.detail.control.editorialOffice);
      if (position == null) {
        position = [0, AREA.H];
        teeReport("unknown editorial office :" + d.detail.control.editorialOffice);
      }
      return "translate(" + projection(position) + ")";
    })
    .each("end", bind(transend, reportObj))
    .transition()
    .duration(REPORT_FIG.DURATION)
    .attr("fill", "#ff00ff")
    .remove();

}



/**
 * callback at the end of transition report circle.
 */
function transend() {
  console.log("start function transend.");

  drawRipple(this);
  drawDescription(this);

  console.log("end function transend.");
}


/**
 *
 **/
function drawDescription(pCircle) {

  var repdata = pCircle.datum();
  teeReport("show: " + repdata.detail.control.editorialOffice + " " + repdata.link);

  var descRect = svg.select("g#georepo").append("rect");
  descRect
    .attr({
      "class": "description",
      "width": 100,
      "height": DESCRIPTION_FIG.HEIGHT,
      "rx": DESCRIPTION_FIG.RX,
      "ry": DESCRIPTION_FIG.RY
    })
    .attr("transform", function(d) {
      pos = getDescPosition(pCircle.attr("transform"), descRect.attr("width"));
      return "translate(" + pos[0] + "," + pos[1] + ")";
    })
    .transition()
    .duration(3000)
    .transition()
    .duration(DESCRIPTION_FIG.DURATION)
    .style("opacity", 0)
    .remove();


  // var desc = [
  //   "d: " + repdata.detail.control.dateTime,
  //   "p: " + repdata.detail.control.editorialOffice,
  //   "t: " + repdata.detail.head.title,
  //   "h: " + repdata.headline
  // ];
  //
  // var descText = svg.select("g#georepo").selectAll("text")
  //   .data(desc)
  //   .enter()
  //   .append("text")
  //   .attr({
  //     "class": "description",
  //     "width": 120,
  //     "height": DESCRIPTION_FIG.HEIGHT
  //   })
  //   .attr("transform", function(d) {
  //     pos = getDescPosition(pCircle.attr("transform"), descRect.attr("width"));
  //     return "translate(" + pos[0] + "," + pos[1] + ")";
  //   })
  //   .text(function(d) {
  //     return d;
  //   });
  //
  // descText
  //   .transition()
  //   .duration(2000);
  //
  // svg.select("g#georepo").selectAll("text")
  //   .data([])
  //   .exit()
  //   .remove();


  var descText = svg.select("g#georepo").append("text")
  descText
    .attr({
      "class": "description",
      "width": 100,
      "height": DESCRIPTION_FIG.HEIGHT
    })
    .attr({
      "transform": function(d) {
        pos = getDescPosition(pCircle.attr("transform"), descRect.attr("width"));
        return "translate(" + pos[0] + "," + pos[1] + ")";
      },
      "dx": "0.7em",
      "dy": "1.2em"
    })
    .text(function() {
      var desc = [];
      desc.push("d: " + repdata.detail.control.dateTime);
      desc.push("p: " + repdata.detail.control.editorialOffice);
      desc.push("t: " + repdata.detail.head.title);
      desc.push("h: " + repdata.headline);

      return "d: " + repdata.detail.control.dateTime;
    })
    .transition()
    .duration(3000)
    .transition()
    .duration(DESCRIPTION_FIG.DURATION)
    .style("opacity", 0)
    .remove();
}


/**
 *
 **/
function drawRipple(pCircle) {

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
