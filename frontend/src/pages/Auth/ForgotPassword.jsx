import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import { useForgotPasswordMutation } from "../../redux/api/usersApislice";

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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    try {
      const res = await forgotPassword({ email }).unwrap();
      setSuccessMsg(res.message || "If an account exists with this email, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.message || "An error occurred.");
    }
  };

  const inputClasses = "w-full mt-1 p-3 bg-[#0a0a0a] text-[#E8E6E1] border border-[#333] rounded-lg outline-none focus:border-b-2 focus:border-b-[#C9A84C] focus:bg-[#111] transition-all duration-300 placeholder-[#666]";
  const iconClasses = "absolute top-4 left-3 text-[#C9A84C] w-5 h-5";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141414] rounded-2xl p-8 sm:p-10 border border-[#C9A84C]/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col justify-center">
          <h1 className="text-4xl text-[#C9A84C] font-semibold mb-2 text-center" style={fontHeading}>Forgot Password</h1>
          <p className="text-[#9C9690] mb-8 text-center" style={fontBody}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div className="mb-6 relative">
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

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="text-[#ff6b6b] text-sm mb-4 text-center"
                style={fontBody}
              >
                {errorMsg}
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="text-[#C9A84C] text-sm mb-4 text-center"
                style={fontBody}
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#C9A84C] hover:bg-[#B8963E] text-[#0a0a0a] font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center h-12"
            style={fontBody}
          >
            {isLoading ? <BouncingDotsLoader /> : "Send Reset Link"}
          </button>

          <div className="mt-6 text-center border-t border-[#333] pt-6">
            <Link to="/login" className="text-[#C9A84C] hover:text-[#E8E6E1] font-semibold transition-colors" style={fontBody}>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
