console.log("Here! Wow!");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);   
    if (request.shiftval != null) {
    	// New tab update. Set new tab. 
    	switchTab(request.shiftval);
    } else if (request.ctrlState != null) {
    	// Control state update. Notify all tabs. 
    	console.log("Control state update! " + request.ctrlState);
		chrome.tabs.query({}, function(alltabs) {
			var i = 0;
			for (i = 0; i < alltabs.length; i++) {
				notifyTab(alltabs[i].id, request.ctrlState);
			}
		});
    }
   	// left 37 right 39 ctrl 17 
  }
);

function notifyTab(tabId, ctrlState) {
	console.log("Time to notify! " + tabId + " " + ctrlState);
	chrome.tabs.sendMessage(tabId, {ctrlState:ctrlState});
}

function switchTab(shiftval) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.query({}, function(alltabs) {
			var totaltabs = alltabs.length;
			console.log(alltabs);
			console.log(totaltabs);
			var nextTabId = tab.index + shiftval;

			// Account for edge cases. 
			if (nextTabId < 0) {
				nextTabId = totaltabs - 1;
			} else if (nextTabId == totaltabs) {
				nextTabId = 0;
			}

			var idtoset = alltabs[nextTabId].id;
			console.log(nextTabId + " | " + idtoset + " will be active!");
			// Set new active tab 
			chrome.tabs.update(alltabs[nextTabId].id, {selected: true}, function() {
				chrome.windows.update(alltabs[nextTabId].windowId, {focused:true});
			});
		});
	});	
}