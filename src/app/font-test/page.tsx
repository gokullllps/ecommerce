export default function FontTestPage() {
  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111111] p-8 sm:p-16 flex flex-col items-center justify-center space-y-12">
      <div className="w-full max-w-4xl bg-white p-8 sm:p-12 border border-[#D9D8D3] shadow-sm">
        <h1 className="text-xs font-sans tracking-[0.2em] uppercase text-[#666666] mb-8 pb-4 border-b border-[#D9D8D3]">
          PABLO Editorial Typography Verification — Beverly (Pen Culture)
        </h1>

        {/* 1. Exact Beverly Wordmark as shown in Pen Culture specimen reference */}
        <div className="mb-10 pb-8 border-b border-[#D9D8D3]">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#999999] block mb-2">
            Specimen 1: Beverly with Signature B.salt Swash (\ue038)
          </span>
          <div
            className="text-7xl sm:text-8xl lg:text-9xl text-[#111111] leading-none select-none"
            style={{ fontFamily: "'Beverly', serif", fontKerning: "normal" }}
          >
            {'\ue038'}everly
          </div>
          <p className="text-xs text-[#666666] font-sans mt-3">
            Notice the signature curved lower loop on B, the high curved e, and long sweeping descender on y.
          </p>
        </div>

        {/* 2. Standard ASCII "Beverly" */}
        <div className="mb-10 pb-8 border-b border-[#D9D8D3]">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#999999] block mb-2">
            Specimen 2: Standard ASCII typing &quot;Beverly&quot;
          </span>
          <div
            className="text-6xl sm:text-7xl lg:text-8xl text-[#111111] leading-none select-none"
            style={{ fontFamily: "'Beverly', serif", fontKerning: "normal" }}
          >
            Beverly
          </div>
        </div>

        {/* 3. Individual Glyphs Requested by User */}
        <div className="mb-10 pb-8 border-b border-[#D9D8D3]">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#999999] block mb-2">
            Specimen 3: Individual Characters (B e v r l y o a s)
          </span>
          <div
            className="text-4xl sm:text-5xl lg:text-6xl text-[#111111] tracking-wide select-none"
            style={{ fontFamily: "'Beverly', serif", fontKerning: "normal" }}
          >
            B e v r l y o a s
          </div>
        </div>

        {/* 4. "NEW ARRIVALS" Headline */}
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#999999] block mb-2">
            Specimen 4: NEW ARRIVALS in Beverly (Natural Luxury Tracking)
          </span>
          <div
            className="text-4xl sm:text-5xl lg:text-6xl text-[#111111] uppercase tracking-[0.03em] select-none"
            style={{ fontFamily: "'Beverly', serif", fontKerning: "normal" }}
          >
            NEW ARRIVALS
          </div>
        </div>
      </div>
    </div>
  );
}
