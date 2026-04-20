import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, updateUser, API } = useAuth();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await axios.put(`${API}/auth/profile`, { username, bio });
      updateUser(res.data);
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setEditing(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Profile</h1>

        <div className="border border-gray-200 rounded-lg p-8">
          {/* User avatar and name section */}
          <div className="flex items-center gap-4 pb-8 mb-8 border-b border-gray-200">
            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">{user?.username}</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {editing ? (
            // Edit mode
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (optional)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-right text-xs text-gray-500 mt-1">{bio.length}/200</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Username</p>
                <p className="text-gray-800">{user?.username}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Email</p>
                <p className="text-gray-800">{user?.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Bio</p>
                <p className="text-gray-800">{user?.bio || "No bio yet"}</p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
