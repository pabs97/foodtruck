const moment = require('moment');
const request = require('request');
const util = require('util');

class FoodTruckData {
  constructor() {
  }

  async init() {
    const today = moment().format('dddd');
    const options = { url: `https://data.sfgov.org/resource/bbb8-hzi6.json` };

    return new Promise((resolve, reject) => {
      request.get(options, (error, response) => {
        if (error) return reject(error);

        this.trucks = treatResponse(JSON.parse(response.body));
        this.size = this.trucks.length;
        this.page = 0;
        resolve(this);
      });
    });

    function treatResponse(response) {
      return response
        .filter(truck => truck.dayofweekstr === today)
        .map(truck => {
          return {
            applicant: truck.applicant,
            location: truck.location
          }
        })
        .sort((a, b) => a.applicant.localeCompare(b.applicant));
    }
  }

  next() {
    // 40 / 10 = 4
    // 39 / 10 = 3.9
    // 31 / 10 = 3.1
    // 30 / 10 = 3
    let page = this.page;
    if (page < this.size / 10) page = ++this.page;
    let block = this.trucks.slice(page * 10, page * 10 + 10);
    return displayTenTrucks(block);
  }

  prev() {
    let page = this.page;
    if (page > 1) page = --this.page;
    let block = this.trucks.slice(page * 10, page * 10 + 10);
    return displayTenTrucks(block);
  }
}

function displayTenTrucks(block) {

  // TODO: this could be done in treatResponse function
  return block.reduce((accum, curr) => {
    return `${accum}\nName: ${curr.applicant}\nAddress:${curr.location}\n`;
  }, '');

}

module.exports = FoodTruckData;