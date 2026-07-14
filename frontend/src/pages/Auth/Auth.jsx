import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

import { useLoginMutation, useRegisterMutation } from "../../redux/api/usersApislice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import Loader from "../../components/Loader";

const fontHeading = { fontFamily: "'Cormorant Garamond', serif" };
const fontBody = { fontFamily: "'Inter', sans-serif" };

const BouncingDotsLoader = () => (
  <div className="flex space-x-1.5 justify-center items-center h-full">
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className="w-2 h-2 bg-[#0a0a0a] rounded-full"
        animate={{ y: ["0%", "-80%", "0%"] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.15,
        }}
      />
    ))}
  </div>
);

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(location.pathname === "/login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Mutations
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const sp = new URLSearchParams(location.search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);
  
  // Sync location with state if route changes
  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!email.trim() || !password.trim()) {
      setLoginError("Please fill all the fields");
      return;
    }
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Welcome to The Silk Routes!");
    } catch (err) {
      setLoginError(err?.data?.message || err?.message || "Invalid email or password.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
    try {
      const res = await register({ username, email, password }).unwrap();
      if (res.message) {
         toast.success(res.message);
         // Often backends return a message like "User registered, please login" if no token is returned immediately
         const nextPath = "/login";
         navigate(`${nextPath}?redirect=${redirect}`);
      } else {
         dispatch(setCredentials({ ...res }));
         navigate(redirect);
         toast.success("Successfully joined The Silk Routes!");
      }
    } catch (err) {
      console.log(err);
      setRegisterError(err?.data?.message || err?.message || "An error occurred during registration");
    }
  };

  // Switch form view helper (updates route so page reload keeps context)
  const toggleView = () => {
    setLoginError("");
    setRegisterError("");
    const nextPath = isLogin ? "/register" : "/login";
    navigate(`${nextPath}?redirect=${redirect}`);
  };

  const inputClasses = "w-full mt-1 p-3 bg-[#0a0a0a] text-[#E8E6E1] border border-[#333] rounded-lg outline-none focus:border-b-2 focus:border-b-[#C9A84C] focus:bg-[#111] transition-all duration-300 placeholder-[#666]";
  
  const iconClasses = "absolute top-4 left-3 text-[#C9A84C] w-5 h-5";

  const renderLoginForm = (isMobile = false) => (
    <form onSubmit={handleLoginSubmit} autoComplete="off" className={`w-full max-w-md mx-auto ${isMobile ? 'px-0' : 'px-16'} flex flex-col justify-center h-full`}>
      <h1 className="text-4xl text-[#C9A84C] font-semibold mb-2" style={fontHeading}>Sign In</h1>
      <p className="text-[#9C9690] mb-8" style={fontBody}>Welcome back to The Silk Routes</p>

      <div className="mb-4 relative">
        <Mail className={iconClasses} />
        <input 
          type="email" 
          placeholder="Email Address" 
          className={`${inputClasses} pl-10`} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={fontBody}
          autoComplete="nope"
        />
      </div>

      <div className="mb-4 relative">
        <Lock className={iconClasses} />
        <input 
          type={showPassword ? "text" : "password"} 
          placeholder="Password" 
          className={`${inputClasses} pl-10 pr-10`} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={fontBody}
          autoComplete="new-password"
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-4 right-3 text-[#9C9690] hover:text-[#C9A84C] transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
        </button>
      </div>

      <AnimatePresence>
        {loginError && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="text-[#ff6b6b] text-sm mb-4 text-center"
            style={fontBody}
          >
            {loginError}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        type="submit" 
        disabled={isLoginLoading}
        className="w-full bg-[#C9A84C] hover:bg-[#B8963E] text-[#0a0a0a] font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center h-12"
        style={fontBody}
      >
        {isLoginLoading ? <BouncingDotsLoader /> : "Login"}
      </button>

      <div className="mt-4 text-center">
        <Link to="/forgot-password" className="text-sm text-[#C9A84C] hover:text-[#E8E6E1] transition-colors" style={fontBody}>
          Forgot Password?
        </Link>
      </div>
    </form>
  );

  const renderRegisterForm = (isMobile = false) => (
    <form onSubmit={handleRegisterSubmit} autoComplete="off" className={`w-full max-w-md mx-auto ${isMobile ? 'px-0' : 'px-16'} flex flex-col justify-center h-full`}>
      <h1 className="text-4xl text-[#C9A84C] font-semibold mb-2" style={fontHeading}>Sign Up</h1>
      <p className="text-[#9C9690] mb-6" style={fontBody}>Join The Silk Routes community</p>

      <div className="mb-4 relative">
        <User className={iconClasses} />
        <input 
          type="text" 
          placeholder="Username" 
          className={`${inputClasses} pl-10`} 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={fontBody}
          autoComplete="nope"
        />
      </div>

      <div className="mb-4 relative">
        <Mail className={iconClasses} />
        <input 
          type="email" 
          placeholder="Email Address" 
          className={`${inputClasses} pl-10`} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={fontBody}
          autoComplete="nope"
        />
      </div>

      <div className="mb-4 relative">
        <Lock className={iconClasses} />
        <input 
          type={showPassword ? "text" : "password"} 
          placeholder="Password" 
          className={`${inputClasses} pl-10 pr-10`} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={fontBody}
          autoComplete="new-password"
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-4 right-3 text-[#9C9690] hover:text-[#C9A84C] transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
        </button>
      </div>

      <div className="mb-4 relative">
        <Lock className={iconClasses} />
        <input 
          type={showConfirmPassword ? "text" : "password"} 
          placeholder="Confirm Password" 
          className={`${inputClasses} pl-10 pr-10`} 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={fontBody}
          autoComplete="new-password"
        />
        <button 
          type="button" 
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute top-4 right-3 text-[#9C9690] hover:text-[#C9A84C] transition-colors"
        >
          {showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
        </button>
      </div>

      <AnimatePresence>
        {registerError && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="text-[#ff6b6b] text-sm mb-4 text-center"
            style={fontBody}
          >
            {registerError}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        type="submit" 
        disabled={isRegisterLoading}
        className="w-full bg-[#C9A84C] hover:bg-[#B8963E] text-[#0a0a0a] font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center h-12"
        style={fontBody}
      >
        {isRegisterLoading ? <BouncingDotsLoader /> : "Register"}
      </button>
    </form>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] flex items-center justify-center p-4">
      
      {/* DESKTOP SPLIT PANEL */}
      <div className="hidden md:block relative w-full max-w-6xl h-[600px] bg-[#141414] rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-[#C9A84C]/20">
        
        {/* Left Form: Sign In */}
        <div className={`absolute top-0 left-0 w-[60%] h-full z-0 transition-opacity duration-500 ${isLogin ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {renderLoginForm()}
        </div>

        {/* Right Form: Sign Up */}
        <div className={`absolute top-0 right-0 w-[60%] h-full z-0 transition-opacity duration-500 ${!isLogin ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {renderRegisterForm()}
        </div>

        {/* Sliding Overlay Panel */}
        <motion.div 
          className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-br from-[#2a2211] to-[#0d0a05] z-10 flex flex-col items-center justify-center text-center px-16 shadow-[0_0_30px_rgba(201,168,76,0.15)]"
          animate={{ 
            x: isLogin ? "150%" : "0%",
            borderTopLeftRadius: isLogin ? 60 : 0,
            borderBottomLeftRadius: isLogin ? 60 : 0,
            borderTopRightRadius: isLogin ? 0 : 60,
            borderBottomRightRadius: isLogin ? 0 : 60,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div 
                key="hello"
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }} 
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h2 className="text-4xl text-[#E8E6E1] mb-4" style={fontHeading}>New Here?</h2>
                <p className="text-[#9C9690] mb-8 text-lg" style={fontBody}>Sign up now and become part of The Silk Routes story.</p>
                <button 
                  onClick={toggleView}
                  className="px-8 py-3 rounded-full border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0a0a0a] font-semibold transition-colors duration-300 w-full max-w-[200px]"
                  style={fontBody}
                >
                  Sign Up
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h2 className="text-4xl text-[#E8E6E1] mb-4" style={fontHeading}>Welcome Back!</h2>
                <p className="text-[#9C9690] mb-8 text-lg" style={fontBody}>To keep connected with us please login with your personal info.</p>
                <button 
                  onClick={toggleView}
                  className="px-8 py-3 rounded-full border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0a0a0a] font-semibold transition-colors duration-300 w-full max-w-[200px]"
                  style={fontBody}
                >
                  Sign In
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* MOBILE STACKED VIEW */}
      <div className="md:hidden w-full max-w-md bg-[#141414] rounded-2xl p-6 sm:p-8 border border-[#C9A84C]/20 shadow-lg my-8">
        {isLogin ? renderLoginForm(true) : renderRegisterForm(true)}
        
        <div className="mt-6 text-center border-t border-[#333] pt-6">
          <p className="text-[#9C9690]" style={fontBody}>
            {isLogin ? "New here? " : "Already have an account? "}
            <button 
              onClick={toggleView}
              className="text-[#C9A84C] hover:text-[#E8E6E1] font-semibold ml-1 transition-colors"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
