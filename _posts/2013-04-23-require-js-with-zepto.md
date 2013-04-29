---
layout: post
title: Conditional loading with require.js
excerpt: For my current mobile-first project, and I wanted to use jQuery 2.0 by default, but fallback to jQuery 1.9.1 when the site is loaded in IE9 or lower.
---

####WHAT
For my current mobile-first project, and I wanted to use jQuery 2.0 by default, but fallback to jQuery 1.9.1 when the site is loaded in IE9 or lower. I wanted to use require.js as a script loader / pseudo-IoC container to make the site as composable and performant as possible. I had everything humming along fine, exept there was one snag. I couldn't figure out to conditionally load different versions of a script.

####WHY
The reason I need to do this is because the site content is managed with a browser-based CMS that allows viewing the site pages as you're editing content. Since the site content will be administered by content admins who are undoubtedly using some version of IE.

As you've probably read, jQuery 2.xx drops support for IE9 and lower. This is a good thing -- I want to send the smaller jQuery 2.0 file to portable devices that use cellular networks for data due to the inherent latency in said networks. Additionally, given the known mobile browser cache size limits, I wanted to be more confident that the jQuery script would be cached by the mobile browser.

####HOW
Figuring out how to do this wasn't straightforward for me, but I finally got it. Here's how I did it:

<script src="https://gist.github.com/askesian/6e05daa443ca1955ea32.js"></script>

Now, I am in no way claiming that this is the best or only way. This is my way, and it works beautifully.
