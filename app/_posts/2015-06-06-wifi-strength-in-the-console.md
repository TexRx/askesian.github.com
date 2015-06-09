---
layout: page
title: Wi-Fi strength graph in the console
show_title: true
---

After learning about [spark](http://zachholman.com/spark/ "Spark repo on Github") by [Zach Holman](https://github.com/holman "Zach Holman Github profile"), and reviewing some of the [examples](https://github.com/holman/spark/wiki/Wicked-Cool-Usage "Examples using Spark"), I wrote up this little [bash helper](https://gist.github.com/askesian/26ee4a76f147d1ee22e1 "View Gist") function for showing wi-fi strength in the console.

```bash
# objective:
# type wifi in the console and get a pretty little graph of your current wifi strength
# usage:
# > wifi
# output:
# ▁▃▅█  59
 
# first install spark
brew install spark
 
# add this alias to your ~/.zshrc file
alias airport='/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/bin/airport'
 
# add this function to your ~/.zshrc (or external function) file
wifi () {
  if [ $(ifconfig en0 | grep UP | wc -l) -eq 1 ]
   then
     _linkQual="`airport -I | grep agrCtlRSSI | cut -d':' -f2 | sed 's/-//g'`"
 
     if [ $_linkQual -gt 52 ] # >75% link qual
     then
       _linkSparked=$(spark 1 2 3 4)
     elif [ $_linkQual -gt 35 ] # >50% link qual
     then
       _linkSparked=$(spark 1 2 3 0)
     elif [ $_linkQual -gt 17 ] # 25% link qual
     then
       _linkSparked=$(spark 1 2 0 0)
     elif [ $_linkQual -gt 7 ] # 25% link qual
     then
       _linkSparked=$(spark 1 0 0 0)
     else # < 25%
       _linkSparked=$(spark 0 0 0 0)
     fi
 
     echo $_linkSparked $_linkQual
   fi
}
```

Credit: [Example](https://github.com/holman/spark/wiki/Wicked-Cool-Usage#wifi-link-quality-cryptix "Wi-Fi link quality Linux example") by [@cryptix](https://github.com/cryptix "Cryptix Github profile")