// Shared helpers used by every page. Loaded before each page's own inline script.
window.RHC = (function () {
  function byPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return (o || {})[k]; }, obj);
  }

  function bindStatics(root, data) {
    root.querySelectorAll('[data-bind]').forEach(function (el) {
      var v = byPath(data, el.getAttribute('data-bind'));
      if (v != null) el.textContent = v;
    });
    root.querySelectorAll('[data-bind-href]').forEach(function (el) {
      var v = byPath(data, el.getAttribute('data-bind-href'));
      if (v != null) el.setAttribute('href', v);
    });
  }

  function fetchJSON(path) {
    return fetch(path).then(function (r) {
      if (!r.ok) throw new Error('Failed to load ' + path + ' (' + r.status + ')');
      return r.json();
    });
  }

  // Marks the nav link matching the current page with a "current" class.
  function markCurrentNav(pageKey) {
    document.querySelectorAll('.nav-links a[data-page]').forEach(function (a) {
      a.classList.toggle('current', a.getAttribute('data-page') === pageKey);
    });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // A nav item's "key" (for current-page highlighting) is derived from its
  // URL rather than stored separately in the CMS: the part after "#" for
  // an anchor link, otherwise the filename without ".html". This exactly
  // reproduces the data-page values every page already used.
  function deriveNavKey(url) {
    var hashIndex = url.indexOf('#');
    if (hashIndex !== -1) return url.slice(hashIndex + 1);
    var file = url.split('/').pop();
    return file.replace(/\.html$/, '');
  }

  // Renders the main nav (content/navigation.json) into the .nav-links
  // element every page already has, highlighting whichever item matches
  // currentKey (the value each page already passed to markCurrentNav).
  function renderNav(items, currentKey) {
    var el = document.querySelector('.nav-links');
    if (!el) return;
    el.innerHTML = (items || [])
      .filter(function (item) { return item.visible !== false; })
      .map(function (item) {
        var key = deriveNavKey(item.url);
        var currentAttr = key === currentKey ? ' class="current"' : '';
        return (
          '<a href="' + escapeHtml(item.url) + '" data-page="' + escapeHtml(key) + '"' + currentAttr + '>' +
            escapeHtml(item.label) +
          '</a>'
        );
      })
      .join('');
  }

  // Renders the footer "Explore" list from the same navigation data, only
  // real pages (no "#" anchors), matching the original hardcoded footer.
  function renderFooterNav(items) {
    var el = document.getElementById('footer-explore-list');
    if (!el) return;
    el.innerHTML = (items || [])
      .filter(function (item) { return item.visible !== false && item.url.indexOf('#') === -1; })
      .map(function (item) {
        return '<li><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.label) + '</a></li>';
      })
      .join('');
  }

  return {
    byPath: byPath,
    bindStatics: bindStatics,
    fetchJSON: fetchJSON,
    markCurrentNav: markCurrentNav,
    renderNav: renderNav,
    renderFooterNav: renderFooterNav
  };
})();
