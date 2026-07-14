import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX, FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const DualRangeSlider = ({ min, max, minValue, maxValue, setMinValue, setMaxValue }) => {
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
  };

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="w-full relative mt-6 mb-4">
      <div className="absolute top-[-25px] left-0 text-xs font-light text-[#C9A84C]">₹{minValue}</div>
      <div className="absolute top-[-25px] right-0 text-xs font-light text-[#C9A84C]">₹{maxValue}</div>
      <div className="slider relative h-1 rounded-md bg-[#2a2a2a]">
        <div
          className="absolute h-1 bg-[#C9A84C] rounded-md"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        ></div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full -top-1 h-1 bg-transparent appearance-none pointer-events-none dual-range"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full -top-1 h-1 bg-transparent appearance-none pointer-events-none dual-range"
        />
      </div>
    </div>
  );
};

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [catOpen, setCatOpen] = useState(true);
  const [stateOpen, setStateOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const fontHeading = { fontFamily: "'Cormorant Garamond', serif" };
  const fontBody = { fontFamily: "'Inter', sans-serif" };

  const [searchParams, setSearchParams] = useSearchParams();
  const urlState = searchParams.get("state") || "";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
    state: urlState,
    keyword: debouncedSearchTerm,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch, categoriesQuery.isLoading]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      const filteredProducts = filteredProductsQuery.data.filter((product) => {
        const pPrice = Number(product.price);
        return pPrice >= minPrice && pPrice <= maxPrice;
      });
      dispatch(setProducts(filteredProducts));
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, minPrice, maxPrice, filteredProductsQuery.isLoading]);

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const filteredStatesList = indianStates.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));

  const handleReset = () => {
    dispatch(setChecked([]));
    setMinPrice(0);
    setMaxPrice(100000);
    setSearchTerm("");
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-[#E8E6E1]" style={fontBody}>
      {/* SECTION 1 - SHOP HEADER */}
      <div className="pt-6 md:pt-8 px-4 md:px-8 max-w-[1400px] mx-auto w-full flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-widest uppercase text-center"
          style={{ ...fontHeading, WebkitBackgroundClip: "text", color: "transparent", backgroundImage: "linear-gradient(to bottom, white 30%, transparent 100%)" }}
        >
          Shop
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-xl md:max-w-2xl mt-5 md:mt-6 mb-8 md:mb-10"
        >
          <div className="flex items-center bg-[#141414] rounded-full border border-[#C9A84C]/30 px-6 py-4 focus-within:shadow-[0_8px_16px_-4px_rgba(201,168,76,0.35)] transition-shadow duration-300">
            <FiSearch className="text-[#C9A84C] text-xl mr-4" />
            <input
              type="text"
              placeholder="Search products by name, description, category or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-[#E8E6E1] placeholder-[#9C9690] font-light"
            />
          </div>
        </motion.div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-[#0a0a0a] w-full pb-24">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* MOBILE FILTER TOGGLE */}
          <div className="lg:hidden flex justify-between items-center w-full mb-6">
            <h2 className="text-2xl text-white" style={fontHeading}>Products ({products?.length || 0})</h2>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#141414] border border-[#C9A84C]/30 rounded-full text-[#C9A84C] text-sm uppercase tracking-widest font-semibold hover:bg-[#C9A84C]/10 transition"
            >
              <FiFilter /> Filters
            </button>
          </div>

          {/* SECTION 2 - LEFT SIDEBAR FILTERS */}
          <aside className={`w-full lg:w-1/4 lg:sticky lg:top-[90px] lg:z-30 flex-col ${mobileFiltersOpen ? "flex" : "hidden lg:flex"} mb-8 lg:mb-0`}>
            
            <div className="bg-[#141414] rounded-xl border border-[#C9A84C]/20 p-6 flex flex-col gap-8 shadow-xl">
              
              {/* Filter by Categories */}
              <div className="border-b border-[#C9A84C]/10 pb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer mb-4"
                  onClick={() => setCatOpen(!catOpen)}
                >
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-[#C9A84C]">Categories</h3>
                  {catOpen ? <FiChevronUp className="text-[#C9A84C]"/> : <FiChevronDown className="text-[#C9A84C]"/>}
                </div>
                <AnimatePresence>
                  {catOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-col gap-3 overflow-hidden">
                      {categories?.map((c) => (
                        <label key={c._id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={checked.includes(c._id)}
                            onChange={(e) => handleCheck(e.target.checked, c._id)}
                            className="w-4 h-4 rounded-sm border-[#C9A84C]/30 bg-transparent text-[#C9A84C] focus:ring-[#C9A84C] focus:ring-offset-[#141414] cursor-pointer"
                          />
                          <span className="text-sm font-light text-[#E8E6E1] group-hover:text-[#C9A84C] transition">{c.name}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>



              {/* Filter by State */}
              <div className="border-b border-[#C9A84C]/10 pb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer mb-4"
                  onClick={() => setStateOpen(!stateOpen)}
                >
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-[#C9A84C]">States</h3>
                  {stateOpen ? <FiChevronUp className="text-[#C9A84C]"/> : <FiChevronDown className="text-[#C9A84C]"/>}
                </div>
                <AnimatePresence>
                  {stateOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-col gap-3 overflow-hidden">
                      <input
                        type="text"
                        placeholder="Search state..."
                        value={stateSearch}
                        onChange={(e) => setStateSearch(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#C9A84C]/20 rounded-md px-3 py-2 text-sm text-[#E8E6E1] placeholder-[#9C9690] focus:border-[#C9A84C] outline-none transition mb-2"
                      />
                      <div className="flex flex-col gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {filteredStatesList.map((stateName, i) => (
                          <label key={i} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="radio"
                              name="stateFilter"
                              checked={urlState === stateName}
                              onChange={() => {
                                const newParams = new URLSearchParams(searchParams);
                                newParams.set('state', stateName);
                                setSearchParams(newParams);
                              }}
                              className="w-4 h-4 border-[#C9A84C]/30 bg-transparent text-[#C9A84C] focus:ring-[#C9A84C] focus:ring-offset-[#141414] cursor-pointer"
                            />
                            <span className="text-sm font-light text-[#E8E6E1] group-hover:text-[#C9A84C] transition">{stateName}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filter by Price */}
              <div className="mb-4">
                <div 
                  className="flex justify-between items-center cursor-pointer mb-4"
                  onClick={() => setPriceOpen(!priceOpen)}
                >
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-[#C9A84C]">Price Range</h3>
                  {priceOpen ? <FiChevronUp className="text-[#C9A84C]"/> : <FiChevronDown className="text-[#C9A84C]"/>}
                </div>
                <AnimatePresence>
                  {priceOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <DualRangeSlider
                        min={0}
                        max={100000}
                        minValue={minPrice}
                        maxValue={maxPrice}
                        setMinValue={setMinPrice}
                        setMaxValue={setMaxPrice}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 text-center border-2 border-[#C9A84C] text-[#C9A84C] font-semibold uppercase tracking-widest text-sm rounded-sm hover:bg-[#C9A84C] hover:text-[#0a0a0a] transition-colors duration-300"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* SECTION 3 - RIGHT PRODUCT GRID */}
          <main className="lg:w-3/4 w-full">
            <div className="hidden lg:flex justify-between items-center mb-8 border-b border-[#C9A84C]/10 pb-4">
              <h2 className="text-3xl text-white" style={fontHeading}>Products ({products?.length || 0})</h2>
            </div>

            {filteredProductsQuery.isLoading ? (
              <div className="flex justify-center w-full mt-20"><Loader /></div>
            ) : products?.length === 0 ? (
              <div className="text-center w-full mt-20 text-xl font-light text-[#9C9690]">
                No products found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full">
                {products?.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .dual-range::-webkit-slider-thumb {
          pointer-events: all;
          width: 16px;
          height: 16px;
          -webkit-appearance: none;
          border-radius: 50%;
          background: #C9A84C;
          cursor: pointer;
        }
        .dual-range::-moz-range-thumb {
          pointer-events: all;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #C9A84C;
          cursor: pointer;
          border: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
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

export default Shop;
