import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [previewSource, setPreviewSource] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  // ✅ Correct file handling (NO register)
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)
    setValue("image", file)

    const reader = new FileReader()
    reader.onloadend = () => setPreviewSource(reader.result)
    reader.readAsDataURL(file)
  }

  const submitProfileForm = async (data) => {
    const formData = new FormData()

    // append text fields
    Object.keys(data).forEach((key) => {
      if (key !== "image") {
        formData.append(key, data[key])
      }
    })

    // append image
    if (imageFile) {
      formData.append("image", imageFile)
    }

    dispatch(updateProfile(token, formData))
  }

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      
      {/* ================= PROFILE PICTURE ================= */}
      <div className="my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">
          Profile Picture
        </h2>

        <div className="flex items-center gap-6">
          <img
            src={previewSource || user?.AdditionalDetails?.Image}
            alt="profile"
            className="h-20 w-20 rounded-full object-cover border border-richblack-600"
          />

          <label className="cursor-pointer rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900">
            Change Picture
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {/* ================= PROFILE INFO ================= */}
      <div className="my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">
          Profile Information
        </h2>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label className="lable-style">First Name</label>
            <input
              className="form-style"
              {...register("FirstName", { required: true })}
              defaultValue={user?.FirstName}
            />
            {errors.FirstName && (
              <span className="text-yellow-100 text-sm">
                Please enter your First name.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label className="lable-style">Last Name</label>
            <input
              className="form-style"
              {...register("LastName", { required: true })}
              defaultValue={user?.LastName}
            />
            {errors.LastName && (
              <span className="text-yellow-100 text-sm">
                Please enter your Last name.
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label className="lable-style">Date of Birth</label>
            <input
              type="date"
              className="form-style"
              {...register("dob", { required: true })}
              defaultValue={user?.AdditionalDetails?.dob}
            />
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label className="lable-style">Gender</label>
            <select
              className="form-style"
              {...register("gender", { required: true })}
              defaultValue={user?.AdditionalDetails?.gender}
            >
              {genders.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label className="lable-style">Contact Number</label>
            <input
              className="form-style"
              {...register("contactNumber", { required: true })}
              defaultValue={user?.AdditionalDetails?.contactNumber}
            />
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label className="lable-style">About</label>
            <input
              className="form-style"
              {...register("about", { required: true })}
              defaultValue={user?.AdditionalDetails?.about}
            />
          </div>
        </div>
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="rounded-md bg-richblack-700 px-5 py-2 text-richblack-50"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Save" />
      </div>
    </form>
  )
}
