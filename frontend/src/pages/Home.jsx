import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-accentdeep font-semibold text-sm uppercase tracking-wide mb-3">For students & recruiters</p>
        <h1 className="font-display text-5xl font-extrabold text-ink leading-tight mb-6">
          Find your next <span className="text-accent">opportunity</span>, faster.
        </h1>
        <p className="text-lg text-ink/60 mb-8 max-w-md">
          Browse internships and jobs, or post open roles for students to discover — all in one focused place.
        </p>
        <div className="flex gap-4">
          <Link to="/postings" className="bg-accent hover:bg-accentdeep text-ink font-semibold px-6 py-3 rounded-lg shadow-sm transition">
            Browse Postings
          </Link>
          <Link to="/register" className="text-ink font-medium px-6 py-3 rounded-lg border border-line hover:border-ink/40 transition">
            Get Started
          </Link>
        </div>
      </div>

      <div className="relative h-72 hidden md:block">
        <div className="absolute top-4 left-8 w-64 bg-white border border-line rounded-xl shadow-md p-4 rotate-[-6deg]">
          <p className="text-xs text-accentdeep font-semibold mb-1">RECRUITER</p>
          <p className="font-display font-bold text-ink">Frontend Intern</p>
          <p className="text-sm text-ink/50">TechNova Pvt Ltd</p>
        </div>
        <div className="absolute top-16 left-24 w-64 bg-white border border-line rounded-xl shadow-lg p-4 rotate-[3deg]">
          <p className="text-xs text-accentdeep font-semibold mb-1">OPEN</p>
          <p className="font-display font-bold text-ink">Backend Developer</p>
          <p className="text-sm text-ink/50">CloudWorks Inc.</p>
        </div>
        <div className="absolute top-32 left-12 w-64 bg-white border border-line rounded-xl shadow-xl p-4 rotate-[-2deg]">
          <p className="text-xs text-accentdeep font-semibold mb-1">NEW</p>
          <p className="font-display font-bold text-ink">Data Analyst</p>
          <p className="text-sm text-ink/50">Insight Labs</p>
        </div>
      </div>
    </div>
  );
}

export default Home;