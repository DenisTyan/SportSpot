$(function(){

	$('.header__menu-mobile').click(function (event) {
        $(this).toggleClass('_active');
        $('.header__list').toggleClass('_active');
        if ($(this).hasClass('_active')) {
            $('body').data('scroll', $(window).scrollTop());
        }
        $('body').toggleClass('_lock');
        if (!$(this).hasClass('_active')) {
            $('body,html').scrollTop(parseInt($('body').data('scroll')));
        }
    });

    $('.header__link').click(function (event) {
        $(this).toggleClass('_active');
        $('.header__list').removeClass('_active');
        $('.header__menu-mobile').removeClass('_active');
        if ($(this).hasClass('_active')) {
            $('body').data('scroll', $(window).scrollTop());
        }
        $('body').removeClass('_lock');
        if (!$(this).hasClass('_active')) {
            $('body,html').scrollTop(parseInt($('body').data('scroll')));
        }
    });

	$('._goto').click(function () {
		var el = $(this).attr('href').replace('#', '');
		var offset = 0;
		$('body,html').animate({ scrollTop: $('.' + el).offset().top + offset }, 800, function () { });
	
		if ($('header__menu').hasClass('_active')) {
			$('.header__menu, .header__logo-mobile').removeClass('_active');
			$('body').removeClass('_lock');
		}
		return false;
	});


	$('body').on('click', '._tabs-item', function (event) {
		var eq = $(this).index();
		if ($(this).hasClass('parent')) {
			var eq = $(this).parent().index();
		}
		if (!$(this).hasClass('_active')) {
			$(this).closest('._tabs').find('._tabs-item').removeClass('_active');
			$(this).addClass('_active');
			$(this).closest('._tabs').find('._tabs-block').removeClass('_active').eq(eq).addClass('_active');
			if ($(this).closest('._tabs').find('.slick-slider').length > 0) {
				$(this).closest('._tabs').find('.slick-slider').slick('setPosition');
			}
		}
	});


	let useSlider = new Swiper('.use__slider', {
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 0,
		autoHeight: true,
		speed: 800,
		loop: false,
		effect: 'fade',

		pagination: {
			el: '.use__dots',
			clickable: true,
		},

		navigation: {
			nextEl: '.use__arrows-next',
			prevEl: '.use__arrows-prev',
		},
	});

	function forms() {

		//FIELDS
		$('input,textarea').focus(function () {
			if ($(this).val() == $(this).attr('data-value')) {
				$(this).addClass('focus');
				$(this).parent().addClass('focus');
				if ($(this).attr('data-type') == 'pass') {
					$(this).attr('type', 'password');
				};
				$(this).val('');
			};
			removeError($(this));
		});
		$('input[data-value], textarea[data-value]').each(function () {
			if (this.value == '' || this.value == $(this).attr('data-value')) {
				this.value = $(this).attr('data-value');
				if ($(this).hasClass('l') && $(this).parent().find('.form__label').length == 0) {
					$(this).parent().append('<div class="form__label">' + $(this).attr('data-value') + '</div>');
				}
			}
			if (this.value != $(this).attr('data-value') && this.value != '') {
				$(this).addClass('focus');
				$(this).parent().addClass('focus');
				if ($(this).hasClass('l') && $(this).parent().find('.form__label').length == 0) {
					$(this).parent().append('<div class="form__label">' + $(this).attr('data-value') + '</div>');
				}
			}

			$(this).click(function () {
				if (this.value == $(this).attr('data-value')) {
					if ($(this).attr('data-type') == 'pass') {
						$(this).attr('type', 'password');
					};
					this.value = '';
				};
			});
			$(this).blur(function () {
				if (this.value == '') {
					this.value = $(this).attr('data-value');
					$(this).removeClass('focus');
					$(this).parent().removeClass('focus');
					if ($(this).attr('data-type') == 'pass') {
						$(this).attr('type', 'text');
					};
				};
			});
		});
	}
	forms();

	//VALIDATE FORMS
	$('form button[type=submit]').click(function () {
		var er = 0;
		var form = $(this).parents('form');
		var ms = form.data('ms');
		$.each(form.find('.req'), function (index, val) {
			er += formValidate($(this));

		});
		if (er == 0) {

			sendForm();
			removeFormError(form);

			if (ms != null && ms != '') {
				showMessageByClass(ms);
				return false;

			}
		} else {
			return false;
		}
	});
	function formValidate(input) {
		var er = 0;
		var form = input.parents('form');
		if (input.attr('name') == 'email' || input.hasClass('email')) {
			if (input.val() != input.attr('data-value')) {
				var em = input.val().replace(" ", "");
				input.val(em);
			}
			if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(input.val())) || input.val() == input.attr('data-value')) {
				er++;
				addError(input);
			} else {
				removeError(input);
			}
		} else {
			if (input.val() == '' || input.val() == input.attr('data-value')) {
				er++;
				addError(input);
			} else {
				removeError(input);
			}
		}
		if (input.attr('type') == 'checkbox') {
			if (input.prop('checked') == true) {
				input.removeClass('err').parent().removeClass('err');
			} else {
				er++;
				input.addClass('err').parent().addClass('err');
			}
		}
		if (input.hasClass('name')) {
			if (!(/^[А-Яа-яa-zA-Z-]+( [А-Яа-яa-zA-Z-]+)$/.test(input.val()))) {
				er++;
				addError(input);
			}
		}
		if (input.hasClass('pass-2')) {
			if (form.find('.pass-1').val() != form.find('.pass-2').val()) {
				addError(input);
			} else {
				removeError(input);
			}
		}
		return er;
	}

	function showMessageByClass(ms) {
		$('.popup').hide();
		popupOpen('message.' + ms, '');
	}


	function addError(input) {
		input.addClass('err');
		input.parent().addClass('err');
		input.parent().find('.form__error').remove();
		if (input.hasClass('email')) {
			var error = '';
			if (input.val() == '' || input.val() == input.attr('data-value')) {
				error = input.data('error');
			} else {
				error = input.data('error');
			}
			if (error != null) {
				input.parent().append('<div class="form__error">' + error + '</div>');
			}
		} else {
			if (input.data('error') != null && input.parent().find('.form__error').length == 0) {
				input.parent().append('<div class="form__error">' + input.data('error') + '</div>');
			}
		}
		if (input.parents('.select-block').length > 0) {
			input.parents('.select-block').parent().addClass('err');
			input.parents('.select-block').find('.select').addClass('err');
		}
	}


	function removeFormError(form) {
		form.find('.form__generalerror').hide().html('');
	}
	function removeError(input) {
		input.removeClass('err');
		input.parent().removeClass('err');
		input.parent().find('.form__error').remove();

		if (input.parents('.select-block').length > 0) {
			input.parents('.select-block').parent().removeClass('err');
			input.parents('.select-block').find('.select').removeClass('err').removeClass('active');
		}
	}

});


