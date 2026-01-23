import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import ReactPlayer from "react-player"

export default function Upload({
  name,
  label,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData || editData || ""
  )

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setSelectedFile(file)

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setPreviewSource(reader.result)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: video
      ? { "video/*": [".mp4"] }
      : { "image/*": [".jpg", ".jpeg", ".png"] },
    multiple: false,
    onDrop,
  })

  useEffect(() => {
    if (selectedFile) {
      setValue(name, selectedFile, { shouldValidate: true })
    }
  }, [selectedFile])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5">{label}</label>

      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        <input
          type="file"
          {...getInputProps()}
          className="hidden"
        />

        {previewSource ? (
          <img
            src={previewSource}
            alt="Preview"
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <div className="flex flex-col items-center">
            <FiUploadCloud className="text-2xl text-yellow-50" />
            <p className="mt-2 text-sm text-richblack-200">
              Click to browse or drag & drop
            </p>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="text-xs text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
