var items = document.querySelectorAll(".qs-item");
var nextQuestionBtn = document.getElementById("js-btn-next-qs");

function Quiz(items) {
    this.questionIndex = 0;
    this.items = items;
}

Quiz.prototype.getQuestionIndex = function() {
    return this.items[this.questionIndex];
}

Quiz.prototype.isEnded = function() {
    return this.questionIndex === this.items.length;
}

Quiz.prototype.nextQuestion = function() {
    this.questionIndex++;
}



function quizDisplay() {
    if(quiz.isEnded()) { 
        console.log("submit")
    } else {
        //show question
        for(var i = 0; i < items.length; i++) {
            items[i].classList.add('hide')
        }
        items[quiz.questionIndex].classList.remove("hide")

        //show option
        var choices = items[quiz.questionIndex].querySelectorAll('input')
        for(var i = 0; i < choices.length; i++) { 
            choices[i].setAttribute("checked", "checked");
        }
        choices[i].addEventListener("click", storeAnswer);
    }
}

 
function storeAnswer(e) { 
    var element = e.target;
    var answer = {
        id: element.id,
        value: element.value || ""
    }
    // storeAnswer[index] = answer;
    // console.log(storeAnswer[index])
    // if ( storeAnswer[index] !== null) {
    //     nextQuestionBtn.removeAttribute('disabled', '');
    // }
}


function setText (id,text){ 
    var element= document.getElementById(id);
    // innerHTML is a property, not function
	element.innerHTML = text;
}

function countQuestion () {
    var questionNo = quiz.questionIndex;
    this.setText("qs-count", (questionNo+1) + "/" + quiz.items.length + "問");
}



function nextQuestionItem() {
    if(quiz.isEnded()) {  
        console.log("submit")
    } else {
        quizDisplay()
        countQuestion()
    }  
}


nextQuestionBtn.addEventListener("click",  function() {
    quiz.nextQuestion()
    nextQuestionItem()
})


var quiz = new Quiz(items);

nextQuestionItem()