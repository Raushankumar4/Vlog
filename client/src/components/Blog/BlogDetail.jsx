import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { url, user, vlogrl } from "../../constant";
import { toast } from "react-hot-toast";
import { getRefresh } from "../Redux/Store/Slices/vlogSlice";
import GetVlogComments from "./GetVlogComments";
import { useGetAllVlogComments } from "../../hooks/useGetAllComments";
import { errorToast, successToast } from "../Notify/Notify";

const BlogDetail = () => {
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const allVlogs = useSelector((state) => state.vlog.allVlogs);
  const { id } = useParams();
  const navigate = useNavigate();
  const userI = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const vlog = allVlogs.find((vlog) => id === vlog?._id);
  const getAllComent = useSelector((state) => state.vlog.comments);

  // Format the date and time
  const postDate = new Date(vlog?.createdAt);
  const formattedDate = postDate.toLocaleDateString(); // e.g., "9/9/2024"
  const formattedTime = postDate.toLocaleTimeString(); // e.g., "3:45 PM"
  const year = postDate.getFullYear(); // e.g., 2024

  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now - past) / 1000);

    const intervals = [
      { label: "year", value: 31536000 },
      { label: "month", value: 2592000 },
      { label: "day", value: 86400 },
      { label: "hour", value: 3600 },
      { label: "minute", value: 60 },
      { label: "second", value: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.value);
      if (count > 0) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  const relativeTime = vlog?.createdAt
    ? timeAgo(vlog.createdAt)
    : "Unknown time";

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  useGetAllVlogComments(vlog?._id);

  const handleBackClick = () => {
    navigate(-1);
  };

  const [addComment, setAddComment] = useState({
    text: "",
    userId: "",
    vlogId: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAddComment((prev) => ({
      ...prev,
      [name]: value,
      userId: userI?._id,
      vlogId: vlog?._id,
    }));
  };

  const handleOnComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${url}${vlogrl}/comment`, addComment, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      dispatch(getRefresh());
      setShowComments(true);
      successToast(data?.message);
      setAddComment({ text: "" });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      errorToast(error?.response?.data?.message || error.message);
    }
  };

  const handleWishlistClick = async (vlogId) => {
    try {
      const { data } = await axios.post(
        `${url}${user}/savepost/${vlogId}`,
        {
          userId: userI?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log(data.message);
      successToast(data?.message);
      dispatch(getRefresh());
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
      errorToast(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="relative p-6 mt-6  bg-gray-200 overflow-hidden flex flex-col w-full max-w-full mx-auto transition-transform duration-300 ease-in-out transform border-t-gray-400 border dark:bg-gray-900">
      {/* Icons for back and wishlist */}
      <div className="absolute top-16 right-10 flex space-x-4 z-10">
        {userI?._id !== vlog?.userId?._id && (
          <button
            onClick={() => handleWishlistClick(vlog?._id)}
            className="relative group hover:text-red-600 transition"
            aria-label="Wishlist"
          >
            <MdOutlineBookmarkAdd size={24} />
            {/* Tooltip */}
            <span className="absolute bottom-full right-0 mb-2 p-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity text-nowrap dark:text-gray-400">
              Add to favorites
            </span>
          </button>
        )}
        <button
          onClick={handleBackClick}
          className="text-gray-700 hover:text-gray-900 transition"
          aria-label="Back"
        >
          <HiArrowLeft size={24} />
          <span className="absolute bottom-full right-0 mb-2 p-1 text-xs text-white bg-black rounded opacity-0 hover:opacity-100 transition-opacity text-nowrap dark:text-gray-200">
            Go back
          </span>
        </button>
      </div>

      <div className="p-6 flex flex-col">
        <div className="flex items-center mb-4">
          <img
            className="w-16 h-16 rounded-full border border-gray-400 mr-4"
            src={
              vlog?.userId?.profileImage ||
              "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
            }
            alt="User Profile"
          />
          <span className="text-gray-900 font-medium text-lg dark:text-gray-300">
            @{vlog?.userId?.fullName}
          </span>
        </div>

        {/* Title above description */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-300">
          {vlog?.title || "Title"}
        </h2>
        <p className="text-gray-700 text-base mb-6 dark:text-gray-300">
          {vlog?.description}
        </p>

        {/* New Information: Categories and Date */}
        <div className="flex justify-between gap-2 mb-4">
          <span className="bg-gray-300 p-2 text-gray-700 text-xs px-2 py-1 rounded-full inline-block mb-2">
            {(vlog?.categories && vlog?.categories[0]) || "Category"}
          </span>
          <span className="text-gray-500 text-sm">
            {formattedDate} at {formattedTime} ({year}) - {relativeTime}
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="w-full h-[80vh] flex items-center justify-center overflow-hidden relative">
          <img
            className="object-cover rounded-md"
            src={
              vlog?.postImage ||
              "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360"
            }
            alt="Vlog Cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-white">
          {/* Title overlay on image */}
          <h2 className="text-2xl font-bold dark:text-gray-300">
            {vlog?.title || "Title"}
          </h2>
        </div>
      </div>

      <div className="p-6 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <button
            onClick={() => handleCommentClick()}
            className="bg-gray-400 text-black p-2 rounded-lg text-base hover:bg-gray-500 dark:bg-gray-800 transition dark:text-gray-300"
          >
            {getAllComent && getAllComent?.length === 0
              ? "No comments"
              : `All comments ${getAllComent?.length}`}
          </button>
          <div className="space-y-4 my-4 ">
            {!showComments && (
              <>
                <input
                  className="w-fit p-2 mx-2 rounded-lg ring-1 ring-gray-400 focus:outline-gray-800 dark:ring-gray-800 outline-none dark:text-gray-300 dark:bg-gray-900"
                  name="text"
                  type="text"
                  placeholder="Add a comment"
                  onChange={handleOnChange}
                  value={addComment.text}
                  required
                  autoComplete="off"
                />
                <button
                  disabled={isLoading}
                  onClick={handleOnComment}
                  className="bg-black dark:text-gray-300 dark:bg-gray-800 text-white p-2 ml-2 rounded-lg text-base hover:bg-gray-500 transition"
                >
                  {isLoading ? "Commenting..." : "Comment"}
                </button>
              </>
            )}
          </div>
        </div>
        {showComments && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg w-full dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-300">
              Comments
            </h3>
            <ul className="space-y-8 w-full dark:text-gray-300 dark:bg-gray-800">
              <li className="p-4 bg-white rounded shadow-sm w-full dark:text-gray-300 dark:bg-gray-800">
                <GetVlogComments />
              </li>
              <li className="p-4 rounded shadow-sm">
                <div className="space-y-5 ">
                  <input
                    className="w-fit p-2 mx-2 rounded-lg ring-1 ring-gray-400 focus:outline-gray-300 outline-none dark:text-gray-300 dark:bg-gray-800"
                    name="text"
                    type="text"
                    placeholder="Add a comment"
                    onChange={handleOnChange}
                    value={addComment.text}
                    required
                    autoComplete="off"
                  />
                  <button
                    onClick={handleOnComment}
                    disabled={isLoading}
                    className="bg-black ml-2 dark:text-gray-300 dark:bg-gray-600 text-white p-2 rounded-lg text-base hover:bg-gray-500 transition dark:outline-gray-800"
                  >
                    {isLoading ? "Commenting..." : "Comment"}
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
