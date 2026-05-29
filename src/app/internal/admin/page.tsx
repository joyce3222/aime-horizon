"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ADVISOR_NAMES: Record<string, string> = {
  strategy: "跨境战略顾问",
  policy: "政策情报顾问",
  proposals: "提案与申请顾问",
  relationships: "利益相关方关系顾问",
  china: "中国市场传播顾问",
  education: "教育合作顾问",
  research: "AI产业研究顾问",
  founder: "创始人办公室AI",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

type UserData = Record<string, Message[]>;
type AllData = Record<string, UserData>;

export default function AdminPage() {
  const [data, setData] = useState<AllData>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"conversations" | "stats" | "export">("conversations");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/internal/admin")
      .then((r) => {
        if (r.status === 403) { router.push("/internal/workspace"); return null; }
        if (!r.ok) { router.push("/internal"); return null; }
        return r.json();
      })
      .then((d) => {
        if (d?.users) {
          setData(d.users);
          const firstUser = Object.keys(d.users)[0];
          if (firstUser) setSelectedUser(firstUser);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  function exportConversation(username: string, advisorId: string) {
    const msgs: Message[] = data[username]?.[advisorId] || [];
    if (!msgs.length) return;
    const advisorName = ADVISOR_NAMES[advisorId] || advisorId;
    const lines = [`AIME Horizon — ${advisorName} 对话记录`, `用户：${username}`, `导出时间：${new Date().toLocaleString("zh-CN")}`, "─".repeat(50), ""];
    msgs.forEach((m) => {
      lines.push(m.role === "user" ? `【${username}】` : `【${advisorName}】`);
      lines.push(m.content);
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${username}_${advisorId}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportAll() {
    const lines: string[] = [`AIME Horizon — 全部对话记录`, `导出时间：${new Date().toLocaleString("zh-CN")}`, "═".repeat(60), ""];
    for (const [username, advisors] of Object.entries(data)) {
      for (const [advisorId, msgs] of Object.entries(advisors)) {
        if (!msgs.length) continue;
        const advisorName = ADVISOR_NAMES[advisorId] || advisorId;
        lines.push(`▌ ${username} × ${advisorName}  (${Math.floor(msgs.length / 2)} 轮对话)`);
        lines.push("─".repeat(50));
        msgs.forEach((m) => {
          lines.push(m.role === "user" ? `【${username}】 ${m.content}` : `【${advisorName}】 ${m.content}`);
        });
        lines.push("");
      }
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aime_all_conversations_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const users = Object.keys(data);
  const totalMsgs = users.reduce((sum, u) => sum + Object.values(data[u] || {}).reduce((s, msgs) => s + msgs.length, 0), 0);
  const totalConvos = users.reduce((sum, u) => sum + Object.values(data[u] || {}).filter((msgs) => msgs.length > 0).length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <p className="text-cream/40 font-sans text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Header */}
      <header className="border-b border-cream/10 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif text-cream text-lg font-light">AIME Horizon</span>
          <span className="text-cream/20">·</span>
          <span className="text-gold text-xs tracking-widest uppercase font-sans">Admin</span>
        </div>
        <button
          onClick={() => router.push("/internal/workspace")}
          className="text-cream/30 hover:text-cream/60 text-xs font-sans tracking-wide transition-colors"
        >
          ← 返回工作区
        </button>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "用户数", value: users.length },
              { label: "活跃对话", value: totalConvos },
              { label: "消息总数", value: totalMsgs },
            ].map((s) => (
              <div key={s.label} className="bg-navy-light border border-cream/10 rounded-lg p-5 text-center">
                <p className="font-serif text-3xl text-gold font-light">{s.value}</p>
                <p className="text-cream/40 text-xs font-sans mt-1 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-cream/10">
            {(["conversations", "stats", "export"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-xs font-sans tracking-wide transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? "text-gold border-gold"
                    : "text-cream/40 border-transparent hover:text-cream/60"
                }`}
              >
                {t === "conversations" ? "对话记录" : t === "stats" ? "使用统计" : "导出"}
              </button>
            ))}
          </div>

          {/* Conversations tab */}
          {tab === "conversations" && (
            <div className="flex gap-6">
              {/* User + advisor selector */}
              <div className="w-56 flex-shrink-0 space-y-2">
                {users.map((u) => (
                  <div key={u}>
                    <button
                      onClick={() => { setSelectedUser(u); setSelectedAdvisor(""); }}
                      className={`w-full text-left px-3 py-2 rounded text-sm font-sans transition-colors ${
                        selectedUser === u ? "bg-gold/15 text-cream border border-gold/30" : "text-cream/50 hover:text-cream/80 border border-transparent"
                      }`}
                    >
                      {u}
                    </button>
                    {selectedUser === u && (
                      <div className="ml-3 mt-1 space-y-0.5">
                        {Object.entries(ADVISOR_NAMES).map(([id, name]) => {
                          const count = (data[u]?.[id] || []).length;
                          return (
                            <button
                              key={id}
                              onClick={() => setSelectedAdvisor(id)}
                              className={`w-full text-left px-2 py-1.5 rounded text-xs font-sans transition-colors flex items-center justify-between ${
                                selectedAdvisor === id
                                  ? "bg-cream/10 text-cream"
                                  : count > 0
                                  ? "text-cream/50 hover:text-cream/70"
                                  : "text-cream/20"
                              }`}
                            >
                              <span>{name}</span>
                              {count > 0 && <span className="text-gold/50">{Math.floor(count / 2)}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 min-w-0">
                {selectedUser && selectedAdvisor ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-cream font-sans text-sm">
                        {selectedUser} × {ADVISOR_NAMES[selectedAdvisor]}
                        <span className="text-cream/30 ml-2">
                          ({Math.floor((data[selectedUser]?.[selectedAdvisor] || []).length / 2)} 轮)
                        </span>
                      </h3>
                      <button
                        onClick={() => exportConversation(selectedUser, selectedAdvisor)}
                        className="text-gold/60 hover:text-gold text-xs font-sans tracking-wide transition-colors"
                      >
                        导出 ↓
                      </button>
                    </div>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                      {(data[selectedUser]?.[selectedAdvisor] || []).length === 0 ? (
                        <p className="text-cream/20 text-sm font-sans">暂无对话记录</p>
                      ) : (
                        (data[selectedUser]?.[selectedAdvisor] || []).map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-xl rounded-lg px-4 py-3 text-sm font-sans leading-relaxed whitespace-pre-wrap ${
                              msg.role === "user"
                                ? "bg-gold/15 text-cream border border-gold/20"
                                : "bg-navy-light text-cream/80 border border-cream/10"
                            }`}>
                              <p className="text-xs mb-1.5 opacity-50">
                                {msg.role === "user" ? selectedUser : ADVISOR_NAMES[selectedAdvisor]}
                              </p>
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-cream/20 text-sm font-sans">← 选择用户和顾问查看对话</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats tab */}
          {tab === "stats" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-cream/10">
                    <th className="text-left text-cream/40 text-xs tracking-widest uppercase pb-3 pr-6">顾问</th>
                    {users.map((u) => (
                      <th key={u} className="text-center text-cream/40 text-xs tracking-widest uppercase pb-3 px-4">{u}</th>
                    ))}
                    <th className="text-center text-cream/40 text-xs tracking-widest uppercase pb-3 px-4">合计</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(ADVISOR_NAMES).map(([id, name]) => {
                    const totals = users.map((u) => Math.floor((data[u]?.[id] || []).length / 2));
                    const rowTotal = totals.reduce((a, b) => a + b, 0);
                    return (
                      <tr key={id} className="border-b border-cream/5 hover:bg-cream/3 transition-colors">
                        <td className="py-3 pr-6 text-cream/70">{name}</td>
                        {totals.map((count, i) => (
                          <td key={i} className="py-3 px-4 text-center">
                            {count > 0
                              ? <span className="text-gold">{count}</span>
                              : <span className="text-cream/15">—</span>
                            }
                          </td>
                        ))}
                        <td className="py-3 px-4 text-center text-cream/50">{rowTotal || "—"}</td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-cream/20">
                    <td className="py-3 pr-6 text-cream/40 text-xs uppercase tracking-wide">合计</td>
                    {users.map((u) => {
                      const total = Object.values(data[u] || {}).reduce((s, msgs) => s + Math.floor(msgs.length / 2), 0);
                      return (
                        <td key={u} className="py-3 px-4 text-center text-cream/50">{total || "—"}</td>
                      );
                    })}
                    <td className="py-3 px-4 text-center text-gold">
                      {users.reduce((s, u) => s + Object.values(data[u] || {}).reduce((ss, msgs) => ss + Math.floor(msgs.length / 2), 0), 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Export tab */}
          {tab === "export" && (
            <div className="space-y-4">
              <div className="bg-navy-light border border-cream/10 rounded-lg p-5 flex items-center justify-between">
                <div>
                  <p className="text-cream font-sans text-sm mb-1">导出全部对话</p>
                  <p className="text-cream/30 text-xs font-sans">所有用户、所有顾问的完整记录，合并为一个 .txt 文件</p>
                </div>
                <button
                  onClick={exportAll}
                  className="bg-gold hover:bg-gold-dark text-navy px-5 py-2.5 rounded font-sans text-xs tracking-widest uppercase transition-colors flex-shrink-0"
                >
                  导出全部
                </button>
              </div>

              {users.map((u) => (
                <div key={u} className="bg-navy-light border border-cream/10 rounded-lg p-5">
                  <p className="text-cream font-sans text-sm mb-3">{u} 的对话</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(ADVISOR_NAMES).map(([id, name]) => {
                      const count = Math.floor((data[u]?.[id] || []).length / 2);
                      return (
                        <button
                          key={id}
                          onClick={() => exportConversation(u, id)}
                          disabled={count === 0}
                          className="flex items-center justify-between px-3 py-2 rounded border border-cream/10 hover:border-gold/30 disabled:opacity-25 disabled:cursor-not-allowed transition-colors group"
                        >
                          <span className="text-cream/60 group-hover:text-cream text-xs font-sans transition-colors">{name}</span>
                          <span className="text-xs font-sans text-cream/30">{count > 0 ? `${count} 轮 ↓` : "空"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
