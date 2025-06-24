export default function MindMap({ nodes = [], links = [] }) {
  // For simplicity, a list; use a visualization lib for real mind maps
  return (
    <div className="bg-gray-100 rounded p-4 min-h-[200px]">
      <h3 className="font-bold mb-2">Knowledge Nodes</h3>
      <ul>
        {nodes && nodes.length ? nodes.map(n => (
          <li key={n.id || n._id} className="mb-1">{n.title}</li>
        )) : <li className="text-gray-500">No data</li>}
      </ul>
    </div>
  );
}