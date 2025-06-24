import axios from "axios";
import Content from "../models/content.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// AI API details
const HF_API = "https://api-inference.huggingface.co/models";
const HF_HEADERS = { Authorization: `Bearer ${process.env.HF_API_KEY}` };

// 1. Create Content
const createContent = async (req, res) => {
  const { title, body, type } = req.body;
  const user = req.user;

  // Save content to DB
  const content = await Content.create({
    title, body, type, owner: user._id
  });

  res.status(201).json(new ApiResponse(201, content, "Content created successfully"));
};

// 2. Get AI Insights
const getContentInsights = async (req, res) => {
  const { contentId } = req.params;
  const content = await Content.findById(contentId);

  // AI Summary
  const summaryRes = await axios.post(
    `${HF_API}/facebook/bart-large-cnn`,
    { inputs: content.body },
    { headers: HF_HEADERS }
  );
  // AI Keywords
  const keywordsRes = await axios.post(
    `${HF_API}/yanekyuk/bert-keyword-extractor`,
    { inputs: content.body },
    { headers: HF_HEADERS }
  );

  res.status(200).json(new ApiResponse(200, {
    summary: summaryRes.data[0]?.summary_text,
    keywords: keywordsRes.data,
  }, "Insights generated"));
};

// 3. Generate MindMap (simple: connect by keyword intersection)
const generateMindMap = async (req, res) => {
  const userId = req.params.userId;
  const contents = await Content.find({ owner: userId });
  // Simple mapping: intersecting keywords = related
  let nodes = contents.map(c => ({
    id: c._id,
    title: c.title,
    keywords: c.keywords || [],
  }));
  let links = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].keywords.some(k => nodes[j].keywords.includes(k))) {
        links.push({ source: nodes[i].id, target: nodes[j].id });
      }
    }
  }
  res.json(new ApiResponse(200, { nodes, links }, "Mind map generated"));
};

// 4. Get AI Recommendations (dummy: fetch latest content)
const getContentRecommendations = async (req, res) => {
  const user = req.user;
  const recs = await Content.find({ owner: { $ne: user._id } }).sort({ createdAt: -1 }).limit(5);
  res.json(new ApiResponse(200, recs, "Recommended content"));
};

// Export functions at the bottom
export {
  createContent,
  getContentInsights,
  generateMindMap,
  getContentRecommendations
};
