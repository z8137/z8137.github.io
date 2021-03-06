! function (t) {
	"use strict";
	t("body").scrollspy({
		target: ".navbar-fixed-top",
		offset: 60
	}), t("#topNav").affix({
		offset: {
			top: 200
		}
	}), (new WOW).init(), t("a.page-scroll").bind("click", function (a) {
		var e = t(this);
		t("html, body").stop().animate({
			scrollTop: t(e.attr("href")).offset().top - 60
		}, 1450, "easeInOutExpo"), a.preventDefault()
	}), t(".navbar-collapse ul li a").click(function () {
		t(".navbar-toggle:visible").click()
	}), t("#galleryModal").on("show.bs.modal", function (a) {
		t("#galleryImage").attr("src", t(a.relatedTarget).data("src"))
	})
}(jQuery);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
	$('a.page-scroll').bind('click', function (event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top
		}, 1500, 'easeInOutExpo');
		event.preventDefault();
	});
});

// SOME STUPID NAVIGATION SHIT I DIDN'T MAKE BUT MAKES MY WEBSITE LOOK COOL

;
(function ($, window, document, undefined) {
	"use strict";
	var pluginName = 'autoHidingNavbar',
		$window = $(window),
		$document = $(document),
		_scrollThrottleTimer = null,
		_resizeThrottleTimer = null,
		_throttleDelay = 70,
		_lastScrollHandlerRun = 0,
		_previousScrollTop = null,
		_windowHeight = $window.height(),
		_visible = true,
		_hideOffset,
		defaults = {
			disableAutohide: false,
			showOnUpscroll: true,
			showOnBottom: true,
			hideOffset: 'auto', // "auto" means the navbar height
			animationDuration: 200,
			navbarOffset: 0
		};

	function AutoHidingNavbar(element, options) {
		this.element = $(element);
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	function hide(autoHidingNavbar) {
		if (!_visible) {
			return;
		}

		autoHidingNavbar.element.addClass('navbar-hidden').animate({
			top: -1 * parseInt(autoHidingNavbar.element.css('height'), 10) + autoHidingNavbar.settings.navbarOffset
		}, {
			queue: false,
			duration: autoHidingNavbar.settings.animationDuration
		});

		$('.dropdown.open .dropdown-toggle', autoHidingNavbar.element).dropdown('toggle');

		_visible = false;

		autoHidingNavbar.element.trigger('hide.autoHidingNavbar');
	}

	function show(autoHidingNavbar) {
		if (_visible) {
			return;
		}

		autoHidingNavbar.element.removeClass('navbar-hidden').animate({
			top: 0
		}, {
			queue: false,
			duration: autoHidingNavbar.settings.animationDuration
		});
		_visible = true;

		autoHidingNavbar.element.trigger('show.autoHidingNavbar');
	}

	function detectState(autoHidingNavbar) {
		var scrollTop = $window.scrollTop(),
			scrollDelta = scrollTop - _previousScrollTop;

		_previousScrollTop = scrollTop;

		if (scrollDelta < 0) {
			if (_visible) {
				return;
			}

			if (autoHidingNavbar.settings.showOnUpscroll || scrollTop <= _hideOffset) {
				show(autoHidingNavbar);
			}
		} else if (scrollDelta > 0) {
			if (!_visible) {
				if (autoHidingNavbar.settings.showOnBottom && scrollTop + _windowHeight === $document.height()) {
					show(autoHidingNavbar);
				}
				return;
			}

			if (scrollTop >= _hideOffset) {
				hide(autoHidingNavbar);
			}
		}

	}

	function scrollHandler(autoHidingNavbar) {
		if (autoHidingNavbar.settings.disableAutohide) {
			return;
		}

		_lastScrollHandlerRun = new Date().getTime();

		detectState(autoHidingNavbar);
	}

	function bindEvents(autoHidingNavbar) {
		$document.on('scroll.' + pluginName, function () {
			if (new Date().getTime() - _lastScrollHandlerRun > _throttleDelay) {
				scrollHandler(autoHidingNavbar);
			} else {
				clearTimeout(_scrollThrottleTimer);
				_scrollThrottleTimer = setTimeout(function () {
					scrollHandler(autoHidingNavbar);
				}, _throttleDelay);
			}
		});

		$window.on('resize.' + pluginName, function () {
			clearTimeout(_resizeThrottleTimer);
			_resizeThrottleTimer = setTimeout(function () {
				_windowHeight = $window.height();
			}, _throttleDelay);
		});
	}

	function unbindEvents() {
		$document.off('.' + pluginName);

		$window.off('.' + pluginName);
	}

	AutoHidingNavbar.prototype = {
		init: function () {
			this.elements = {
				navbar: this.element
			};

			this.setDisableAutohide(this.settings.disableAutohide);
			this.setShowOnUpscroll(this.settings.showOnUpscroll);
			this.setShowOnBottom(this.settings.showOnBottom);
			this.setHideOffset(this.settings.hideOffset);
			this.setAnimationDuration(this.settings.animationDuration);

			_hideOffset = this.settings.hideOffset === 'auto' ? parseInt(this.element.css('height'), 10) : this.settings.hideOffset;
			bindEvents(this);

			return this.element;
		},
		setDisableAutohide: function (value) {
			this.settings.disableAutohide = value;
			return this.element;
		},
		setShowOnUpscroll: function (value) {
			this.settings.showOnUpscroll = value;
			return this.element;
		},
		setShowOnBottom: function (value) {
			this.settings.showOnBottom = value;
			return this.element;
		},
		setHideOffset: function (value) {
			this.settings.hideOffset = value;
			return this.element;
		},
		setAnimationDuration: function (value) {
			this.settings.animationDuration = value;
			return this.element;
		},
		show: function () {
			show(this);
			return this.element;
		},
		hide: function () {
			hide(this);
			return this.element;
		},
		destroy: function () {
			unbindEvents(this);
			show(this);
			$.data(this, 'plugin_' + pluginName, null);
			return this.element;
		}
	};

	$.fn[pluginName] = function (options) {
		var args = arguments;

		if (options === undefined || typeof options === 'object') {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new AutoHidingNavbar(this, options));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			var returns;

			this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);

				if (instance instanceof AutoHidingNavbar && typeof instance[options] === 'function') {
					returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}
			});

			return returns !== undefined ? returns : this;
		}

	};
	/* === Search === */

	(function () {
		$('.top-search a').on('click', function (e) {
			e.preventDefault();
			$('.show-search').slideToggle('fast');
			$('.top-search a').toggleClass('sactive');
		});
	}());
