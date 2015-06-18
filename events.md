---
layout: page
title: Events in my life
permalink: /events/
---
{% for event in site.data.events %}
{% include event.md event=event %}
{% endfor %}