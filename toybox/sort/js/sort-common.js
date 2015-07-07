/** =======================================================================
 *  processing steps as sort method.
 * ======================================================================= */

/**
 * re-draw one step.
 */
function procStepAsExchaging() {
  console.log("start function procStep." + ":" + count);

  if (count >= steps.length) {
    console.log("end of steps");
    clearInterval(intervalId);
    return;
  }

  $("#txt-step-count").text(count + 1 + " / " + steps.length);
  // slide rect.
  svgSteps.select("g.data").selectAll("rect")
    .data(steps[count].swapelem, function(d) {
      return d.id;
    })
    .transition()
    .duration(INTERVAL)
    .attr({
      fill: COLOR_MOVE,
      x: function(d, i) {
        return d.pos * (AREA_W - AREA_PAD) / dataset.original.length + AREA_PAD;
      }
    })
    .transition()
    .duration(INTERVAL)
    .attr({
      fill: function(d) {
        console.log(d);
        if (d.sorted === true) {
          return COLOR_COMP;
        } else {
          return COLOR_INIT;
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
        return d.pos * (AREA_W - AREA_PAD) / dataset.original.length + (AREA_W / dataset.original.length - 1) / 2 + AREA_PAD;
      }
    });

  printStepLog(steps[count]);
  count++;

  console.log("end function procStep." + ":" + count);
}

/**
 *
 */
function procStepAsSelectionSort() {
  procStepAsExchaging();

}



/** =======================================================================
 *  messsaging.
 * ======================================================================= */
/**
 * write step log to textarea.
 */
function printStepLog(stepObj) {
  $("#txta-step-log").append("step: " + stepObj.seq + "\tswap(id): " + stepObj.swapelem[0].id + " <-> " + stepObj.swapelem[1].id + "\tarray: クライアントで今の状態をとるしかない。" + "\n");
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
