import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function PromptCard({ prompt, onDelete}) {
  const { user, API } = useAuth();
  const [likes, setLikes] = useState(prompt.likes?.length || 0);
  const [liked, setLiked] = useState(
    prompt.likes?.includes(user?._id) || false,
  );

  // console.log(path);

  const handleLike = async () => {
    if (!user) {
      toast.error("Login to like prompts");
      return;
    }

    try {
      const res = await axios.put(`${API}/prompts/${prompt._id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      toast.error("Failed to like");
    }
  };

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 transition flex flex-col gap-3 cursor-pointer">
      {/* Title and category */}
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/prompts/${prompt._id}`}
          className="text-sm font-semibold text-gray-800 hover:text-blue-500 transition line-clamp-2"
        >
          {prompt.title}
        </Link>
        <span className="px-2 py-1 bg-white text-blue-700 rounded-full text-xs border whitespace-nowrap">
          {prompt.category}
        </span>
      </div>

      {/* Description */}
      {prompt.description && (
        <p className="text-xs text-gray-600 line-clamp-2">
          {prompt.description}
        </p>
      )}

      {/* Content preview */}
      <div className="bg-white rounded-lg p-2 border">
        <p className="text-xs text-gray-700 line-clamp-3 font-mono">
          {prompt.content}
        </p>
      </div>

      {/* Tags */}
      {prompt.tags?.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {prompt.tags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-black/10 text-black/70 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Author and likes */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-2 mt-auto">
        <div className="flex items-center gap-2 text-xs">
          Posted by:
          <span className=" text-gray-600">{prompt.author?.username}</span>
        </div>

        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-xs border px-2 py-1 rounded-full hover:bg-red-100 transition duration-300"
        >
          {liked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="17px"
              viewBox="0 -960 960 960"
              width="17px"
              fill="#0000F5"
            >
              <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="17px"
              viewBox="0 -960 960 960"
              width="17px"
              fill="#000000"
            >
              <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
            </svg>
          )}
          {likes}
        </button>
      </div>
      {
        user?._id == prompt.author._id && <div className="flex justify-between gap-1 text-xs text-gray-600">
          <Link to={`/edit/${prompt._id}`} className="flex-1 border hover:border-green-500 transition duration-300 p-2 rounded-lg bg-white text-center">Edit</Link>
          <button onClick={() => onDelete(prompt._id)} className="flex-1 border hover:border-red-500 transition duration-300 p-2 rounded-lg bg-white">Delete</button>
        </div>
      }
    </div>
  );
}

export default PromptCard;
