import * as React from "react";
export function useAutoPlay(opts) {
  const {
    autoPlay = false,
    autoPlayReverse = false,
    autoPlayInterval,
    carouselController
  } = opts;
  const {
    prev,
    next
  } = carouselController;
  const timer = React.useRef();
  const stopped = React.useRef(!autoPlay);
  const play = React.useCallback(() => {
    if (stopped.current) return;
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      autoPlayReverse ? prev({
        onFinished: play
      }) : next({
        onFinished: play
      });
    }, autoPlayInterval);
  }, [autoPlayReverse, autoPlayInterval, prev, next]);
  const pause = React.useCallback(() => {
    if (!autoPlay) return;
    timer.current && clearTimeout(timer.current);
    stopped.current = true;
  }, [autoPlay]);
  const start = React.useCallback(() => {
    if (!autoPlay) return;
    stopped.current = false;
    play();
  }, [play, autoPlay]);
  React.useEffect(() => {
    if (autoPlay) start();else pause();
    return pause;
  }, [pause, start, autoPlay]);
  return {
    pause,
    start
  };
}
//# sourceMappingURL=useAutoPlay.js.map