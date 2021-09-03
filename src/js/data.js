import Papa from 'papaparse';
import $ from 'jquery';
import moon_data from '../data/moon_data.csv'
// !use ajax
// let moonData = $.ajax({
//   method: 'GET',
//   url: 'http://127.0.0.1:8887/data/moon_data.csv',
//   async: false
// });
// export default Papa.parse(moonData.responseText);

// !directly import data
export default Papa.parse(moon_data).data;