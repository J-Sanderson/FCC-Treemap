var w = 900;
var h = 800;

var svg = d3
  .select("#chart")
  .attr("width", w)
  .attr("height", h);

var fills = {
  "Wii": "#4C92C3",
  "DS": "#BED2ED",
  "X360": "#FF993E",
  "GB": "#FFC993",
  "PS3": "#56B356",
  "NES": "#ADE5A1",
  "PS2": "#DE5253",
  "3DS": "#FFADAB",
  "PS4": "#A985CA",
  "SNES": "#D1C0DD",
  "PS": "#A3786F",
  "N64": "#D0B0A9",
  "GBA": "#E992CE",
  "XB": "#F9C5DB",
  "PC": "#999999",
  "2600": "#D2D2D2",
  "PSP": "#C9CA4E",
  "XOne": "#E2E2A4"
};

d3.json(
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json",
  function(error, data) {
    if (error) throw error;

    var tip = d3
      .tip()
      .attr("class", "d3-tip")
      .html(function(d) {
        if (d.data.category) {
          return (
            d.data.name +
            "<br>Console: " +
            d.data.category +
            "<br>Value: " +
            d.data.value
          );
        }
      })
      .direction("e");
    svg.call(tip);

    var treemap = d3
      .treemap()
      .size([w, 600])
      .paddingOuter(1);

    var root = d3.hierarchy(data);
    root.sum(function(d) {
      return d.value;
    });

    var nodes = treemap(root);

    var rects = svg
      .selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + [d.x0, d.y0] + ")";
      })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    rects
      .append("rect")
      .attr("width", function(d) {
        return Math.max(0, d.x1 - d.x0 - 1);
      })
      .attr("height", function(d) {
        return Math.max(0, d.y1 - d.y0 - 1);
      })
      .attr("class", "legend-item")
      .attr("fill", function(d) {
        if (fills.hasOwnProperty(d.data.category)) {
          return fills[d.data.category];
        } else {
          return "white";
        }
      });

    rects
      .append("text")
      .attr("class", "label")
      .attr("x", 3)
      .attr("y", 10)
      .text(function(d) {
        return d.data.name;
      });

    var legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", "translate(" + (w / 2 - 140) + ", 620)");

    var consoles = Object.keys(fills);

    for (var i = 0; i < consoles.length; i++) {
      var offset;
      if (i % 3 === 0) {
        offset = 0;
      } else if ((i - 1) % 3 === 0) {
        offset = 1;
      } else {
        offset = 2;
      }
      var row = i - offset;
      legend
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", fills[consoles[i]])
        .attr("x", function(d) {
          if (i % 3 === 0) {
            return 0;
          } else if ((i - 1) % 3 === 0) {
            return 100;
          } else {
            return 200;
          }
        })
        .attr("y", row * 10);
      legend
        .append("text")
        .attr("class", "legend-text")
        .text(consoles[i])
        .attr("x", function(d) {
          if (i % 3 === 0) {
            return 23;
          } else if ((i - 1) % 3 === 0) {
            return 123;
          } else {
            return 223;
          }
        })
        .attr("y", row * 10 + 16);
    }
  }
);
