let dataset;
const CITIES = ["Calabar", "Lagos", "Abuja"];
let _CURRENT_CITY = CITIES[1];
const width = 1000;
const height = 700;
const margin = { top: 20, right: 20, bottom: 50, left: 20 };
const svg = d3.select("svg");
let xAxis;
let yAxis;
let xScale;
let yScale;

//load temperature/_CURRENT_CITY dataset
const loadData = () => {
  if (dataset) return Promise.resolve(dataset);

  return new Promise((resolve, reject) => {
    d3.tsv("data.tsv", (err, data) => {
      if (err) reject(err);

      data.forEach(d => {
        d.date = d3.timeParse("%Y%m%d")(d.date);
        d.date = new Date(d.date);
        d[_CURRENT_CITY] = ++d[_CURRENT_CITY];
      });
      dataset = data;
      resolve(data);
    });
  });
};

const buildAxes = data => {
  const yExtent = d3.extent(data, d => d[_CURRENT_CITY]);

  xScale = d3
    .scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d[_CURRENT_CITY]))
    .range([height, margin.top]);

  xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickFormat(d3.timeFormat("%b %Y"));

  yAxis = d3.axisLeft().scale(yScale);

  svg
    .append("g")
    .attr("transform", "translate(" + [0, height] + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", "translate(" + [margin.left, 0] + ")")
    .call(yAxis);
};

const buildChart = () => {
  loadData().then(data => {
    buildAxes(data);
    drawChart(data);
  });
};

const drawChart = data => {
  let rect = svg.selectAll("rect").data(data, d => d.date);
  const transitionDuration = d3.transition().duration(1500);

  //exit
  rect
    .exit()
    .transition(transitionDuration)
    .attr("y", height)
    .attr("x", width)
    .attr("height", 0)
    .attr("width", 0)
    .remove();

  //enter
  let enter = rect
    .enter()
    .append("rect")
    .attr("stroke", "teal")
    .attr("strokeWidth", 0.5)
    .attr("x", width)
    .attr("y", height);

  //enter + update
  rect = enter
    .merge(rect)
    .attr("fill", "#ffa600")
    .attr("width", 2)
    .transition(transitionDuration)
    .attr("x", d => xScale(d.date))
    .attr("y", d => yScale(d[_CURRENT_CITY]))
    .attr("height", d => height - yScale(d[_CURRENT_CITY]));
};

const updateDataSource = () => {
  let currentCityIndex = CITIES.indexOf(_CURRENT_CITY);
  _CURRENT_CITY = CITIES[++currentCityIndex % 3];
};

buildChart();

setInterval(() => {
  updateDataSource();
  buildChart();
}, 5000);
