const logFile = 'log.txt';

const hashNumber = Number((window.location.hash || '#4').substring(1));

const logResponse = fetch(logFile);

am4core.ready(async function() {


  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  var chart = am4core.create("chartdiv", am4charts.XYChart);

  // Add data
  chart.data = await generateChartData();

  // Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "visits";
  series.dataFields.dateX = "date";
  series.strokeWidth = 2;
  series.minBulletDistance = 10;
  series.tooltipText = "{valueY}";
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.fillOpacity = 0.5;
  series.tooltip.label.padding(12,12,12,12)

  // Add scrollbar
  chart.scrollbarX = new am4charts.XYChartScrollbar();
  chart.scrollbarX.series.push(series);

  // Add cursor
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;
  chart.cursor.snapToSeries = series;

  async function generateChartData() {
    /*var firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 1000);
    var visits = 1200;
    for (var i = 0; i < 500; i++) {
      // we create date objects here. In your data, you can have date strings
      // and then set format of your dates using chart.dataDateFormat property,
      // however when possible, use date objects, as this will speed up chart rendering.
      var newDate = new Date(firstDate);
      newDate.setDate(newDate.getDate() + i);

      visits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);

      chartData.push({
          date: newDate,
          visits: visits
      });
    }*/

    const chartData = [];

    const data = (await (await logResponse).text()).split("\n").map(Number).filter(n => n);

    for (let entry of data) {

      const currDate = new Date(entry);

      const dateReduced = hashNumber > 1000 ? reduceDateDynamic(currDate, hashNumber) : reduceDate(currDate);

      const indexOfReducedEntry = chartData.indexOfKey("timestamp", dateReduced.getTime());
      if (indexOfReducedEntry > -1) {
        chartData[indexOfReducedEntry].visits++;
      }
      else {
        chartData.push({
          get timestamp() {
            return this.date.getTime();
          },
          date: dateReduced,
          visits: 1
        });
      }
    }
    console.log(chartData);
    return chartData;
  }

  function reduceDateDynamic(date, ms) {

    const timestamp = date.getTime();

    const reducedTimestamp = Math.trunc(timestamp / ms) * ms;

    return new Date(reducedTimestamp);

  }

  function reduceDate(date) {


    const dateSteps = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ].slice(0, hashNumber);
    return new Date(...dateSteps);
  }

}); // end am4core.ready()


Array.prototype.indexOfKey = function (key, value) {
  for (var i = 0; i < this.length; i++) {
    if (this[i][key] == value) {
      return i;
    }
  }
  return -1;
};
