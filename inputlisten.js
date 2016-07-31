var holdingCtrl = false;

window.onkeydown = function(e) {
	// Only interested in Ctrl, left arrow, right arrow). 
   	var key = e.keyCode ? e.keyCode : e.which;
   	if (key == 17) { // ctrl
		holdingCtrl = true;
		sendStateCtrlMessage();
	} else if (key == 37 && holdingCtrl) { // left
		sendTabChangeMessage(-1);
	} else if (key == 39 && holdingCtrl) { // right
		sendTabChangeMessage(1);
	}  	
}

window.onkeyup = function(e) {
	// Only interested in ctrl. 
   	var key = e.keyCode ? e.keyCode : e.which;
   	if(key == 17) { // ctrl
   		holdingCtrl = false;
   		sendStateCtrlMessage();
   	}
}

function sendTabChangeMessage(shiftval) {
	chrome.runtime.sendMessage({shiftval:shiftval}, function(response) {
	   	console.log(response);
   	});
}

function sendStateCtrlMessage() {
	chrome.runtime.sendMessage({ctrlState:holdingCtrl});
}

// Catch update to ctrl pressed status. 
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.ctrlState != null) {
			holdingCtrl = request.ctrlState;
		}
	}
);

