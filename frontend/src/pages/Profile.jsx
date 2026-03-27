import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateUser, API } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`${API}/auth/profile`, formData);
      updateUser(res.data);
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ username: user?.username || "", bio: user?.bio || "" });
    setEditing(false);
  };

  return (
    <div className="app-shell">
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="mb-8 text-2xl font-bold theme-text">Your Profile</h1>

        <div className="surface-card rounded-2xl p-6 md:p-8">
          <div className="mb-7 flex items-center gap-4 border-b pb-7 theme-border">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-700 text-2xl font-bold text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold theme-text">{user?.username}</p>
              <p className="text-sm theme-text-muted">{user?.email}</p>
            </div>
          </div>

          {editing ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm theme-text-secondary">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="theme-input compact"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm theme-text-secondary">
                  Bio <span className="theme-text-muted">(optional)</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={200}
                  className="theme-input compact resize-none"
                />
                <p className="mt-1 text-right text-xs theme-text-muted">{formData.bio.length}/200</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-1 text-xs theme-text-muted">Username</p>
                <p className="text-sm theme-text">{user?.username}</p>
              </div>
              <div>
                <p className="mb-1 text-xs theme-text-muted">Email</p>
                <p className="text-sm theme-text">{user?.email}</p>
              </div>
              <div>
                <p className="mb-1 text-xs theme-text-muted">Bio</p>
                <p className="text-sm theme-text-secondary">{user?.bio || "No bio yet"}</p>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 w-full rounded-lg border py-2.5 text-sm transition-colors theme-border theme-text-secondary hover:border-violet-500 hover:text-violet-500"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <div className="surface-card mt-4 rounded-xl p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide theme-text-muted">Account</p>
          <div className="flex items-center justify-between">
            <p className="text-sm theme-text-secondary">Member since</p>
            <p className="text-sm theme-text-secondary">{new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
