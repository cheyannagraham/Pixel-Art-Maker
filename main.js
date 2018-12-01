// ---- PIXEL ART MAKER----------------
//--------FUNCTIONS-------------------
function setBackground(event) {
    let color;
    if (erase) {
      color = "white";
    } else {
      color = $("#color-picker-button").attr("value");
  
      if (!recents.includes(color) && color !== "") {
        recents.push(color);
        createRecentDiv(color);
      }
    }
    $(event.target).css("background-color", color);
  }
  
  function makeGrid() {
    let table = $("#grid-table");
    table.empty();
  
    const height = $("#grid-height").val();
    const width = $("#grid-width").val();
  
    for (let tr = 0; tr < height; tr++) {
      let td = "<tr>";
      let num = 1;
  
      while (num <= width) {
        td += "<td></td>";
        num++;
      }
      td += "</tr>";
      table.append(td);
    }
  }
  //-----CANVAS/COLORPICKER RELATED-----------------
  //show recents in color picker
  function createRecentDiv(color) {
    recentsContainer = $("#recents-container");
    recentsContainer.prepend(
      "<div class = 'small-view recent-color' title = '" +
        color +
        "' style='background-color:" +
        color +
        ";'> </div>"
    );
    if (recents.length > 14) {
      recents.shift();
      recentsContainer
        .children()
        .last()
        .remove();
    }
  }
  //--------------------------------------
  let recents = [];
  let mouseDown = false;
  let erase = false;
  let grid = $("#grid-table");
  
  //--------- EVENTS-------------------
  $(function() {
    makeGrid();
  });
  
  grid.on("click", "td", function(event) {
    setBackground(event);
  });
  
  grid.on("mousedown", "td", function(event) {
    mouseDown = true;
    setBackground(event);
  });
  
  grid.on("mouseup", "td", function(event) {
    mouseDown = false;
  });
  
  grid.on("mouseover", "td", function(event) {
    if (mouseDown) {
      setBackground(event);
    }
  });
  
  $("#erase-button").click(function() {
    erase = true;
    $(this).css("background-color", "yellow");
  });
  
  grid.on("dblclick", "td", function(event) {
    $(event.target).css("background-color", "white");
  });
  
  $("#color-picker-button").click(function() {
    erase = false;
    $("#erase-button").css("background-color", "white");
  });
  
  $("#form-button").on("click", function(event) {
    event.preventDefault();
    makeGrid();
  });
  
  $("#info-button").click(function() {
    $("#info-container").toggle("slow");
  });
  
  //-------CANVAS/COLORPICKER---------------
  
  //---------FUNCTIONS------------------
    function fillCanvas(inputColor) {
      //base color
      context.fillStyle = inputColor;
      context.fillRect(0, 0, cvsWidth, cvsHeight);
  
      let gradient = context.createLinearGradient(0, 0, cvsWidth, cvsHeight);
      gradient.addColorStop(0, "rgba(0,0,0,1");
      gradient.addColorStop(0.5, "rgba(0,0,0,0");
      gradient.addColorStop(0.5, "rgba(255,255,255,0)");
      gradient.addColorStop(1, "rgba(255,255,255,1)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, cvsWidth, cvsHeight);
    }
  
    function posToRGB(event, cxt) {
      let x = event.offsetX;
      let y = event.offsetY;
  
      let selectionData = cxt.getImageData(x, y, 1, 1).data;
      let rgb = "rgb(" + selectionData.slice(0, 3).join() + ")";
  
      $("#color-preview").css("background-color", rgb);
      return rgb;
    }
  
    function closePalette() {
      canvasContainer.toggle("slow");
    }
  
    function getColor(event) {
      let color = posToRGB(event, context);
      setColor(color);
    }
  
    function setColor(color) {
      let colorButton = $("#color-picker-button");
      colorButton.attr("value", color);
      colorButton.css("background-color", color);
      closePalette();
    }
  
    //---- CANVAS VARIABLES----------------
    let canvas = document.getElementById("color-shade");
    let context = canvas.getContext("2d");
    let cvsWidth = canvas.width;
    let cvsHeight = canvas.height;
  
    let canvas2 = document.getElementById("color-palette");
    let context2 = canvas2.getContext("2d");
    let cvs2Width = canvas2.width;
    let cvs2Height = canvas2.height;
  
    let canvasContainer = $("#canvas-container");
  
    //------ FILL CANVAS 1 & 2---------------
    let gradient2 = context2.createLinearGradient(0, 0, cvs2Width, cvs2Height);
    gradient2.addColorStop(0.03, "rgba(255,0,0,1)");
    gradient2.addColorStop(0.25, "rgba(255,255,0,1)");
  
    gradient2.addColorStop(0.35, "rgba(0,255,0,1)");
    gradient2.addColorStop(0.5, "rgba(0,255,255,1)");
  
    gradient2.addColorStop(0.699, "rgba(0,0,255,1)");
    gradient2.addColorStop(0.80, "rgba(255,0,255,1)");
    gradient2.addColorStop(0.99, "rgba(255,0,0,1)");
  
    context2.fillStyle = gradient2;
    context2.fillRect(0, 0, cvs2Width, cvsHeight);
  
    // ------------EVENTS--------------------
      fillCanvas("red");  
  
    $("#color-shade").mousemove(function(event) {
      posToRGB(event, context);
    });
  
    $("#color-shade").click(function(event) {
      getColor(event);
    });
  
    $("#recents-container").on("click", "div", function(event) {
      let color = $(this).attr("title");
      setColor(color);
    });
  
    $("#color-palette").mousemove(function(event) {
      posToRGB(event, context2);
    });
  
    $("#color-palette").click(function(event) {
      inputColor = posToRGB(event, context2);
      fillCanvas(inputColor);
    });
  
    $("#color-picker-button").click(function(event) {
      canvasContainer.css("display", "flex");
      canvasContainer.css("left", event.pageX);
      canvasContainer.css("top", event.pageY);
    });
  
    $(".close-button").click(function() {
      closePalette();
    });
  
  