import { useEffect, useState } from "react"
import { Rating } from "react-simple-star-rating"

// Swiper
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay, FreeMode, Pagination } from "swiper/modules"

// API
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

// CSS
import "../../App.css"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (data?.success) {
          setReviews(data.data)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }

    fetchReviews()
  }, [])

  return (
    <div className="text-white">
      <div className="my-[50px] max-w-maxContent mx-auto px-4">
        <Swiper
          slidesPerView={4}
          spaceBetween={25}
          loop
          freeMode
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination, Autoplay]}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="flex h-full flex-col gap-3 rounded-lg bg-richblack-800 p-4 text-[14px] text-richblack-25">

                {/* User */}
                <div className="flex items-center gap-4">
                
                  <img
                    src={
                      review?.user?.AdditionalDetails?.Image ||
                      `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.FirstName} ${review?.user?.LastName}`
                    }
                    alt="user"
                    className="h-9 w-9 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold text-richblack-5">
                      {review?.user?.FirstName} {review?.user?.LastName}
                    </p>
                    <p className="text-xs text-richblack-400">
                      {review?.course?.courseName}
                    </p>
                  </div>
                </div>

                {/* Review */}
                <p className="text-richblack-25">
                  {review?.review?.split(" ").length > truncateWords
                    ? review.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ") + " ..."
                    : review.review}
                </p>

                {/* Rating */}
                <div className="mt-auto flex items-center gap-3">
                  <span className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </span>

                  <Rating
                      readonly
                      size={18}
                      initialValue={review.rating}
                      allowFraction
                      fillColor="#FFD700"
                      emptyColor="#6B7280"
                      SVGstyle={{ display: "inline" }}
                    />

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
