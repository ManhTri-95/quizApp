

(function () {
    "use strict";
  
    window.Carousel = function (settings) {
        this.carousel = document.querySelector(settings.carousel);
        this.slides = this.carousel.querySelectorAll(settings.slide);
        this.btnNext = this.carousel.querySelector(settings.btnNext) || null;
        this.btnPrev = this.carousel.querySelector(settings.btnPrev) || null;
        this.activeIndex = settings.activeIndex || 0;
        this.oneByOne = settings.oneByOne || false;
        this.speed = settings.speed || 400;
        this.delay = settings.delay || 0;
        this.effect = settings.effect || "linear";
        this.infinite = settings.infinite || false
        
        this.minPos = null;
        this.maxIndex = null;
        this.slidesToShow = null;
      
        this.build(); 
    };
  
    Carousel.prototype.build = function () {
        var _ = this,
            dotsLength,
            i;
    
        _.minPos = _.carousel.offsetWidth - _.slides.length * _.slides[0].offsetWidth;
        _.maxIndex = 0;
        _.carousel.className += " jscarousel";
  
        //create slides container
        _.slidesContainer = document.createElement("div");
        _.carousel.insertBefore(_.slidesContainer, _.slides[0]);
        _.slidesContainer.className += " jscarousel-container";
      
        // infinite
        if (_.infinite === true) {
            _.currentXPos = -(_.slides[0].offsetWidth * _.slides.length);
            _.slidesContainer.style.transform = "translateX(" + _.currentXPos + "px)";
            _.slidesContainer.style.width = _.slides[0].offsetWidth * _.slides.length * 3 + "px";
        } else {
            _.currentXPos = 0;
            _.slidesContainer.style.transform = "translateX(0px)";
            _.slidesContainer.style.width = _.slides[0].offsetWidth * _.slides.length + "px";
        }
       
        //create slides dots
        _.dotsContainer = document.createElement("div");
        _.carousel.insertBefore(_.dotsContainer, _.slides[0]);
        _.dotsContainer.className += " jscarousel-dots-container";
        _.dots = [];
      
        if (_.infinite === true) {
            dotsLength = _.slides.length;
        } else {
            dotsLength = (_.slidesContainer.offsetWidth - _.carousel.offsetWidth) / _.slides[0].offsetWidth + 1;
        }
       
      
        for (i = 0; i < dotsLength; i++) {
            var dot = document.createElement("button");
            dot.className = "jscarousel-dot" + (i === 0 ? " active" : "");
            dot.setAttribute("data-index", i);
            dot.setAttribute("type", "button");
            addDotEventListener(dot, _);
            _.dots.push(dot);
            _.dotsContainer.appendChild(dot);
        }
  
        _.maxIndex = dotsLength - 1;
  
        //create carousel btn-prev
        _.btnPrev.setAttribute("data-is-native", 1);
        _.btnPrev.className += " jscarousel-btn purejscarousel-btn-prev";
        if (window.addEventListener) {
            _.btnPrev.addEventListener("click", function () {
                _.goToPrevSlide();
            });
        } else if (window.attachEvent) {
            _.btnPrev.attachEvent("onclick", function () {
            _.goToPrevSlide();
        });
        } else {
            _.btnPrev.onclick = function () {
                _.goToPrevSlide();
            };
        }

        if(_.activeIndex === 0) {
            _.btnPrev.disabled = true;
        }
  
        //create carousel btn-next
        _.btnNext.setAttribute("data-is-native", 1);
        _.btnNext.className += " jscarousel-btn jscarousel-btn-next";
        if (window.addEventListener) {
            _.btnNext.addEventListener("click", function () {
                _.goToNextSlide();
            });
        } else if (window.attachEvent) {
            _.btnNext.attachEvent("onclick", function () {
                _.goToNextSlide();
            });
        } else {
            _.btnNext.onclick = function () {
                _.goToNextSlide();
            };
        }

        if(_.activeIndex === _.maxIndex) {
            _.btnNext.disabled = true;
        }
      
        //build slides
        for (i = 0; i < _.slides.length; i++) {
            _.slides[i].className += " jscarousel-slide";
            _.slidesContainer.appendChild(_.slides[i]);
        }
        
        // infinite slide 
        if (_.infinite === true) {
            for (i = 0; i < _.slides.length; i++) {
                var slideClone = _.slides[i].cloneNode(true);
                slideClone.className += " jscarousel-slide-clone";
                _.slidesContainer.appendChild(slideClone);
                }
                for (i = 0; i < _.slides.length; i++) {
                var slideClone = _.slides[i].cloneNode(true);
                slideClone.className += " jscarousel-slide-clone";
                _.slidesContainer.insertBefore(
                    slideClone,
                    _.slidesContainer.querySelectorAll(".jscarousel-slide")[i]
                );
            }
        }
       
        function addDotEventListener(d, c) {
            if (window.addEventListener) {
            d.addEventListener("click", function () {
                c.goToSlide(parseInt(this.getAttribute("data-index")));
            });
            } else if (window.attachEvent) {
            d.attachEvent("onclick", function () {
                c.goToSlide(parseInt(this.getAttribute("data-index")));
            });
            } else {
            d.onclick = function () {
                c.goToSlide(parseInt(this.getAttribute("data-index")));
            };
            }
        }  
    };

    Carousel.prototype.enableControl = function () {
        var i;
        this.btnNext.disabled = false;
        this.btnPrev.disabled = false;
        for (i = 0; i < this.dots.length; i++) {
            this.dots[i].disabled = false;
        }
        this.dots[this.activeIndex].disabled = true
        if (this.infinite === false) {
            if (this.activeIndex === this.maxIndex) {
                this.btnNext.disabled = true;
            }
            if(this.activeIndex === 0) {
                this.btnPrev.disabled = true;
            }
        }
    }
  
    Carousel.prototype.disableControl = function () {
        var i;
        this.btnNext.disabled = true;
        this.btnPrev.disabled = true;
        for (i = 0; i < this.dots.length; i++) {
            this.dots[i].disabled = true;
        }
    }
  
    Carousel.prototype.goToNextSlide = function () {
        var newActiveIndex;
            if (this.infinite === true) {
                newActiveIndex = this.activeIndex + 1 > this.maxIndex ? 0 : this.activeIndex + 1; 
            } else {
                newActiveIndex = this.activeIndex + 1
            }
            this.goToSlide(newActiveIndex, "next", "dirBtn");
    };
  
    Carousel.prototype.goToPrevSlide = function () {
        var newActiveIndex;
            if (this.infinite === true) {
                newActiveIndex = this.activeIndex - 1 < 0 ? this.maxIndex : this.activeIndex - 1;
            } else {
                newActiveIndex = this.activeIndex - 1
            }
           
            this.goToSlide(newActiveIndex, "prev", "dirBtn");
    };
  
    Carousel.prototype.goToSlide = function (n, dir, trigger) {
        var _ = this,
            direction = dir ? dir : n > this.activeIndex ? "next" : "prev",
            slidesContainerWidth = this.slidesContainer.offsetWidth / (this.infinite === true ? 3 : 1),

            blockWidth = this.slides[0].offsetWidth,
            currentPos = this.infinite === true ? -slidesContainerWidth : Math.max(-blockWidth * this.activeIndex, this.minPos),
            scrollWidth = trigger === "dirBtn" ? blockWidth : Math.abs(blockWidth * (this.activeIndex - n)),
            slidesCount,
            newPos;
  
        
        slidesCount = scrollWidth / this.slides[0].offsetWidth;
        if (this.infinite === true) {
            newPos = direction === "next" 
                ? currentPos - scrollWidth 
                : currentPos + scrollWidth;
        }  else {
            newPos = direction === "next" ? Math.max(this.minPos ,currentPos - scrollWidth) : Math.min(0, currentPos + scrollWidth);
            //console.log(newPos)
        }
        this.disableControl();
      
        if ("transition" in document.body.style) {
            this.slidesContainer.style.transition = "transform " + this.speed + "ms" + " " + this.effect + " " + this.delay + "ms";
        }
        _.currentXPos = newPos;
        this.slidesContainer.style.transform = "translateX(" + _.currentXPos + "px)";
        if ("transition" in document.body.style) {
            this.slidesContainer.addEventListener("transitionend", scrollEnd);
        } else {
            scrollEnd();
        }
  
        function scrollEnd() {
            var i;
            if ("transition" in document.body.style) {
                _.slidesContainer.style.transition = null;
                _.slidesContainer.removeEventListener("transitionend", scrollEnd);
            }
    
            _.dots[_.activeIndex].className = _.dots[_.activeIndex].className.replace(" active","");
            _.activeIndex = n;
            _.dots[_.activeIndex].className += " active";
            
            if (_.infinite === true) {
                for (i = 0; i < slidesCount; i++) {
                    if (direction === "next") {
                        _.slidesContainer.appendChild(_.slidesContainer.children[0]);
                    } else {
                        _.slidesContainer.insertBefore(_.slidesContainer.lastElementChild, _.slidesContainer.children[0] );
                    }
                }
                _.currentXPos = -(_.slidesContainer.offsetWidth / 3);
                _.slidesContainer.style.transform = "translateX(" + _.currentXPos + "px)";
            }
            _.enableControl();
        }
    };
  
    var carousel = new Carousel({
        carousel: '.carousel',
        slide: '.slide',
        btnNext: '.btn-next',
        btnPrev: '.btn-prev',
        // /infinite: true
    });
  })();

  