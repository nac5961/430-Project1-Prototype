'use strict';

var pattern = [];
var maxLength = 30;

//Function to setup callback events for all UI
var setupUI = function setupUI() {
	var redPicker = document.getElementById('red-pick');
	var yellowPicker = document.getElementById('yellow-pick');
	var greenPicker = document.getElementById('green-pick');
	var bluePicker = document.getElementById('blue-pick');

	var gameForm = document.getElementById('input-container');

	var cancelButton = document.getElementById('cancel-button');
	var findButton = document.getElementById('find-button');

	/* Color Picker Event Listeners */
	redPicker.onclick = function () {
		updatePattern('Red');
	};

	yellowPicker.onclick = function () {
		updatePattern('Yellow');
	};

	greenPicker.onclick = function () {
		updatePattern('Green');
	};

	bluePicker.onclick = function () {
		updatePattern('Blue');
	};

	/* Form Event Listeners */
	gameForm.onsubmit = function (e) {
		//Get method and url to send in AJAX request
		var method = gameForm.getAttribute('method');
		var url = gameForm.getAttribute('action');

		//Send AJAX request and clear data
		sendRequest(method, url);
		clearPattern();

		//Prevent the form from submitting and changing the page
		e.preventDefault();
		return false;
	};

	/* Button Event Listeners */
	cancelButton.onclick = function () {
		clearPattern();
	};

	findButton.onclick = function () {
		//Send GET request to server using the filter query
		var url = document.getElementById('filter').value;
		sendRequest('GET', url);
	};
};

//Function to clear the pattern data and stop displaying it
var clearPattern = function clearPattern() {
	pattern = [];
	document.getElementById('pattern-text').innerHTML = '';
};

//Function to update the pattern data and display it
var updatePattern = function updatePattern(color) {
	//Prevent going over max length
	if (pattern.length === maxLength) return;

	//Get reference to pattern text
	var patternText = document.getElementById('pattern-text');

	//Special Case: 1st entry - display color
	if (pattern.length === 0) {
		patternText.innerHTML = color;
	}

	//Normal Case: Other entries - display color and comma separate them
	else {
			patternText.innerHTML += ', ' + color;
		}

	//Add color to array of pattern
	pattern.push(color);
};

//Helper function to create an element with a class
var createElement = function createElement(elementName, className) {
	//Create element
	var newElement = document.createElement(elementName);

	//Add class if one was provided
	if (className) newElement.classList.add(className);

	return newElement;
};

//Function to build the HTML for the returned games
var buildResult = function buildResult(json) {
	if (json.games && json.games.length != 0) {
		var resultsDiv = document.getElementById('results-container');
		resultsDiv.innerHTML = '';

		for (var i = 0; i < json.games.length; i++) {
			//Create all elements
			var result = createElement('div', 'result');

			var resultNameContainer = createElement('div', 'result-text-container');
			var resultName = createElement('p', 'result-text');

			var optionsContainer = createElement('div', 'options-container');
			var optionsSubContainer = createElement('div', 'options-sub-container');
			var difficulty = createElement('select', 'difficulty');
			var normalOption = createElement('option');
			var fastOption = createElement('option');
			var playButton = createElement('button', 'play-button');

			var resultLengthContainer = createElement('div', 'result-text-container');
			var resultLength = createElement('p', 'result-text');

			//Assign all elements values if needed
			resultName.textContent = json.games[i].name;

			normalOption.textContent = 'Speed: Normal';
			normalOption.value = 'normal';
			fastOption.textContent = 'Speed: Fast';
			fastOption.value = 'fast';
			playButton.textContent = 'Play';

			resultLength.textContent = 'Length: ' + json.games[i].length;

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
var processResponse = function processResponse(xhr, method) {
	//Display data returned from GET request
	if (method === 'get') {
		var json = JSON.parse(xhr.response);
		buildResult(json);
	}
};

//Function to send request to the server
var sendRequest = function sendRequest(method, url) {
	//Standardize the method to not worry about casing
	method = method.toLowerCase();

	//Create xhr object to send request
	var xhr = new XMLHttpRequest();

	//Set method and url for sending the request
	xhr.open(method, url);

	//Setup callback
	xhr.onload = function () {
		return processResponse(xhr, method);
	};

	//Set accept header (data we want to get back from the server)
	xhr.setRequestHeader('Accept', 'application/json');

	if (method === 'post') {
		//Set content-type header (data we are sending to the server)
		xhr.setRequestHeader('Content-Type', 'application/json');

		//Set data to send to the server
		var formData = {};
		formData.pattern = pattern;
		formData.name = document.getElementById('name-input').value;
		formData.length = pattern.length;

		//Send POST request to server with data
		xhr.send(JSON.stringify(formData));
	} else {
		//Send GET/HEAD request to server
		xhr.send();
	}
};

//Initialization
var init = function init() {
	setupUI();
};

window.onload = init;
