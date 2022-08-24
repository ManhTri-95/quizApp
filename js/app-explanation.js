(function (){
var quizExplanation = function () {}

quizExplanation.prototype.data = { 
    maxLengthText: 42
}

quizExplanation.prototype.init = function(){ 
    this.elements = {
        el: document.querySelector(".answer"),
        items: document.querySelectorAll('.answer-item'),
        btnBackToTop: document.getElementById("js-btn-back-answer"),
        btnScrollToEx: document.getElementById("js-btn-next-answer"),
        btnBackResultPage: document.getElementById("js-btn-back-result-page"),
        btnBackTestListsPage:  document.getElementById("js-btn-back-list-page"),
    }

    this.data.totalExplanation = this.elements.items.length;

    this.displayExplanation();

    this.initEventDOM();
}

quizExplanation.prototype.initEventDOM = function(){ 
    this.elements.btnBackToTop.addEventListener("click", this.evtClickBackToTop.bind(this));

    this.elements.btnScrollToEx.addEventListener("click", this.evtClickScrollToEx.bind(this));

    this.elements.btnBackTestListsPage.addEventListener("click", this.evtClickBackTestListsPage.bind(this));

    this.elements.btnBackResultPage.addEventListener("click", this.evtClickBackResultPage.bind(this));

}

quizExplanation.prototype.evtClickBackToTop = function(){
    this.elements.el.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
    })
   
}

quizExplanation.prototype.evtClickBackTestListsPage = function() {
    this.postMessage('backPage', { "value": "test_lists" });
}

quizExplanation.prototype.evtClickBackResultPage = function() {
    this.postMessage('backPage', { "value": "result_rate" });
}

quizExplanation.prototype.evtClickScrollToEx = function () {
    this.elements.items[5].scrollIntoView({ behavior: "smooth", block: "start"});
}

quizExplanation.prototype.displayExplanation = function () { 
    if (this.data.totalExplanation <= 5) {
        this.elements.btnBackToTop.classList.add("hide");
        this.elements.btnScrollToEx.classList.add("hide");
    } 

    if (this.data.totalExplanation > 5) {
        this.maxLengthText();

        this.elements.btnBackToTop.classList.add("hide");
        this.elements.btnBackTestListsPage.classList.add("hide");

        this.elements.el.addEventListener("scroll", () => {    
            var elementTop = this.elements.items[5].getBoundingClientRect().top;
            if (elementTop <= this.elements.el.clientHeight) { 
                this.elements.btnScrollToEx.classList.add("hide");
                this.elements.btnBackToTop.classList.remove("hide");
                this.elements.btnBackResultPage.classList.add("hide");
                this.elements.btnBackTestListsPage.classList.remove("hide");
                document.querySelector(".group-btn").classList.add("reverse");
            } else {
                this.elements.btnScrollToEx.classList.remove("hide");
                this.elements.btnBackToTop.classList.add("hide");
                this.elements.btnBackResultPage.classList.remove("hide")
                this.elements.btnBackTestListsPage.classList.add("hide")
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
    if((e.target.parentElement.parentElement).classList.contains('expand')) {
        e.target.parentElement.parentElement.classList.remove("expand");
    } else {
        e.target.parentElement.parentElement.classList.add("expand");
    }
}

quizExplanation.prototype.maxLengthText = function () { 
    var contents = this.elements.el.querySelectorAll(".answer-content");
    var ellipsestext = "...";
    for (var i = 0; i < contents.length; i++) { 
        var content = contents[i].innerText;
        if (content.length >  this.data.maxLengthText) {
            var shortText = content.substring(0,  this.data.maxLengthText);
            var truncateText = content.substring(this.data.maxLengthText, content.length -this.data.maxLengthText);
            var html = shortText + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span>' +
            '<span class="morecontent">' +  truncateText +'<span>';
            contents[i].innerHTML = html
        }
    }
}

quizExplanation.prototype.postMessage = function(fncName, msg){
    msg = JSON.stringify(msg);
    
    if( 'webkit' in window ){
        window.webkit.messageHandlers[fncName].postMessage(msg);
    }else if( 'Android' in window || 'android' in window ) {
        (window.android || window.Android)[fncName](msg);
    }
}


var quizExplanation = new quizExplanation();

window.startQuizExplanation = function () {
    var e = null, isSuccess = false;
    try {
        quizExplanation.init();
        isSuccess = true;
    } catch (error) {
        e = error.message;
    }
    quizExplanation.postMessage('loadFinished', {error: e, "success": isSuccess});
}

startQuizExplanation();

})()


