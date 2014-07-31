var TempMonitorModule = function () {
	this.readings = {};
};

TempMonitorModule.prototype.init = function(fw, onFinished) {
    this.fw = fw;
	onFinished.call(this);
}

TempMonitorModule.prototype.onServerStarted = function(){
	var t = this;
}

TempMonitorModule.prototype.onMessage = function (req, callback) {
	if(req.body.type === undefined || req.body.sessionId === undefined){
		callback({error: "Invalid request"});
		return;
	}
	
	switch(req.body.type){
		case "SetReading" :
			if(typeof(req.body.id) === "string" && typeof(req.body.deviceName) === "string"){
				this.readings[req.body.id] = {
												id: req.body.id,
												deviceName: req.body.deviceName,
												readingText: typeof(req.body.readingText) === "string" ? req.body.readingText.substring(0, 200) : "",
												timestamp: new Date().getTime()
											 }
	 			callback({success: true, reading: this.readings[req.body.id]});
			}
			else
			{
				callback({error: "Could not add reading", success: false});
			}
			break;

		case "GetReadings" :
			var res = [];
			for(var reading in this.readings){
				if(this.readings[reading]  === undefined)
					continue;
				
				if(this.readings[reading].timestamp < new Date().getTime() - 2400000)
					this.readings[reading] = undefined;
				else
					res.push({
								deviceName: this.readings[reading].deviceName, 
								readingText: this.readings[reading].readingText,
								timestamp: this.readings[reading].timestamp
							});
			}
			callback(res);
			break;
			
	}
};

module.exports = TempMonitorModule
