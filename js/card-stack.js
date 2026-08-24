(function () {
  var stack = document.querySelector('[data-card-stack]');
  var rotateBtn = document.querySelector('[data-card-stack-rotate]');
  if (!stack) return;

  var cards = Array.prototype.slice.call(stack.querySelectorAll('.card-stack__card'));
  if (!cards.length) return;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Snapshot of each card's original {top, left, rot} preset, in DOM order.
  var presets = cards.map(function (card) {
    return {
      top: card.style.getPropertyValue('--top'),
      left: card.style.getPropertyValue('--left'),
      rot: card.style.getPropertyValue('--rot')
    };
  });

  function applyPreset(card, preset) {
    card.style.setProperty('--top', preset.top);
    card.style.setProperty('--left', preset.left);
    card.style.setProperty('--rot', preset.rot);
  }

  function withoutTransition(card, fn) {
    var prev = card.style.transition;
    card.style.transition = 'none';
    fn();
    // Force reflow so the "none" transition actually takes effect before restoring.
    void card.offsetWidth;
    card.style.transition = prev;
  }

  if (rotateBtn) {
    rotateBtn.addEventListener('click', function () {
      presets.push(presets.shift());
      cards.forEach(function (card, i) {
        if (reduceMotionQuery.matches) {
          withoutTransition(card, function () { applyPreset(card, presets[i]); });
        } else {
          applyPreset(card, presets[i]);
        }
      });
      rotateBtn.classList.add('is-spinning');
      window.setTimeout(function () { rotateBtn.classList.remove('is-spinning'); }, 400);
    });
  }

  cards.forEach(function (card, index) {
    var dragState = null;

    card.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      var rect = stack.getBoundingClientRect();
      var cardRect = card.getBoundingClientRect();
      dragState = {
        pointerId: e.pointerId,
        offsetX: e.clientX - cardRect.left,
        offsetY: e.clientY - cardRect.top,
        stackRect: rect
      };
      card.setPointerCapture(e.pointerId);
      card.classList.add('is-dragging');
    });

    card.addEventListener('pointermove', function (e) {
      if (!dragState || dragState.pointerId !== e.pointerId) return;
      var stackRect = dragState.stackRect;
      var cardW = card.offsetWidth;
      var cardH = card.offsetHeight;

      var x = e.clientX - stackRect.left - dragState.offsetX;
      var y = e.clientY - stackRect.top - dragState.offsetY;

      // Clamp so the card stays reachable within the stack's bounding area,
      // with generous slack so it still feels free to drag.
      var minX = -cardW * 0.6;
      var maxX = stackRect.width - cardW * 0.4;
      var minY = -cardH * 0.6;
      var maxY = stackRect.height - cardH * 0.4;
      x = Math.max(minX, Math.min(maxX, x));
      y = Math.max(minY, Math.min(maxY, y));

      var leftPct = (x / stackRect.width) * 100;
      var topPct = (y / stackRect.height) * 100;

      card.style.setProperty('--left', leftPct);
      card.style.setProperty('--top', topPct);
      card.style.setProperty('--rot', '0deg');
    });

    function endDrag(e) {
      if (!dragState || dragState.pointerId !== e.pointerId) return;
      card.releasePointerCapture(e.pointerId);
      card.classList.remove('is-dragging');
      dragState = null;
      var preset = presets[index];
      if (reduceMotionQuery.matches) {
        withoutTransition(card, function () { applyPreset(card, preset); });
      } else {
        applyPreset(card, preset);
      }
    }

    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);
  });
})();
