// eslint-disable-next-line import/no-amd
define(['jquery', '../disclosure-view.js'], function ($, DisclosureView) {
    'use strict';

    describe('Disclosure view', function () {
        it('should display toggle display', function () {
            var disclosureEl = document.createElement('div'),
                toggleText = document.createElement('div'),
                toggleContent = document.createElement('div'),
                view = new DisclosureView({
                    el: disclosureEl
                });

            // for testing visibility
            spyOn($.fn, 'slideToggle');

            // set up the text to display
            disclosureEl.setAttribute('data-expanded-text', 'Expand Text');
            disclosureEl.setAttribute('data-collapsed-text', 'Click to Collapse');

            toggleText.className = 'disclosure-toggle';
            disclosureEl.appendChild(toggleText);

            toggleContent.className = 'disclosure-target';
            toggleContent.textContent = 'sample stuff';
            disclosureEl.appendChild(toggleContent);

            view.render();

            // disclosure content is visible and text should display messaging
            expect(toggleText.textContent).toEqual('Click to Collapse');
            expect($.fn.slideToggle).not.toHaveBeenCalled();
            expect(toggleText.getAttribute('aria-expanded')).toBe('false');
            expect($(disclosureEl).hasClass('is-collapsed')).toBe(true);

            $(toggleText).trigger('click');
            expect(toggleText.textContent).toEqual('Expand Text');
            // visability is difficult to test in jasmine, but we know that slideToggle
            // should have been called
            expect($.fn.slideToggle).toHaveBeenCalled();
            expect(toggleText.getAttribute('aria-expanded')).toBe('true');
            expect($(disclosureEl).hasClass('is-collapsed')).toBe(false);
        });
    });
});
