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
          <div key={idx} className="category-item" onClick={() => onCategoryClick(cat.name)}>
            <div className="category-icon-circle">
              <Icon size={28} color="var(--text-muted)" strokeWidth={1.5} />
            </div>
            <span className="category-label">{cat.name}</span>
          </div>
        );
      })}
    </div>
  );
}
