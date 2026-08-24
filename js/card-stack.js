(function () {
  var stack = document.querySelector('[data-card-stack]');
  var rotateBtn = document.querySelector('[data-card-stack-rotate]');
  if (!stack) return;

  var cards = Array.prototype.slice.call(stack.querySelectorAll('.card-stack__card'));
  if (!cards.length) return;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // The slot a promoted (top-of-stack) card animates into: centered, close
  // to flat, and slightly larger so it reads as "the one you're looking at."
  var FRONT_SLOT = { top: 12, left: 24, rot: -2, scale: 1.08 };

  // The four positions used by whichever cards are currently "in the back" of
  // the fan — these are the original decorative layout presets.
  var BACK_SLOTS = [
    { top: 18.42, left: 21.05, rot: -10, scale: 1 },
    { top: 9.21, left: 32.89, rot: 6, scale: 1 },
    { top: 27.63, left: 39.47, rot: -3, scale: 1 },
    { top: 43.42, left: 30.26, rot: -16, scale: 1 }
  ];

  // zOrder holds card indices from bottom of the stack to top. It starts
  // matching DOM order, since that's how the browser paints them by default.
  var zOrder = cards.map(function (_, i) { return i; });

  function applySlot(card, slot) {
    card.style.setProperty('--top', slot.top);
    card.style.setProperty('--left', slot.left);
    card.style.setProperty('--rot', slot.rot + 'deg');
    card.style.setProperty('--scale', slot.scale);
  }

  function withoutTransition(card, fn) {
    var prev = card.style.transition;
    card.style.transition = 'none';
    fn();
    void card.offsetWidth; // force reflow so "none" takes effect first
    card.style.transition = prev;
  }

  // Repaints every card's slot + z-index from the current zOrder. The last
  // entry (top of the stack) gets FRONT_SLOT; everyone else gets a BACK_SLOT
  // based on their position in the stack, which is what makes the rest of
  // the deck visibly reshuffle each time.
  function render(options) {
    var instant = options && options.instant;

    zOrder.forEach(function (cardIndex, position) {
      var card = cards[cardIndex];
      var isTop = position === zOrder.length - 1;
      var slot = isTop ? FRONT_SLOT : BACK_SLOTS[position % BACK_SLOTS.length];
      card.style.setProperty('--z', position + 1);

      if (instant || reduceMotionQuery.matches) {
        withoutTransition(card, function () { applySlot(card, slot); });
      } else {
        applySlot(card, slot);
      }
    });
  }

  // Moves a card to the top of zOrder (removing it from wherever it was).
  function promote(cardIndex) {
    zOrder = zOrder.filter(function (i) { return i !== cardIndex; });
    zOrder.push(cardIndex);
  }

  // Note: the initial fan layout comes straight from the template's inline
  // styles (matching _data/home.yml) so the page's first paint is unchanged.
  // zOrder just needs to start in DOM order to match that default stacking;
  // render() only takes over once the user interacts with the stack.

  if (rotateBtn) {
    rotateBtn.addEventListener('click', function () {
      var bottomCardIndex = zOrder[0];
      promote(bottomCardIndex);
      render();
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
      try { card.setPointerCapture(e.pointerId); } catch (err) { /* capture is best-effort */ }
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
      try { card.releasePointerCapture(e.pointerId); } catch (err) { /* may already be released */ }
      card.classList.remove('is-dragging');
      dragState = null;
      // A released card becomes the new top of the stack and stays there,
      // rather than snapping back to its old spot.
      promote(index);
      render();
    }

    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);
  });
})();
