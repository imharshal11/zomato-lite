'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabNavProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function TabNav({ tabs, defaultTab = tabs[0]?.id, className = '' }: TabNavProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className={`flex w-full border-b border-[#f1f0eb] ${className}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium rounded-t-xl transition-all duration-150 border-b-2 -mb-px whitespace-nowrap ${
            activeTab === tab.id
              ? 'text-[#e23744] border-[#e23744] bg-[#fef2f2]'
              : 'text-[#6b6b6b] hover:text-[#e23744] hover:bg-[#fef2f2] border-transparent'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold ${
              activeTab === tab.id
                ? 'bg-[#e23744] text-white'
                : 'bg-[#f1f0eb] text-[#6b6b6b]'
            }`}>
            {tab.count}
          </span>
        )}
      </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

export function TabPanel({ id, children }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className="animate-fade-in"
    >
      {children}
    </div>
  );
}