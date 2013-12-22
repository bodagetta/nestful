var login = "";
var password = "";
var accessToken;
var transportUrl;
var userId;
var lastStatus;
var nestIds = [];
var currentTemperature;
var targetTemperature;

function connect(){
	URL = "https://home.nest.com/user/login";
	$.ajax({
		url: URL,
		type: 'POST',
		data: { username: login, password: password },
		success: function(response) {
		 console.log(response);
		 transportUrl = response.urls.transport_url;
		 accessToken = response.access_token;
		 userId = response.user;
		 getSystemInfo();
		}
	});
}

function getSystemInfo(){
	URL = transportUrl + "/v2/mobile/" + userId;
	$.ajax({
		url: URL,
		type: 'GET',
		headers: {
            'X-nl-user-id':userId,
            'X-nl-protocol-version':'1',
            'Accept-Language':'en-us',
            'Authorization':'Basic ' + accessToken
		},
		success: function(response) {
			lastStatus = response;
			getAllIds(response);
			console.log(response);
		}
	});
}

function getAllIds(){
	$.each(lastStatus.device, function(k, v){ 
				nestIds.push(k);
	});
	getCurrentTemperature();
}

function getCurrentTemperature(){
	currentTemperature = celsiusToFahrenheit(lastStatus.shared[nestIds[0]].current_temperature);
	targetTemperature = celsiusToFahrenheit(lastStatus.shared[nestIds[0]].target_temperature);
	$( "div.temperature" ).text(currentTemperature);
	$( "div.target_temperature" ).text(targetTemperature);
}

var fahrenheitToCelsius = function (f) {
    return (f - 32) * 5 / 9.0;
};

var celsiusToFahrenheit = function (c) {
    return Math.round(c * (9 / 5.0) + 32.0);
};

function setTemperature(tempC){
	var body = {
            'target_change_pending':true,
            'target_temperature':tempC
        };
}

function temperature_up(e){
	console.log("Temperature Up");
}

function temperature_down(e){
	console.log("Temperature Down");
}

function loginSubmitted(e){
	login = $("#loginName").val();
	password = $("#password").val();
	console.log(login);
	console.log(password);
	$('#controls').removeClass('hidden');
	$('#login').addClass('hidden');
	connect();
}


document.addEventListener('DOMContentLoaded', function () {
	console.log("connecting");
	document.getElementById("temp_up").addEventListener('click', temperature_up);
	document.getElementById("temp_down").addEventListener('click', temperature_down);	
	document.getElementById("loginSubmitted").addEventListener('click', loginSubmitted);
	if (login === ""){
		$('#controls').addClass('hidden');
		$('#login').removeClass('hidden');
	}
	else{
		connect();
	}	

});

