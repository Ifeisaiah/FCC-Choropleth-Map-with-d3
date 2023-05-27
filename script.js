let countyData;
let educationData;

let svg = d3.select('#chart');
let tooltip = d3.select('#tooltip')

let drawMap = () => {
  svg.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
    let id = countyDataItem.id;
    let county = educationData.find((item) => {
      return item.fips === id;
    })
    let percentage = county.bachelorsOrHigher;
    if (percentage <= 15) {
      return '#ce4257'
    } else if (percentage <= 30) {
      return '#ff7f51'
    } else if(percentage <= 45) {
      return '#218380'
    } else {
      return '#73d2de'
    }
  })   
    .attr('data-fips', (countyDataItem) => {
    return countyDataItem.id
  })
    .attr('data-education', (countyDataItem) => {
    let id = countyDataItem.id;
    let county = educationData.find((item) => {
      return item.fips === id;
    })
    let percentage = county.bachelorsOrHigher;
    return percentage
  })
    .on('mouseover', (countyDataItem, index) => {
    let id = index.id;
    let county = educationData.find((item) => {
      return item.fips === id;
    })
    let percentage = county.bachelorsOrHigher;

    tooltip.style('visibility', 'visible')
      .html(`${county.area_name}, ${county.state}, ${county.fips} ${county.bachelorsOrHigher}%`)
      .attr('data-education', county.bachelorsOrHigher)
  })
    .on('mouseout', (countyData) => {
    tooltip.style('visibility','hidden')
  })
}
//fetches county data
fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
  .then(res => res.json())
  .catch((err) => console.log(err))
  .then(data => {
  countyData = topojson.feature(data, data.objects.counties).features;
  console.log(countyData)

  //fetches education data
  fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    .then(res => res.json())
    .catch((err) => console.log(err))
    .then(data => {
    educationData = data;
    console.log(educationData)
    drawMap()
  })
})
