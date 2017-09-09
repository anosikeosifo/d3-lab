const city = "Lagos";
const rectWidth = 50;
const height = 400;

//load temperature/city dataset

d3.tsv("data.tsv", (err, data) => {
  console.log(data);
});
