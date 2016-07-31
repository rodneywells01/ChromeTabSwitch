var holdingCtrl = false;

window.onkeydown = function(e) {
   	var key = e.keyCode ? e.keyCode : e.which;
   	if (key == 17) {
		holdingCtrl = true;
		sendStateCtrlMessage();
	} else if (key == 37 && holdingCtrl) {
		// alert("Left arrow down!");
		sendMessage(-1);
	} else if (key == 39 && holdingCtrl) {
		// alert("Right arrow down!");
		sendMessage(1);
	}  	
}

function sendMessage(shiftval) {
	chrome.runtime.sendMessage({shiftval:shiftval}, function(response) {
	   	console.log(response);
   	});
	// chrome.tabs.getCurrent(function(tab) {
	// 	chrome.runtime.sendMessage({TEST:"hey"}, function(response) {
	// 	   	console.log(response);
	//    	});	
	// });	
}

function sendStateCtrlMessage() {
	chrome.runtime.sendMessage({ctrlState:holdingCtrl});
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.ctrlState != null) {
			holdingCtrl = request.ctrlState;
		}
	}
);

window.onkeyup = function(e) {
   	var key = e.keyCode ? e.keyCode : e.which;
   	if(key == 17) {
   		holdingCtrl = false;
   		sendStateCtrlMessage();
   	}
}