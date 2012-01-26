/*
	A simple async test timer for QUnit.
	
	Calling 'asyncTest.start()' starts a timeout and returns a test object. This test object has a couple important methods, the first of which is 'continue'. 'continue()' is used anytime you are doing asserts in a callback. Once you've called 'continue' the number of times specified as a start parameter (default 1), Testtimer will automatically cancel the timeout and restart the QUnit test runner.

The test object also has a 'done' boolean property. This property should be checked before performing asserts in callbacks to make sure your asserts dont end up in a separate test. See examples in test file.

The test object has one other method, 'abort()'. This method immediately aborts the currently running asyncTest and begins the next one. The timeout will be cleared and 'ok(false, "async test aborted")' will be called, and the 'done' property would be set. Any async callbacks in the test should make sure to check the 'done' object as I have already described to make sure they arent processing after an abort.
*/
(function(w){
	var topId = 1;
	var current;
	
	function _continue(){
		//ignore continues in the wrong context
		if(this.done)
			return;
			
		this.remaining--;
		if (this.remaining <= 0 && this.timer != null){
			console.log(this.id + " continues complete");
			this.finish();
		}
	}
	
	function timedOut(){
		if(this.done)
			return;
		
		console.log(this.id + " timed out");
		if(this.remaining >= 0){
			ok(false, "test timed out");
			this.finish();
		}
	}
	
	function _abort(message){
		//ignore aborts in the wrong context
		if(this.done)
			return;
	
		if(!message) message = "async test aborted";
		console.log(this.id + " aborting, msg: " + message);
		if(this.remaining >= 0){
			ok(false, message);
			this.finish();
		}
	}
	
	function _finish(){
		if(this.done)
			return;
				
		console.log(this.id + " finished, killing");
		this.kill();
		current = null;
		//restart test runner since we're done
		console.log(this.id + " restarting test runner");
		start();
	}
	
	function _kill(){
		if(this.done)
			return;
		
		if(this.timer != null) 
			clearTimeout(this.timer);
		this.timer = null;
		this.done = true;
		console.log(this.id + " killed");
		//do not restart test runner
	}
	
	asyncTest.defaultTimeout = 2000;
		
	asyncTest.start = function(timeout, expect){
		
		if(current != null)
			current.kill();
			
		//create the response object
		temp = {
			wait: timeout ? timeout : asyncTest.defaultTimeout,
			remaining: expect ? expect : 1,
			continue: _continue,
			abort: _abort,
			finish: _finish,
			kill: _kill,
			done: false
		};
		topId++;
		current = temp;
		console.log(temp.id + " starting");
		temp.timer = setTimeout(timedOut.bind(temp), temp.wait);
		
		return current;
	}

})(window);
