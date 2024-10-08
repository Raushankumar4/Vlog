import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { url, vlogrl } from "../../constant";
import { toast } from "react-hot-toast";
import { getRefresh } from "../Redux/Store/Slices/vlogSlice";
import { useDispatch, useSelector } from "react-redux";
import { errorToast, successToast } from "../Notify/Notify";

const CommentCard = ({ comment, onDelete = () => {} }) => {
  const [editComment, setEditComment] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.user.user);
  const [updatedComment, setUpdatedComment] = useState({
    text: comment?.text || "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUpdatedComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditCommet = async (commentId) => {
    try {
      if (!token) return errorToast("Please login first");
      const { data } = await axios.put(
        `${url}${vlogrl}/updatecomment/${commentId}`,
        updatedComment,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      dispatch(getRefresh());
      setEditComment(false);
      successToast(data?.message);
    } catch (error) {
      errorToast(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div
      key={comment?._id}
      className="w-full  bg-white shadow-lg rounded-lg overflow-hidden mb-4"
    >
      {/* User Profile and Comment Section */}
      <div className="flex flex-col sm:flex-row items-start p-4  dark:text-gray-300 dark:bg-gray-800 ">
        <div className="flex-shrink-0">
          <img
            className="w-12 h-12 rounded-full mb-2 sm:mb-0"
            src={
              comment?.userId?.profileImage || "https://via.placeholder.com/150"
            }
            alt="User profile"
          />
        </div>
        <div className="ml-0 sm:ml-4 flex-1  dark:bg-gray-800">
          <p className="text-lg font-semibold dark:text-gray-300 ">
            @{comment?.userId?.fullName}
          </p>
          <p className="text-gray-600 text-sm dark:text-gray-400">
            {comment?.userId?.email}
          </p>
        </div>
      </div>

      {/* Comment Text and Actions */}
      <div className="p-4 w-full dark:text-gray-300 dark:bg-gray-800">
        <ul className="space-y-4">
          <li className="p-4 bg-gray-50   rounded-lg flex flex-col sm:flex-row justify-between items-center dark:text-gray-300 dark:bg-gray-700">
            <p
              className={`${
                editComment ? "hidden" : "block"
              } text-gray-800 mb-2 sm:mb-0 dark:text-gray-300  `}
            >
              {comment?.text}
            </p>
            <p
              className={`${
                !editComment ? "hidden" : "block"
              } text-gray-800 mb-2 sm:mb-0 `}
            >
              <input
                type="text"
                name="text"
                value={updatedComment.text}
                onChange={handleOnChange}
                placeholder="Edit Comment"
                className="border outline-none  dark:ring-gray-800 dark:text-gray-300 dark:bg-gray-800 rounded-md p-2 w-full"
              />

              <button
                onClick={() => handleEditCommet(comment?._id)}
                className="mx-2 text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                Save
              </button>
            </p>
            <div className="flex gap-2">
              {currentUser?._id === comment?.userId?._id && (
                <>
                  <button
                    onClick={() => setEditComment(true)}
                    className="text-blue-500 hover:text-blue-700 focus:outline-none dark:text-gray-300 dark:bg-gray-800"
                  >
                    <FaEdit size={16} />
                  </button>
                </>
              )}
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommentCard;
