import React from 'react';


export default function Modal({ open, children, onClose }: { open: boolean; children: React.ReactNode; onClose: () => void; }) {
if (!open) return null;
return (
<div style={{ position: 'fixed', inset:0, background: 'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
<div style={{ background:'#fff', padding:20, borderRadius:8, minWidth:300 }}>
{children}
<div style={{ marginTop:12 }}>
<button onClick={onClose}>Close</button>
</div>
</div>
</div>
);
}