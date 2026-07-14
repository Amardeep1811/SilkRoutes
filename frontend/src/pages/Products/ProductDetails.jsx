import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaMapMarkerAlt,
  FaBookOpen,
  FaHammer,
  FaUserAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";

import { BsArrowLeft } from "react-icons/bs";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import ContentWrapper from "../../components/ContentWrapper";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeStoryTab, setActiveStoryTab] = useState("story");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="bg-[#0F172A]">
      <ContentWrapper>
        <div className="min-h-[100vh] pb-8">
          <div className="mb-4">
            <Link
              to="/"
              className="text-white font-semibold text-base xl:text-lg"
            >
              <BsArrowLeft size={25} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center w-full h-[100%]">
              <Loader />
            </div>
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error?.message}
            </Message>
          ) : (
            <>
              <div className="px-4 w-full">
                <div className="container flex mx-auto flex-col md:flex-row gap-8 flex-wrap w-full relative">
                  <div className="w-full md:w-1/3 overflow-hidden container flex mx-auto">
                    <img
                      src={product?.image ? (product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${product.image}`) : ""}
                      alt={product?.name}
                      className="w-full object-cover transition-transform ease-in-out duration-500 transform hover:scale-105"
                    />
                    <HeartIcon product={product} />
                  </div>

                  <div className="pt-8 flex-1 mx-4 h-full ">
                    <div className="w-[90%]">
                      <h2 className="text-base md:text-2xl font-semibold">
                        {product?.name}
                      </h2>
                      <p className="my-4 text-sm md:text-base text-[#97A1AF] ">
                        {product?.description}
                      </p>

                      <p className="text-base md:text-xl font-semibold xl:font-bold mb-4 text-[#009650]">
                        <span className="font-medium text-[#dddfe3]">
                          Price:
                        </span>{" "}
                        <s className="font-medium text-[#97A1AF] mr-2">
                          $ {product?.price * 2}
                        </s>{" "}
                        $ {product?.price}
                      </p>

                      <div className="flex gap-6 my-4">
                        <div className="flex flex-col gap-3">
                          <h1 className="flex items-center ">
                            <FaMapMarkerAlt className="mr-2 text-white" /> State:{" "}
                            {product?.state}
                          </h1>
                          <h1 className="flex items-center">
                            <FaClock className="mr-2 text-white" /> Added:{" "}
                            {moment(product?.createAt).format("MMM Do YY")}
                          </h1>
                          <h1 className="flex items-center">
                            <FaStar className="mr-2 text-white" /> Reviews:{" "}
                            {product?.numReviews}
                          </h1>
                        </div>

                        <div className="flex flex-col gap-3">
                          <h1 className="flex items-center ">
                            <FaStar className="mr-2 text-white" /> Ratings:{" "}
                            {rating}
                          </h1>
                          <h1 className="flex items-center ">
                            <FaShoppingCart className="mr-2 text-white" />{" "}
                            Quantity: {product?.quantity}
                          </h1>
                          <h1 className="flex items-center">
                            <FaBox className="mr-2 text-white" /> In Stock:{" "}
                            {product?.countInStock}
                          </h1>
                        </div>
                      </div>

                      <div className="flex gap-8  md:my-8 flex-wrap">
                        <Ratings
                          value={product?.rating}
                          text={`${product?.numReviews} reviews`}
                        />

                        {product?.countInStock > 0 && (
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                              className="rounded-sm outline-none p-1 border text-white bg-[#0F172A]"
                            >
                              {[...Array(product?.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="btn-container">
                        <button
                          onClick={addToCartHandler}
                          disabled={product.countInStock === 0}
                          className="bg-[#db1143f3] hover:bg-[#FF2E63] transition-colors text-white border-none outline-none w-full  px-4 py-2 rounded cursor-pointer text-base font-semibold mt-12 mb-4"
                        >
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Storytelling Tabs Section */}
                {(product?.story || product?.craftProcess || product?.artisanInfo || product?.origin) && (
                  <div className="w-full mt-16 mb-8 rounded-lg overflow-hidden border border-[#57575b] bg-[#0E1629]">
                    <div className="flex flex-wrap border-b border-[#57575b] bg-[#1a233a]">
                      <button
                        className={`flex-1 min-w-[150px] flex items-center justify-center p-4 text-sm md:text-base font-semibold transition-colors duration-300 ${
                          activeStoryTab === "story"
                            ? "bg-[#B4846C] text-white border-b-4 border-[#FF2E63]"
                            : "text-[#97A1AF] hover:text-white hover:bg-[#2a3655]"
                        }`}
                        onClick={() => setActiveStoryTab("story")}
                      >
                        <FaBookOpen className="mr-2" /> Our Story
                      </button>
                      <button
                        className={`flex-1 min-w-[150px] flex items-center justify-center p-4 text-sm md:text-base font-semibold transition-colors duration-300 ${
                          activeStoryTab === "process"
                            ? "bg-[#B4846C] text-white border-b-4 border-[#FF2E63]"
                            : "text-[#97A1AF] hover:text-white hover:bg-[#2a3655]"
                        }`}
                        onClick={() => setActiveStoryTab("process")}
                      >
                        <FaHammer className="mr-2" /> Craft Process
                      </button>
                      <button
                        className={`flex-1 min-w-[150px] flex items-center justify-center p-4 text-sm md:text-base font-semibold transition-colors duration-300 ${
                          activeStoryTab === "artisan"
                            ? "bg-[#B4846C] text-white border-b-4 border-[#FF2E63]"
                            : "text-[#97A1AF] hover:text-white hover:bg-[#2a3655]"
                        }`}
                        onClick={() => setActiveStoryTab("artisan")}
                      >
                        <FaUserAlt className="mr-2" /> Meet the Artisan
                      </button>
                      <button
                        className={`flex-1 min-w-[150px] flex items-center justify-center p-4 text-sm md:text-base font-semibold transition-colors duration-300 ${
                          activeStoryTab === "origin"
                            ? "bg-[#B4846C] text-white border-b-4 border-[#FF2E63]"
                            : "text-[#97A1AF] hover:text-white hover:bg-[#2a3655]"
                        }`}
                        onClick={() => setActiveStoryTab("origin")}
                      >
                        <FaMapMarkedAlt className="mr-2" /> Origin
                      </button>
                    </div>

                    <div className="p-6 md:p-10 bg-[#0E1629] text-[#eaeaea] leading-relaxed">
                      {activeStoryTab === "story" && (
                        <div className="animate-fadeIn">
                          <h3 className="text-2xl font-bold text-[#E5D3B3] mb-6 border-b border-[#57575b] pb-2 inline-block">The Story</h3>
                          <p className="text-[#dbd9d9] text-base md:text-lg whitespace-pre-line">
                            {product.story || "The story for this product has not been added yet."}
                          </p>
                        </div>
                      )}

                      {activeStoryTab === "process" && (
                        <div className="animate-fadeIn">
                          <h3 className="text-2xl font-bold text-[#E5D3B3] mb-6 border-b border-[#57575b] pb-2 inline-block">Crafting Process</h3>
                          <p className="text-[#dbd9d9] text-base md:text-lg whitespace-pre-line">
                            {product.craftProcess || "The crafting process for this product has not been added yet."}
                          </p>
                        </div>
                      )}

                      {activeStoryTab === "artisan" && (
                        <div className="animate-fadeIn">
                          <h3 className="text-2xl font-bold text-[#E5D3B3] mb-6 border-b border-[#57575b] pb-2 inline-block">Meet the Artisan</h3>
                          <p className="text-[#dbd9d9] text-base md:text-lg whitespace-pre-line">
                            {product.artisanInfo || "Artisan information is not available at the moment."}
                          </p>
                        </div>
                      )}

                      {activeStoryTab === "origin" && (
                        <div className="animate-fadeIn">
                          <h3 className="text-2xl font-bold text-[#E5D3B3] mb-6 border-b border-[#57575b] pb-2 inline-block">Origin</h3>
                          <div className="bg-[#1a233a] p-6 rounded-lg border border-[#B4846C] max-w-md mx-auto mt-4 text-center shadow-lg transform transition hover:-translate-y-1">
                            <FaMapMarkedAlt className="text-4xl text-[#FF2E63] mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-white mb-2">{product.origin || "Unknown Region"}</h4>
                            <p className="text-[#B4846C] font-semibold text-lg">{product.state}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="">
                  <div className="border border-[#444444] mt-[5rem] container flex flex-wrap items-start justify-between min-h-[300px]">
                    <ProductTabs
                      loadingProductReview={loadingProductReview}
                      userInfo={userInfo}
                      submitHandler={submitHandler}
                      rating={rating}
                      setRating={setRating}
                      comment={comment}
                      setComment={setComment}
                      product={product}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
};
export default ProductDetails;
