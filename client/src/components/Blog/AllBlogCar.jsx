import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};

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

const AllBlogCard = ({ vlog, key }) => {
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Format the creation date
  const formattedDate = vlog?.createdAt
    ? formatDate(vlog.createdAt)
    : "Date Not Available";

  // Get relative time
  const relativeTime = vlog?.createdAt
    ? timeAgo(vlog.createdAt)
    : "Unknown time";

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div
      onClick={() => navigate(`/blog/${vlog?._id}`)}
      key={key}
      className="flex mx-10  flex-col md:flex-row bg-gray-200 text-gray-400 shadow-lg m-4 rounded-lg overflow-hidden dark:bg-gray-900 transition-transform cursor-pointer"
    >
      {/* Left Side - Image */}
      <div className="flex-shrink-0 p-5">
        <img
          src={
            vlog?.postImage ||
            "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360"
          }
          alt="Vlog Thumbnail"
          className="w-full h-48 dark:border-gray-700 dark:rounded-md border-gray-300 border-[1px] rounded-sm md:w-80 md:h-52 object-contain"
        />
      </div>
      {/* Right Side - Content */}
      <div className="p-4 flex-1">
        {/* Category */}
        <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full inline-block mb-2 dark:bg-gray-600 dark:text-gray-200">
          {(vlog?.categories && vlog?.categories[0]) || "Category"}
        </div>

        {/* Blog Title and Date */}
        <div className="text-xs flex flex-col md:flex-row justify-between text-gray-900 mb-2 dark:text-gray-400">
          <h2 className="text-xl font-semibold mb-2 md:mb-0">{vlog?.title}</h2>
          <div className="flex flex-col md:flex-row md:items-center">
            <span className="block md:inline">{formattedDate}</span>
            <span className="text-gray-500 text-sm ml-2 md:ml-4 block md:inline">
              {relativeTime}
            </span>
          </div>
        </div>

        {/* Username */}
        <p className="text-sm text-gray-900 mb-2 dark:text-gray-400">
          by @{vlog?.userId?.fullName}
        </p>

        {/* Description */}
        <p className="text-gray-900 mb-4 dark:text-gray-400">
          {showFullDescription
            ? vlog?.description || "Description"
            : `${vlog?.description?.slice(0, 100)}${
                vlog?.description?.length > 100 ? "..." : ""
              }`}
        </p>

        {/* Toggle Button */}
        <button
          onClick={toggleDescription}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          {showFullDescription ? (
            "Show Less"
          ) : (
            <button
              onClick={() => navigate(`/blog/${vlog?._id}`)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 dark:text-gray-400 dark:bg-gray-800 mt-2"
            >
              Read More
            </button>
          )}
        </button>
      </div>
    </div>
  );
};

export default AllBlogCard;
