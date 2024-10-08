const axios = require('axios');//Imports axios for making HTTP requests to the API

// Function to fetch the goal map from the API for the specified candidate
const getMap = async (candidate_id) => {
    try {
        console.log("Fetching goal map...");
        const response = await axios.get(`https://challenge.crossmint.io/api/map/${candidate_id}/goal`);
        console.log("Goal map fetched successfully.");
        return response.data.goal; // It returns the map data for further processing
    } catch (error) {
        console.error('Error fetching goal map:', error.message);
    }
}

// Function to insert a 'cometh' into the map at the specified row, column, and direction
const comeths = async (candidate_id, row, column, direction) => {
    try {
        console.log(`Processing cometh at [${row}, ${column}] with direction "${direction}"...`);
        await axios.post('https://challenge.crossmint.io/api/comeths', {
            candidateId: candidate_id,
            row,
            column,
            direction
        });
        console.log(`Successfully inserted cometh at [${row}, ${column}].`);
    } catch (error) {
        console.error(`Error while inserting the comeths at [${row}, ${column}]: ${error.message}`);
    }
}

// Function to insert a 'soloon' into the map at the specified row, column, and color
const soloons = async (candidate_id, row, column, color) => {
    try {
        console.log(`Processing soloon at [${row}, ${column}] with color "${color}"...`);
        await axios.post('https://challenge.crossmint.io/api/soloons', {
            candidateId: candidate_id,
            row,
            column,
            color
        });
        console.log(`Successfully inserted soloon at [${row}, ${column}].`);
    } catch (error) {
        console.error(`Error while inserting the soloons at [${row}, ${column}]: ${error.message}`);
    }
}

// Function to insert a 'polyanet' into the map at the specified row and column
const polyanets = async (candidate_id, row, column) => {
    try {
        console.log(`Processing polyanet at [${row}, ${column}]...`);
        await axios.post('https://challenge.crossmint.io/api/polyanets', {
            candidateId: candidate_id,
            row,
            column
        });
        console.log(`Successfully inserted polyanet at [${row}, ${column}].`);
    } catch (error) {
        console.error(`Error while inserting the polyanets at [${row}, ${column}]: ${error.message}`);
    }
}

//Delay function to avoid rate-limiting issues
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Main function to orchestrate the insertion process
const crossmint = async (candidate_id) => {
    console.log("Starting crossmint processing...");

    // First, we need to get the map data to know where to insert things
    const goalMap = await getMap(candidate_id);
    if (!goalMap) {
        console.error("Failed to fetch goal map. Exiting...");
        return; // Exits if the map wasn't fetched successfully
    }

    const size = goalMap.length; 

    // Loops over each cell in the map to process objects that aren't "space"
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const object = goalMap[i][j].toLowerCase();
            if (object !== "space") {
                // Inserts the correct object type based on its description
                if (object === "polyanet") {
                    await polyanets(candidate_id, i, j); // Inserts a polyanet
                } else {
                    const [attr, obj] = object.split("_");
                    if (obj === "soloon") {
                        await soloons(candidate_id, i, j, attr); // Inserts a soloon with the specified color
                    } else if (obj === "cometh") {
                        await comeths(candidate_id, i, j, attr); // Inserts a cometh with the specified direction
                    } else {
                        console.log(`Object with the name ${obj} doesn't exist`);
                    }
                }

                // Pause to avoid hitting the API rate limit
                await delay(4000);
            }
        }
    }
    console.log("Crossmint processing completed.");
}


const candidate_id = "471f1b47-6f11-4328-8dcd-2b6d7adfc142";
crossmint(candidate_id);
