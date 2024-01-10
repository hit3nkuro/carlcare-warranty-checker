const resultTableBodySelector = "#warranty-check-result";
const textAreaSelector = "#warranty-check-textarea";
const buttonSelector = "#warranty-check-button";

const imeiRegExp = new RegExp("[0-9]{15}");
const apiUrl = 'https://java-api.carlcare.com/warranty/check';

$(document).ready(function(e) {
	$(buttonSelector).on('click', function() {
		checkWarranty();
	});
});

function checkWarranty() {
	let imeiArray = $(textAreaSelector).val().split('\n');
	imeiArray = imeiArray.filter((temp) => imeiRegExp.test(temp));


	imeiArray.forEach( async (imei) => {		
		if ($('tr#'+imei).length == 0) {
			let dataString = { "shortName" : "ru", "imei" : imei};
			postData(apiUrl, dataString).then((data) => createRow(dataProcessing(data)));
		}		
	});
}

function dataProcessing(jsonData) {
	console.log(jsonData);
	let imei;
	let currentDate;
	let activationDate;
	let warrantyStatus;
	let warrantyExpirationDate;

	imei = jsonData.result.imei[0];
	currentDate = (new Date()).toISOString().slice(0,10);
	activationDate = (new Date(jsonData.result.activeTime)).toISOString().slice(0,10);	

	switch(jsonData.result.status) {
		case 2:
			warrantyStatus = 'Не активирован';
			break;
		case 3:
			warrantyExpirationDate = (new Date(jsonData.result.warrantyDuration)).toISOString().slice(0,10);
			if (warrantyExpirationDate < currentDate) {
				warrantyStatus = 'Истекла';
			}
			else {
				warrantyStatus = 'Активна';
			}
			break;
		default:
			console.log('unexpected status');
	}

	return new Array(imei, warrantyStatus, activationDate, warrantyExpirationDate);
}

function createRow(arrayData) {
	let newRow = '<tr imei="'+arrayData[0]+'"><td>'+arrayData[0]+'</td><td>'+arrayData[1]+'</td><td>'+arrayData[2]+'</td><td>'+arrayData[3]+'</td></tr>';
	$(resultTableBodySelector).append('<tr id="'+arrayData[0]+'"><td>'+arrayData[0]+'</td><td>'+arrayData[1]+'</td><td>'+arrayData[2]+'</td><td>'+arrayData[3]+'</td></tr>');
}

async function postData(url='', data={}) {
	const response = await fetch(url,{
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'omit',
		headers: {
			'accept': 'application/json, text/plain, */*',
			'accept-language': 'ru,en-US;q=0.9,en;q=0.8,ru-RU;q=0.7,id;q=0.6,de;q=0.5,ar;q=0.4',
			'content-type': 'application/json;charset=UTF-8',
			'sec-ch-ua': '\'Not_A Brand\';v=\'8\', \'Chromium\';v=\'120\', \'Google Chrome\';v=\'120\'',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '\'Windows\'',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-site',
			'sign': '12c0d63d0005ec61c364845d974b9b62',
			'Referer': 'https://www.carlcare.com/',
			'Referrer-Policy': 'strict-origin-when-cross-origin'
		},
		redirect: 'follow',
		reffererPolicy: 'strict-origin-when-cross-origin',
		body: JSON.stringify(data)
	});
	return response.json();
}