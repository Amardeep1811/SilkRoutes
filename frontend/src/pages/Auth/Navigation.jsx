import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { useLogoutMutation } from "../../redux/api/usersApislice.js";
import { logout } from "../../redux/features/auth/authSlice";

import FavoritesCount from "../Products/FavoritesCount.jsx";

// Icons
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { MdOutlineSpaceDashboard, MdOutlineCategory, MdLogout } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { CiCircleList } from "react-icons/ci";
import { RiContactsLine, RiAccountCircleLine } from "react-icons/ri";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      toast.success("User successfully Logged out");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const navClass = `fixed top-0 left-0 w-full h-[60px] z-50 transition-colors duration-300 ease-in-out flex items-center ${isScrolled ? "text-[#1a1a1a]" : "text-white"
    }`;

  return (
    <>
      <nav className={navClass}>
        <motion.div
          initial={false}
          animate={{ y: isScrolled ? 0 : "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 bg-[#C9A84C] shadow-md z-[-1]"
        />
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 h-full flex items-center justify-between">

          {/* MOBILE LEFT: Hamburger */}
          <div className="flex lg:hidden items-center w-1/3">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 hover:opacity-70 transition-opacity">
              <FiMenu size={24} />
            </button>
          </div>

          {/* DESKTOP LEFT: Links */}
          <div className="hidden lg:flex items-center gap-8 w-1/3 text-sm font-medium tracking-wide uppercase">
            <Link to="/" className="hover:opacity-70 transition-opacity duration-300">Home</Link>
            <Link to="/shop" className="hover:opacity-70 transition-opacity duration-300">Curated Collection</Link>
          </div>

          {/* CENTER: Logo */}
          <div className="flex justify-center w-1/3">
            <Link to="/" className="text-2xl md:text-3xl font-bold tracking-widest text-center whitespace-nowrap" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Silk Routes
            </Link>
          </div>

          {/* RIGHT: Icons */}
          <div className="flex items-center justify-end gap-5 w-1/3">
            <button className="hover:opacity-70 transition-opacity duration-300 hidden lg:block" onClick={() => navigate("/shop")}>
              <FiSearch size={22} />
            </button>

            {/* Account / Dropdown */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => userInfo ? setDropdownOpen(!dropdownOpen) : navigate("/login")}
                className="hover:opacity-70 transition-opacity duration-300 flex items-center"
              >
                <FiUser size={22} />
              </button>

              {/* Desktop Dropdown */}
              <AnimatePresence>
                {dropdownOpen && userInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-56 bg-white border border-gray-100 shadow-lg rounded-sm py-2 text-[#1a1a1a] flex flex-col z-50"
                  >
                    <span className="px-4 py-3 border-b border-gray-100 font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wide">
                      Hi, {userInfo.username}
                    </span>

                    {userInfo.isAdmin && (
                      <div className="flex flex-col border-b border-gray-100 mb-2 pb-2">
                        <Link to="/admin/dashboard" className="px-4 py-2 hover:bg-gray-50 hover:opacity-70 text-sm flex items-center gap-3 transition-opacity" onClick={() => setDropdownOpen(false)}>
                          <MdOutlineSpaceDashboard size={18} /> Dashboard
                        </Link>
                        <Link to="/admin/productlist" className="px-4 py-2 hover:bg-gray-50 hover:opacity-70 text-sm flex items-center gap-3 transition-opacity" onClick={() => setDropdownOpen(false)}>
                          <BsBoxSeam size={18} /> Create Product
                        </Link>
                        <Link to="/admin/allproductslist" className="px-4 py-2 hover:bg-gray-50 hover:opacity-70 text-sm flex items-center gap-3 transition-opacity" onClick={() => setDropdownOpen(false)}>
                          <BsBoxSeam size={18} /> All Products
                        </Link>
                        <Link to="/admin/categorylist" className="px-4 py-2 hover:bg-gray-50 hover:opacity-70 text-sm flex items-center gap-3 transition-opacity" onClick={() => setDropdownOpen(false)}>
                          <MdOutlineCategory size={18} /> Category
                        </Link>
                        <Link to="/admin/orderlist" className="px-4 py-2 hover:bg-gray-50 hover:opacity-70 text-sm flex items-center gap-3 transition-opacity" onClick={() => setDropdownOpen(false)}>
                          <CiCircleList size={18} /> Orders
                        </Link>
                        <Link to="/admin/userlist" className="px-4 py-2 hover:bg-gray-50 hover:opacity-70 text-sm flex items-center gap-3 transition-opacity" onClick={() => setDropdownOpen(false)}>
                          <RiContactsLine size={18} /> Users
                        </Link>
                      </div>
                    )}

                    <Link to="/profile" className="px-4 py-2 hover:bg-gray-50 hover:opacity-70 text-sm flex items-center gap-3 transition-opacity" onClick={() => setDropdownOpen(false)}>
                      <RiAccountCircleLine size={18} /> Profile
                    </Link>
                    <button onClick={logoutHandler} className="px-4 py-2 hover:bg-gray-50 hover:text-red-600 text-sm flex items-center gap-3 transition-colors w-full text-left">
                      <MdLogout size={18} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link to="/favorite" className="hover:opacity-70 transition-opacity duration-300 relative hidden lg:block">
              <FiHeart size={22} />
              <FavoritesCount />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="hover:opacity-70 transition-opacity duration-300 relative flex items-center">
              <FiShoppingCart size={22} />
              {cartItems?.length > 0 && (
                <span className={`absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center text-[10px] ${isScrolled ? "bg-[#1a1a1a] text-white" : "bg-[#C9A84C] text-[#0a0a0a]"} rounded-full font-bold`}>
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-[80%] max-w-sm h-full bg-[#C9A84C] z-50 shadow-2xl flex flex-col text-[#1a1a1a]"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#0a0a0a]/10">
                <span className="text-xl font-bold tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  The Silk Routes
                </span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 hover:text-white transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <div className="flex flex-col p-6 gap-6 text-base tracking-wide uppercase font-bold">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Home</Link>
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Shop</Link>
                <Link to="/user-orders" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Orders</Link>
                <Link to="/favorite" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Wishlist</Link>

                {userInfo ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Account</Link>
                    {userInfo.isAdmin && (
                      <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors text-sm mt-4">Admin Panel</Link>
                    )}
                    <button onClick={logoutHandler} className="text-left mt-8 text-sm hover:text-red-700 transition-colors font-bold">LOGOUT</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors mt-4">Login / Register</Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
