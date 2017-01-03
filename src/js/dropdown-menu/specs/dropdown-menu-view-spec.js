define([
    'jquery',
    'underscore',
    'backbone',
    '../dropdown-menu-view.js',
    '../../utils/constants.js',
    'jquery.simulate'
],
    ($, _, Backbone, DropdownMenuView, constants) => {
        'use strict';

        describe('Dropdown Menu View', () => {
            const timeoutInt = 100,
                dropdownModel = new Backbone.Model();
            let view;

            const singleKeyDown = (key) => {
                $(document.activeElement).simulate('keydown', {keyCode: key});
            };

            const focusTrapDown = (key, listLength) => {
                const $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(() => {
                    expect($(document.activeElement)).not.toHaveClass('js-dropdown-button');

                    for (let i = 0; i < listLength; i++) {
                        singleKeyDown(key);
                    }
                }, timeoutInt);

                setTimeout(() => {
                    expect($(document.activeElement)).not.toHaveClass('js-dropdown-button');
                    singleKeyDown(key);
                }, timeoutInt * 2);

                setTimeout(() => {
                    expect($(document.activeElement)).toHaveClass('js-dropdown-button');
                }, timeoutInt * 3);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2) + 1);
                jasmine.clock().tick((timeoutInt * 3) + 1);
            };

            const focusTrapUp = (key) => {
                const $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(() => {
                    expect($(document.activeElement)).not.toHaveClass('js-dropdown-button');
                    singleKeyDown(key);
                }, timeoutInt);

                setTimeout(() => {
                    expect($(document.activeElement)).toHaveClass('js-dropdown-button');
                    singleKeyDown(key);
                }, timeoutInt * 2);

                setTimeout(() => {
                    const $active = $(document.activeElement),
                        lastItem = _.last(view.model.get('items'));

                    expect($active).toHaveClass('action');
                    expect($active.attr('href')).toEqual(lastItem.url);
                }, timeoutInt * 3);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2) + 1);
                jasmine.clock().tick((timeoutInt * 3) + 1);
            };

            const menuIsClosed = ($btn, $menu) => {
                expect($btn).not.toHaveClass('is-active');
                expect($btn.attr('aria-expanded')).toEqual('false');
                expect($menu).toHaveClass('is-hidden');
            };

            const menuIsOpen = ($btn, $menu) => {
                expect($btn).toHaveClass('is-active');
                expect($btn.attr('aria-expanded')).toEqual('true');
                expect($menu).not.toHaveClass('is-hidden');
            };

            const openMenuTest = () => {
                const $btn = view.$('.js-dropdown-button'),
                    $menu = view.$('ul.dropdown-menu');

                menuIsClosed($btn, $menu);
                $btn.click();

                setTimeout(() => {
                    menuIsOpen($btn, $menu);
                }, timeoutInt);

                jasmine.clock().tick(timeoutInt + 1);
            };

            const closeMenuTest = () => {
                const $btn = view.$('.js-dropdown-button'),
                    $menu = view.$('ul.dropdown-menu');

                menuIsClosed($btn, $menu);
                $btn.click();

                setTimeout(() => {
                    menuIsOpen($btn, $menu);
                    $btn.click();
                }, timeoutInt);

                setTimeout(() => {
                    menuIsClosed($btn, $menu);
                }, timeoutInt * 2);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2) + 1);
            };

            const closeMenuOnPageClickTest = () => {
                const $btn = view.$('.js-dropdown-button'),
                    $menu = view.$('ul.dropdown-menu');

                menuIsClosed($btn, $menu);
                $btn.click();

                setTimeout(() => {
                    menuIsOpen($btn, $menu);
                    $(document).click();
                }, timeoutInt);

                setTimeout(() => {
                    menuIsClosed($btn, $menu);
                }, timeoutInt * 2);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2) + 1);
            };

            const closeOnKeypressTest = function(key) {
                const $btn = view.$('.js-dropdown-button'),
                    $menu = view.$('ul.dropdown-menu');

                menuIsClosed($btn, $menu);
                $btn.click();

                setTimeout(() => {
                    menuIsOpen($btn, $menu);
                    singleKeyDown(key);
                }, timeoutInt);

                setTimeout(() => {
                    menuIsClosed($btn, $menu);
                }, timeoutInt * 2);

                jasmine.clock().tick(timeoutInt + 1);
                jasmine.clock().tick((timeoutInt * 2) + 1);
            };

            // Extend the view to add analytics for testing
            class ExtendedDropdownMenuView extends DropdownMenuView {
                analyticsLinkClick(event) {
                    const $link = $(event.target),
                        label = $link.hasClass('menu-title') ? 'Dashboard' : $link.html().trim();

                    /**
                     *  Add your own analytics tracking here
                     *  for example:
                     */
                    window.analytics.track('user_dropdown.clicked', {
                        category: 'navigation',
                        label,
                        link: $link.attr('href')
                    });
                }
            }

            beforeEach(() => {
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

            afterEach(() => {
                view.remove();
                jasmine.clock().uninstall();
            });

            describe('Default icon usage', () => {
                beforeEach(() => {
                    view = new ExtendedDropdownMenuView({
                        className: 'wrapper-more-actions user-menu logged-in',
                        menuId: 'edx-user-menu',
                        model: dropdownModel,
                        parent: '.js-user-cta'
                    }).render();

                    window.analytics = jasmine.createSpyObj('analytics', ['track', 'page', 'trackLink']);

                    jasmine.clock().install();
                });

                afterEach(() => {
                    view.remove();
                    jasmine.clock().uninstall();
                });

                it('should exist', () => {
                    expect(view).toBeDefined();
                });

                it('should open the user menu on click of the button', openMenuTest);

                it('should close the user menu on click of the button', closeMenuTest);

                it('should close the user menu on keypress of the esc key', () => {
                    closeOnKeypressTest(constants.keyCodes.esc);
                });

                it('should close the user menu on keypress of the space bar', () => {
                    closeOnKeypressTest(constants.keyCodes.space);
                });

                it('should return to the button after pressing ↓ while at bottom of dropdown menu', () => {
                    focusTrapDown(constants.keyCodes.down, 4);
                });

                it('should return to the button after pressing → while at bottom of dropdown menu', () => {
                    focusTrapDown(constants.keyCodes.right, 4);
                });

                it('should return to the bottom of dropdown menu after pressing ↑ while on button', () => {
                    focusTrapUp(constants.keyCodes.up);
                });

                it('should return to the bottom of dropdown menu after pressing ← while on button', () => {
                    focusTrapUp(constants.keyCodes.left);
                });

                it('should close the user menu on page click', closeMenuOnPageClickTest);

                it('should add a screenreader label to the user link if provided', () => {
                    let $srLabel = view.$el.find('.menu-title .sr-only');
                    const srLabelText = 'Dashboard for:';

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

                it('should add a user image to the user link if provided', () => {
                    let $img = view.$el.find('.menu-title .menu-image');
                    const imgSrc = 'http://placehold.it/350x150';
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

                it('should open track analytics for user title clicks', () => {
                    const $userTitle = view.$el.find('.menu-title'),
                        analyticsData = {
                            category: 'navigation',
                            label: 'Dashboard',
                            link: 'dashboard'
                        };

                    $userTitle.click();

                    setTimeout(() => {
                        expect(window.analytics.track).toHaveBeenCalledWith('user_dropdown.clicked', analyticsData);
                    }, timeoutInt);

                    jasmine.clock().tick(timeoutInt + 1);
                });

                it('should open track analytics for user menu link clicks', () => {
                    const $userTitle = view.$el.find('.dropdown-item').last().find('a'),
                        analyticsData = {
                            category: 'navigation',
                            label: 'Sign Out',
                            link: 'logout'
                        };

                    $userTitle.click();

                    setTimeout(() => {
                        expect(window.analytics.track).toHaveBeenCalledWith('user_dropdown.clicked', analyticsData);
                    }, timeoutInt);

                    jasmine.clock().tick(timeoutInt + 1);
                });
            });

            describe('Pattern Library icon usage', () => {
                beforeEach(() => {
                    dropdownModel.set({
                        button: {
                            icon: 'fa fa-angle-down',
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

                afterEach(() => {
                    view.remove();
                    jasmine.clock().uninstall();
                });

                it('should exist', () => {
                    expect(view).toBeDefined();
                });

                it('should open the user menu on click of the button', openMenuTest);

                it('should close the user menu on click of the button', closeMenuTest);

                it('should close the user menu on page click', closeMenuOnPageClickTest);

                it('should toggle the menu on icon click', () => {
                    const $btn = view.$('.js-dropdown-button'),
                        $icon = $btn.find('.icon'),
                        $menu = view.$('ul.dropdown-menu');

                    menuIsClosed($btn, $menu);
                    $icon.click();

                    setTimeout(() => {
                        menuIsOpen($btn, $menu);
                        $icon.click();
                    }, timeoutInt);

                    setTimeout(() => {
                        menuIsClosed($btn, $menu);
                    }, timeoutInt * 2);

                    jasmine.clock().tick(timeoutInt + 1);
                    jasmine.clock().tick((timeoutInt * 2) + 1);
                });
            });
        });
    }
);
