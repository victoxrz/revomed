"use client";
import { useState } from "react";

export default function EntityTabs({
  tabs,
}: {
  tabs: { label: string; content: React.ReactNode }[];
}) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="tabs tabs-border border-b mb-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            className={`tab ${
              activeTab === index
                ? "tab-active text-primary hover:text-primary"
                : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.find((_tab, index) => index === activeTab)?.content}
    </>
  );
}
