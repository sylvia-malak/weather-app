// Personal API Key for OpenWeatherMap API
const apiKey = '27a953b3df9377119c1ce6bbfe232b70';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// This will hold the weather data we fetch
let weatherData;

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', generateEntries);

/* Function called by event listener */
const generateEntries = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get user input
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    // Fetch weather data based on the ZIP code
    weatherData = await getWeatherData(zip);
    
    // Check if we got the weather data
    if (weatherData) {
        // Grab the temperature and the current date
        const temperature = weatherData.main.temp;
        const date = new Date().toLocaleDateString();

        // Prepare the data to send to our server
        const data = {
            temperature: temperature,
            date: date,
            content: feelings
        };

        // Function to POST data
        await postData('/projects/add', data);

        // Now, let's get the updated project data to display
        await retrieveData();
    } else {
        console.error("couldn't retrieve the weather data.");
    }
};

/* Function to GET Web API Data */
const getWeatherData = async (zip) => {
    try {
        const response = await fetch(`${baseURL}${zip}&appid=${apiKey}&units=metric`);
        
        // Check if the response is okay
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        return data; // Return the data if all goes well
    } catch (error) {
        console.error("There was an error fetching the weather data:", error);
    }
};

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Return the new data from the server
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.error("There was an error posting the data:", error);
    }
};

/* Function to GET Project Data */
const retrieveData = async () => {
    const request = await fetch('/projects');
    try {
        const allData = await request.json();

        // Update the UI with the new data
        document.getElementById('temp').innerHTML = Math.round(allData.data[0].temperature) + '°F';
        document.getElementById('content').innerHTML = allData.data[0].content;
        document.getElementById('date').innerHTML = allData.data[0].date;
    } catch (error) {
        console.error("There was a problem retrieving the data:", error);
        // Let the user know something went wrong
        document.getElementById('content').innerHTML = " Failed to retrieve data.";
    }
};


