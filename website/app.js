// Personal API Key for OpenWeatherMap API
const apiKey = '27a953b3df9377119c1ce6bbfe232b70';

const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// This will hold the weather data we fetch
let weatherData;

// Event listener to add function to existing HTML DOM element
var generateBtn = document.getElementById('generate')

/* Function called by event listener */
const generateEntries = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get user input
    const zip = document.getElementById('zip').value.trim();
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
        console.error("Couldn't retrieve the weather data.");
    }
};

generateBtn.addEventListener('click', generateEntries);

/* Function to GET Web API Data */
const getWeatherData = async (zip) => {
    try {
        const country = 'US'; // Change 'US' to the country code if necessary
        const response = await fetch(`${baseURL}${zip},${country}&appid=${apiKey}&units=metric`);

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        const data = await response.json();

        // Check if city was found
        if (data.cod === "404") {
            console.error("City not found. Please check the ZIP code.");
            alert("City not found. Please check the ZIP code.");
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("There was an error fetching the weather data:", error);
    }
};




/* Function to POST data */
const postData = async (url = '', data = {}) => {
    try {
        const response = await fetch(`http://localhost:3000${url}`, {  // Updated URL to localhost:3000
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const newData = await response.json();
        return newData;
    } catch (error) {
        console.error("There was an error posting the data:", error);
    }
};

/* Function to GET Project Data */
const retrieveData = async () => {
    try {
        const request = await fetch('http://localhost:3000/projects');  // Updated URL to localhost:3000
        const allData = await request.json();

        // Update the UI with the new data
        document.getElementById('temp').innerHTML = Math.round(allData.data[0].temperature) + '°C';
        document.getElementById('content').innerHTML = allData.data[0].content;
        document.getElementById('date').innerHTML = allData.data[0].date;
    } catch (error) {
        console.error("There was a problem retrieving the data:", error);
        document.getElementById('content').innerHTML = "Failed to retrieve data.";
    }
};
