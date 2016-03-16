define([
        'jquery',
        'underscore',
        '../dropdown-menu-view.js',
        '../../utils/constants.js',
        'jquery.simulate'
    ],
    function($, _, DropdownMenuView, constants) {
        'use strict';

        describe('Main Menu View', function() {
            var view = {},
                dropdownModel = new Backbone.Model(),
                customKeyDown = function(obj) {
                    $(document.activeElement).simulate('keydown', obj);
                },
                singleKeyDown = function(key) {
                    $(document.activeElement).simulate('keydown', {keyCode: key });
                },
                timeoutInt = 100;

            beforeEach(function() {
                // Extend the view to add analytics for testing
                var ExtendedDropdownMenuView = DropdownMenuView.extend({
                    analyticsLinkClick: function(event) {
                        var $link = $(event.target),
                            label = $link.hasClass('menu-title') ? 'Dashboard' : $link.html().trim();

                        /**
                         *  Add your own analytics tracking here
                         *  for example:
                         */
                        window.analytics.track('user_dropdown.clicked', {
                            category: 'navigation',
                            label: label,
                            link: $link.attr('href')
                        });
                    }
                });

                // Set the DOM
                setFixtures('<div class="js-user-cta"></div>');

                dropdownModel.set({
                    main: {
                        text: 'username',
                        url: 'dashboard'
                    },
                    button_label: 'User options dropdown',
                    items: [
                        {
                            text: 'Dashboard',
                            url: 'dashboard'
                        }, {
                            text: 'Account',
                            url: 'account_settings'
                        }, {
                            text: 'Profile',
                            url: 'learner_profile'
                        }, {
                            text: 'Sign Out',
                            url: 'logout'
                        }
                    ]
                });

                view = new ExtendedDropdownMenuView({
                    className: 'wrapper-more-actions user-menu logged-in',
                    model: dropdownModel,
                    parent: '.js-user-cta'
                }).render();

                window.analytics = jasmine.createSpyObj('analytics', ['track', 'page', 'trackLink']);

                jasmine.clock().install();
            });

            afterEach(function() {
                view.remove();
                jasmine.clock().uninstall();
            });

            it('should exist', function() {
                expect(view).toBeDefined();
            });

            it('should open the user menu on click of the button', function() {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    expect($btn).toHaveClass('is-active');
                }, 100);

                jasmine.clock().tick(101);
            });

            it('should close the user menu on keypress of the esc key', function() {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    expect($btn).toHaveClass('is-active');
                    singleKeyDown(constants.keyCodes.esc);
                }, timeoutInt);

                setTimeout(function() {
                    expect($btn).not.toHaveClass('is-active');
                }, timeoutInt * 2);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2 ) + 1);
            });

            it('should close the user menu on keypress of the space bar', function() {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    expect($btn).toHaveClass('is-active');
                    singleKeyDown(constants.keyCodes.space);
                }, timeoutInt);

                setTimeout(function() {
                    expect($btn).not.toHaveClass('is-active');
                }, timeoutInt * 2);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2 ) + 1);
            });

            it('should return to the button after pressing down arrow key while at bottom of dropdown menu', function() {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    expect($(document.activeElement)).not.toHaveClass('js-dropdown-button');
                    singleKeyDown(constants.keyCodes.down);
                    singleKeyDown(constants.keyCodes.down);
                    singleKeyDown(constants.keyCodes.down);
                    singleKeyDown(constants.keyCodes.down);
                }, timeoutInt);

                setTimeout(function() {
                    expect($(document.activeElement)).not.toHaveClass('js-dropdown-button');
                    singleKeyDown(constants.keyCodes.down);
                }, timeoutInt * 2);

                setTimeout(function() {
                    expect($(document.activeElement)).toHaveClass('js-dropdown-button');
                }, timeoutInt * 3);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2 ) + 1);
                jasmine.clock().tick((timeoutInt * 3 ) + 1);
            });

            it('should return to the bottom of dropdown menu after pressing up arrow key while on button', function() {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    expect($(document.activeElement)).not.toHaveClass('js-dropdown-button');
                    singleKeyDown(constants.keyCodes.up);
                }, timeoutInt);

                setTimeout(function() {
                    expect($(document.activeElement)).toHaveClass('js-dropdown-button');
                    singleKeyDown(constants.keyCodes.up);
                }, timeoutInt * 2);

                setTimeout(function() {
                    var $active = $(document.activeElement),
                        lastItem = _.last(view.model.get('items'));

                    expect($active).toHaveClass('action');
                    expect($active.attr('href')).toEqual(lastItem.url);
                }, timeoutInt * 3);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2 ) + 1);
                jasmine.clock().tick((timeoutInt * 3 ) + 1);
            });

            it('should close the user menu on page click', function() {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    expect($btn).toHaveClass('is-active');
                    $('body').click();
                }, 100);

                setTimeout(function() {
                    expect($btn).not.toHaveClass('is-active');
                }, 200);

                jasmine.clock().tick(101);
                jasmine.clock().tick(201);
            });

            it('should add a screenreader label to the user link if provided', function() {
                var $srLabel = view.$el.find('.menu-title .sr-only'),
                    srLabelText = 'Dashboard for:';

                expect($srLabel.length).toEqual(0);

                view.model.set({
                    main: {
                        text: 'username',
                        screenreader_label: srLabelText,
                        url: 'dashboard'
                    }
                });
                view.render();
                $srLabel = view.$el.find('.menu-title .sr-only');
                expect($srLabel.length).toEqual(1);
                expect($srLabel.html().trim()).toEqual(srLabelText);
            });

            it('should add a user image to the user link if provided', function() {
                var $img = view.$el.find('.menu-title .menu-image'),
                    imgSrc = 'http://placehold.it/350x150';
                expect($img.length).toEqual(0);

                view.model.set({
                    main: {
                        text: 'username',
                        image: imgSrc,
                        url: 'dashboard'
                    }
                });
                view.render();
                $img = view.$el.find('.menu-title .menu-image');
                expect($img.length).toEqual(1);
                expect($img.attr('src')).toEqual(imgSrc);
            });

            it('should open track analytics for user title clicks', function() {
                var $userTitle = view.$el.find('.menu-title'),
                    analyticsData = {
                        category: 'navigation',
                        label: 'Dashboard',
                        link: 'dashboard'
                    };

                $userTitle.click();

                setTimeout(function() {
                    expect(window.analytics.track).toHaveBeenCalledWith('user_dropdown.clicked', analyticsData);
                }, 100);

                jasmine.clock().tick(101);
            });

            it('should open track analytics for user menu link clicks', function() {
                var $userTitle = view.$el.find('.dropdown-item').last().find('a'),
                    analyticsData = {
                        category: 'navigation',
                        label: 'Sign Out',
                        link: 'logout'
                    };

                $userTitle.click();

                setTimeout(function() {
                    expect(window.analytics.track).toHaveBeenCalledWith('user_dropdown.clicked', analyticsData);
                }, 100);

                jasmine.clock().tick(101);
            });
        });
    }
);
