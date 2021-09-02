// import parse from 'csv-parser';
// import parse from 'csv-parse/lib/sync';
import Papa from 'papaparse';
import $ from 'jquery';
let moonData = $.ajax({
  method: 'GET',
  url: 'http://127.0.0.1:8887/moon_data.csv',
  async: false
});
export default Papa.parse(moonData.responseText);
