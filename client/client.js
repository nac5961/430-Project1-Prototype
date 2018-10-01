let pattern = [];
let maxLength = 30;

//Function to setup callback events for all UI
const setupUI = () => {
	const redPicker = document.getElementById('red-pick');
	const yellowPicker = document.getElementById('yellow-pick');
	const greenPicker = document.getElementById('green-pick');
	const bluePicker = document.getElementById('blue-pick');
	
	const gameForm = document.getElementById('input-container');
	
	const cancelButton = document.getElementById('cancel-button');
	const findButton = document.getElementById('find-button');
	
	/* Color Picker Event Listeners */
	redPicker.onclick = () => {
		updatePattern('Red');
	};
	
	yellowPicker.onclick = () => {
		updatePattern('Yellow');
	};
	
	greenPicker.onclick = () => {
		updatePattern('Green');
	};
	
	bluePicker.onclick = () => {
		updatePattern('Blue');
	};
	
	/* Form Event Listeners */
	gameForm.onsubmit = (e) => {
		//Get method and url to send in AJAX request
		const method = gameForm.getAttribute('method');
		const url = gameForm.getAttribute('action');
		
		//Send AJAX request and clear data
		sendRequest(method, url);
		clearPattern();
		
		//Prevent the form from submitting and changing the page
		e.preventDefault();
		return false;
	};
	
	/* Button Event Listeners */
	cancelButton.onclick = () => {
		clearPattern();
	};
	
	findButton.onclick = () => {
		//Send GET request to server using the filter query
		const url = document.getElementById('filter').value;
		sendRequest('GET', url);
	};
};

//Function to clear the pattern data and stop displaying it
const clearPattern = () => {
	pattern = [];
	document.getElementById('pattern-text').innerHTML = '';
};

//Function to update the pattern data and display it
const updatePattern = (color) => {
	//Prevent going over max length
	if (pattern.length === maxLength)
		return;
	
	//Get reference to pattern text
	const patternText = document.getElementById('pattern-text');
	
	//Special Case: 1st entry - display color
	if (pattern.length === 0){
		patternText.innerHTML = color;
	}
	
	//Normal Case: Other entries - display color and comma separate them
	else{
		patternText.innerHTML += `, ${color}`;
	}
	
	//Add color to array of pattern
	pattern.push(color);
};

//Helper function to create an element with a class
const createElement = (elementName, className) => {
	//Create element
	const newElement = document.createElement(elementName);

	//Add class if one was provided
	if (className)
		newElement.classList.add(className);
	
	return newElement;
};

//Function to build the HTML for the returned games
const buildResult = (json) => {
	if (json.games && json.games.length != 0){
		const resultsDiv = document.getElementById('results-container');
		resultsDiv.innerHTML = '';
		
		for (let i = 0; i < json.games.length; i++){
			//Create all elements
			const result = createElement('div', 'result');
			
			const resultNameContainer = createElement('div', 'result-text-container');
			const resultName = createElement('p', 'result-text');
			
			const optionsContainer = createElement('div', 'options-container');
			const optionsSubContainer = createElement('div', 'options-sub-container');
			const difficulty = createElement('select', 'difficulty');
			const normalOption = createElement('option');
			const fastOption = createElement('option');
			const playButton = createElement('button', 'play-button');
			
			const resultLengthContainer = createElement('div', 'result-text-container');
			const resultLength = createElement('p', 'result-text');
			
			//Assign all elements values if needed
			resultName.textContent = json.games[i].name;
			
			normalOption.textContent = 'Speed: Normal';
			normalOption.value = 'normal';
			fastOption.textContent = 'Speed: Fast';
			fastOption.value = 'fast';
			playButton.textContent = 'Play';
			
			resultLength.textContent = `Length: ${json.games[i].length}`;
			
			//Parent all of the elements
			result.appendChild(resultNameContainer);
			result.appendChild(optionsContainer);
			result.appendChild(resultLengthContainer);
			
			resultNameContainer.appendChild(resultName);
			
			optionsContainer.appendChild(optionsSubContainer);
			optionsSubContainer.appendChild(difficulty);
			optionsSubContainer.appendChild(playButton);
			difficulty.appendChild(normalOption);
			difficulty.appendChild(fastOption);
			
			resultLengthContainer.appendChild(resultLength);
			
			//Append the result to the page
			resultsDiv.appendChild(result);
		}
	}		
};

//Function to handle the response from the server
const processResponse = (xhr, method) => {
	//Display data returned from GET request
	if (method === 'get'){
		const json = JSON.parse(xhr.response);
		buildResult(json);
	}
};

//Function to send request to the server
const sendRequest = (method, url) => {
	//Standardize the method to not worry about casing
	method = method.toLowerCase();
	
	//Create xhr object to send request
	const xhr = new XMLHttpRequest();
	
	//Set method and url for sending the request
	xhr.open(method, url);
	
	//Setup callback
	xhr.onload = () => processResponse(xhr, method);
	
	//Set accept header (data we want to get back from the server)
	xhr.setRequestHeader('Accept', 'application/json');
	
	if (method === 'post'){
		//Set content-type header (data we are sending to the server)
		xhr.setRequestHeader('Content-Type', 'application/json');
		
		//Set data to send to the server
		const formData = {};
		formData.pattern = pattern;
		formData.name = document.getElementById('name-input').value;
		formData.length = pattern.length;
		
		//Send POST request to server with data
		xhr.send(JSON.stringify(formData));
	}
	else{
		//Send GET/HEAD request to server
		xhr.send();
	}
};

//Initialization
const init = () => {
	setupUI();
};

window.onload = init;