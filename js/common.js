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

  return { byPath: byPath, bindStatics: bindStatics, fetchJSON: fetchJSON, markCurrentNav: markCurrentNav };
})();
