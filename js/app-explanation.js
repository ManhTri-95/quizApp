(function (){
    var quizExplanation = function () {}
    
    quizExplanation.prototype.data = { 
        //maxLengthText: 42,
        toDetails: {
            id: '',
            type: ''
        },
    }
    
    quizExplanation.prototype.init = function(){ 
        this.elements = {
            el: document.querySelector(".answer"),
            items: document.querySelectorAll('.answer-item'),
            slideItem: document.querySelectorAll('.slider-item'),
            btnBackToTop: document.getElementById("js-btn-back-answer"),
            btnScrollToEx: document.getElementById("js-btn-next-answer"),
            btnBackResultPage: document.getElementById("js-btn-back-result-page"),
            btnBackTestListsPage:  document.getElementById("js-btn-back-list-page"),
        }
    
        this.data.totalExplanation = this.elements.items.length;

        /**
        * Defaults
        */
        this.defaultOptions = {
            moreText: 'もっと見る',
            lessText: '小さくする',
            wordsCount: 100,
        }

         // Internal Settings
        this.settings = {
            originalContentArr: [],
            truncatedContentArr: [],
        }

        this.displayExplanation();
    
        this.initEventDOM();

        // document.querySelector('.container')
		// .classList.remove('hide');

    }
    
    quizExplanation.prototype.initEventDOM = function(){ 
        this.elements.btnBackToTop.addEventListener("click", this.evtClickBackToTop.bind(this));
    
        this.elements.btnScrollToEx.addEventListener("click", this.evtClickScrollToEx.bind(this));
    
        this.elements.btnBackTestListsPage.addEventListener("click", this.evtClickBackTestListsPage.bind(this));
    
        this.elements.btnBackResultPage.addEventListener("click", this.evtClickBackResultPage.bind(this));
    
        this.toDetailsEvt();
    }
    
    quizExplanation.prototype.evtClickBackToTop = function(){
        this.elements.el.scroll({
            top: 0, 
            left: 0, 
            behavior: 'smooth'
        })
    }
    
    // Back native page test list
    quizExplanation.prototype.evtClickBackTestListsPage = function() {
        this.postMessage('backPage', { "value": "test_lists" });
    }
    
    // Back native page result rate
    quizExplanation.prototype.evtClickBackResultPage = function() {
        this.postMessage('backPage', { "value": "result_rate" });
    }
    
    quizExplanation.prototype.evtClickScrollToEx = function () {
        this.elements.items[5].scrollIntoView({ behavior: "smooth"});
    }
     
    quizExplanation.prototype.displayExplanation = function () {

        this.calculatorDom(this.elements.el); 
        this.maxLengthText();

        if (this.data.totalExplanation <= 5) {
            this.elements.btnBackToTop.classList.add("hide");
            this.elements.btnScrollToEx.classList.add("hide");
        } 
    
        if (this.data.totalExplanation > 5) {
    
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

    quizExplanation.prototype.calculatorDom = function(el) {
        var headers = document.querySelector('.header-container').clientHeight,
            footers = document.querySelector('.fixed-footer').clientHeight,
            elHeight = document.documentElement.clientHeight - (headers + footers);
        
        el.style.height = elHeight + 'px';
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
            e.target.innerText = "小さくする"
        } else {
            e.target.parentElement.parentElement.classList.add("expand");
            e.target.innerText = "もっと見る"
        }
    }
    
    quizExplanation.prototype.toDetailsEvt = function () {
        for (var i = 0; i < this.elements.slideItem.length; i++) {
            this.elements.slideItem[i].addEventListener("click", this.toDetails.bind(this));
        }    
    } 

    quizExplanation.prototype.toDetails = function(e) {
        this.data.toDetails = {
            id: e.target.getAttribute("data-id"),
            type: e.target.getAttribute("data-type").toUpperCase(),
        }
        this.postMessage('toDetails', this.data.toDetails);
        console.log(this.data.toDetails)
    }

    quizExplanation.prototype.maxLengthText = function () { 
        var contents = document.querySelectorAll(".js-read-smore");
        // var ellipsestext = "...";
        // for (var i = 0; i < contents.length; i++) { 
        //     var content = contents[i].innerHTML;
        //     if (content.length >  this.data.maxLengthText) {
        //         var shortText = content.substring(0,  this.data.maxLengthText);
        //         var truncateText = content.substring(this.data.maxLengthText, content.length -this.data.maxLengthText);
        //         var html = shortText + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span>' +
        //         '<span class="morecontent">' +  truncateText +'<span>';
        //         contents[i].innerHTML = html
        //     }
        // }
        for (let i = 0, n = contents.length; i < n; ++i) {
            this.truncate(contents[i], i);
        }
       
    }

    quizExplanation.prototype.truncate = function(el, idx) { 
        var originalContent = el.innerHTML,

            numberWords = el.dataset.readSmoreWords || this.defaultOptions.wordsCount,

            numberCount = el.dataset.readSmoreChars || numberWords,

            truncateContent = this.ellipse(
                originalContent,
                numberCount,
                el.dataset.readSmoreChars ? true : false
            );

        var originalContentCount = el.dataset.readSmoreWords
        ? this.getWordCount(originalContent)
        : this.getCharCount(originalContent);

        this.settings.originalContentArr.push(originalContent);
        this.settings.truncatedContentArr.push(truncateContent);
        if (numberCount < originalContentCount) { 
            el.innerHTML = this.settings.truncatedContentArr[idx];
            console.log(el.innerHTML)
        }
        
    }

    quizExplanation.prototype.ellipse = function (str, max, isChars = false) {
         // Trim starting/ending empty spaces
        const trimedSpaces = this.trimSpaces(str);
        if (isChars) { 
            return trimedSpaces.split('').slice(0, max).join('') + '...';
        }
        return trimedSpaces.split(/\s+/).slice(0, max).join(' ') + '...';
        console.log(trimedSpaces)
    }



    quizExplanation.prototype.getCharCount = function(str) {
        return str.split(/\s+/).length;
    }

    quizExplanation.prototype.getCharCount = function(str) {
        console.log(str.length)
        return str.length;
      }
 
    quizExplanation.prototype.trimSpaces = function (str) {
        return str.replace(/(^\s*)|(\s*$)/gi, '');
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