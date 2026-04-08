import React, { useState, useEffect, useRef } from 'react';
import http from '@/config/http';
import { useParams } from 'react-router-dom';
import {
    Trophy, BarChart2, Globe, Clock, CheckCircle,
    Medal, Users, TrendingUp, Star, Award, Filter
} from 'lucide-react';

// API usage now handled by http instance

/* ─── helpers ─── */
const getInitials = n => n ? n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2) : '?';

/* Animated bar that fills only when visible */
function AnimatedBar({ pct, color, delay = 0 }) {
    const ref  = useRef(null);
    const [w, setW] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setTimeout(() => setW(pct), delay);
                obs.disconnect();
            }
        }, { threshold: 0.3 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [pct, delay]);

    return (
        <div ref={ref} style={{
            height: 10, background: 'var(--bg-main)', borderRadius: 20,
            overflow: 'hidden', border: '1px solid var(--border)'
        }}>
            <div style={{
                height: '100%', width: `${w}%`, background: color,
                borderRadius: 20, transition: 'width 1.4s cubic-bezier(0.1,0,0,1)'
            }} />
        </div>
    );
}

const VoteResults = () => {
    const { id: urlId } = useParams();
    const [votes, setVotes]             = useState([]);
    const [resultsData, setResultsData] = useState({});
    const [loading, setLoading]         = useState(true);
    const [activeCard, setActiveCard]   = useState(null); // expanded election id

    useEffect(() => {
        const load = async () => {
            try {
                const vRes  = await http.get('/votes');
                const done  = vRes.data.filter(v => v.status === 'ended' || v.status === 'published');
                setVotes(done);
                
                // Prioritize URL parameter, then first election
                if (urlId) setActiveCard(urlId);
                else if (done.length > 0) setActiveCard(done[0]._id);

                const map = {};
                await Promise.all(done.map(async v => {
                    try {
                        const r = await http.get(`/votes/${v._id}/results`);
                        map[v._id] = r.data;
                    } catch {}
                }));
                setResultsData(map);
            } catch {}
            finally { setLoading(false); }
        };
        load();
    }, [urlId]);

    /* rank candidates for a given vote */
    const getRanked = (voteId) => {
        const d = resultsData[voteId];
        if (!d) return [];
        const candidates = d.vote?.candidates || [];
        return [...candidates]
            .map(c => ({ ...c, count: d.results[c._id] || 0 }))
            .sort((a, b) => b.count - a.count);
    };

    const getTotal   = id => resultsData[id]?.totalVotes || 0;
    const getPct     = (id, cnt) => { const t = getTotal(id); return t > 0 ? (cnt / t * 100) : 0; };
    const getMargin  = (id) => {
        const ranked = getRanked(id);
        if (ranked.length < 2) return '—';
        const t = getTotal(id);
        return t > 0 ? `${((ranked[0].count - ranked[1].count) / t * 100).toFixed(1)}%` : '—';
    };

    const filtered = votes;

    /* Bar colors: 1st gold, 2nd silver, 3rd bronze, rest primary shades */
    const BAR_COLORS = [
        'linear-gradient(90deg,#f59e0b,#fbbf24)',
        'linear-gradient(90deg,#94a3b8,#cbd5e1)',
        'linear-gradient(90deg,#b45309,#d97706)',
        'linear-gradient(90deg,#6366f1,#8b5cf6)',
        'linear-gradient(90deg,#0891b2,#06b6d4)',
        'linear-gradient(90deg,#10b981,#34d399)',
    ];

    const PODIUM_STYLE = [
        { height: 110, bg: 'linear-gradient(160deg,#f59e0b,#fbbf24)', label: '🥇 1st', top: 0 },
        { height: 80,  bg: 'linear-gradient(160deg,#64748b,#94a3b8)', label: '🥈 2nd', top: 30 },
        { height: 60,  bg: 'linear-gradient(160deg,#92400e,#b45309)', label: '🥉 3rd', top: 50 },
    ];

    if (loading) return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16 }}>
            <div style={{ width:44, height:44, border:'3px solid var(--border)', borderTopColor:'#f59e0b', borderRadius:'50%', animation:'spin-vr 0.8s linear infinite' }} />
            <p style={{ color:'var(--text-muted)', fontWeight:600 }}>Loading election results…</p>
            <style>{`@keyframes spin-vr{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <>
        <style>{`
            .vr-page { min-height:100vh; background:var(--bg-main); padding:32px; }
            @media(max-width:900px){ .vr-page{ padding:20px; } }

            /* ── Header ── */
            .vr-hero { position:relative; background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.05)); border:1px solid var(--border); border-radius:24px; padding:36px 40px; margin-bottom:28px; overflow:hidden; }
            .vr-hero::before { content:''; position:absolute; right:-60px; top:-60px; width:260px; height:260px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,0.12),transparent 70%); pointer-events:none; }
            .vr-hero-title { font-size:2.2rem; font-weight:900; font-family:var(--font-heading); letter-spacing:-0.04em; background:linear-gradient(135deg,var(--primary),var(--secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
            .vr-hero-sub { font-size:0.9rem; color:var(--text-muted); margin-top:6px; max-width:560px; line-height:1.6; }
            .vr-hero-stats { display:flex; gap:24px; margin-top:20px; flex-wrap:wrap; }
            .vr-hs { display:flex; align-items:center; gap:8px; }
            .vr-hs-val { font-size:1.25rem; font-weight:800; color:var(--text-main); font-family:var(--font-heading); }
            .vr-hs-lbl { font-size:0.72rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.05em; }

            /* ── Type tabs ── */
            .vr-tabs { display:flex; gap:6px; background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:5px; margin-bottom:24px; flex-wrap:wrap; }
            .vr-tab { padding:8px 18px; border-radius:10px; font-size:0.8rem; font-weight:700; border:none; background:transparent; color:var(--text-muted); cursor:pointer; transition:all 0.15s; }
            .vr-tab.active { background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; box-shadow:0 2px 12px rgba(99,102,241,0.35); }
            .vr-tab:hover:not(.active) { color:var(--text-main); background:var(--bg-main); }

            /* ── Election list ── */
            .vr-list { display:flex; flex-direction:column; gap:6px; width:280px; flex-shrink:0; }
            .vr-list-item { padding:14px 18px; border-radius:14px; border:1.5px solid var(--border); background:var(--bg-card); cursor:pointer; transition:all 0.18s; }
            .vr-list-item:hover { border-color:rgba(99,102,241,0.35); }
            .vr-list-item.active { border-color:var(--primary); background:rgba(99,102,241,0.06); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
            .vr-list-title { font-size:0.88rem; font-weight:700; color:var(--text-main); margin-bottom:4px; }
            .vr-list-meta { font-size:0.7rem; color:var(--text-muted); display:flex; gap:6px; flex-wrap:wrap; }
            .vr-tag { font-size:0.6rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; padding:2px 8px; border-radius:5px; }

            /* ── Two-panel layout ── */
            .vr-layout { display:flex; gap:20px; align-items:flex-start; }
            @media(max-width:850px){ .vr-layout{ flex-direction:column; } .vr-list{ width:100%; flex-direction:row; overflow-x:auto; } }

            /* ── Detail panel ── */
            .vr-detail { flex:1; min-width:0; display:flex; flex-direction:column; gap:16px; }

            /* Winner Hero card */
            .vr-winner-hero { border-radius:22px; overflow:hidden; border:1px solid var(--border); }
            .vr-wh-top { padding:28px 32px; background:linear-gradient(135deg,#6366f1,#a855f7,#06b6d4); position:relative; display:flex; gap:24px; align-items:center; }
            .vr-wh-top::before { content:''; position:absolute; inset:0; background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
            .vr-wh-av { width:90px; height:90px; border-radius:22px; background:rgba(255,255,255,0.2); border:3px solid rgba(255,255,255,0.35); display:flex; align-items:center; justify-content:center; font-size:2.2rem; font-weight:900; color:white; flex-shrink:0; backdrop-filter:blur(8px); z-index:1; }
            .vr-wh-info { z-index:1; }
            .vr-wh-badge { display:inline-flex; align-items:center; gap:5px; background:rgba(255,255,255,0.18); color:white; font-size:0.65rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; padding:4px 12px; border-radius:20px; margin-bottom:8px; backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,0.2); }
            .vr-wh-name { font-size:1.5rem; font-weight:900; color:white; margin-bottom:4px; }
            .vr-wh-pct { font-size:2.4rem; font-weight:900; color:white; line-height:1; font-family:var(--font-heading); }
            .vr-wh-pct-lbl { font-size:0.72rem; color:rgba(255,255,255,0.7); font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-top:2px; }
            .vr-wh-mini-stats { display:flex; gap:0; background:var(--bg-card); border-top:1px solid var(--border); }
            .vr-wh-mini-stat { flex:1; padding:14px 0; text-align:center; border-right:1px solid var(--border); }
            .vr-wh-mini-stat:last-child { border-right:none; }
            .vr-wh-mini-val { font-size:1.1rem; font-weight:800; color:var(--text-main); font-family:var(--font-heading); }
            .vr-wh-mini-lbl { font-size:0.62rem; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-top:2px; }

            /* Podium */
            .vr-podium-wrap { background:var(--bg-card); border:1px solid var(--border); border-radius:22px; padding:28px; }
            .vr-podium-title { font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); margin-bottom:20px; display:flex; align-items:center; gap:6px; }
            .vr-podium { display:flex; gap:14px; align-items:flex-end; justify-content:center; height:200px; }
            .vr-podium-col { display:flex; flex-direction:column; align-items:center; gap:8px; flex:1; max-width:130px; }
            .vr-podium-name { font-size:0.78rem; font-weight:700; color:var(--text-main); text-align:center; line-height:1.3; }
            .vr-podium-pct { font-size:0.72rem; color:var(--text-muted); font-weight:600; }
            .vr-podium-bar { width:100%; border-radius:12px 12px 0 0; display:flex; align-items:flex-start; justify-content:center; padding-top:10px; transition:height 1.2s cubic-bezier(0.1,0,0,1); }
            .vr-podium-place { font-size:1.1rem; font-weight:900; color:white; }

            /* Detailed bars */
            .vr-bars-wrap { background:var(--bg-card); border:1px solid var(--border); border-radius:22px; padding:28px; }
            .vr-bars-title { font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); margin-bottom:20px; display:flex; align-items:center; gap:6px; }
            .vr-bar-row { display:flex; gap:14px; align-items:center; margin-bottom:18px; }
            .vr-bar-rank { width:22px; height:22px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:900; color:white; flex-shrink:0; }
            .vr-bar-left { flex:1; min-width:0; }
            .vr-bar-namerow { display:flex; justify-content:space-between; align-items:center; margin-bottom:7px; }
            .vr-bar-name { font-size:0.88rem; font-weight:700; color:var(--text-main); display:flex; align-items:center; gap:6px; }
            .vr-bar-stat { font-size:0.75rem; font-weight:700; color:var(--text-muted); white-space:nowrap; }

            /* empty */
            .vr-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 24px; gap:14px; text-align:center; background:var(--bg-card); border:2px dashed var(--border); border-radius:24px; }
        `}</style>

        <div className="vr-page">

            {/* Hero */}
            <div className="vr-hero">
                <h1 className="vr-hero-title">🏆 Election Results</h1>
                <p className="vr-hero-sub">
                    Certified results for all concluded elections. Data is tallied live from the database.
                </p>
                <div className="vr-hero-stats">
                    {[
                        { label:'Concluded', value: votes.length,         icon: CheckCircle, color:'#10b981' },
                        { label:'Total Votes Cast', value: Object.values(resultsData).reduce((s,d)=>s+(d?.totalVotes||0),0), icon: Users, color:'#a855f7' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div className="vr-hs" key={label}>
                            <div style={{ width:34, height:34, borderRadius:10, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <Icon size={16} style={{ color }} />
                            </div>
                            <div>
                                <div className="vr-hs-val">{value}</div>
                                <div className="vr-hs-lbl">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Election list */}

            {/* Empty state */}
            {filtered.length === 0 ? (
                <div className="vr-empty">
                    <div style={{ fontSize:'3.5rem' }}>📊</div>
                    <p style={{ fontWeight:700, fontSize:'1.05rem', color:'var(--text-main)' }}>No Results Yet</p>
                    <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', maxWidth:340 }}>
                        Elections appear here once they've ended. Active elections are on the <strong>Active Votes</strong> page.
                    </p>
                </div>
            ) : (
                <div className="vr-layout">
                    {/* Left list */}
                    <div className="vr-list">
                        {filtered.map(vote => {
                            const ranked = getRanked(vote._id);
                            const winner = ranked[0];
                            return (
                                <div
                                    key={vote._id}
                                    className={`vr-list-item ${activeCard === vote._id ? 'active' : ''}`}
                                    onClick={() => setActiveCard(vote._id)}
                                >
                                    <div className="vr-list-title">{vote.title}</div>
                                    <div className="vr-list-meta">
                                        {winner && <span style={{ fontSize:'0.72rem', color:'#10b981', fontWeight:700 }}>🏆 {winner.name}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right detail */}
                    {activeCard && (() => {
                        const vote   = filtered.find(v => v._id === activeCard);
                        if (!vote) return null;
                        const ranked = getRanked(activeCard);
                        const total  = getTotal(activeCard);
                        const winner = ranked[0];
                        const winPct = winner ? getPct(activeCard, winner.count) : 0;
                        const margin = getMargin(activeCard);

                        return (
                            <div className="vr-detail">
                                {/* Election meta */}
                                <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
                                    <span style={{ fontWeight:800, color:'var(--text-main)', fontSize:'1.05rem' }}>{vote.title}</span>
                                    <span className="vr-tag" style={
                                        vote.status === 'published'
                                            ? { background:'rgba(16,185,129,0.1)', color:'#10b981' }
                                            : { background:'rgba(245,158,11,0.1)', color:'#f59e0b' }
                                    }>{vote.status === 'published' ? '✅ Certified' : '⏳ Ended – Tallying'}</span>
                                    <span style={{ marginLeft:'auto', fontSize:'0.75rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4 }}>
                                        <Clock size={12} />Ended {new Date(vote.endTime).toLocaleDateString('en-IN',{ day:'numeric', month:'short', year:'numeric' })}
                                    </span>
                                </div>

                                {/* Winner Hero */}
                                {winner && total > 0 && (
                                    <div className="vr-winner-hero">
                                        <div className="vr-wh-top">
                                            <div className="vr-wh-av">{getInitials(winner.name)}</div>
                                            <div className="vr-wh-info">
                                                <div className="vr-wh-badge"><Trophy size={11} /> WINNER</div>
                                                <div className="vr-wh-name">{winner.name}</div>
                                                <div className="vr-wh-pct">{winPct.toFixed(1)}%</div>
                                                <div className="vr-wh-pct-lbl">of all votes</div>
                                            </div>
                                        </div>
                                        <div className="vr-wh-mini-stats">
                                            {[
                                                { label:'Total Votes', val: total },
                                                { label:'Winner Votes', val: winner.count },
                                                { label:'Candidates', val: ranked.length },
                                                { label:'Win Margin', val: margin },
                                            ].map(({ label, val }) => (
                                                <div className="vr-wh-mini-stat" key={label}>
                                                    <div className="vr-wh-mini-val">{val}</div>
                                                    <div className="vr-wh-mini-lbl">{label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Podium (top 3) */}
                                {ranked.length >= 2 && total > 0 && (
                                    <div className="vr-podium-wrap">
                                        <div className="vr-podium-title"><Award size={14} /> Podium — Top {Math.min(ranked.length, 3)}</div>
                                        <div className="vr-podium">
                                            {/* Reorder: 2nd, 1st, 3rd for visual podium shape */}
                                            {[1, 0, 2].map(ri => {
                                                const cand = ranked[ri];
                                                if (!cand) return <div key={ri} style={{ flex:1 }} />;
                                                const p = PODIUM_STYLE[ri];
                                                const pct = getPct(activeCard, cand.count).toFixed(1);
                                                return (
                                                    <div className="vr-podium-col" key={cand._id}>
                                                        <div className="vr-podium-name">{cand.name}</div>
                                                        <div className="vr-podium-pct">{pct}%</div>
                                                        <div className="vr-podium-bar" style={{
                                                            height: p.height, background: p.bg,
                                                            borderRadius: '12px 12px 0 0'
                                                        }}>
                                                            <div className="vr-podium-place">{p.label}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Animated bars — all candidates */}
                                <div className="vr-bars-wrap">
                                    <div className="vr-bars-title"><BarChart2 size={14} /> Full Vote Breakdown</div>
                                    {ranked.length === 0 ? (
                                        <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', textAlign:'center', padding:'24px 0' }}>No candidates registered for this election.</p>
                                    ) : ranked.map((c, ci) => {
                                        const pct   = getPct(activeCard, c.count);
                                        const color = BAR_COLORS[ci] || BAR_COLORS[BAR_COLORS.length - 1];
                                        const rankColors = ['#f59e0b','#94a3b8','#b45309'];
                                        const rankBg = rankColors[ci] || 'var(--primary)';
                                        return (
                                            <div className="vr-bar-row" key={c._id}>
                                                <div className="vr-bar-rank" style={{ background: rankBg }}>
                                                    {ci + 1}
                                                </div>
                                                <div className="vr-bar-left">
                                                    <div className="vr-bar-namerow">
                                                        <span className="vr-bar-name">
                                                            {ci === 0 && <Trophy size={14} color="#f59e0b" />}
                                                            {c.name}
                                                        </span>
                                                        <span className="vr-bar-stat">{c.count} votes · {pct.toFixed(1)}%</span>
                                                    </div>
                                                    <AnimatedBar pct={pct} color={color} delay={ci * 80} />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {total === 0 && (
                                        <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', textAlign:'center', padding:'16px 0', fontStyle:'italic' }}>
                                            No votes were cast in this election.
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
        </>
    );
};

/* compile-time safe re-use of BAR_COLORS in outer scope */
const BAR_COLORS = [
    'linear-gradient(90deg,#f59e0b,#fbbf24)',
    'linear-gradient(90deg,#94a3b8,#cbd5e1)',
    'linear-gradient(90deg,#b45309,#d97706)',
    'linear-gradient(90deg,#6366f1,#8b5cf6)',
    'linear-gradient(90deg,#0891b2,#06b6d4)',
    'linear-gradient(90deg,#10b981,#34d399)',
];

export default VoteResults;
