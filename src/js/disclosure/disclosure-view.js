/**
 * Clickable view that expands or collapses a section.
 *
 * Set the following data attributes on the element:
 *
 * - `data-collapsed-text`: text to display when content collapsed
 * - `data-expanded-text`: text to display when content expanded
 *
 * @module DisclosureView
 */
((define) => {
    'use strict';

    define(['backbone'],
        (Backbone) => {
            class DisclosureView extends Backbone.View {
                initialize(options) {
                    this.options = Object.assign({}, options, {
                        toggleTextSelector: '.disclosure-toggle',
                        disclosureSelector: '.disclosure-target',
                        isCollapsedClass: 'is-collapsed'
                    });
                    this.render();
                }

                /**
                 * Toggles the visibility of the section.
                 *
                 * @param {boolean} isVisible True if the section should be visible (default: false).
                 */
                toggleState(isVisible) {
                    const $textEl = this.$el.find(this.options.toggleTextSelector);

                    if (isVisible) {
                        $textEl.text(this.$el.data('expanded-text'));
                    } else {
                        $textEl.text(this.$el.data('collapsed-text'));
                    }
                    $textEl.attr('aria-expanded', isVisible);
                    this.$el.toggleClass(this.options.isCollapsedClass, !isVisible);
                }

                render() {
                    const $disclosureEl = this.$el.find(this.options.disclosureSelector),
                        $textEl = this.$el.find(this.options.toggleTextSelector);

                    // sets the initial state
                    this.toggleState($disclosureEl.is(':visible'));

                    // clicking on the toggle text will hide/show content and update text
                    $textEl.click(() => {
                        // Get the state now because getting it after toggling isn't  always accurate -- state is
                        // in transition
                        const isVisible = $disclosureEl.is(':visible');
                        $disclosureEl.slideToggle();
                        this.toggleState(!isVisible);
                    });

                    return this;
                }

            }

            return DisclosureView;
        }
    );
}).call(
    this,
    // Use the default 'define' function if available, else use 'RequireJS.define'
    typeof define === 'function' && define.amd ? define : RequireJS.define
);
