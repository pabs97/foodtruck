'use strict';
const moment = require('moment');
const request = require('request');

/**
 * A class for requesting and managing the Food Truck info
 */
class FoodTruckData {

  /**
   * Empty constructor since we need to initialize asynchronously
   */
  constructor() {
  }

  /**
   * Make the network for the food truck data
   * Treats/Filters the response of unncessary data
   * @returns {Promise} Promise for network request and data treating
   */
  async init() {
    // Day of the week
    const today = moment().format('dddd');

    // Foodtruck API endpoint
    const options = { url: `https://data.sfgov.org/resource/bbb8-hzi6.json` };

    // Wrap request call in a promise
    return new Promise((resolve, reject) => {
      request.get(options, (error, response) => {
        if (error) return reject(error);

        // Treat the response and intialize some class properties
        this.trucks = treatResponse(JSON.parse(response.body));
        this.size = this.trucks.length;
        this.page = 0;
        resolve(this);
      });
    });

    /**
     * Filter that only keeps trucks open today, and name/address keys
     * Sorts the list alphabetically
     * @param {Object} response
     * @returns {Array} Treated data block
     */
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

  /**
   * Gets next block of 10 or less food trucks
   * Sets isLast flag if there are no more blocks after
   * @returns {Object} The block itself and isLast flag
   */
  next() {
    let isLast = false;

    if (++this.page > this.size / 10) isLast = true;

    let block = this.trucks.slice(this.page * 10, this.page * 10 + 10);

    return {
      isLast,
      block: displayTenTrucks(block)
    };
  }

  /**
   * NOT USED
   * does the opposite of next() (goes to previous 10 trucks)
   */
  prev() {
    let page = this.page;
    if (page > 1) page = --this.page;
    let block = this.trucks.slice(page * 10, page * 10 + 10);
    return displayTenTrucks(block);
  }
}

/**
 * Converts Array of 10 trucks into a readable output String
 * @param {Array} block
 * @returns {String} Readable output String
 */
function displayTenTrucks(block) {
  return block.reduce((accum, curr) => {
    return `${accum}\nName: ${curr.applicant}\nAddress:${curr.location}\n`;
  }, '');
}

module.exports = FoodTruckData;