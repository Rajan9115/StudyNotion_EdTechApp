import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const fetchSublinks = async () => {
    setLoading(true)
    try {
      const response = await apiConnector("GET", categories.CATEGORIES_API)
      setSubLinks(response.data.categories)
    } catch (error) {
      console.log("Could not fetch Categories.", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSublinks()
  }, [])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div
        className={`flex h-14 items-center justify-center border-b border-b-richblack-700 ${
          location.pathname !== "/" ? "bg-richblack-800" : ""
        }`}
      >
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">

          {/* LOGO */}
          <Link to="/">
            <img src={logo} alt="Logo" width={160} height={32} />
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:block">
            <ul className="flex gap-x-6 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div className="group relative flex cursor-pointer items-center gap-1">
                      <p>Catalog</p>
                      <BsChevronDown />

                      <div className="invisible absolute left-1/2 top-full z-50 w-[250px]
                        -translate-x-1/2 translate-y-3 rounded-lg bg-richblack-5
                        p-4 text-richblack-900 opacity-0 transition-all
                        group-hover:visible group-hover:opacity-100">

                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : (
                          subLinks?.map((subLink, i) => (
                            <Link
                              key={i}
                              to={`/catalog/${subLink.Name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="block rounded py-2 px-3 hover:bg-richblack-50"
                            >
                              {subLink.Name}
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link.path}>
                      <p
                        className={`${
                          matchRoute(link.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* DESKTOP RIGHT */}
          <div className="hidden md:flex items-center gap-x-4">
            {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link to="/dashboard/cart" className="relative">
                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center
                    rounded-full bg-richblack-600 text-xs text-yellow-100">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {token === null && (
              <>
                <Link to="/login">
                  <button className="rounded border border-richblack-700 px-3 py-1 text-richblack-5">
                    Log in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="rounded border border-richblack-700 px-3 py-1 text-richblack-5">
                    Sign up
                  </button>
                </Link>
              </>
            )}

            {token !== null && <ProfileDropdown />}
          </div>

          {/* MOBILE MENU ICON */}
          <button
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <AiOutlineMenu size={24} fill="#AFB2BF" />
          </button>
        </div>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      {isSidebarOpen && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* SIDEBAR */}
          <div className="fixed left-0 top-0 z-50 h-full w-[70%]
            bg-richblack-900 p-6">

            <button
              className="mb-6 text-xl text-richblack-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              ✕
            </button>

            <ul className="flex flex-col gap-4 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <>
                      <p className="font-semibold">Catalog</p>
                      {subLinks?.map((subLink, i) => (
                        <Link
                          key={i}
                          to={`/catalog/${subLink.Name
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`}
                          onClick={() => setIsSidebarOpen(false)}
                          className="block py-2 pl-2 text-sm"
                        >
                          {subLink.Name}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {link.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              {token === null && (
                <>
                  <Link to="/login" onClick={() => setIsSidebarOpen(false)}>
                    <button className="w-full rounded bg-richblack-800 py-2">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsSidebarOpen(false)}>
                    <button className="w-full rounded bg-richblack-800 py-2">
                      Sign up
                    </button>
                  </Link>
                </>
              )}

              {token !== null && <ProfileDropdown />}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
