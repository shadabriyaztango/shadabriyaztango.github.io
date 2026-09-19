(function () {
  'use strict';

  /* ---------------------------------------------
     AREAS — real Bangalore coordinates
     --------------------------------------------- */

  var AREAS = [
    { name: 'Koramangala',     lat: 12.9352, lng: 77.6245 },
    { name: 'Indiranagar',     lat: 12.9784, lng: 77.6408 },
    { name: 'HSR Layout',      lat: 12.9116, lng: 77.6474 },
    { name: 'MG Road',         lat: 12.9758, lng: 77.6096 },
    { name: 'Whitefield',      lat: 12.9698, lng: 77.7500 },
    { name: 'Jayanagar',       lat: 12.9250, lng: 77.5938 },
    { name: 'JP Nagar',        lat: 12.9063, lng: 77.5857 },
    { name: 'BTM Layout',      lat: 12.9166, lng: 77.6101 },
    { name: 'Electronic City', lat: 12.8452, lng: 77.6602 },
    { name: 'Marathahalli',    lat: 12.9591, lng: 77.6974 },
    { name: 'Bellandur',       lat: 12.9260, lng: 77.6762 },
    { name: 'Sarjapur Road',   lat: 12.9010, lng: 77.6870 },
    { name: 'Domlur',          lat: 12.9610, lng: 77.6387 },
    { name: 'Ulsoor',          lat: 12.9816, lng: 77.6206 },
    { name: 'Malleshwaram',    lat: 13.0035, lng: 77.5709 },
    { name: 'Rajajinagar',     lat: 12.9916, lng: 77.5551 },
    { name: 'Basavanagudi',    lat: 12.9422, lng: 77.5735 },
    { name: 'Banashankari',    lat: 12.9255, lng: 77.5468 },
    { name: 'Hebbal',          lat: 13.0358, lng: 77.5970 },
    { name: 'Yelahanka',       lat: 13.1007, lng: 77.5963 },
    { name: 'Vijayanagar',     lat: 12.9719, lng: 77.5300 },
    { name: 'Majestic',        lat: 12.9767, lng: 77.5713 },
    { name: 'Cubbon Park',     lat: 12.9763, lng: 77.5929 },
    { name: 'Lalbagh',         lat: 12.9507, lng: 77.5848 },
    { name: 'Kempegowda Airport', lat: 13.1986, lng: 77.7066 }
  ];

  var STORE = {
    defaultPin: 'pin.default',
    drift: 'pin.drift',
    caption: 'pin.caption',
    phone: 'pin.phone'
  };

  /* ---------------------------------------------
     STATE
     --------------------------------------------- */

  // base = the chosen spot. sent = base + drift, and is exactly what gets sent.
  var base = AREAS[0];
  var sent = { lat: base.lat, lng: base.lng };
  var drift = 200;

  /* ---------------------------------------------
     HELPERS
     --------------------------------------------- */

  function $(id) { return document.getElementById(id); }

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  // Uniform random point inside a disc of `radius` metres.
  function applyDrift(lat, lng, radius) {
    if (!radius) return { lat: lat, lng: lng };

    var r = radius * Math.sqrt(Math.random());
    var theta = 2 * Math.PI * Math.random();
    var metresPerDegLat = 111320;
    var metresPerDegLng = 111320 * Math.cos(lat * Math.PI / 180);

    return {
      lat: lat + (r * Math.cos(theta)) / metresPerDegLat,
      lng: lng + (r * Math.sin(theta)) / metresPerDegLng
    };
  }

  function fmt(n) { return n.toFixed(6); }

  function mapsUrl() {
    return 'https://maps.google.com/?q=' + fmt(sent.lat) + ',' + fmt(sent.lng);
  }

  function messageText() {
    var caption = $('caption').value.trim();
    return caption ? caption + ' ' + mapsUrl() : mapsUrl();
  }

  function whatsappUrl() {
    var phone = $('phone').value.replace(/\D/g, '');
    var text = encodeURIComponent(messageText());
    return phone
      ? 'https://wa.me/' + phone + '?text=' + text
      : 'https://wa.me/?text=' + text;
  }

  var toastTimer;

  function toast(msg) {
    var el = $('toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 2600);
  }

  /* ---------------------------------------------
     RENDER
     --------------------------------------------- */

  function render() {
    $('pin-name').textContent = base.name;
    $('pin-coords').textContent = fmt(sent.lat) + ', ' + fmt(sent.lng);
    $('lat-input').value = fmt(sent.lat);
    $('lng-input').value = fmt(sent.lng);
    $('preview').textContent = messageText();

    Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (chip) {
      chip.setAttribute('aria-pressed', String(chip.dataset.name === base.name));
    });

    moveMarker();
  }

  // Re-rolls the drift around the current base, then redraws.
  function reroll() {
    sent = applyDrift(base.lat, base.lng, drift);
    render();
  }

  function setBase(area) {
    base = area;
    reroll();
  }

  /* ---------------------------------------------
     MAP — a small self-contained slippy map.
     No library: OSM raster tiles positioned by
     Web Mercator maths.
     --------------------------------------------- */

  var MapView = (function () {
    var TILE = 256;
    var MIN_Z = 9;
    var MAX_Z = 18;

    var el, layer, markerEl;
    var z = 14;
    var cLat = 0, cLng = 0;        // viewport centre
    var mLat = 0, mLng = 0;        // marker position
    var w = 0, h = 0;
    var tiles = {};
    var onPick = null;
    var ready = false;

    /* ---- Web Mercator ---- */

    function scale() { return Math.pow(2, z); }

    function lngToX(lng) { return (lng + 180) / 360 * scale(); }

    function latToY(lat) {
      var s = Math.sin(lat * Math.PI / 180);
      return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * scale();
    }

    function xToLng(x) { return x / scale() * 360 - 180; }

    function yToLat(y) {
      var n = Math.PI - 2 * Math.PI * y / scale();
      return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    }

    // Top-left corner of the viewport, in world pixels.
    function originX() { return lngToX(cLng) * TILE - w / 2; }
    function originY() { return latToY(cLat) * TILE - h / 2; }

    /* ---- drawing ---- */

    function measure() {
      w = el.clientWidth;
      h = el.clientHeight;
    }

    function draw() {
      if (!ready || !w || !h) return;

      var ox = originX();
      var oy = originY();
      var n = scale();

      var x0 = Math.floor(ox / TILE);
      var x1 = Math.floor((ox + w) / TILE);
      var y0 = Math.floor(oy / TILE);
      var y1 = Math.floor((oy + h) / TILE);

      var seen = {};

      for (var ty = y0; ty <= y1; ty++) {
        if (ty < 0 || ty >= n) continue;

        for (var tx = x0; tx <= x1; tx++) {
          var wrapped = ((tx % n) + n) % n;   // wrap across the date line
          var key = z + ':' + wrapped + ':' + ty + ':' + tx;
          seen[key] = true;

          var img = tiles[key];
          if (!img) {
            img = document.createElement('img');
            img.className = 'map__tile';
            img.alt = '';
            img.decoding = 'async';
            img.onerror = function () { this.style.visibility = 'hidden'; };
            img.src = 'https://tile.openstreetmap.org/' + z + '/' + wrapped + '/' + ty + '.png';
            layer.appendChild(img);
            tiles[key] = img;
          }

          img.style.transform =
            'translate(' + (tx * TILE - ox) + 'px,' + (ty * TILE - oy) + 'px)';
        }
      }

      Object.keys(tiles).forEach(function (key) {
        if (!seen[key]) {
          layer.removeChild(tiles[key]);
          delete tiles[key];
        }
      });

      markerEl.style.transform =
        'translate(' + (lngToX(mLng) * TILE - ox) + 'px,' + (latToY(mLat) * TILE - oy) + 'px)';
    }

    /* ---- interaction ---- */

    function bind() {
      var dragging = false;
      var travelled = 0;
      var lastX = 0, lastY = 0;
      var pointerId = null;

      el.addEventListener('pointerdown', function (e) {
        if (e.target.closest('.map__zoom, .map__attr')) return;
        dragging = true;
        travelled = 0;
        lastX = e.clientX;
        lastY = e.clientY;
        pointerId = e.pointerId;
        el.setPointerCapture(pointerId);
        el.classList.add('is-dragging');
      });

      el.addEventListener('pointermove', function (e) {
        if (!dragging) return;

        var dx = e.clientX - lastX;
        var dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        travelled += Math.abs(dx) + Math.abs(dy);

        var ox = originX() - dx;
        var oy = originY() - dy;
        cLng = xToLng((ox + w / 2) / TILE);
        cLat = clampLat(yToLat((oy + h / 2) / TILE));
        draw();
      });

      function release(e) {
        if (!dragging) return;
        dragging = false;
        el.classList.remove('is-dragging');
        if (pointerId !== null) {
          try { el.releasePointerCapture(pointerId); } catch (err) {}
          pointerId = null;
        }
        // A short press is a tap, not a drag — drop the pin there.
        if (travelled < 6 && onPick) {
          // Measure against the tile layer, not the map box: the map has a
          // border, so its rect starts 1.5px above where the tiles do.
          var rect = layer.getBoundingClientRect();
          var lat = yToLat((originY() + (e.clientY - rect.top)) / TILE);
          var lng = xToLng((originX() + (e.clientX - rect.left)) / TILE);
          onPick(lat, lng);
        }
      }

      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', function () {
        dragging = false;
        el.classList.remove('is-dragging');
      });

      $('zoom-in').addEventListener('click', function () { zoomBy(1); });
      $('zoom-out').addEventListener('click', function () { zoomBy(-1); });

      window.addEventListener('resize', function () { measure(); draw(); });
    }

    function clampLat(lat) { return Math.max(-85, Math.min(85, lat)); }

    function zoomBy(delta) {
      var next = Math.max(MIN_Z, Math.min(MAX_Z, z + delta));
      if (next === z) return;
      z = next;
      draw();
    }

    /* ---- public ---- */

    return {
      init: function (lat, lng, pick) {
        el = $('map');
        layer = $('map-layer');
        markerEl = $('map-marker');
        if (!el || !layer || !markerEl) return;

        onPick = pick;
        mLat = cLat = lat;
        mLng = cLng = lng;
        ready = true;

        measure();
        bind();
        draw();
      },

      // Move the marker, keeping it in view.
      setMarker: function (lat, lng) {
        mLat = lat;
        mLng = lng;
        cLat = clampLat(lat);
        cLng = lng;
        draw();
      },

      setZoom: function (value) {
        z = Math.max(MIN_Z, Math.min(MAX_Z, value));
        draw();
      }
    };
  })();

  function moveMarker() {
    MapView.setMarker(sent.lat, sent.lng);
  }

  /* ---------------------------------------------
     BUILD CHIPS
     --------------------------------------------- */

  (function buildChips() {
    var wrap = $('chips');
    var frag = document.createDocumentFragment();

    AREAS.forEach(function (area) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = area.name;
      chip.dataset.name = area.name;
      chip.setAttribute('aria-pressed', 'false');
      chip.addEventListener('click', function () { setBase(area); });
      frag.appendChild(chip);
    });

    var random = document.createElement('button');
    random.type = 'button';
    random.className = 'chip';
    random.textContent = '✦ Surprise me';
    random.addEventListener('click', function () {
      setBase(AREAS[Math.floor(Math.random() * AREAS.length)]);
    });
    frag.appendChild(random);

    wrap.appendChild(frag);
  })();

  /* ---------------------------------------------
     RESTORE SAVED PREFERENCES
     --------------------------------------------- */

  (function restore() {
    var savedDrift = read(STORE.drift);
    if (savedDrift !== null && !isNaN(parseInt(savedDrift, 10))) {
      drift = parseInt(savedDrift, 10);
    }

    Array.prototype.forEach.call(document.querySelectorAll('#drift button'), function (btn) {
      btn.setAttribute('aria-checked', String(parseInt(btn.dataset.drift, 10) === drift));
    });

    var caption = read(STORE.caption);
    if (caption) $('caption').value = caption;

    var phone = read(STORE.phone);
    if (phone) $('phone').value = phone;

    var saved = read(STORE.defaultPin);
    if (saved) {
      try {
        var pin = JSON.parse(saved);
        if (typeof pin.lat === 'number' && typeof pin.lng === 'number') {
          base = { name: pin.name || 'My default', lat: pin.lat, lng: pin.lng };
          $('default-note').textContent = 'Default pin: ' + base.name;
        }
      } catch (e) {}
    }
  })();

  /* ---------------------------------------------
     EVENTS
     --------------------------------------------- */

  $('nudge').addEventListener('click', reroll);

  document.querySelectorAll('#drift button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      drift = parseInt(btn.dataset.drift, 10);
      write(STORE.drift, String(drift));
      document.querySelectorAll('#drift button').forEach(function (other) {
        other.setAttribute('aria-checked', String(other === btn));
      });
      reroll();
    });
  });

  $('apply-coords').addEventListener('click', function () {
    var lat = parseFloat($('lat-input').value);
    var lng = parseFloat($('lng-input').value);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast('Those coordinates don’t look right');
      return;
    }

    base = { name: 'Custom pin', lat: lat, lng: lng };
    sent = { lat: lat, lng: lng };
    render();
    MapView.setZoom(14);
    toast('Pin moved');
  });

  $('save-default').addEventListener('click', function () {
    write(STORE.defaultPin, JSON.stringify(base));
    $('default-note').textContent = 'Default pin: ' + base.name;
    toast('Saved — opens here next time');
  });

  $('caption').addEventListener('input', function () {
    write(STORE.caption, $('caption').value);
    $('preview').textContent = messageText();
  });

  $('phone').addEventListener('input', function () {
    write(STORE.phone, $('phone').value);
  });

  $('send').addEventListener('click', function () {
    var url = whatsappUrl();
    var win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
  });

  $('copy').addEventListener('click', function () {
    var text = messageText();

    function fallbackCopy() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast('Copied'); }
      catch (e) { toast('Copy failed — select it manually'); }
      document.body.removeChild(ta);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(function () { toast('Copied'); })
        .catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

  /* ---- THEME TOGGLE (shares the portfolio's stored preference) ---- */

  var root = document.documentElement;
  var themeToggle = $('theme-toggle');

  function updateLabel() {
    themeToggle.textContent = root.getAttribute('data-theme') === 'dark' ? 'LIGHT' : 'DARK';
  }

  themeToggle.addEventListener('click', function () {
    if (root.getAttribute('data-theme') === 'dark') {
      root.removeAttribute('data-theme');
      write('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      write('theme', 'dark');
    }
    updateLabel();
  });

  updateLabel();

  /* ---------------------------------------------
     GO
     --------------------------------------------- */

  reroll();

  MapView.init(sent.lat, sent.lng, function (lat, lng) {
    // A hand-placed pin is already exact — don't drift it away from the tap.
    base = { name: 'Custom pin', lat: lat, lng: lng };
    sent = { lat: lat, lng: lng };
    render();
  });

})();
