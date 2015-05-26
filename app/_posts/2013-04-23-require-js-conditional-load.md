---
layout: post
title: Conditional loading with require.js
---

####WHAT
For one of my mobile-first projects, I wanted to use jQuery 2.0 by default, but fallback to jQuery 1.9.1 when the site was loaded in IE9 or lower. I wanted to use require.js as a script loader / pseudo-IoC container to make the site as composable and performant as possible. I had everything humming along fine, exept there was one snag. I couldn't figure out how to conditionally load the correct version of jQuery.

####WHY
The reason I needed to do this was because the site content was managed with a browser-based CMS that allowed viewing the site pages as you would edit content. The site content was administered by content admins who are undoubtedly using some version of IE, so I had to fall back to jQuery pre-2.0 for IE8 support.

As you've probably read, jQuery 2.xx drops support for IE8 and lower. This is a good thing -- I wanted to send the smaller jQuery 2.0 file to modern browsers, and especially portable devices that use cellular networks for data due to the inherent latency in said networks. Additionally, given the relative uncertainty around mobile device browser cache size limits, I wanted to be more confident that the jQuery script would always be cached by the mobile browser.

####HOW
Figuring out how to do this wasn't straightforward for me, but I finally got it. Here's how I did it:

<script src="https://gist.github.com/askesian/6e05daa443ca1955ea32.js"></script>

Now, I am in no way claiming that this is the best or only way. This is my way, and it works beautifully.
