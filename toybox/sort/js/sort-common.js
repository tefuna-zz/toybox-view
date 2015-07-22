/** =======================================================================
 *  processing steps as sort method.
 * ======================================================================= */

/**
 *
 */
function procStep() {
  console.log("start function procStep." + ":" + count);

  if (count >= steps.length) {

    clearInterval(intervalId);
    intervalId = setInterval("finishSteps()", INTERVAL + 100);
    console.log("end of steps");

    return;
  }

  $("#txt-step-count").text(count + 1 + " / " + steps.length);

  drawStepAsExchanging();

  printStepLog(steps[count]);
  count++;

  console.log("end function procStep." + ":" + count);
}

/**
 * re-draw one step.
 */
function drawStepAsExchanging() {

  // slide rect.
  svgSteps.select("g.data").selectAll("rect")
    .data(steps[count].swapelem, function(d) {
      return d.id;
    })
    .transition()
    .duration(INTERVAL)
    .attr({
      x: function(d, i) {
        return d.pos * (AREA.W - AREA_MARGIN.RIGHT) / dataset.original.length + AREA_MARGIN.RIGHT;
      },
      fill: function(d) {
        if (steps[count].operation == "comparing") {
          return COLOR_RECT.COMPARING;
        } else {
          return COLOR_RECT.EXCHANGING;
        }
      }
    })
    .transition()
    .duration(INTERVAL)
    .attr({
      fill: function(d) {
        if (d.sorted === true) {
          return COLOR_RECT.COMPLETE;
        } else {
          if (d.id < 0) {
            return COLOR_RECT.DUMMY;
          } else {
            return COLOR_RECT.UNDONE;
          }
        }
      }
    });

  // slide text.
  svgSteps.select("g.data").selectAll("text")
    .data(steps[count].swapelem, function(d) {
      return d.id;
    })
    .transition()
    .duration(INTERVAL)
    .attr({
      "text-anchor": "middle",
      x: function(d, i) {
        return d.pos * (AREA.W - AREA_MARGIN.RIGHT) / dataset.original.length + (AREA.W / dataset.original.length - 1) / 2 + AREA_MARGIN.RIGHT;
      }
    });
}


/**
 *
 */
function finishSteps() {
  console.log("start function finishStep.");

  svgSteps.select("g.data").selectAll("rect")
    .transition()
    .duration(INTERVAL)
    .attr({
      fill: COLOR_RECT.COMPLETE
    });

  clearInterval(intervalId);
  console.log("end function finishStep.");
}



/** =======================================================================
 *  messsaging.
 * ======================================================================= */
/**
 * write step log to textarea.
 */
function printStepLog(stepObj) {

  var elemIds = "";
  for (var i = 0; i < stepObj.swapelem.length - 1; i++) {
    elemIds = elemIds + stepObj.swapelem[i].id + "(" + stepObj.swapelem[i].val + "), ";
  }
  elemIds = elemIds + stepObj.swapelem[stepObj.swapelem.length - 1].id + "(" + stepObj.swapelem[stepObj.swapelem.length - 1].val + ")";

  var array = "[]";
  // for (var i = 0; i < dataList.length - 1; i++) {
  //   array = array + dataList[i].val + ", ";
  // }
  // array = "[" + array + dataList[dataList.length - 1].val + "]";


  $("#txta-step-log").append("step: " + stepObj.seq + "\t");
  $("#txta-step-log").append("operation: " + stepObj.operation + "\t");
  $("#txta-step-log").append("elem-ids: " + elemIds + "\t");
  $("#txta-step-log").append("array: " + array + "\n");

  $("#txta-step-log").scrollTop($("#txta-step-log")[0].scrollHeight);
}


/**
 * set sort desciption text.
 */
function showSortDescription() {
  console.log("start function showSortDescription.");

  var selValue = $("#sel-sort-name").val();
  var description = "";

  switch (selValue) {
    case "01": //selection sort
      description = "01";
      break;
    case "02": //insertion sort
      description = "02";
      break;
    case "03": //quick sort
      description = "03";
      break;
    case "04": //merge sort
      description = "04";
      break;
    case "05": //heap sort
      description = "05";
      break;
    case "06": //radix sort(LSD)
      description = "06";
      break;
    case "07": //radix sort(MSD)
      description = "07";
      break;
    case "08": //intro sort
      description = "08";
      break;
    case "09": //std stable sort
      description = "09";
      break;
    case "10": //shell sort
      description = "10";
      break;
    case "11": //bubble sort
      description = "11";
      break;
    case "12": //shaker sort
      description = "12";
      break;
    case "13": //gnome sort
      description = "13";
      break;
    case "14": //bitonic sort
      description = "14";
      break;
    case "15": //bogo sort
      description = "15";
      break;
    default:
      description = "aaa";
      break;
  }

  $("#txta-sort-description").val(description);
  console.log("end function showSortDescription.");
}
