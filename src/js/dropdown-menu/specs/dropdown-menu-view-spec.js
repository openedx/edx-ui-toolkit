define([
        'jquery',
        'underscore',
        '../dropdown-menu-view.js',
        '../../utils/constants.js',
        'jquery.simulate'
    ],
    function($, _, DropdownMenuView, constants) {
        'use strict';

        describe('Dropdown Menu View', function() {
            var view = {},
                dropdownModel = new Backbone.Model(),
                ExtendedDropdownMenuView,
                singleKeyDown = function(key) {
                    $(document.activeElement).simulate('keydown', {keyCode: key});
                },
                focusTrapDown,
                focusTrapUp,
                menuIsClosed,
                menuIsOpen,
                openMenuTest,
                closeMenuTest,
                closeMenuOnPageClickTest,
                closeOnKeypressTest,
                timeoutInt = 100;

            focusTrapDown = function(key, listLength) {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    var i;

                    expect($(document.activeElement)).not.toHaveClass('js-dropdown-button');

                    for (i = 0; i < listLength; i++) {
                        singleKeyDown(key);
                    }
                }, timeoutInt);

                setTimeout(function() {
                    expect($(document.activeElement)).not.toHaveClass('js-dropdown-button');
                    singleKeyDown(key);
                }, timeoutInt * 2);

                setTimeout(function() {
                    expect($(document.activeElement)).toHaveClass('js-dropdown-button');
                }, timeoutInt * 3);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2) + 1);
                jasmine.clock().tick((timeoutInt * 3) + 1);
            };

            focusTrapUp = function(key) {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    expect($(document.activeElement)).not.toHaveClass('js-dropdown-button');
                    singleKeyDown(key);
                }, timeoutInt);

                setTimeout(function() {
                    expect($(document.activeElement)).toHaveClass('js-dropdown-button');
                    singleKeyDown(key);
                }, timeoutInt * 2);

                setTimeout(function() {
                    var $active = $(document.activeElement),
                        lastItem = _.last(view.model.get('items'));

                    expect($active).toHaveClass('action');
                    expect($active.attr('href')).toEqual(lastItem.url);
                }, timeoutInt * 3);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2) + 1);
                jasmine.clock().tick((timeoutInt * 3) + 1);
            };

            menuIsClosed = function($btn, $menu) {
                expect($btn).not.toHaveClass('is-active');
                expect($btn.attr('aria-expanded')).toEqual('false');
                expect($menu).toHaveClass('is-hidden');
            };

            menuIsOpen = function($btn, $menu) {
                expect($btn).toHaveClass('is-active');
                expect($btn.attr('aria-expanded')).toEqual('true');
                expect($menu).not.toHaveClass('is-hidden');
            };

            openMenuTest = function() {
                var $btn = view.$('.js-dropdown-button'),
                    $menu = view.$('ul.dropdown-menu');

                menuIsClosed($btn, $menu);
                $btn.click();

                setTimeout(function() {
                    menuIsOpen($btn, $menu);
                }, timeoutInt);

                jasmine.clock().tick(timeoutInt + 1);
            };

            closeMenuTest = function() {
                var $btn = view.$('.js-dropdown-button'),
                    $menu = view.$('ul.dropdown-menu');

                menuIsClosed($btn, $menu);
                $btn.click();

                setTimeout(function() {
                    menuIsOpen($btn, $menu);
                    $btn.click();
                }, timeoutInt);

                setTimeout(function() {
                    menuIsClosed($btn, $menu);
                }, timeoutInt * 2);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2) + 1);
            };

            closeMenuOnPageClickTest = function() {
                var $btn = view.$('.js-dropdown-button'),
                    $menu = view.$('ul.dropdown-menu');

                menuIsClosed($btn, $menu);
                $btn.click();

                setTimeout(function() {
                    menuIsOpen($btn, $menu);
                    $(document).click();
                }, timeoutInt);

                setTimeout(function() {
                    menuIsClosed($btn, $menu);
                }, timeoutInt * 2);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2) + 1);
            };

            closeOnKeypressTest = function(key) {
                var $btn = view.$('.js-dropdown-button'),
                    $menu = view.$('ul.dropdown-menu');

                menuIsClosed($btn, $menu);
                $btn.click();

                setTimeout(function() {
                    menuIsOpen($btn, $menu);
                    singleKeyDown(key);
                }, timeoutInt);

                setTimeout(function() {
                    menuIsClosed($btn, $menu);
                }, timeoutInt * 2);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2) + 1);
            };

            beforeEach(function() {
                // Extend the view to add analytics for testing
                ExtendedDropdownMenuView = DropdownMenuView.extend({
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
                    button: {
                        label: 'User options dropdown'
                    },
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
            });

            afterEach(function() {
                view.remove();
                jasmine.clock().uninstall();
            });

            describe('Default icon usage', function() {
                beforeEach(function() {
                    view = new ExtendedDropdownMenuView({
                        className: 'wrapper-more-actions user-menu logged-in',
                        menuId: 'edx-user-menu',
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

                it('should open the user menu on click of the button', openMenuTest);

                it('should close the user menu on click of the button', closeMenuTest);

                it('should close the user menu on keypress of the esc key', function() {
                    closeOnKeypressTest(constants.keyCodes.esc);
                });

                it('should close the user menu on keypress of the space bar', function() {
                    closeOnKeypressTest(constants.keyCodes.space);
                });

                it('should return to the button after pressing down arrow key while at bottom of dropdown menu', function() {
                    focusTrapDown(constants.keyCodes.down, 4);
                });

                it('should return to the button after pressing right arrow key while at bottom of dropdown menu', function() {
                    focusTrapDown(constants.keyCodes.right, 4);
                });

                it('should return to the bottom of dropdown menu after pressing up arrow key while on button', function() {
                    focusTrapUp(constants.keyCodes.up);
                });

                it('should return to the bottom of dropdown menu after pressing left arrow key while on button', function() {
                    focusTrapUp(constants.keyCodes.left);
                });

                it('should close the user menu on page click', closeMenuOnPageClickTest);

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
                    }, timeoutInt);

                    jasmine.clock().tick(timeoutInt + 1);
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
                    }, timeoutInt);

                    jasmine.clock().tick(timeoutInt + 1);
                });
            });

            describe('Pattern Library icon usage', function() {
                beforeEach(function() {
                    dropdownModel.set({
                        button: {
                            icon: 'icon-angle-down',
                            label: 'User options dropdown'
                        }
                    });
                    view = new ExtendedDropdownMenuView({
                        className: 'wrapper-more-actions user-menu logged-in',
                        menuId: 'edx-user-menu',
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

                it('should open the user menu on click of the button', openMenuTest);

                it('should close the user menu on click of the button', closeMenuTest);

                it('should close the user menu on page click', closeMenuOnPageClickTest);

                it('should toggle the menu on icon click', function() {
                    var $btn = view.$('.js-dropdown-button'),
                        $icon = $btn.find('.icon'),
                        $menu = view.$('ul.dropdown-menu');

                    menuIsClosed($btn, $menu);
                    $icon.click();

                    setTimeout(function() {
                        menuIsOpen($btn, $menu);
                        $icon.click();
                    }, timeoutInt);

                    setTimeout(function() {
                        menuIsClosed($btn, $menu);
                    }, timeoutInt * 2);

                    jasmine.clock().tick(timeoutInt + 1);
                    jasmine.clock().tick((timeoutInt * 2) + 1);
                });
            });
        });
    }
);
