import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { Rating } from "react-simple-star-rating"
import { useSelector } from "react-redux"

import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const [rating, setRating] = useState(0)

  // Initialize form values
  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 0)
  }, [setValue])

  // ⭐ Rating handler 
  const handleRating = (rate) => {
    const normalized = rate // → 1–5
    setRating(normalized)
    setValue("courseRating", normalized, { shouldValidate: true })
  }

  // Submit handler
  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    )
    setReviewModal(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/40 backdrop-blur-sm">
      <div className="w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">

        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-richblack-5">
            Add Review
          </h2>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center justify-center gap-4">
            <img
              src={
                user?.image ||
                `https://api.dicebear.com/5.x/initials/svg?seed=${user?.FirstName} ${user?.LastName}`
              }
              alt="profile"
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5">
                {user?.FirstName} {user?.LastName}
              </p>
              <p className="text-sm text-richblack-300">
                Posting publicly
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center gap-6"
          >
            {/* ⭐ Rating + Numeric */}
            <div className="flex items-center gap-4">
              <div className="flex flex-row">
                <Rating
                  onClick={handleRating}
                  ratingValue={rating * 20}
                  size={34}
                  transition
                  allowFraction={false}
                  fillColor="#FFD700"
                  emptyColor="#6B7280"
                  SVGstyle={{ display: "inline" }}
                />
              </div>

              <span className="text-lg font-semibold text-richblack-5">
                {rating > 0 ? `${rating} / 5` : "0 / 5"}
              </span>
            </div>

            {errors.courseRating && (
              <span className="text-xs text-pink-200">
                Please select a rating
              </span>
            )}

            {/* Hidden input for react-hook-form */}
            <input
              type="hidden"
              {...register("courseRating", { required: true })}
            />

            {/* Review textarea */}
            <div className="w-11/12 space-y-2">
              <label className="text-sm text-richblack-5">
                Add your experience
                <sup className="text-pink-200">*</sup>
              </label>

              <textarea
                placeholder="Share your learning experience..."
                {...register("courseExperience", { required: true })}
                className="form-style min-h-[130px] w-full resize-none"
              />

              {errors.courseExperience && (
                <span className="text-xs text-pink-200">
                  Please add your experience
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex w-11/12 justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-md bg-richblack-300 px-5 py-2 font-semibold text-richblack-900"
              >
                Cancel
              </button>

              <IconBtn
                text="Save"
                type="submit"
                disabled={rating === 0}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
