"use client";

import { useState } from "react";

const videos = [
  { id: "HKZ-wcZfQqk", title: "Company profile", summary: "Meet AYS and its team", label: "AYS company profile" },
  { id: "w61bxEMxzHo", title: "What AYS does", summary: "An introduction to the business", label: "An introduction to the AYS business" },
  { id: "9S-72Uu42oY", title: "Problems AYS addresses", summary: "Common service challenges", label: "Common service challenges" },
  { id: "NwhkkwNDG5s", title: "Ways to earn", summary: "The business model", label: "Ways to earn with AYS" },
  { id: "nsZSrJ4sCWU", title: "Building a community", summary: "Why the network matters", label: "Why the AYS network matters" },
  { id: "3jkCMrZnmmg", title: "More technology opportunities", summary: "Other ways to take part", label: "Other ways to take part" },
];

export function VideoSeries() {
  const [current, setCurrent] = useState(0);
  const video = videos[current];

  function select(index: number) {
    setCurrent((index + videos.length) % videos.length);
  }

  return (
    <div className="video-experience">
      <div className="video-stage">
        <div className="video-ratio">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
            title={video.label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="video-caption">
          <div><span>Part {current + 1} of {videos.length}</span><h3>{video.title}</h3></div>
          <div className="video-controls">
            <button type="button" onClick={() => select(current - 1)} aria-label="Previous video">Previous</button>
            <button type="button" onClick={() => select(current + 1)} aria-label="Next video">Next</button>
          </div>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${((current + 1) / videos.length) * 100}%` }} />
        </div>
      </div>

      <ol className="video-list">
        {videos.map((item, index) => (
          <li key={item.id}>
            <button
              className={`video-item ${index === current ? "active" : ""}`}
              type="button"
              onClick={() => select(index)}
              aria-current={index === current ? "step" : undefined}
            >
              <span>{index + 1}</span>
              <div><strong>{item.title}</strong><small>{item.summary}</small></div>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
