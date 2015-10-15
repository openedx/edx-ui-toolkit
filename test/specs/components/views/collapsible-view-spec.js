define(['jquery', 'components/views/collapsible-view'], function ($, CollapsibleView) {
    'use strict';

    describe('Collapsible view', function () {

        it('should display toggle display', function () {
            var collapsibleEl = document.createElement('div'),
                toggleText = document.createElement('div'),
                toggleContent = document.createElement('div'),
                view = new CollapsibleView({
                    el: collapsibleEl
                });

            // for testing visibility
            spyOn($.fn, 'slideToggle');

            // set up the text to display
            collapsibleEl.setAttribute('data-expanded-text', 'Expand Text');
            collapsibleEl.setAttribute('data-collapsed-text', 'Click to Collapse');

            toggleText.className = 'collapsible-toggle';
            collapsibleEl.appendChild(toggleText);

            toggleContent.className = 'collapsible-target';
            toggleContent.textContent = 'sample stuff';
            collapsibleEl.appendChild(toggleContent);

            view.render();

            // collapsible content is visible and text should display messaging
            expect(toggleText.textContent).toEqual('Click to Collapse');
            expect($.fn.slideToggle).not.toHaveBeenCalled();
            expect(toggleText.getAttribute('aria-expanded')).toBe('false');
            expect($(collapsibleEl).hasClass('is-collapsed')).toBe(true);

            $(toggleText).trigger('click');
            expect(toggleText.textContent).toEqual('Expand Text');
            // visability is difficult to test in jasmine, but we know that slideToggle
            // should have been called
            expect($.fn.slideToggle).toHaveBeenCalled();
            expect(toggleText.getAttribute('aria-expanded')).toBe('true');
            expect($(collapsibleEl).hasClass('is-collapsed')).toBe(false);
        });

    });

});
