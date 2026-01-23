export default function GetAvgRating(ratingArr = []) {
  if (!Array.isArray(ratingArr) || ratingArr.length === 0) return 0

  const ratings = ratingArr
    .map((item) => Number(item.rating)) // convert string → number
    .filter((rating) => !isNaN(rating) && rating > 0)

  if (ratings.length === 0) return 0

  const total = ratings.reduce((sum, rating) => sum + rating, 0)

  return Math.round((total / ratings.length) * 10) / 10
}
