(function (){
    var quizExplanation = function () {}
    
    quizExplanation.prototype.data = {}

    quizExplanation.prototype.defaultOptions = {
        voidTags: ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'wbr'],
        wordsCount: 42,
        blockClassName: 'read-smore',
        moreText: 'もっと見る',
        lessText: '小さくする',
    }

    quizExplanation.prototype.init = function(options){ 
        this.elements = {
            el: document.querySelector(".answer"),
            items: document.querySelectorAll('.answer-item'),
            slideItem: document.querySelectorAll('.slider-item'),
            btnBackToTop: document.getElementById("js-btn-back-answer"),
            btnScrollToEx: document.getElementById("js-btn-next-answer"),
            btnBackResultPage: document.getElementById("js-btn-back-result-page"),
            btnBackTestListsPage:  document.getElementById("js-btn-back-list-page"),
        }
    
        this.options = Object.assign({}, this.defaultOptions, options);
    
        this.data.totalExplanation = this.elements.items.length;
    
        this.displayExplanation();
    
        this.initEventDOM();

        this.toDetailsEvt();
        // document.querySelector('.container')
		// .classList.remove('hide');
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
        this.elements.items[5].scrollIntoView({ behavior: "smooth"});
    }
     
    quizExplanation.prototype.displayExplanation = function () {

        for (var i = 0; i < this.elements.items.length; i++) { 

            this.createBtnReadMore(i);

            var smoreContents = this.elements.items[i].querySelectorAll(".js-read-smore");
               
            for ( var j = 0; j < smoreContents.length; j++) {
                var numberWords = smoreContents[j].dataset.readSmoreWords || this.options.wordsCount,
                    originalContent = smoreContents[j].innerHTML,
                    truncateContent = this.htmlEllipsis(originalContent, numberWords, true);
                
                var tranCateWrap = document.createElement('div');

                    tranCateWrap.className = "answer-content truncate-text";

                    tranCateWrap.innerHTML = truncateContent

                    smoreContents[j].parentNode.insertBefore(tranCateWrap, smoreContents[j].nextSibling);
            }
        }
       
        //this.calculatorDom(this.elements.el); 

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
    }

    quizExplanation.prototype.htmlEllipsis = function(html, maxLength, addEllipsis) {
        var len = html.length;
        if (len < maxLength) {
            return html
        }

        // leave room for ellipsis
        if (addEllipsis) {
            --maxLength
        }
        var i = 0,
            charCount = 0,
            tagStack = [];
        while (i < len && charCount < maxLength) {
            var char = html.charAt(i),
                charCode = html.charCodeAt(i);
            if (char === '<') { 
                var tag = this.extractTag(html, i);
                i += tag.length;
                
                if (this.isEndTag(tag)) {
                    tagStack.pop();
                } else {
                    var tagName = this.extractTagName(tag);

                    if (!this.isVoidTag(tagName)) {
                        tagStack.push(tagName);
                    }
                }
            } else {
                if (charCode >= 0xD800 && charCode <= 0xDBFF && i + 1 < len) { 
                    ++i;
                }

                ++charCount;
                ++i;
            }
        }
        
        let result = html.slice(0, i);

        for (let j = tagStack.length - 1; j >= 0; --j) {
            result += '</' + tagStack[j] + '>';
        }

        if (addEllipsis && result.length < html.length) {
            result += '&hellip;';
        }
        return result;
    }

    /**
     * Extracts <tag id="foo"> from larger string. Assumes str[startIdx] === '<'
     */
    quizExplanation.prototype.extractTag = function(str, startIdx) {
        const endIdx = str.indexOf('>', startIdx);
        return str.slice(startIdx, endIdx + 1);
    }

    /** Checks that <tag> is and end tag */
    quizExplanation.prototype.isEndTag = function(tag) {
        return tag[1] === '/'
    }

    /** Extracts tag from <tag id="foo"> */
    quizExplanation.prototype.extractTagName = function(tag) {
        var tagNameEndIdx = tag.indexOf(' ');
        if (tagNameEndIdx === -1) {
            // check for <br/> style tags
            tagNameEndIdx = tag.indexOf('/');

            if (tagNameEndIdx === -1) {
                tagNameEndIdx = tag.length - 1;
            }
        }
        
        return tag.slice(1, tagNameEndIdx);
    }

    /** Checks that tabName is a void tag (it doesn't have an end tag) */
    quizExplanation.prototype.isVoidTag = function (tagName) {
        for (var i = this.options.voidTags.length - 1; i >= 0; --i) {
            if (tagName ===  this.options.voidTags[i]) {
                return true
            }
        }
        return false;
    }

    // quizExplanation.prototype.calculatorDom = function(el) {
    //     var headers = document.querySelector('.header-container').clientHeight,
    //         footers = document.querySelector('.fixed-footer').clientHeight,
    //         elHeight = document.documentElement.clientHeight - (headers + footers);
        
    //     el.style.height = elHeight + 'px';
    // }

    quizExplanation.prototype.createBtnReadMore = function(idx) {
        var btnReadMoreWrap = document.createElement('div');

        btnReadMoreWrap.className = `text-center ${this.options.blockClassName}__wrap`;

        btnReadMoreWrap.innerHTML = `<button id=${this.options.blockClassName}_${idx}
                                            class="btn btn--info ${this.options.blockClassName}__link">
                                            ${this.options.moreText}
                                    </button>`

        this.elements.items[idx].appendChild(btnReadMoreWrap);

        // Call link click handler
        this.handleClickReadMore(idx)
    }

    quizExplanation.prototype.handleClickReadMore = function (idx) { 
        var btnReadMore = document.querySelector(`#${this.options.blockClassName}_${idx}`)
        btnReadMore.addEventListener('click', (e) => {
            this.elements.items[idx].classList.toggle('is-expanded');
            var target = e.currentTarget;
            if (target.dataset.clicked !== 'true') {
                target.innerHTML = this.options.lessText;
                target.dataset.clicked = true;
            } else {
                target.innerHTML = this.options.moreText;
                target.dataset.clicked = false;
            }
        })
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