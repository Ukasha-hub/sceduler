import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API from '../API';

const AssetVideos = () => {
  const navigate = useNavigate();
  
  const location = useLocation();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('asset_id');

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
  
    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null, // hide 00h if not needed
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0")
    ]
      .filter(Boolean) // removes null if hrs = 0
      .join(":");
  };

 

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await API.get(`/api/v1/assets/single?asset_id=${id}`);
        setVideo(response.data); // assuming API returns the object directly
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to fetch video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);


  

  if (loading) return <p>Loading video...</p>;
  if (error) return <p>{error}</p>;
  if (!video) return <p>Video not found</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
      >
        ⬅ Back
      </button>

      <div className="p-4 border-2 w-full flex flex-col lg:flex-row gap-6 justify-between h-screen">
      <div className="w-full lg:w-3/5 aspect-video">
  <iframe
    width="100%"
    height="315"
    src={video.lowres_url}
    title={video.file_name}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  ></iframe>

  {/* ✅ Download button */}
  <div className="relative inline-block mt-3">
    {/* Dropdown Button */}
    <button
      onClick={() => setIsOpen(prev => !prev)}
      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center gap-2"
    >
      ⬇ Download
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {/* Dropdown Menu */}
    {isOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
        <a
      href={`${API.defaults.baseURL}/api/v1/download/original/${id}`}
      download={video.file_name}
      className="block px-4 py-2 text-sm hover:bg-gray-100"
    >
      Original Quality
    </a>

    <a
      href={`${API.defaults.baseURL}/api/v1/download/lowres/${id}`}
      download={video.file_name}
      className="block px-4 py-2 text-sm hover:bg-gray-100"
    >
      Low Quality
    </a>
      </div>
    )}
  </div>
</div>

        <div className="flex flex-col gap-2 text-xs">
          <h1 className="text-xl font-bold">{video.file_name}</h1>
          <p>
            <span className="font-bold">Author: </span>
            {video.created_by}
          </p>
          <p>
            <span className="font-bold">Mime type: </span>
            {video.mime_type}
          </p>
          <p>
            <span className="font-bold">Publishing Date: </span>
            {new Date(video.created_at).toLocaleString()}
          </p>

          <hr />

          <p>
            <span className="font-bold">Codec: </span>
            {video.codec}
          </p>
          <p>
            <span className="font-bold">Width: </span>
            {video.width} pixels
          </p>
          <p>
            <span className="font-bold">Height: </span>
            {video.height} pixels
          </p>
          <p>
            <span className="font-bold">Frame Rate: </span>
            {video.frame_rate}
          </p>
          <p>
            <span className="font-bold">Bit Rate: </span>
            {video.bitrate}
          </p>
          <p>
            <span className="font-bold">Duration: </span>
            {formatDuration(video.duration)}
          </p>
          <p>
            <span className="font-bold">Size: </span>
            {video.file_size_kb} KB
          </p>
          <p>
            <span className="font-bold">Format: </span>
            {video.file_ext}
          </p>
          <p>
            <span className="font-bold">Category: </span>
            {video.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetVideos;
