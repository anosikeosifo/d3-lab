const chartData = [120, 400, 250, 205, 80, 230];
const rectWidth = 50;
const height = 400;

const svg = d3.select("svg");

var enter = svg
  .selectAll("rect")
  .data(chartData)
  .enter()
  .append("rect")
  .attr("transform", "translate(50, 0)")
  .attr("x", (d, i) => i * rectWidth)
  .attr("y", d => height - d)
  .attr("width", rectWidth)
  .attr("height", d => d)
  .attr("fill", "teal")
  .attr("stroke", "#fff")
  .attr("class", "rect__hist");

//append yAxis
// // // // //
const yScale = d3
  .scaleLinear()
  .domain(d3.extent(chartData))
  .range([height, 0]);

const yAxis = d3.axisLeft().scale(yScale);
yAxis.ticks(10, ",.0f");
// yAxis.tickFormat(d3.format(",.0f"));

const axis = d3
  .select("svg")
  .append("g")
  .attr("transform", "translate(30, 0)")
  // .attr("stroke", "red")
  .call(yAxis);

const axisText = axis
  .selectAll("text")
  .attr("fill", d => (d > 200 ? "red" : "green"));

console.log("yAxis===> ", axis.node());
// console.log("extent===>>", d3.extent(enter.data()));
