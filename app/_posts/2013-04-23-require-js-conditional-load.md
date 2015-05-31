---
layout: post
title: Conditional loading with require.js
excerpt: <p>For one of my mobile-first projects, I wanted to use jQuery 2.x by default, but fallback to jQuery 1.9.x when the site was loaded in IE8 or lower.</p>
---

**UPDATE**:
I am now using [Browserify](http://browserify.org/) and [WebPack](http://webpack.github.io/), which much more easily address the issues described in the original article.
---

For one of my mobile-first projects, I wanted to use jQuery 2.x by default, but fallback to jQuery 1.9.x when the site was loaded in IE8 or lower. I was also using [RequireJS](http://requirejs.org/) as front-end module loader, to make the site as composable and performance-oriented as possible. I had everything humming along fine, except there was one snag -- I couldn't figure out how to conditionally load the correct version of jQuery.

####WHY
The reason I needed to do this was because the site content was managed with a CMS that allowed viewing the site pages while editing the site content. The site content was administered by content admins who are undoubtedly using some older version of IE, so in order for everything to work properly, I had to fall back to jQuery 1.9.x for older IE support.

As you've probably read, jQuery 2.x [discontinued support for IE8 and lower](http://blog.jquery.com/2013/04/18/jquery-2-0-released/). This is a good thing. The jQuery 2.x file size is smaller, which has an obvious positive impact, especially when delivering resources to devices that use cellular networks -- due to the [inherent latency](http://calendar.perfplanet.com/2012/latency-in-mobile-networks-the-missing-link/) in these cellular networks. Additionally, given the relative uncertainty around mobile device [browser cache size limits](http://www.html5rocks.com/en/tutorials/offline/quota-research/), I wanted to be more confident that the smaller jQuery script would always be cached by a mobile browser.

####HOW
Figuring out how to do this wasn't straightforward for me, but I finally got it. Here's how I did it:

<script src="https://gist.github.com/askesian/6e05daa443ca1955ea32.js"></script>

Now, I am in no way claiming that this is the best or only way. This is my way, and it works beautifully.
