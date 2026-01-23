import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import ReactPlayer from "react-player"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const playerRef = useRef(null)

  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(true)


  // ===========================
  // Load Video Data
  // ===========================
  useEffect(() => {
    if (!courseSectionData.length) return

    if (!courseId || !sectionId || !subSectionId) {
      navigate("/dashboard/enrolled-courses")
      return
    }

    const section = courseSectionData.find(
      (sec) => sec._id === sectionId
    )

    const subSection = section?.subSection.find(
      (sub) => sub._id === subSectionId
    )

    if (!subSection) return

    setVideoData(subSection)
    setPreviewSource(courseEntireData?.thumbnail)
    setVideoEnded(false)
  }, [courseSectionData, courseEntireData, location.pathname])

  // ===========================
  // Navigation Helpers
  // ===========================
  const isFirstVideo = () => {
    const secIndex = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex = courseSectionData[secIndex]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    )
    return secIndex === 0 && subIndex === 0
  }

  const isLastVideo = () => {
    const secIndex = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subLength = courseSectionData[secIndex]?.subSection.length
    const subIndex = courseSectionData[secIndex]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    )
    return (
      secIndex === courseSectionData.length - 1 &&
      subIndex === subLength - 1
    )
  }

  const goToNextVideo = () => {
    const secIndex = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex = courseSectionData[secIndex].subSection.findIndex(
      (sub) => sub._id === subSectionId
    )

    if (subIndex < courseSectionData[secIndex].subSection.length - 1) {
      const nextSubId =
        courseSectionData[secIndex].subSection[subIndex + 1]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubId}`
      )
    } else {
      const nextSection = courseSectionData[secIndex + 1]
      navigate(
        `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
      )
    }
  }

  const goToPrevVideo = () => {
    const secIndex = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex = courseSectionData[secIndex].subSection.findIndex(
      (sub) => sub._id === subSectionId
    )

    if (subIndex > 0) {
      const prevSubId =
        courseSectionData[secIndex].subSection[subIndex - 1]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubId}`
      )
    } else {
      const prevSection = courseSectionData[secIndex - 1]
      const lastSub =
        prevSection.subSection[prevSection.subSection.length - 1]._id
      navigate(
        `/view-course/${courseId}/section/${prevSection._id}/sub-section/${lastSub}`
      )
    }
  }

  // ===========================
  // Completion Handler
  // ===========================
  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId, subsectionId: subSectionId },
      token
    )
    if (res) dispatch(updateCompletedLectures(subSectionId))
    setLoading(false)
  }

  // ===========================
  // UI
  // ===========================
  return (
    <div className="flex flex-col  gap-6 text-richblack-800">
     
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="w-full rounded-md object-cover"
        />
      ) : (
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          <ReactPlayer
            ref={playerRef}
            src={videoData?.videoUrl}
            playing={playing}
            muted   
            width="100%"
            height="100%"
            controls
            onEnded={() => {
              setVideoEnded(true)
              setPlaying(false)
            }}
          />
         

          {videoEnded && (
            <div className="absolute inset-0 z-50 grid place-content-center bg-black/70">
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={handleLectureCompletion}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl px-4 mx-auto"
                />
              )}

              <IconBtn
                onclick={() => {
                  playerRef.current?.seekTo?.(0,"seconds")
                  setVideoEnded(false)
                  setPlaying(true) 
                }}
                text="Rewatch"
                customClasses="text-xl px-4 mx-auto mt-3"
              />

              <div className="mt-8 flex gap-4 justify-center">
                {!isFirstVideo() && (
                  <button onClick={goToPrevVideo} className="blackButton">
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button onClick={goToNextVideo} className="blackButton">
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <h1 className="text-3xl font-semibold">{videoData?.title}</h1>
      <p className="text-richblack-900">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails
