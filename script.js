// ==UserScript==
// @name         comick.io Preferred Scanlators
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically selects your preferred scanlator(s) on a manga web page.
// @author       Your Name
// @match        https://comick.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define your preferred scanlators as regex patterns
    const preferredScanlators = [
        /Line/i, // Example: Replace with actual scanlator name regex
        /Scanlator B/i  // Add more regex patterns as needed
    ];

    // Function to set the scanlator
    function setScanlator() {
        const scanlatorSelector = document.querySelector("#__next > main > div.padding-safe-left > div.flex.flex-col.xl\\:flex-row-reverse.justify-between.\\35 xl\\:justify-center.relative > div.sticky.p-1.md\\:p-3.w-full.\\!bg-opacity-80.right-0.bg-gray-200.dark\\:bg-gray-700.text-sm.md\\:text-base.padding-safe-top.z-10.ransition-all.duration-700.ease-in-out.-top-40 > div.max-md\\:grid.max-md\\:grid-cols-3.md\\:flex.mt-2.md\\:mt-3.items-center > div > select");

        if (scanlatorSelector) {
            const options = Array.from(scanlatorSelector.options);

            // Find the first matching preferred scanlator
            const match = options.find(option => {
                return preferredScanlators.some(regex => regex.test(option.textContent));
            });

            if (match && scanlatorSelector.value !== match.value) {
                scanlatorSelector.value = match.value; // Set the preferred scanlator
                scanlatorSelector.dispatchEvent(new Event('change')); // Trigger the change event
            }
        }
    }

    // Run the function on page load
    setScanlator();

    // Also monitor for changes in the DOM to handle dynamic content
    const observer = new MutationObserver(setScanlator);
    observer.observe(document.body, { childList: true, subtree: true });
})();
