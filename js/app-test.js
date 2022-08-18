function Quiz(questions) {
    this.questions = questions;
    this.currentQuestionIndex = 0;
}

Quiz.prototype.getCurrentQuestion = function() {
    return this.questions[this.currentQuestionIndex];
}

Quiz.prototype.nextQuestion = function() {
    this.currentQuestionIndex++;
}

Quiz.prototype.hasEnded = function() {
    if (this.currentQuestionIndex === this.questions.length)
      return true;
}

var QuizUI = { 
    displayNext : function(){ 
        if (quiz.hasEnded()) {

        } else {
            this.displayQuestion();
            quiz.this.nextQuestion();
        }
    },

    displayQuestion: function(){ 
        for(var item = 0; item < quiz.questions.length; item++) {
            quiz.questions[item].classList.add("hide");
        }
    }
}

var items = document.querySelectorAll('.qs-item');
var quiz = new Quiz(items)
console.log(quiz)

QuizUI.displayQuestion();



// var QuizController = (function () {
   
// })();


// var UIController = (function () {
//     var DOMstrings = { 
//         nextQuestionBtn: "#js-btn-next-qs",
//         questionItems: '.qs-item'
//     };

//     return {
//         displayQuestion: function() {
//             var items = document.querySelectorAll(DOMstrings.questionItems);
//             for(var i = 0; i < items.length; i++) {
//                 items[i].classList.add("hide")
//             }
//         },

//         getDOMstrings: function () {
//             return DOMstrings;
//         },

//     }
// })();




// var initGlobal = (function (quizCtrl, UICtrl) { 
//     var setupEventListeners = function() {
//         var DOM = UICtrl.getDOMstrings();
//         document.querySelector(DOM.nextQuestionBtn).addEventListener("click", nextQuestionItem)
        
//     };

   
//     return { 
//         init: function () { 
//             console.log("Application has started.");
//             UICtrl.displayQuestion()
//             setupEventListeners();
//         }
//     }
// })(QuizController, UIController);


// initGlobal.init();