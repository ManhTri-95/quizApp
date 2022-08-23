(function (){
var quizExplanation = function () {}

quizExplanation.prototype.data = { 
    maxLengthText: 42
}

quizExplanation.prototype.init = function(){ 
    this.elements = {
        items: document.querySelectorAll('.answer-item'),
        contents: document.querySelectorAll('.answer-content'),
        btnBackToTop: document.getElementById("js-btn-back-answer"),
        btnScrollToEx: document.getElementById("js-btn-next-answer"),
        backResultPage: document.getElementById("js-back-result-page"),
        backTestListPage: document.getElementById("js-back-test-page")
    }

    this.data.totalExplanation = this.elements.items.length;

    this.displayExplanation();

    this.initEventDOM();
}

quizExplanation.prototype.initEventDOM = function(){ 
    this.elements.btnBackToTop.addEventListener("click", this.evtClickBackToTop.bind(this));

    this.elements.btnScrollToEx.addEventListener("click", this.evtClickScrollToEx.bind(this));
}

quizExplanation.prototype.evtClickBackToTop = function(){
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
    })
}

quizExplanation.prototype.evtClickScrollToEx = function () {
    this.elements.items[5].scrollIntoView({ behavior: "smooth"});
}

quizExplanation.prototype.displayExplanation = function () { 
    if (this.data.totalExplanation <= 5) {
        this.elements.btnBackToTop.classList.add("hide");
        this.elements.btnScrollToEx.classList.add("hide");
    } 

    if (this.data.totalExplanation > 5) {
        this.maxLengthText();

        window.addEventListener("scroll", () => {  
            var elementTop = this.elements.items[5].getBoundingClientRect().top;
            if (elementTop <= (window.innerHeight || document.documentElement.clientHeight)) { 
                this.elements.btnScrollToEx.classList.add("hide");
                this.elements.btnBackToTop.classList.remove("hide");
                this.elements.backResultPage.classList.add("hide");
                this.elements.backTestListPage.classList.remove("hide");
                document.querySelector(".group-btn").classList.add("reverse");
            } else {
                this.elements.btnScrollToEx.classList.remove("hide");
                this.elements.btnBackToTop.classList.add("hide");
                this.elements.backResultPage.classList.remove("hide")
                this.elements.backTestListPage.classList.add("hide")
                document.querySelector(".group-btn").classList.remove("reverse");
            }
        })
    }

    this.showFullExplanation();
}

quizExplanation.prototype.showFullExplanation = function () { 
    for (var i = 0; i < this.data.totalExplanation; i++) {
        var btnCollapse = this.elements.items[i].querySelector(".btn-collapse");
        btnCollapse.addEventListener("click", this.evtCollapseItems.bind(this))
   } 
}

quizExplanation.prototype.evtCollapseItems = function(e) {
    var elements = e.target;
    if((elements.parentElement.parentElement).classList.contains('expand')) {
        elements.parentElement.parentElement.classList.remove("expand");
    } else {
        elements.parentElement.parentElement.classList.add("expand");
    }
}

quizExplanation.prototype.maxLengthText = function () { 
    var ellipsestext = "...";
    for (var i = 0; i < this.elements.contents.length; i++) { 
        var content = this.elements.contents[i].innerText;
        if (content.length >  this.data.maxLengthText) {
            var shortText = content.substring(0,  this.data.maxLengthText);
            var truncateText = content.substring(this.data.maxLengthText, content.length -this.data.maxLengthText);
            var html = shortText + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span>' +
            '<span class="morecontent">' +  truncateText +'<span>';
            this.elements.contents[i].innerHTML = html
        }
    }
}

var quizExplanation = new quizExplanation();

window.startQuizExplanation = function () {
    quizExplanation.init();
}

startQuizExplanation();

})()


