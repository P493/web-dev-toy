// ==UserScript==
// @name         simple-script-patcher
// @namespace    web-dev-toy
// @version      0.1
// @description  try to take over the world!
// @author       page
// @run-at document-start
// @match        https://example.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function patchScript({ srcPattern, replacer }) {
        new MutationObserver(async function callback(mutations, observer) {
            const targetScript = Array.from(document.querySelectorAll('script')).find(e => e.src.match(srcPattern));
            if (!targetScript) {
                return;
            }

            console.log(`matched script`, targetScript.src, targetScript, mutations);
            observer.disconnect();

            targetScript.parentNode.removeChild(targetScript);

            const originalText = await fetch(targetScript.src).then(r => r.text());
            const patchedScript = document.createElement('script');
            patchedScript.className = 'nice-patch';
            patchedScript.textContent = replacer(originalText);
            document.head.appendChild(patchedScript);

        }).observe(document, { childList: true, subtree: true });
    }

    // !!! example
    patchScript({
        srcPattern: /main_\w+\.js$/,
        replacer: function (text) {
            return text.replace(/if\s*\(\w+\.isLogin\)/g, 'if (true)');
        }
    });
})();
