export const calculateStarState = (index: number, hoverRating: number, rating: number) => {
  const starValue = index + 1;
  const isActive = starValue <= (hoverRating || rating);
  return { starValue, isActive };
};
