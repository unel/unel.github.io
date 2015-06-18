##{{ include.event.title }} ({{ include.event.start-date}} - {{ include.event.end-date }})
{{ include.event.comment }}
{% for impact in include.event.skills-impact %}
- {{ impact.skill }}: {% if impact.delta > 0 %}+{% endif %}{{ impact.delta }}{% if impact.comment %} // {% endif %}{{ impact.comment }}{% endfor %}