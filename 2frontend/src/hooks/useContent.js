import { useState } from "react";
import api from "../api";

export function useContent() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchMindMap(userId) {
    setLoading(true);
    const res = await api.get(`/content/mindmap/${userId}`);
    setContents(res.data.data.nodes || []);
    setLoading(false);
    return res.data.data;
  }

  async function createContent(form) {
    const res = await api.post("/content/create", form);
    return res.data.data;
  }

  async function getInsights(contentId) {
    const res = await api.get(`/content/insights/${contentId}`);
    return res.data.data;
  }

  async function getRecommendations() {
    const res = await api.get("/content/recommendations");
    return res.data.data;
  }

  return { contents, fetchMindMap, createContent, getInsights, getRecommendations, loading };
}