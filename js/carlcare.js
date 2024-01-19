const TRY_COUNT = 5;
const API_URL = 'https://java-api.carlcare.com/warranty/check';
const IMEI_REGEXP = new RegExp('[0-9]{15}');

const TABLE_SELECTOR = '#warranty-result';
const TEXTAREA_SELECTOR = '#warranty-check-textarea';
const BUTTON_SELECTOR = '#warranty-check-button';



$(document).ready(function(e) {
	$(BUTTON_SELECTOR).on('click', function() {
		checkWarranty();
	});
});



function checkWarranty() {
	let imeiArray = $(TEXTAREA_SELECTOR).val().split('\n');
	imeiArray = imeiArray.filter((temp) => IMEI_REGEXP.test(temp));
	//console.log(imeiArray);
	imeiArray.forEach((imei) => {
		if ($('tr#'+imei).length == 0) {
			let dataString = { "shortName" : "ru", "imei" : imei};
			tryRequest(dataString, TRY_COUNT);
		}
	});
}




function processData(jsonData) {
	if ((jsonData==null)||(jsonData.message!='success')||(jsonData.result==null)) {
		console.log('Ошибка. Запрос вернул следующий результат:\n'+jsonData);
		return;
	}
	else {
		const IMEI = jsonData.result.imei[0];
		switch(jsonData.result.status) {
		case 2:
			return new Array(IMEI, 'Не активирован','','');
			break;
		case 3:
			let currentDate = (new Date()).toISOString().slice(0,10);
			let activeDate = (new Date(jsonData.result.activeTime)).toISOString().slice(0,10);
			let warrantyExpirationDate = (new Date(jsonData.result.warrantyDuration)).toISOString().slice(0,10);
			return new Array(IMEI, (warrantyExpirationDate < currentDate) ? 'Истекла' : 'Активна', activeDate, warrantyExpirationDate);
			break;
		default:
			break;
		}
	}
}



function tryRequest(dataString, tryCount) {
	switch(tryCount) {
	case 0:
		console.error(`Не удалось проверить гарантию: ${dataString.imei}`);
		break;

	default:
		sendRequest(API_URL, dataString).then((data) => {
			const temp = processData(data)
			if (temp != null) {
				insertRow(temp);
			}
			else {
				tryRequest(dataString, tryCount-1);
			}
		});
		break;
	}
}

function insertRow(arrayData) {
	let newRow = '<tr imei="'+arrayData[0]+'"><td>'+arrayData[0]+'</td><td>'+arrayData[1]+'</td><td>'+arrayData[2]+'</td><td>'+arrayData[3]+'</td></tr>';
	$(TABLE_SELECTOR).append('<tr id="'+arrayData[0]+'"><td>'+arrayData[0]+'</td><td>'+arrayData[1]+'</td><td>'+arrayData[2]+'</td><td>'+arrayData[3]+'</td></tr>');
}



async function sendRequest(url='', data={}) {
	let response = await fetch(url, {
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
		body: JSON.stringify(data),
	});
	return response.json();
}