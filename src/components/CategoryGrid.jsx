import React from 'react';
import { Shield, Zap, Droplets, Disc3, FlaskConical, Briefcase } from 'lucide-react';

const CATEGORIES = [
  { name: 'Helmets', icon: Shield },
  { name: 'Exhausts', icon: Zap },
  { name: 'Filters', icon: FlaskConical },
  { name: 'Brakes', icon: Disc3 },
  { name: 'Lubricants', icon: Droplets },
  { name: 'Luggage', icon: Briefcase },
];

export default function CategoryGrid({ onCategoryClick }) {
  return (
    <div className="category-grid">
      {CATEGORIES.map((cat, idx) => {
        const Icon = cat.icon;
        return (
          <div
            key={idx}
            className="category-item"
            onClick={() => onCategoryClick(cat.name)}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="category-icon-circle">
              <span className="category-icon-halo" />
              <Icon size={28} color="var(--text-muted)" strokeWidth={1.5} className="category-icon-svg" />
            </div>
            <span className="category-label">{cat.name}</span>
            <span className="category-hover-line" />
          </div>
        );
      })}
    </div>
  );
}
