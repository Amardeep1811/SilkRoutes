import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const fontHeading = { fontFamily: "'Cormorant Garamond', serif" };
  const fontBody = { fontFamily: "'Inter', sans-serif" };

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div
      className="w-full flex flex-col group relative rounded-2xl transition-all duration-300 bg-transparent hover:bg-[#141414] hover:shadow-[0_10px_30px_rgba(201,168,76,0.15)] border border-transparent hover:border-[#C9A84C]/30 p-2 md:p-3"
      style={fontBody}
    >
      <section className="relative aspect-square w-full overflow-hidden rounded-xl">
        <Link to={`/product/${p._id}`}>
          <img
            className="w-full h-full object-cover transition-transform ease-in-out duration-700 transform group-hover:scale-110"
            src={p.image || "/images/placeholder.jpg"}
            alt={p.name}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="flex flex-col mt-4 px-1">
        <Link to={`/product/${p._id}`}>
          <h5
            className="text-base md:text-lg text-[#E8E6E1] font-semibold leading-tight hover:text-[#C9A84C] transition-colors line-clamp-1"
            style={fontHeading}
          >
            {p?.name}
          </h5>
        </Link>
        <p className="font-semibold text-[#C9A84C] text-sm md:text-base mt-1">
          ₹{p?.price?.toLocaleString("en-IN") || p?.price}
        </p>

        <section className="flex justify-between items-center transition-all duration-300 opacity-100 lg:opacity-0 group-hover:opacity-100 max-h-14 lg:max-h-0 lg:group-hover:max-h-14 overflow-hidden mt-3 lg:mt-0 lg:group-hover:mt-3 pt-3 border-t border-transparent group-hover:border-[#C9A84C]/10">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#0a0a0a] bg-[#C9A84C] hover:bg-white transition-colors duration-300 rounded-sm"
          >
            Read More
          </Link>

          <button
            className="p-2 rounded-full text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
            onClick={() => addToCartHandler(p, 1)}
            aria-label="Add to cart"
          >
            <AiOutlineShoppingCart size={20} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
