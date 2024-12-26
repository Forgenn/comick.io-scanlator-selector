// ==UserScript==
// @name         Manga Page Preferred Scanlators
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

    // Function to check if any whitelisted scanlators are available in the selector
    function isWhitelistedScanlatorAvailable(scanlatorSelector) {
        const options = Array.from(scanlatorSelector.options);

        // Check if any preferred scanlator is available
        return options.some(option =>
            preferredScanlators.some(regex => regex.test(option.textContent.trim()))
        );
    }

    const maxRetries = 20;
    let retryCount = 0;

    // Function to set the scanlator
    function redirectToPreferredScanlator() {
        const scanlatorSelector = document.querySelector("#__next > main > div.padding-safe-left > div.flex.flex-col.xl\\:flex-row-reverse.justify-between.\\35 xl\\:justify-center.relative > div.sticky.p-1.md\\:p-3.w-full.\\!bg-opacity-80.right-0.bg-gray-200.dark\\:bg-gray-700.text-sm.md\\:text-base.padding-safe-top.z-10.ransition-all.duration-700.ease-in-out.top-0 > div.max-md\\:grid.max-md\\:grid-cols-3.md\\:flex.mt-2.md\\:mt-3.items-center > div > select")

        // Check if the selector exists and if any whitelisted scanlators are available
        if (scanlatorSelector && isWhitelistedScanlatorAvailable(scanlatorSelector)) {
            const options = Array.from(scanlatorSelector.options);

            // Find the first matching preferred scanlator
            const match = options.find(option =>
                preferredScanlators.some(regex => regex.test(option.textContent.trim()))
            );

            if (match) {
                const currentUrl = new URL(window.location.href);
                const currentPathParts = currentUrl.pathname.split('/');

                // Extract the current scanlator ID from the last part of the URL (before the first '-')
                const currentScanlatorId = currentPathParts[currentPathParts.length - 1].split('-')[0];

                // Check if the current ID matches the preferred scanlator's ID
                if (currentScanlatorId !== match.value) {
                    // Replace the scanlator ID in the URL
                    currentPathParts[currentPathParts.length - 1] = `${match.value}-${currentPathParts[currentPathParts.length - 1].split('-').slice(1).join('-')}`;
                    const newUrl = `${currentUrl.origin}${currentPathParts.join('/')}`;

                    // Redirect to the new URL with the preferred scanlator
                    window.location.href = newUrl;
                }
            }
        }
    }

    // Function to check if the URL has changed dynamically and handle it
    function monitorUrlChanges() {
        let lastUrl = window.location.href;

        setInterval(() => {
            const currentUrl = window.location.href;

            // Only trigger a redirect if the URL has changed and it's a valid chapter page
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;

                // Only redirect if a whitelisted scanlator is available
                redirectToPreferredScanlator();
            }
        }, 1000); // Check every 1 second (you can adjust this interval as needed)
    }

    // Initialize the script
    window.addEventListener('load', () => {
        // Check if there are any whitelisted scanlators and redirect if necessary
        redirectToPreferredScanlator();
        monitorUrlChanges(); // Start monitoring URL changes
    });
})();
