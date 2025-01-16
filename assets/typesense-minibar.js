/*! https://github.com/jquery/typesense-minibar 1.3.4 */
globalThis.tsminibar = function tsminibar (form, dataset = form.dataset) {
  const cache = new Map();
  const state = { query: '', cursor: -1, open: false, hits: [] };
  const searchParams = new URLSearchParams({
    per_page: '5',
    query_by: 'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,hierarchy.lvl4,hierarchy.lvl5,content',
    include_fields: 'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,hierarchy.lvl4,hierarchy.lvl5,content,url_without_anchor,url,id',
    highlight_full_fields: 'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,hierarchy.lvl4,hierarchy.lvl5,content',
    group_by: 'url_without_anchor',
    group_limit: '1',
    sort_by: 'item_priority:desc',
    snippet_threshold: '8',
    highlight_affix_num_tokens: '12',
    'x-typesense-api-key': dataset.key,
    ...Object.fromEntries(new URLSearchParams(dataset.searchParams))
  });
  const noResults = dataset.noResults || "No results for '{}'.";

  const input = form.querySelector('input[type=search]');
  const listbox = document.createElement('div');
  listbox.setAttribute('role', 'listbox');
  listbox.hidden = true;
  input.after(listbox);

  let preconnect = null;
  input.addEventListener('focus', function () {
    if (!preconnect) {
      preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.crossOrigin = 'anonymous'; // match fetch cors,credentials:omit
      preconnect.href = dataset.origin;
      document.head.append(preconnect);
    }
    if (!state.open && state.hits.length) {
      state.open = true;
      render();
    }
  });
  input.addEventListener('input', async function () {
    const query = state.query = input.value;
    if (!query) {
      state.hits = [];
      return close();
    }
    const hits = await search(query);
    if (state.query === query) { // ignore non-current query
      state.hits = hits;
      state.cursor = -1;
      state.open = true;
      render();
    }
  });
  input.addEventListener('click', function () {
    if (!state.open && state.hits.length) {
      state.open = true;
      render();
    }
  });
  input.addEventListener('keydown', function (e) {
    if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      if (e.code === 'ArrowDown') moveCursor(1);
      if (e.code === 'ArrowUp') moveCursor(-1);
      if (e.code === 'Escape') {
        close();
        input.blur();
      }
      if (e.code === 'Enter') {
        const url = state.hits[state.cursor]?.url;
        if (url) location.href = url;
      }
    }
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });
  form.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 12 12" width="20" height="20" aria-hidden="true" tabindex="-1" class="tsmb-icon-close"><path d="M9 3L3 9M3 3L9 9"/></svg>');
  form.querySelector('.tsmb-icon-close').addEventListener('click', function () {
    input.value = '';
    state.hits = [];
    close();
    input.focus();
  });
  connect();

  function close () {
    if (state.open) {
      state.cursor = -1;
      state.open = false;
      render();
    }
  }

  function connect () {
    document.addEventListener('click', onDocClick);
    if (dataset.slash !== 'false') {
      document.addEventListener('keydown', onDocSlash);
      form.classList.add('tsmb-form--slash');
    }
  }

  function disconnect () {
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onDocSlash);
  }

  function onDocClick (e) {
    if (!form.contains(e.target)) close();
  }

  function onDocSlash (e) {
    if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName)) {
      input.focus();
      e.preventDefault();
    }
  }

  async function search (query) {
    let lvl0;
    let hits = cache.get(query);
    if (hits) {
      cache.delete(query);
      cache.set(query, hits);
      return hits;
    }
    searchParams.set('q', query);
    const resp = await fetch(
      `${dataset.origin}/collections/${dataset.collection}/documents/search?` + searchParams,
      { mode: 'cors', credentials: 'omit', method: 'GET' }
    );
    const group = !!dataset.group;
    const data = await resp.json();
    hits = data?.grouped_hits?.map(ghit => {
      const hit = ghit.hits[0];
      return {
        lvl0: group && lvl0 !== hit.document.hierarchy.lvl0 && (lvl0 = hit.document.hierarchy.lvl0),
        title: [!group && hit.document.hierarchy.lvl0, hit.document.hierarchy.lvl1, hit.document.hierarchy.lvl2, hit.document.hierarchy.lvl3, hit.document.hierarchy.lvl4, hit.document.hierarchy.lvl5].filter(lvl => !!lvl).join(' › ') || hit.document.hierarchy.lvl0,
        url: hit.document.url,
        content: hit.highlights[0]?.snippet || hit.document.content || ''
      };
    }) || [];
    cache.set(query, hits);
    if (cache.size > 100) {
      cache.delete(cache.keys().next().value);
    }
    return hits;
  }

  function escape (s) {
    return s.replace(/['"<>&]/g, c => ({ "'": '&#039;', '"': '&quot;', '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
  }

  function render () {
    listbox.hidden = !state.open;
    form.classList.toggle('tsmb-form--open', state.open);
    listbox.innerHTML = (state.hits.map((hit, i) => `<div role="option"${i === state.cursor ? ' aria-selected="true"' : ''}>${hit.lvl0 ? `<div class="tsmb-suggestion_group">${hit.lvl0}</div>` : ''}<a href="${hit.url}" tabindex="-1"><div class="tsmb-suggestion_title">${hit.title}</div><div class="tsmb-suggestion_content">${hit.content}</div></a></div>`).join('') || `<div class="tsmb-empty">${noResults.replace('{}', escape(state.query))}</div>`) + (dataset.foot ? '<a href="https://typesense.org" class="tsmb-foot" title="Search by Typesense"></a>' : '');
  }

  function moveCursor (offset) {
    state.cursor += offset;
    if (state.cursor >= state.hits.length) state.cursor = -1;
    if (state.cursor < -1) state.cursor = state.hits.length - 1;
    render();
  }

  return { form, connect, disconnect };
};
window.customElements.define('typesense-minibar', class extends HTMLElement {
  connectedCallback () {
    const form = this.querySelector('form');
    if (form && this.dataset.origin) tsminibar(form, this.dataset);
  }
});
document.querySelectorAll('.tsmb-form[data-origin]').forEach(form => tsminibar(form));
