/**
 * Main Application Controller
 * @type Object
 */
var app = {

	/**
	 * What happens upon the loading of the app
	 */
	initialize: function() {
		this.detailsUrl = /^#post(\d+)/;
		this.registerEvents();

		this.store = new Posts(function() {
			$('body').html(new HomeView(app.store).render().el);
		});
	},
	
	/**
	 * Show a native alert or a web version if not supported
	 * @param  String 	message 	The message in the alert
	 * @param  String	title   	The title of the alert
	 */
	showAlert: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},

	/**
	 * Setup which events we're listening out for
	 */
	registerEvents: function() {
		$(window).on('hashchange', $.proxy(this.route, this));

		// Check of browser supports touch events...
		if (document.documentElement.hasOwnProperty('ontouchstart')) {
			// ... if yes: register touch event listener to change the "selected" state of the item
			$('body').on('touchstart', 'a', function(event) {
				$(event.target).addClass('tappable-active');
			});
			$('body').on('touchend', 'a', function(event) {
				$(event.target).removeClass('tappable-active');
			});
		} else {
			// ... if not: register mouse events instead
			$('body').on('mousedown', 'a', function(event) {
				$(event.target).addClass('tappable-active');
			});
			$('body').on('mouseup', 'a', function(event) {
				$(event.target).removeClass('tappable-active');
			});
		}
	},

	/**
	 * Handle some application routes, we need to know what
	 * we're looking out for
	 */
	route: function() {
		var hash = window.location.hash;

		if(!hash) {
			$('body').html(new HomeView(this.store).render().el);
			$('.content').hide().fadeIn();
			return;
		}

		var match = hash.match(app.detailsUrl);
		if(match) {
			app.store.getById(Number(match[1]), function(post) {
				$('body').html(new PostView(post).render().el);
				$('.content').hide().fadeIn();
			});
		}
	}

};

app.initialize();