---
layout: page
title: Plugins
redirect_from:
  - "/addons/"
---

<p class="lead">Plugins can extend, enhance, and modify QUnit itself; as well as the developer experience of using QUnit.</p>

<ul id="plugins" class="grid grid--split">
  {% assign _plugins = site.data.plugins | sort: "date" | reverse -%}
  {%- for plugin in _plugins -%}
    <li class="plugin">
      <h3><a href="https://npmjs.com/package/{{ plugin.name }}" target="_blank" rel="noopener noreferrer">{{ plugin.name }}</a></h3>
      <p>{{ plugin.description }}</p>
    </li>
  {% endfor %}
</ul>

Plugins are sometimes known as QUnit addons.

_Note: This list is automatically generated from npm packages using the [**qunit-plugin** keyword](https://www.npmjs.com/search?q=keywords:qunit-plugin)._
