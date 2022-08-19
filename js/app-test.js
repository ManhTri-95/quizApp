var Quiz = function() {}

Quiz.prototype.render = function() { 
    var questions = document.querySelectorAll('.qs-item');
    var nextQuestionBtn = document.getElementById("js-btn-next-qs");
    var progressBar = document.querySelector('.progress-bar');
    var pauseTimerBtn = document.getElementById("js-btn-pause-timer");
    var modalPauseTimer = document.getElementById("modal-pause-timer");
    var resumeTimerBtn = document.getElementById("js-btn-continue");

    // GLOBAL VARIABLES
    var currentQuestion = 0;

    var timeLimit = 60;
    var timePassed = 0;
    var timeLeft = timeLimit;
    var timerInterval = null;

    var storedAnswers = [];

    function displayQuestion () {
        nextQuestionBtn.setAttribute('disabled', '');
        
        for(var i = 0; i < questions.length; i++) {
            questions[i].classList.add('hide')
        }
        questions[currentQuestion].classList.remove('hide');

        setText("qs-count", (currentQuestion + 1) + "/" + questions.length + "問")

        progressBar.children[0].classList.remove("warning");
        progressBar.children[0].classList.add("info");

        storedAnswer = storedAnswers[currentQuestion];
        choices =  questions[currentQuestion].querySelectorAll('input');
        for(var i = 0; i < choices.length; i++) { 
            // if (storedAnswer) {
            //     var id = storedAnswer.id; 
            //     if (i == id) {  
            //         console.log(choices[i].setAttribute("checked", "checked"));
            //     }
            // }
            choices[i].addEventListener("click", storeAnswer);
        }

        startTimer();
    }

    function storeAnswer(e) { 
        var element = e.target;
        var answer = {
            id: element.id,
            value: element.value || ""
        }
        storeAnswer[currentQuestion] = answer;
        if ( storeAnswer[currentQuestion] !== null) {
            nextQuestionBtn.removeAttribute('disabled', '');
        }
    }

    function setText(id,text) {
        var element= document.getElementById(id);
        element.innerText = text;
    }

    // Start timer question
    function startTimer() {  
        if (timerInterval !== null) {
            clearInterval(timerInterval);
        }
        timerInterval = setInterval(() => { 
            timePassed = timePassed += 1;
            timeLeft = timeLimit - timePassed;
            progressBarWidth =  timeLeft * progressBar.offsetWidth / timeLimit;
            progressBar.children[0].style.width = progressBarWidth + "px";
            setText("timer", "残り" + timeLeft + "秒");

            //change color progressBar if timeLeft = 10
            if (timeLeft < (timeLimit*20/100)) {
                progressBar.children[0].classList.add("warning");
                progressBar.children[0].classList.remove("info");
            } 
            if (timeLeft < 1) { 
                if (storeAnswer[currentQuestion] == null) {
                    nextQuestionBtn.removeAttribute('disabled', '');
                }
                disableListAnswer = questions[currentQuestion].querySelectorAll(".qs-answer__option");  
                for(var i = 0; i < disableListAnswer.length; i++) {
                    disableListAnswer[i].classList.add("disabled", "not-allow");
                }
                clearInterval(timerInterval);
            }
        }, 1000)
    }

    //pause timer question
    function pauseTimer() {
        clearInterval(timerInterval);
    }

    //reset timer question
    function resetTimer() {
        timeLimit = 60;
        timePassed = 0;
        timeLeft = timeLimit;
    }

     //resume timer question
    function resumeTimer() {
        startTimer();
    }

    displayQuestion();

    nextQuestionBtn.addEventListener("click", function() {
        if(currentQuestion < questions.length - 1) {
            currentQuestion++;
            resetTimer();
            displayQuestion();
           
        } else {
            console.log('submit')
        }
    })

    pauseTimerBtn.addEventListener("click", function() {
        modalPauseTimer.style.display = "block";
        pauseTimer();
    })

    resumeTimerBtn.addEventListener("click", function() {
        modalPauseTimer.style.display = "none";
        resumeTimer();
    })
}


var quiz = new Quiz();
quiz.render()
