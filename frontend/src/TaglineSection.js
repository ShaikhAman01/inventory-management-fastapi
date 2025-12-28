import React from 'react';
import { ShieldCheck } from 'lucide-react';

const TaglineSection = () => {
  return (
    <div style={{ 
      background: 'linear-gradient(to bottom right, #4f46e5, #3730a3)', 
      borderRadius: '12px', 
      padding: '1.5rem', 
      color: 'white' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <ShieldCheck size={20} />
        <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise Secure</span>
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>Smart Inventory Control</h3>
      <p style={{ margin: 0, fontSize: '13px', opacity: 0.8, lineHeight: '1.5' }}>
        Real-time tracking and management powered by a high-performance FastAPI backbone.
      </p>
    </div>
  );
};

export default TaglineSection;