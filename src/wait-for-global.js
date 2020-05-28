const waitForGlobal = (key, callback) => {
	if (window[key]) {
		callback();
	} else {
		setTimeout(() => {
			waitForGlobal(key, callback);
		}, 100);
	}
};

export default waitForGlobal;