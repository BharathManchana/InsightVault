import { useEffect, useState } from "react";
import api from "../api";

export default function Profile({ user }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      api.get(`/user/c/${user.username}`).then(res => setProfile(res.data.data));
    }
  }, [user]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="font-bold text-xl mb-2">{profile.fullName}</h2>
      <div className="mb-2"><b>Username:</b> {profile.username}</div>
      {profile.avatar && <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-full mb-2" />}
      <div><b>Email:</b> {profile.email}</div>
      {/* Add other profile fields as needed */}
    </div>
  );
}