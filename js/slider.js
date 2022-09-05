(function (){
    "use strict";
    window.JsCarousel = function (settings) {
        this.carousel = document.querySelector(settings.carousel);
        this.slides = this.carousel.querySelectorAll(settings.slide);
        this.btnNext = this.carousel.querySelector(settings.btnNext) || null;
        this.btnPrev = this.carousel.querySelector(settings.btnPrev) || null;
        this.activeIndex = settings.activeIndex || 0;
        this.oneByOne = settings.oneByOne || false;

        this.infinite = settings.infinite || false;

        this.maxIndex = null;

        this.build();
    };

   JsCarousel.prototype.build = function () {
        var _ = this,
        i;

        _.maxIndex = 0;

        _.carousel.className += " purejscarousel";
        //create slides container
        _.slidesContainer = document.createElement("div");
        _.carousel.insertBefore(_.slidesContainer, _.slides[0]);
        _.slidesContainer.className += " purejscarousel-slides-container";
        if(_.infinite === true) {
            _.currentXPos = -(_.slides[0].offsetWidth * _.slides.length);
            _.slidesContainer.style.transform = "translateX("+ _.currentXPos + "px)";
            _.slidesContainer.style.width = _.slides[0].offsetWidth * _.slides.length * 3  + "px";
        } else {
            _.currentXPos = 0;
            _.slidesContainer.style.transform = "translateX(0px)";
            _.slidesContainer.style.width = _.slides[0].offsetWidth * _.slides.length + "px"
        }

        //create carousel btn-next
        _.btnNext.setAttribute("data-is-native", 1);
        _.btnNext.className += " purejscarousel-btn purejscarousel-btn-next";
        if (window.addEventListener) { 
            _.btnNext.addEventListener("click", function () {
                _.goToNextSlide();
            });
        } else if (window.attachEvent) {
            _.btnNext.addEventListener("onclick", function () {
                _.goToNextSlide();
            });
        } else {
            _.btnNext.onclick = function () {
                _.goToNextSlide();
            };
        }
      
        //build slide
        for(i = 0; i < _.slides.length; i++) {
            _.slides[i].className += " purejscarousel-slide";
            _.slidesContainer.appendChild(_.slides[i])
        }
   }

    JsCarousel.prototype.goToNextSlide = function () {
        var newActiveIndex;
        if(this.btnNext.disabled === false) {
            if (this.infinite === true) { 
                newActiveIndex = this.activeIndex + 1 > this.maxIndex ? 0 : this.activeIndex + 1;
            } else {
                newActiveIndex = this.activeIndex - 1;
            }
            //this.goToSlide(newActiveIndex, "next", "dirBtn");
        }
    }

    JsCarousel.prototype.gotoSlide = function (n, dir, trigger) {
        var _ = this,
            direction = dir ? dir : n > this.activeIndex ? "next" : "prev",
            slidesContainerWidth =
                this.slidesContainer.offsetWidth / (this.infinite === true ? 3 : 1);
            
    
    }
 
   var carousel = new JsCarousel({
    carousel: '.carousel',
    slide: '.slide',
    btnNext: '.btn-next',
   })
   
})()