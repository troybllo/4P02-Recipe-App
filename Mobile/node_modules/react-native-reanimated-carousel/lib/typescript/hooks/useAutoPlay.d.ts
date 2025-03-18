import type { ICarouselController } from "./useCarouselController";
export declare function useAutoPlay(opts: {
    autoPlay?: boolean;
    autoPlayInterval?: number;
    autoPlayReverse?: boolean;
    carouselController: ICarouselController;
}): {
    pause: () => void;
    start: () => void;
};
