---
layout: page
title: Skills
permalink: /skills/
---
{% for group in site.data.skills %}
## {{ group.title }}
{% for element in group.elements %}
{% include groupElement.md element=element %}{% endfor %}
{% endfor %}
