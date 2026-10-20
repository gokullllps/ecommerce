export default function FontTestPage() {
  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111111] p-8 sm:p-16 flex flex-col items-center justify-center space-y-12">
      <div className="w-full max-w-4xl bg-white p-8 sm:p-12 border border-[#D9D8D3] shadow-sm">
        <h1 className="text-xs font-sans tracking-[0.2em] uppercase text-[#666666] mb-8 pb-4 border-b border-[#D9D8D3]">
          PABLO Official Typography Verification — Orborn by Nikola Nikolov
        </h1>

        {/* 1. Main Campaign Title */}
        <div className="mb-10 pb-8 border-b border-[#D9D8D3]">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#999999] block mb-2">
            Specimen 1: Homepage Campaign Headline
          </span>
          <div
            className="text-5xl sm:text-6xl lg:text-7xl text-[#111111] leading-tight select-none uppercase"
            style={{ fontFamily: "'Orborn', sans-serif", fontKerning: "normal" }}
          >
            THE AUTUMN /<br />
            WINTER EDIT
          </div>
          <p className="text-xs text-[#666666] font-sans mt-3">
            Authentic Orborn geometry: circular O, curved arch on M, N, R, U, and signature diagonal cuts on E, C.
          </p>
        </div>

        {/* 2. Section Headings */}
        <div className="mb-10 pb-8 border-b border-[#D9D8D3]">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#999999] block mb-2">
            Specimen 2: Section Titles (NEW IN & CATEGORIES)
          </span>
          <div
            className="text-4xl sm:text-5xl lg:text-6xl text-[#111111] leading-normal select-none uppercase space-y-2"
            style={{ fontFamily: "'Orborn', sans-serif", fontKerning: "normal" }}
          >
            <div>NEW IN</div>
            <div>CATEGORIES</div>
          </div>
        </div>

        {/* 3. Navigation Links */}
        <div className="mb-10 pb-8 border-b border-[#D9D8D3]">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#999999] block mb-2">
            Specimen 3: Primary Navigation Links
          </span>
          <div
            className="text-xl sm:text-2xl text-[#111111] tracking-[0.14em] select-none uppercase flex flex-wrap gap-6"
            style={{ fontFamily: "'Orborn', sans-serif", fontKerning: "normal" }}
          >
            <span>MEN</span>
            <span>WOMEN</span>
            <span>KIDS</span>
            <span>SALE</span>
            <span>ABOUT</span>
          </div>
        </div>

        {/* 4. Complete Alphabet Specimen */}
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#999999] block mb-2">
            Specimen 4: Complete Alphabet (A–Z) from Nikola Nikolov Specimen
          </span>
          <div
            className="text-2xl sm:text-3xl lg:text-4xl text-[#111111] uppercase tracking-[0.12em] leading-relaxed select-none"
            style={{ fontFamily: "'Orborn', sans-serif", fontKerning: "normal" }}
          >
            A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
          </div>
        </div>
      </div>
    </div>
  );
}
