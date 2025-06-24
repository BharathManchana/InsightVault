import { useEffect, useState } from "react";
import { useContent } from "../hooks/useContent";
import MindMap from "./MindMap";
import Recommendations from "./Recommendations";
import ContentForm from "./ContentForm";

export default function Dashboard({ user }) {
  const { fetchMindMap, getRecommendations } = useContent();
  const [mindMap, setMindMap] = useState({ nodes: [], links: [] });
  const [recs, setRecs] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMindMap(user._id).then(setMindMap);
      getRecommendations().then(setRecs);
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={() => setShowForm(true)}>Add Content</button>
      </div>
      {showForm && <ContentForm onClose={() => setShowForm(false)} />}
      <div className="my-6">
        <MindMap nodes={mindMap.nodes} links={mindMap.links} />
      </div>
      <Recommendations recs={recs} />
    </div>
  );
}