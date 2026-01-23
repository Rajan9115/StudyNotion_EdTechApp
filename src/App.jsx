import "./app.css";

import{Route,Routes,useNavigate} from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings";
import Contact from "./pages/Contact";
import { ACCOUNT_TYPE } from "./utils/constants";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart/index";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";


function App() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user } = useSelector((state) => state.profile)
  
  return (
    <>
      {/* Navbar */}
      <div className="bg-richblack-800">
        <Navbar />
      </div>
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/login" element ={<Login/>}/> 
          <Route path="/signup" element = {<Signup/>} />
          <Route path="/error" element = {<Error/>} />
          <Route path="/forgot-password" element = {<ForgotPassword/>} />
          <Route path="/update-password/:id" element = {<UpdatePassword/>}/>
          <Route path="/verify-email" element = {<VerifyEmail/>}/>
          <Route path="catalog/:catalogName" element={<Catalog/>} />
          <Route path="courses/:courseId" element={<CourseDetails/>} />

          <Route 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              >
               <Route path="dashboard/my-profile" element={<MyProfile />} />
                
               <Route path="dashboard/Settings" element={<Settings />} />
                
               
                {
                  user?.AccountType === ACCOUNT_TYPE.STUDENT && (
                    <>
                    <Route path="dashboard/cart" element={<Cart />} />
                     <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} /> 
                    </>
                  )
                }
              
                {
                  user?.AccountType === ACCOUNT_TYPE.INSTRUCTOR && (
                    <>
                    <Route path="dashboard/instructor" element={<Instructor />} />
                    <Route path="dashboard/add-course" element={<AddCourse />} />
                    <Route path="dashboard/my-courses" element={<MyCourses />} />
                    <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
                    
                    </>
                  )
                }
          
          
              </Route>
          
            
             <Route element={
                  <PrivateRoute>
                    <ViewCourse />
                  </PrivateRoute>
                }>
          
                {
                  user?.AccountType === ACCOUNT_TYPE.STUDENT && (
                    <>
                <Route 
                      path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                      element={<VideoDetails />}
                    />
                    </>
                  )
                }
          
               
           
            </Route>
                 
           
          
          
              <Route path="*" element={<Error />} />
        </Routes>  
      </div>

    </>
  )
}

export default App
