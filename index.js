'use strict';
const inquirer = require('inquirer');
const chalkPipe = require('chalk-pipe');
const FoodTruckData = require('./lib/foodtruckdata');

// Message to show at every input prompt
const message = [
  'Enter one of the following:',
  'n - show next page',
  ''
].join('\n');




// Main functionality
(async () => {

  try {

    // Initialize the food truck data (make the network request)
    let foodTruckData = new FoodTruckData();
    await foodTruckData.init();

    // Exit condition flag
    let exit = false;

    // Get the next truck info block (10 trucks)
    let truckData = foodTruckData.next().block;

    let questions = [{
      type: 'input',
      name: 'show more',
      message: truckData + '\n' + message,
      validate: (value) => {

        // Get the next block of truck info
        if (value === 'n') {
          let next = foodTruckData.next();

          // If this is the last page, set the exit condition
          if (next.isLast) {
            exit = true;
            return true;
          }
          truckData = next.block;
          return true;
        }
      }
    }];

    // If exit condition is not met, force the message to be the next truck info block. This is hacky :(
    while (!exit) {
      questions[0].message = truckData + '\n' + message;
      await inquirer.prompt(questions);
    }

    console.log('\nEnd of results!');

  } catch (error) {
    throw error;
  }

})();