jQuery( document ).ready(function($) {
    //accessToken: '29186318.7908560.dc30fcb45e6b476d9ecad1f610381912',
    //clientID: '7908560b89b64273af7007b4c336188a'
	var imgs = [];
    var feed = new Instafeed({
        get: 'user',
		userId: '29186318',
        tagName: '',
        clientId: '7908560b89b64273af7007b4c336188a',
		accessToken: '29186318.7908560.dc30fcb45e6b476d9ecad1f610381912',
		limit: 24,
		resolution: 'standard_resolution',
		template: '<div class="item"><img src="{{image}}" /></div>',
 		target: 'instafeed',
		//filter: function(image) {
//            return image.tags.indexOf('delsol') >= 0;
//        },
 		after: function() {
 			$('.owl-carousel').owlCarousel({
 				items:8,
 				loop:false,
 				margin:0,
 				nav: false,
				dots: false,
				mouseDrag: false,
				touchDrag: false,
				pullDrag: false,
				responsive: {
                	0: {items: 1},
                	600: {items: 5},
                	1000: {items: 8}
            	}
 			});

 			}
 	});
	feed.run();
});
})(jQuery, window, document);

//template: '<div style="background-image:url({{image}});" class="nudes"> </div>',
//		template: '<a href="{{link}}" target="_blank"><img src="{{image}}"/></a>',
//		success: function (data) {
//            // read the feed data and create owr own data struture.
//            var images = data.data;
//            var result;
//            for (i = 0; i < images.length; i++) {
//                var image = images[i];
//                result = this._makeTemplate(this.options.template, {
//                    model: image,
//                    id: image.id,
//                    link: image.link,
//                    image: image.images[this.options.resolution].url
//                });
//                imgs.push(result);
//            }
//            // split the feed into divs
//            $("#footer-instagram").html(imgs.slice(0, 8));
//            $("#instafeed3").html(imgs.slice(8, 9));
//            $("#instafeed4").html(imgs.slice(9, 10));
//            $("#instafeed5").html(imgs.slice(10, 11));
//        },