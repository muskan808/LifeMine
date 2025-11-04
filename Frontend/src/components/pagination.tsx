import React from 'react';


export default function Pagination({ current, totalPages, onChange }: { current: number; totalPages: number; onChange: (p: number) => void; }) {
return (
<div style={{ marginTop: 12 }}>
<button disabled={current === 1} onClick={() => onChange(current - 1)}>Prev</button>
<span style={{ margin: '0 8px' }}>{current} / {totalPages}</span>
<button disabled={current === totalPages} onClick={() => onChange(current + 1)}>Next</button>
</div>
);
}