import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css/bundle";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const INDIA_TOPO_JSON = "/india_states.geojson";

// We'll mock the RTK query fetch since the prompt mentions "Images fetched from carousel1 in MongoDB via GET /api/v1/carousel/carousel1"
// But doesn't provide the exact RTK hook, so we'll just use a native fetch inside a useEffect, or RTK if we knew it.
// To avoid breaking existing functionality and keep it simple, we'll use fetch.

const Home = () => {
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState(null);
  const [carousel1, setCarousel1] = useState([]);
  const [carousel2, setCarousel2] = useState([]);
  const [searchState, setSearchState] = useState("");
  const [tooltipContent, setTooltipContent] = useState("");

  const fontHeading = { fontFamily: "'Cormorant Garamond', serif" };
  const fontBody = { fontFamily: "'Inter', sans-serif" };

  useEffect(() => {
    // Add Google Fonts dynamically
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Fetch carousel images
    fetch("/api/v1/carousel/carousel1")
      .then((res) => res.json())
      .then((data) => setCarousel1(data))
      .catch((err) => console.error("Failed to load carousel1", err));

    fetch("/api/v1/carousel/carousel2")
      .then((res) => res.json())
      .then((data) => setCarousel2(data))
      .catch((err) => console.error("Failed to load carousel2", err));
  }, []);

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const filteredStates = indianStates.filter((s) =>
    s.toLowerCase().includes(searchState.toLowerCase())
  );

  const STATE_COLORS = [
    "#C9A84C", "#B4846C", "#8B6347", "#D4956A",
    "#E8B88A", "#A0522D", "#CD853F", "#DEB887",
    "#D2691E", "#BC8F5F", "#F4A460", "#DAA520",
    "#B8860B", "#FFD700", "#FFA500", "#FF8C00",
    "#E9967A", "#FA8072", "#F08080", "#CD5C5C",
    "#A52A2A", "#800000", "#8B4513", "#D2691E",
    "#C19A6B", "#E3A857", "#BA7A2B", "#9E6B3C"
  ];

  return (
    <div
      className="bg-[#0a0a0a] text-white w-full overflow-hidden"
      style={fontBody}
    >
      {/* SECTION 1 - HERO VIDEO */}
      <section className="relative w-full h-[100vh] flex items-center justify-center">
        {/* Placeholder overlay for video */}
        <div
          className="absolute inset-0 bg-[#0a0a0a] z-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(#C9A84C 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            opacity: 0.2,
          }}
        ></div>
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <motion.div
          className="relative z-10 text-center flex flex-col items-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-wider text-[#C9A84C]"
            style={fontHeading}
          >
            PRESERVING HERITAGE
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 font-light text-gray-200 tracking-wide">
            Authentic Indian Handicrafts & Decor
          </p>
          <Link
            to="/shop"
            className="px-8 py-3 bg-[#C9A84C] text-[#0a0a0a] font-semibold text-lg hover:bg-white transition-colors duration-300 rounded-sm"
          >
            Shop Now
          </Link>
        </motion.div>
      </section>

      {/* SECTION 2 - THE INAUGURAL COLLECTION CAROUSEL */}
      <motion.section
        className="w-full min-h-screen flex items-center py-24 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-col lg:flex-row items-center gap-12 w-full overflow-hidden">
          {/* Left Side */}
          <motion.div
            className="lg:w-1/3 flex flex-col items-start"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[#C9A84C] text-sm tracking-widest uppercase mb-2 font-medium">
              CURATED EDITION
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl mb-6 text-white leading-tight"
              style={fontHeading}
            >
              The Inaugural Collection
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed font-light">
              A curated selection of certified, geographically protected artifacts.
            </p>
            <Link
              to="/shop"
              className="px-6 py-2 border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0a0a0a] transition-colors duration-300 rounded-sm uppercase text-sm tracking-wide"
            >
              Shop Now
            </Link>
          </motion.div>

          {/* Right Side */}
          <motion.div
            className="lg:w-2/3 w-full max-w-full overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3.5 },
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-full"
            >
              {carousel1.length > 0 ? (
                carousel1.map((item, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="aspect-[3/4] w-full overflow-hidden">
                      <img
                        src={item.image || item.url || "/images/placeholder.jpg"}
                        alt="collection item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                // Fallbacks if no data yet
                [1, 2, 3, 4, 5].map((i) => (
                  <SwiperSlide key={i}>
                    <div className="aspect-[3/4] w-full bg-[#111111] animate-pulse flex items-center justify-center border border-gray-800"></div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 3 - SHOP BY REGION */}
      <section className="w-full py-24 bg-[#0a0a0a] relative border-t border-gray-900">
        <h2
          className="absolute top-12 left-6 md:left-12 lg:left-24 text-2xl lg:text-3xl text-[#C9A84C] tracking-widest uppercase z-10"
          style={fontHeading}
        >
          SHOP BY REGION
        </h2>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-col lg:flex-row items-center lg:items-start gap-12 mt-16 px-6 md:px-12 lg:px-24 w-full overflow-hidden">

          {/* Map Left Side */}
          <motion.div
            className="w-full lg:w-[60%] relative flex justify-center rounded p-4 max-w-full overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {tooltipContent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#C9A84C] text-[#0a0a0a] px-4 py-2 rounded-full shadow-lg text-sm font-bold tracking-wider pointer-events-none z-20"
              >
                {tooltipContent}
              </motion.div>
            )}
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 1600,
                center: [82.8, 22.5]
              }}
              style={{ width: "100%", height: "700px" }}
            >
              <Geographies geography={INDIA_TOPO_JSON}>
                {({ geographies }) =>
                  geographies.map((geo, index) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        setTooltipContent(geo.properties.ST_NM);
                        setHoveredState(geo.rsmKey);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                        setHoveredState(null);
                      }}
                      onClick={() => {
                        const stateName = geo.properties.ST_NM;
                        if (stateName) {
                          navigate(`/shop?state=${stateName}`);
                        }
                      }}
                      style={{
                        default: {
                          fill: STATE_COLORS[index % STATE_COLORS.length],
                          stroke: "#0a0a0a",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "all 300ms ease",
                          opacity: 0.85,
                        },
                        hover: {
                          fill: "#ffffff",
                          stroke: "#0a0a0a",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                          opacity: 1,
                          filter: "brightness(1.3)",
                          transition: "all 300ms ease",
                        },
                        pressed: {
                          fill: "#C9A84C",
                          outline: "none",
                        },
                        transform: hoveredState === geo.rsmKey ? "scale(1.08)" : "scale(1)",
                        transformOrigin: "center",
                        transformBox: "fill-box",
                        transition: "transform 250ms ease, fill 250ms ease",
                        zIndex: hoveredState === geo.rsmKey ? 10 : 1,
                      }}
                    />
                  ))
                }
              </Geographies>
            </ComposableMap>
          </motion.div>

          {/* List Right Side */}
          <motion.div
            className="w-full lg:w-[40%] flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3
              className="text-3xl mb-6 text-white leading-tight"
              style={fontHeading}
            >
              Explore by State
            </h3>
            <input
              type="text"
              placeholder="Search states..."
              value={searchState}
              onChange={(e) => setSearchState(e.target.value)}
              className="w-full bg-transparent border-b border-gray-700 pb-2 mb-6 text-white focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-gray-500"
            />
            <div className="h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              <ul className="flex flex-col gap-1">
                {filteredStates.map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => navigate(`/shop?state=${s}`)}
                      className="w-full text-left py-2 text-gray-400 hover:text-[#C9A84C] transition-colors text-lg font-light flex items-center justify-between group"
                    >
                      <span>{s}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#C9A84C] text-xl">
                        →
                      </span>
                    </button>
                  </li>
                ))}
                {filteredStates.length === 0 && (
                  <li className="text-gray-500 italic mt-4">
                    No states found.
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 - MEET OUR MAKERS */}
      <section className="w-full min-h-screen bg-[#111111] relative overflow-hidden flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/makers-bg.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

        {/* Video Placeholder (Swap to <video> when ready) */}
        {/* 
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
          src="/videos/makers.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="border border-[#C9A84C]/40 bg-[#0a0a0a]/50 backdrop-blur-md px-6 py-3 rounded-sm text-[#C9A84C]/80 font-semibold tracking-widest uppercase text-sm">
            Video Coming Soon
          </div>
        </div>

        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-end px-6 md:px-12 lg:px-24 py-24 min-h-screen"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#C9A84C] font-bold tracking-wider leading-none"
            style={fontHeading}
          >
            MEET OUR<br />MAKERS
          </h2>
        </motion.div>
      </section>

      {/* SECTION 5 - CORPORATE CURATIONS */}
      <section className="w-full bg-[#111111] relative overflow-hidden">
        <div className="max-w-7xl mx-auto py-24 px-6 md:px-12 lg:px-24 flex flex-col md:flex-col lg:flex-row items-center gap-12 w-full overflow-hidden">
          {/* Left Side */}
          <motion.div
            className="lg:w-1/2 flex flex-col items-start z-10"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#C9A84C] text-xs md:text-sm tracking-widest uppercase mb-2 font-medium">
              BESPOKE SOURCING & VOLUME GIFTING
            </span>
            <h2
              className="text-4xl lg:text-5xl mb-6 text-[#C9A84C] font-bold leading-tight"
              style={fontHeading}
            >
              INSTITUTIONAL & CORPORATE CURATIONS
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed font-light text-lg max-w-md">
              Need custom packaging, engraved corporate branding, or high-volume export orders? Speak directly with our founding team to craft a tailored corporate curation.
            </p>
            <Link
              to="/contact"
              className="px-8 py-3 bg-[#C9A84C] text-[#0a0a0a] font-semibold text-sm md:text-base hover:bg-white transition-colors duration-300 rounded-sm tracking-wide uppercase"
            >
              Request Our Corporate Catalogue
            </Link>
          </motion.div>

          {/* Right Side */}
          <motion.div
            className="lg:w-1/2 w-full max-w-full overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3.5 },
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-full"
            >
              {carousel2.length > 0 ? (
                carousel2.map((item, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-sm shadow-xl">
                      <img
                        src={item.image || item.url || "/images/placeholder.jpg"}
                        alt="maker"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                // Fallbacks if no data
                [1, 2, 3, 4, 5].map((i) => (
                  <SwiperSlide key={i}>
                    <div className="aspect-[3/4] w-full bg-[#1a1a1a] animate-pulse flex items-center justify-center border border-gray-800 rounded-sm"></div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6 - FOOTER */}
      <motion.footer
        className="w-full bg-[#0a0a0a] pt-16 pb-8 border-t border-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">

          {/* Top Newsletter */}
          <div className="flex flex-col items-center mb-16 text-center border-b border-gray-800 pb-12">
            <h3
              className="text-2xl md:text-3xl text-[#C9A84C] italic mb-6"
              style={fontHeading}
            >
              Be a part of our community!
            </h3>
            <form className="flex w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-grow bg-transparent border-b border-gray-600 px-2 py-2 text-white focus:outline-none focus:border-[#C9A84C] transition-colors font-light"
              />
              <button
                type="submit"
                className="ml-4 text-sm font-semibold uppercase tracking-wider text-[#C9A84C] hover:text-white transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white uppercase tracking-widest text-sm font-semibold mb-6">Shop</h4>
              <ul className="flex flex-col gap-3 font-light text-gray-400">
                <li><Link to="/shop" className="hover:text-[#C9A84C] transition">All Products</Link></li>
                <li><Link to="/shop" className="hover:text-[#C9A84C] transition">New Arrivals</Link></li>
                <li><Link to="/shop" className="hover:text-[#C9A84C] transition">Shop by State</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white uppercase tracking-widest text-sm font-semibold mb-6">Customer Care</h4>
              <ul className="flex flex-col gap-3 font-light text-gray-400">
                <li><a href="#" className="hover:text-[#C9A84C] transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#C9A84C] transition">Returns</a></li>
                <li><a href="#" className="hover:text-[#C9A84C] transition">Shipping Info</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white uppercase tracking-widest text-sm font-semibold mb-6">About Us</h4>
              <ul className="flex flex-col gap-3 font-light text-gray-400">
                <li><a href="#" className="hover:text-[#C9A84C] transition">Our Story</a></li>
                <li><a href="#" className="hover:text-[#C9A84C] transition">Our Artisans</a></li>
                <li><a href="#" className="hover:text-[#C9A84C] transition">GI Tags</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white uppercase tracking-widest text-sm font-semibold mb-6">Connect</h4>
              <ul className="flex flex-col gap-3 font-light text-gray-400">
                <li><a href="#" className="hover:text-[#C9A84C] transition">Instagram</a></li>
                <li><a href="#" className="hover:text-[#C9A84C] transition">Facebook</a></li>
                <li><a href="#" className="hover:text-[#C9A84C] transition">WhatsApp</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="text-center pt-8 border-t border-gray-900 text-sm font-light text-gray-500">
            © 2025 The Silk Routes. All rights reserved.
          </div>
        </div>
      </motion.footer>

      {/* Global minimal styles for scrollbar in India map state list */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C9A84C;
        }
      `}} />
    </div>
  );
};

export default Home;
