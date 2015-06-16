---
layout: default
---
just a web developer 
{% for group in site.data.info %}
## {{ group.title }}
{% for element in group.elements %}
{% include groupElement.md element=element %}{% endfor %}
{% endfor %}
