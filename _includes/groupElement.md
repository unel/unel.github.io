- {% include groupElementHead.md element=include.element %}{% for subElement in include.element.sub-elements %}
  {% include groupElement.md element=subElement %}{% endfor %}