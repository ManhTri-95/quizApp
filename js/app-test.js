(function (){
	var Quiz = function() {}
	Quiz.prototype.opts = {}

	Quiz.prototype.data = {
		currentQuestion: 0,
		timeLimit: 0,
		timePassed: 0,
		timeLeft: 0,
		timerInterval: null,
		totalQuestion: 0,
		storedAnswers: {
			is_finished: false,
			answer: null,
			duration: 0
		},
	}

	Quiz.prototype.elements = {}

	Quiz.prototype.init = function(opts){
		this.elements = {
			questions: document.querySelectorAll('.qs-item'),
			progressBar: document.getElementById('js-progress-bar'),
			btnNext: document.getElementById("js-btn-next-qs"),
			btnPause: document.getElementById("js-btn-pause-timer"),
			modalTimer: document.getElementById("modal-pause-timer"),
			btnResume: document.getElementById("js-btn-continue"),
			tooltips: document.getElementById("js-bubble"),
			btnCloseTooltips: document.getElementById("js-bubble__close")
		}
		
		this.data.totalQuestion = this.elements.questions.length;
	   
		this.opts = Object.assign(this.opts,opts);
		// Check data
		
		this.displayQuestion();
		
		this.initEventDOM();
	}

	Quiz.prototype.initEventDOM = function(){
		
		this.elements.btnNext.addEventListener('click', this.nextQuestion.bind(this));

		this.elements.btnPause.addEventListener("click", this.evtClickPause.bind(this));

		this.elements.btnResume.addEventListener("click", this.evtClickResume.bind(this));

		this.elements.btnCloseTooltips.addEventListener("click", this.evtClickCloseTooltips.bind(this));
		
		this.choicesAnswerEvt();
	}

	Quiz.prototype.evtClickPause = function(){
		this.elements.modalTimer.style.display = "block";
		this.pauseTimer();
	}
	Quiz.prototype.evtClickResume = function(){
		this.elements.modalTimer.style.display = "none";
			this.resumeTimer();
	}

	Quiz.prototype.evtClickCloseTooltips = function() {
		this.elements.tooltips.style.display = "none";
		this.opts.is_first = false;
	}

	Quiz.prototype.getQuestion = function(index){
		return this.elements.questions[index] || null;
	}

	Quiz.prototype.activeQuestionByIndex = function(index){
		if( index > 0 ){
			this.elements.questions[index-1].classList.add('hide');
		}
		if( this.elements.questions[index] )
			this.elements.questions[index].classList.remove('hide');
	}
	// Display question
	Quiz.prototype.displayQuestion = function () {
		
	   //document.getElementById("js-btn-next-qs").setAttribute('disabled', '');
		for(var i = 0; i < this.data.totalQuestion; i++) {
			this.elements.questions[i].classList.add('hide')
		}
		
		this.activeQuestionByIndex(this.data.currentQuestion);

		this.setText("qs-count", (this.data.currentQuestion + 1) + "/" + this.data.totalQuestion + "問");

		this.elements.progressBar.children[0].classList.remove("warning");

		this.elements.progressBar.children[0].classList.add("info");

		this.elements.btnNext.setAttribute("disabled", 'disabled');

		this.startTimer();
		
		this.setText("timer", "残り" +  this.opts.timer + "秒");
		this.elements.progressBar.children[0].style.width = '100%';
		
		document.querySelector('.container')
		.classList.remove('hide');

		//delete window.startQuiz;
	}

	// event next question
	Quiz.prototype.nextQuestion = function (e) {
		e.target.setAttribute('disabled', 'disabled');
		this.getAnswer();
		if(this.data.currentQuestion < this.data.totalQuestion - 1) { 
			
			this.data.currentQuestion++;

			this.resetTimer();

			this.displayQuestion();

		} else {
			// console.log('submit')
		}
	}

	// Disabled answer when timeout
	Quiz.prototype.disabledQuestion = function () {
		disableListAnswer =  this.elements.questions[this.data.currentQuestion].querySelectorAll(".qs-answer__option");  
		for(var i = 0; i < disableListAnswer.length; i++) {
			disableListAnswer[i].classList.add("disabled", "not-allow");
		}
	}

	//render text
	Quiz.prototype.setText = function(id,text) { 
		return document.getElementById(id).innerText = text;
	}

	// Start timer question
	Quiz.prototype.startTimer = function() {
		this.clearInterval();
		
		this.data.timerInterval = setInterval((function(){
			this.data.timePassed =  this.data.timePassed += 1;
			this.data.timeLeft = this.opts.timer -  this.data.timePassed;
			
			this.changeProgress()
			.needShowTooltipSuggestion();
			
			if ( this.data.timeLeft < 1) {
				this.disabledQuestion();
				this.elements.btnNext.removeAttribute("disabled");
				clearInterval(this.data.timerInterval);
			}
		}).bind(this), 1000)
	}

	Quiz.prototype.changeProgress = function(){
		var progressBarWidth =  this.data.timeLeft * this.elements.progressBar.offsetWidth / this.opts.timer;
		this.elements.progressBar.children[0].style.width = progressBarWidth + "px";
		
		this.setText("timer", "残り" +  this.data.timeLeft + "秒");
		
		this.elements.progressBar.children[0].classList.remove("warning");
		this.elements.progressBar.children[0].classList.add("info");

		if (this.data.timeLeft < (this.opts.timer*20/100)) { 
			this.elements.progressBar.children[0].classList.add("warning");
			this.elements.progressBar.children[0].classList.remove("info");
		}
		
		return this;
	}

	Quiz.prototype.needShowTooltipSuggestion = function(){
		if (this.opts.is_first && (this.data.timeLeft <= this.opts.timer*50/100)) {
			this.elements.tooltips.style.display = "block";
		} else {
			this.elements.tooltips.style.display = "none";
		}
		
		return this;
	}

	//reset timer question
	Quiz.prototype.resetTimer = function () { 
		this.data.timeLimit = this.opts.timer;
		this.data.timePassed = 0;
		this.data.timeLeft = this.opts.timer;
		this.clearInterval();
	}

	//resume timer question
	Quiz.prototype.clearInterval = function () {
		if( this.data.timerInterval !== null ){
			clearInterval(this.data.timerInterval);
			this.data.timerInterval = null;
		}
	}

	//resume timer question
	Quiz.prototype.resumeTimer = function () {
		this.startTimer();
	}

	//pause timer
	Quiz.prototype.pauseTimer = function () {
		clearInterval(this.data.timerInterval);
	}

	Quiz.prototype.choicesAnswerEvt = function () {
		var choices = document.querySelectorAll('input[type="radio"]');
		for (var i = 0; i < choices.length; i++) {
			choices[i].addEventListener("change", this.storeAnswer.bind(this)); 
		}   
	}

	Quiz.prototype.storeAnswer = function(e) { 
		
		this.data.storedAnswers = {
			is_finished: false,
			answer: e.target.value || null,
			duration: this.opts.timer - this.data.timeLeft,
			id: this.getQuestion(this.data.currentQuestion).getAttribute('data-id') || ''
		}
		
		this.elements.btnNext.removeAttribute('disabled');
	}

	Quiz.prototype.getAnswer = function () {
		
		this.data.storedAnswers.is_finished = (
			this.data.currentQuestion >= this.data.totalQuestion - 1
		); 
		
		if( this.data.storedAnswers.is_finished ) this.pauseTimer();

		this.disabledQuestion();
		console.log(this.data.storedAnswers)
		this.postDataToApp();
	}

	Quiz.prototype.postDataToApp = function(){
		this.postMessage('answerTest', this.data.storedAnswers);
		
		this.data.storedAnswers = {
			is_finished: false,
			answer: null,
			duration: this.opts.timer
		}
	}

	Quiz.prototype.postMessage = function(fncName, msg){
		msg = JSON.stringify(msg);
		
		if( 'webkit' in window ){
			window.webkit.messageHandlers[fncName].postMessage(msg);
		}else if( 'Android' in window || 'android' in window ) {
			(window.android || window.Android)[fncName](msg);
		}
	}

	var quiz = new Quiz();

	window.startQuiz = function(opts) {
		var e = null, isSuccess = false;
		try {
			quiz.init(opts);
			isSuccess = true;
		} catch (error) {
			e = error.message;
		}
		
		quiz.postMessage('loadFinished', {error: e, "success": isSuccess});
		
		return isSuccess;
	}

	quiz.postMessage('javascriptLoaded', {"success": true});
	startQuiz({"timer": 15, "is_first": true});
})()