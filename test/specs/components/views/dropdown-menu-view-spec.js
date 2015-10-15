define([
        'jquery',
        'underscore',
        'components/views/dropdown-menu-view'
    ],
    function( $, _, DropdownMenuView ) {
        'use strict';

        describe( 'Main Menu View', function() {
            var view = {},
                dropdownModel = new Backbone.Model(),
                keyPress = function( key ) {
                    var event = document.createEvent('Event');

                    event.keyCode = key;
                    event.initEvent( 'keydown', true, false );
                    document.dispatchEvent(event);
                };

            beforeEach(function() {
                // Extend the view to add analytics for testing
                var ExtendedDropdownMenuView = DropdownMenuView.extend({
                    analyticsLinkClick: function( event ) {
                        var $link = $(event.target),
                            label = $link.hasClass('user-title') ? 'Dashboard' : $link.html().trim();

                        /**
                         *  Add your own analytics tracking here
                         *  for example:
                         */
                        window.analytics.track( 'user_dropdown.clicked', {
                            category: 'navigation',
                            label: label,
                            link: $link.attr('href')
                        });
                    }
                });

                // Set the DOM
                setFixtures( '<div class="js-user-cta"></div>' );

                dropdownModel.set({
                    main: {
                        text: 'username',
                        url: 'dashboard'
                    },
                    button: {
                        text: '&#8964;',
                        sr_label: 'User options dropdown'
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

                view = new ExtendedDropdownMenuView({
                    className: 'wrapper-more-actions user-menu logged-in',
                    model: dropdownModel,
                    parent: '.js-user-cta'
                });

                window.analytics = jasmine.createSpyObj('analytics', ['track', 'page', 'trackLink']);

                jasmine.clock().install();
            });

            afterEach( function() {
                view.remove();
                jasmine.clock().uninstall();
            });

            it( 'should exist', function () {
                expect( view ).toBeDefined();
            });

            // TODO: Add tests for aria-labels changing
            it( 'should open the user menu on click of the button', function () {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    expect( $btn ).toHaveClass('is-active');
                }, 100);

                jasmine.clock().tick(101);
            });

            // TODO: Add tests for aria-labels changing
            it( 'should close the user menu on keypress of the esc key', function () {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    expect( $btn ).toHaveClass('is-active');
                    keyPress( 27 );
                }, 100);

                setTimeout(function() {
                    expect( $btn ).not.toHaveClass('is-active');
                }, 200);

                jasmine.clock().tick(101);
                jasmine.clock().tick(201);
            });

            // TODO: Add tests for aria-labels changing
            it( 'should close the user menu on page click', function () {
                var $btn = view.$el.find('.js-dropdown-button');

                $btn.click();

                setTimeout(function() {
                    expect( $btn ).toHaveClass('is-active');
                    $('body').click();
                }, 100);

                setTimeout(function() {
                    expect( $btn ).not.toHaveClass('is-active');
                }, 200);

                jasmine.clock().tick(101);
                jasmine.clock().tick(201);
            });

            xit( 'should navigate through the menu with arrow presses', function() {
            });

            it( 'should open track analytics for user title clicks', function () {
                var $userTitle = view.$el.find('.user-title'),
                    analyticsData = {
                        category: 'navigation',
                        label: 'Dashboard',
                        link: 'dashboard'
                    };

                $userTitle.click();

                setTimeout(function() {
                    expect( window.analytics.track ).toHaveBeenCalledWith( 'user_dropdown.clicked', analyticsData );
                }, 100);

                jasmine.clock().tick(101);
            });

            it( 'should open track analytics for user menu link clicks', function () {
                var $userTitle = view.$el.find('.dropdown-item.last a'),
                    analyticsData = {
                        category: 'navigation',
                        label: 'Sign Out',
                        link: 'logout'
                    };

                $userTitle.click();

                setTimeout(function() {
                    expect( window.analytics.track ).toHaveBeenCalledWith( 'user_dropdown.clicked', analyticsData );
                }, 100);

                jasmine.clock().tick(101);
            });
        });
    }
);
