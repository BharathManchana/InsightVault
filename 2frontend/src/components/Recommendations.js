export default function Recommendations({ recs = [] }) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">AI Recommendations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recs && recs.length ? recs.map((r, idx) => (
          <div key={idx} className="p-3 bg-white rounded shadow">
            <div className="font-bold">{r.title}</div>
            <div className="text-gray-700">{r.summary || r.body?.substring(0, 100)}</div>
          </div>
        )) : <div className="text-gray-500">No recommendations</div>}
      </div>
    </div>
  );
}