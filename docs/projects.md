---
layout: page
title: Who's using QUnit?
---

<p class="lead">These organizations and open-source projects use QUnit to keep their code in check.</p>

## Organizations

<div class="grid grid--small">
{% assign entries = site.data.projects.orgs | sort_natural: "name" -%}
{%- for entry in entries -%}
<section markdown="1">
### [{{ entry.name }}]({{ entry.href }})
{%- for sub in entry.sub %}
[{{ sub.name }}]({{ sub.href }}){% if entry.sub.last != sub %}, {% endif %}
{%- endfor %}
</section>
{% endfor %}
</div>
<hr>

## Projects

<div class="grid grid--small">
{% assign entries = site.data.projects.projects | sort_natural: "name" -%}
{%- for entry in entries -%}
<section markdown="1">
### [{{ entry.name }}]({{ entry.href }})
{%- for sub in entry.sub %}
[{{ sub.name }}]({{ sub.href }}){% if entry.sub.last != sub %}, {% endif %}
{%- endfor %}
</section>
{% endfor %}
</div>
