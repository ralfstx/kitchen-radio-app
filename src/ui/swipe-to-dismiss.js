
export function enableSwipe(target) {
  target.on('pan:horizontal', handlePan);
}

function handlePan(event) {
  let {target, state, translationX} = event;
  target.transform = {translationX};
  if (state === 'end') {
    handlePanFinished(event);
  }
}

function handlePanFinished(event) {
  let {target, velocityX, translationX} = event;
  let beyondCenter = Math.abs(translationX) > target.bounds.width / 2;
  let fling = Math.abs(velocityX) > 200;
  let sameDirection = Math.sign(velocityX) === Math.sign(translationX);
  // When swiped beyond the center, trigger dismiss if flinged in the same direction or let go.
  // Otherwise, detect a dismiss only if flinged in the same direction.
  let dismiss = beyondCenter ? sameDirection || !fling : sameDirection && fling;
  if (dismiss) {
    animateDismiss(event);
  } else {
    animateCancel(event);
  }
}

function animateDismiss({target, translationX}) {
  let bounds = target.bounds;
  target.animate({
    transform: {translationX: Math.sign(translationX) * bounds.width}
  }, {
    duration: 200,
    easing: 'ease-out'
  }).then(() => target.trigger('dismiss'));
}

function animateCancel({target}) {
  target.animate({transform: {}}, {duration: 200, easing: 'ease-out'});
}
