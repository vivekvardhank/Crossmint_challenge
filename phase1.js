// Imported axios for handling HTTP requests
const axios = require('axios');

const candidate_id = "471f1b47-6f11-4328-8dcd-2b6d7adfc142";
const grid_size = 11;

// Delay function to pause execution for given seconds
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to send POST requests to place polyanets in a pattern
const sendRequests = async () => {
  console.log("Starting to send POST requests to place polyanets...");

  for (let i = 2; i <= 8; i++) {
    try {
      // Place a polyanet on the main diagonal
      console.log(`Placing polyanet at row ${i}, column ${i}...`);
      await axios.post('https://challenge.crossmint.io/api/polyanets', {
        candidateId: candidate_id,
        row: i,
        column: i,
      });
      console.log(`Polyanet placed at row ${i}, column ${i} successfully.`);

      // Place a polyanet on the opposite diagonal
      console.log(`Placing polyanet at row ${i}, column ${grid_size - i - 1}...`);
      await axios.post('https://challenge.crossmint.io/api/polyanets', {
        candidateId: candidate_id,
        row: i,
        column: grid_size - i - 1,
      });
      console.log(`Polyanet placed at row ${i}, column ${grid_size - i - 1} successfully.`);
      await delay(2000);//Pause between requests to avoid hitting rate limits
    } catch (error) {
      console.error('Error in POST request:', error.message); // Log if there’s an error in any of the POST requests
    }
  }

  // Once all requests are completed it fetches the updated goal map
  try {
    console.log("Fetching updated goal map...");
    const response = await axios.get(`https://challenge.crossmint.io/api/map/${candidate_id}/goal`);
    console.log("Goal Map fetched successfully:", response.data);
  } catch (error) {
    console.error('Error fetching goal map:', error.message); // Logs if there’s an error fetching the goal map
  }

  console.log("Finished sending POST requests.");
}


 sendRequests();


// Function to delete a specific item (polyanet) from the map
const deleteItems = async () => {
  console.log("Starting to delete specific items...");
  try {
    // Attempt to delete an item at the specified coordinates
    await axios.delete('https://challenge.crossmint.io/api/polyanets', {
      data: {
        candidateId: candidate_id,
        row: 2,
        column: 8
      }
    });
    console.log('Item at row 2, column 8 deleted successfully.');
  } catch (error) {
    console.error('Error deleting item:', error.message); // Log if deletion fails
  }

  console.log("Finished deleting items.");
}

// Uncomment this line to run the deleteItems function
// deleteItems();
