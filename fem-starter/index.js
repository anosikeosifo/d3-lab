const city = "Lagos";
const width = 1000;
const height = 700;
const margin = { top: 20, right: 20, bottom: 50, left: 20 };

//load temperature/city dataset

d3.tsv("data.tsv", (err, data) => {
  console.log(data);

  data.forEach(d => {
    d.date = d3.timeParse("%Y%m%d")(d.date);
    d.date = new Date(d.date);
    d[city] = ++d[city];

    const svg = d3.select("svg");
    const yMax = d3.max(data, d => d[city]);
    const xScale = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, yMax]).range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%b %Y"));
    const yAxis = d3.axisLeft().scale(yScale);

    svg.append("g").attr("transform", `translate(${[0, height - margin.bottom]})`).call(xAxis);
    svg.append("g").attr("transform", `translate(${[margin.left, 0]})`).call(yAxis);

    const rect = svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", 5)
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScale(d[city]))
      .attr("height", d => height - yScale(d[city]));
  });
});
