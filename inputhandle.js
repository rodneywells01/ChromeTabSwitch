chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
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
  }
);

function notifyTab(tabId, ctrlState) {
	chrome.tabs.sendMessage(tabId, {ctrlState:ctrlState});
}

function switchTab(shiftval) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.query({}, function(alltabs) {
			var totaltabs = alltabs.length;
			var nextTabId = tab.index + shiftval;

			// Account for edge cases. 
			if (nextTabId < 0) {
				nextTabId = totaltabs - 1;
			} else if (nextTabId == totaltabs) {
				nextTabId = 0;
			}

			// Set new active tab 
			chrome.tabs.update(alltabs[nextTabId].id, {selected: true}, function() {
				chrome.windows.update(alltabs[nextTabId].windowId, {focused:true});
			});
		});
	});	
}