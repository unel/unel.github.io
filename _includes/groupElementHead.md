{{ include.element.title }} {% if include.element.level %}/{% for i in (1..include.element.level) %}+{% endfor %}/{% endif %} {% if include.element.description %}({{ include.element.description }}){% endif %}