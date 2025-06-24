import { useState } from "react";
import { useContent } from "../hooks/useContent";

export default function ContentForm({ onClose }) {
  const { createContent, getInsights } = useContent();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [insights, setInsights] = useState(null);

  async function handleAnalyze() {
    const temp = await createContent({ title, body });
    const ai = await getInsights(temp._id);
    setInsights(ai);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await createContent({ title, body });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form className="bg-white p-6 rounded w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="font-bold text-lg mb-4">Add Knowledge</h2>
        <input className="w-full mb-2 p-2 border rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="w-full mb-2 p-2 border rounded" placeholder="Body" value={body} onChange={e => setBody(e.target.value)} rows={5} />
        <div className="flex space-x-2 mb-2">
          <button type="button" onClick={handleAnalyze} className="bg-blue-500 text-white px-2 py-1 rounded">Analyze with AI</button>
          <button type="submit" className="bg-indigo-600 text-white px-2 py-1 rounded">Save</button>
          <button type="button" onClick={onClose} className="border px-2 py-1 rounded">Cancel</button>
        </div>
        {insights && (
          <div className="bg-blue-50 p-2 rounded mt-2">
            <div><strong>Summary:</strong> {insights.summary}</div>
            <div><strong>Keywords:</strong> {(insights.keywords || []).join(", ")}</div>
          </div>
        )}
      </form>
    </div>
  );
}