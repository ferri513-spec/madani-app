"use client";
import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  LayoutDashboard, Users, GraduationCap, ClipboardCheck, BookOpenCheck,
  FileBarChart2, Settings, LogOut, Search, Plus, Pencil, Trash2, Sun, Moon,
  Menu, X, Download, Printer, CheckCircle2, Clock, Bell, ChevronRight,
  Upload, Image as ImageIcon, PenTool, User, ShieldCheck, TrendingUp, BookOpen, Award
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ---------------------------------- THEME ---------------------------------- */
const theme = (dark) => ({
  bg: dark ? "bg-gray-950" : "bg-gray-50",
  panel: dark ? "bg-gray-900" : "bg-white",
  panelAlt: dark ? "bg-gray-800" : "bg-gray-50",
  border: dark ? "border-gray-800" : "border-gray-200",
  text: dark ? "text-gray-100" : "text-gray-900",
  textMuted: dark ? "text-gray-400" : "text-gray-500",
  hover: dark ? "hover:bg-gray-800" : "hover:bg-gray-100",
  input: dark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-gray-900",
});

const EMERALD = "#059669";
const EMERALD_DARK = "#047857";
const GOLD = "#c9a227";

/* ---------------------------------- MOCK DATA ---------------------------------- */
const initialGuru = [
  { id: 1, nama: "Ust. Ahmad Fauzi", nik: "3271010101900001", hp: "081234560001", email: "ahmad.fauzi@madani.sch.id", alamat: "Depok, Jawa Barat", username: "ahmadfauzi", role: "Guru", aktif: true },
  { id: 2, nama: "Ustzh. Siti Nurhaliza", nik: "3271010101920002", hp: "081234560002", email: "siti.n@madani.sch.id", alamat: "Depok, Jawa Barat", username: "sitin", role: "Guru", aktif: true },
  { id: 3, nama: "Ust. Rizky Ramadhan", nik: "3271010101930003", hp: "081234560003", email: "rizky.r@madani.sch.id", alamat: "Cimanggis, Depok", username: "rizkyr", role: "Guru", aktif: true },
  { id: 4, nama: "Ustzh. Dewi Lestari", nik: "3271010101940004", hp: "081234560004", email: "dewi.l@madani.sch.id", alamat: "Sawangan, Depok", username: "dewil", role: "Admin", aktif: true },
  { id: 5, nama: "Ust. Hasan Albana", nik: "3271010101950005", hp: "081234560005", email: "hasan.a@madani.sch.id", alamat: "Beji, Depok", username: "hasana", role: "Guru", aktif: false },
];

const initialSiswa = [
  { id: 1, nama: "Ahmad Zaki", nis: "S001", jk: "L", level: "Level 1", ortu: "Bpk. Wahyu", hpOrtu: "081211110001", aktif: true },
  { id: 2, nama: "Fatimah Az-Zahra", nis: "S002", jk: "P", level: "Level 1", ortu: "Bpk. Ridwan", hpOrtu: "081211110002", aktif: true },
  { id: 3, nama: "Umar Faruq", nis: "S003", jk: "L", level: "Level 2", ortu: "Bpk. Slamet", hpOrtu: "081211110003", aktif: true },
  { id: 4, nama: "Khadijah Putri", nis: "S004", jk: "P", level: "Level 2", ortu: "Ibu Ratna", hpOrtu: "081211110004", aktif: true },
  { id: 5, nama: "Ali Ridho", nis: "S005", jk: "L", level: "Level 3", ortu: "Bpk. Hendra", hpOrtu: "081211110005", aktif: true },
  { id: 6, nama: "Aisyah Nur", nis: "S006", jk: "P", level: "Level 3", ortu: "Ibu Siti", hpOrtu: "081211110006", aktif: true },
  { id: 7, nama: "Yusuf Al-Amin", nis: "S007", jk: "L", level: "Level 1", ortu: "Bpk. Agus", hpOrtu: "081211110007", aktif: true },
  { id: 8, nama: "Maryam Salsabila", nis: "S008", jk: "P", level: "Level 2", ortu: "Bpk. Dedi", hpOrtu: "081211110008", aktif: true },
];

const weeklyAttendance = [
  { hari: "Sen", guru: 92, siswa: 88 },
  { hari: "Sel", guru: 95, siswa: 90 },
  { hari: "Rab", guru: 88, siswa: 85 },
  { hari: "Kam", guru: 97, siswa: 93 },
  { hari: "Jum", guru: 90, siswa: 87 },
  { hari: "Sab", guru: 94, siswa: 91 },
];

const hafalanStatus = [
  { name: "Lancar", value: 62, color: EMERALD },
  { name: "Mengulang", value: 24, color: GOLD },
  { name: "Belum", value: 14, color: "#9ca3af" },
];

const roster = {
  "Super Admin": { name: "Admin Utama", icon: ShieldCheck },
  "Admin": { name: "Ustzh. Dewi Lestari", icon: User },
  "Guru": { name: "Ust. Ahmad Fauzi", icon: GraduationCap },
};

/* ---------------------------------- SMALL UI PARTS ---------------------------------- */
function StatCard({ t, label, value, icon: Icon, accent }) {
  return (
    <div className={`rounded-xl border ${t.border} ${t.panel} p-4 flex items-center gap-3 shadow-sm`}>
      <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: accent + "1a", color: accent }}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className={`text-xs ${t.textMuted} truncate`}>{label}</p>
        <p className={`text-xl font-semibold ${t.text}`}>{value}</p>
      </div>
    </div>
  );
}

function Badge({ children, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-600",
    blue: "bg-blue-100 text-blue-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function StatusBadge({ status }) {
  const map = { Hadir: "emerald", Terlambat: "amber", Izin: "blue", Sakit: "gray", Alpha: "red", Lancar: "emerald", Mengulang: "amber", Belum: "gray" };
  return <Badge tone={map[status] || "gray"}>{status}</Badge>;
}

function Modal({ t, title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-xl ${t.panel} border ${t.border} shadow-xl max-h-[90vh] overflow-y-auto`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${t.border}`}>
          <h3 className={`font-semibold ${t.text}`}>{title}</h3>
          <button onClick={onClose} className={`p-1 rounded-md ${t.hover}`}><X size={18} className={t.textMuted} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ t, label, children }) {
  return (
    <div className="mb-3">
      <label className={`block text-xs font-medium mb-1 ${t.textMuted}`}>{label}</label>
      {children}
    </div>
  );
}

function Toast({ msg, tone }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[60] animate-pulse">
      <div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${tone === "error" ? "bg-red-600" : "bg-emerald-600"} flex items-center gap-2`}>
        <CheckCircle2 size={16} /> {msg}
      </div>
    </div>
  );
}

/* ---------------------------------- MAIN APP ---------------------------------- */
export default function MadaniApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [role, setRole] = useState("Guru");
  const [profileName, setProfileName] = useState("");
  const [profileFotoUrl, setProfileFotoUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [settings, setSettings] = useState({
    nama_madrasah: "Madrasah Sore Madani", nama_yayasan: "", alamat: "", no_hp: "",
    email: "", website: "", kepala_madrasah: "", tahun_berdiri: "", logo_url: null,
    jam_masuk: "15:30", jam_pulang: "17:30",
  });
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const t = theme(dark);
  const flash = (msg, tone = "ok") => { setToast({ msg, tone }); setTimeout(() => setToast(null), 2200); };

  /* ---- cek sesi login yang sudah ada saat halaman dibuka/di-refresh ---- */
  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadProfile(session.user.id);
      }
      setCheckingSession(false);
    };
    loadSession();
  }, []);

  const loadProfile = async (userId) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (!error && data) {
      setRole(data.role);
      setProfileName(data.nama);
      setProfileFotoUrl(data.foto_url || null);
      setUserId(userId);
      setLoggedIn(true);
    }
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (!error && data) setSettings(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setPage("dashboard");
  };

  /* ---- data state ---- */
  const [guruList, setGuruList] = useState(initialGuru);
  const [siswaList, setSiswaList] = useState([]);
  const [siswaLoading, setSiswaLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  /* ---- ambil data siswa dari database sungguhan setelah login ---- */
  useEffect(() => {
    if (!loggedIn) return;
    fetchSettings();
    const fetchSiswa = async () => {
      setSiswaLoading(true);
      const { data, error } = await supabase.from("students").select("*").order("id");
      if (!error && data) {
        setSiswaList(data.map((s) => ({
          id: s.id, nama: s.nama, nis: s.nis, jk: s.jenis_kelamin,
          level: s.level, ortu: s.nama_ortu, hpOrtu: s.hp_ortu, aktif: s.aktif,
        })));
      }
      setSiswaLoading(false);
    };
    fetchSiswa();
  }, [loggedIn]);

  const navItems = useMemo(() => {
    const all = [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Super Admin", "Admin", "Guru"] },
      { key: "guru", label: "Data Guru", icon: Users, roles: ["Super Admin", "Admin"] },
      { key: "siswa", label: "Data Siswa", icon: GraduationCap, roles: ["Super Admin", "Admin"] },
      { key: "absensiGuru", label: "Absensi Guru", icon: ClipboardCheck, roles: ["Super Admin", "Admin", "Guru"] },
      { key: "catatan", label: "Catatan Harian Guru", icon: BookOpenCheck, roles: ["Super Admin", "Admin", "Guru"] },
      { key: "pembelajaran", label: "Jurnal Pembelajaran", icon: BookOpen, roles: ["Super Admin", "Admin", "Guru"] },
      { key: "penilaian", label: "Penilaian Mingguan", icon: Award, roles: ["Super Admin", "Admin", "Guru"] },
      { key: "rekap", label: "Rekapan Laporan", icon: FileBarChart2, roles: ["Super Admin", "Admin", "Guru"] },
      { key: "pengaturan", label: "Pengaturan", icon: Settings, roles: ["Super Admin", "Admin"] },
    ];
    return all.filter((i) => i.roles.includes(role));
  }, [role]);

  if (checkingSession) {
    return (
      <div className={`min-h-[700px] w-full ${t.bg} flex items-center justify-center`}>
        <p className={`text-sm ${t.textMuted}`}>Memuat...</p>
      </div>
    );
  }

  if (!loggedIn) {
    return <LoginScreen t={t} dark={dark} setDark={setDark} onLoginSuccess={loadProfile} />;
  }

  return (
    <div className={`min-h-[700px] w-full ${t.bg} flex font-sans`}>
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static z-40 h-full w-64 ${t.panel} border-r ${t.border} flex flex-col transition-transform duration-200`}>
        <div className={`flex items-center gap-2 px-5 py-5 border-b ${t.border}`}>
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="h-9 w-9 rounded-lg object-contain shrink-0" style={{ backgroundColor: "#f3f4f6" }} />
          ) : (
            <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: EMERALD }}>MSM</div>
          )}
          <div className="min-w-0">
            <p className={`font-semibold text-sm ${t.text} truncate`}>{settings.nama_madrasah || "Madrasah Sore Madani"}</p>
            <p className="text-xs" style={{ color: GOLD }}>MADANI</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto"><X size={18} className={t.textMuted} /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.key;
            return (
              <button key={item.key} onClick={() => { setPage(item.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "text-white" : `${t.text} ${t.hover}`}`}
                style={active ? { backgroundColor: EMERALD } : {}}>
                <Icon size={17} /> {item.label}
              </button>
            );
          })}
        </nav>
        <div className={`px-3 py-4 border-t ${t.border} space-y-1`}>
          <button onClick={() => setPage("profil")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${t.text} ${t.hover}`}>
            <User size={17} /> Profil
          </button>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50`}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className={`h-16 ${t.panel} border-b ${t.border} flex items-center justify-between px-4 md:px-6 sticky top-0 z-20`}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden"><Menu size={20} className={t.text} /></button>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${t.text} truncate`}>{navItems.find(n => n.key === page)?.label || "Profil"}</p>
              <p className={`text-xs ${t.textMuted} hidden sm:block`}>Tahun Ajaran 2025/2026 · Semester Genap</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg ${t.hover}`}>
              {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className={t.textMuted} />}
            </button>
            <button className={`p-2 rounded-lg ${t.hover} relative`}>
              <Bell size={18} className={t.textMuted} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l ml-1" style={{ borderColor: dark ? "#374151" : "#e5e7eb" }}>
              {profileFotoUrl ? (
                <img src={profileFotoUrl} alt={profileName} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: EMERALD }}>
                  {(profileName || role).split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
              )}
              <div className="hidden sm:block">
                <p className={`text-xs font-medium ${t.text}`}>{profileName}</p>
                <p className={`text-[11px] ${t.textMuted}`}>{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {page === "dashboard" && <Dashboard t={t} role={role} guruList={guruList} siswaList={siswaList} />}
          {page === "guru" && <DataGuru t={t} guruList={guruList} setGuruList={setGuruList} flash={flash} />}
          {page === "siswa" && <DataSiswa t={t} siswaList={siswaList} setSiswaList={setSiswaList} flash={flash} />}
          {page === "absensiGuru" && <AbsensiGuru t={t} role={role} profileName={profileName} userId={userId} settings={settings} checkedIn={checkedIn} setCheckedIn={setCheckedIn} checkInTime={checkInTime} setCheckInTime={setCheckInTime} flash={flash} />}
          {page === "catatan" && <CatatanHarian t={t} siswaList={siswaList} checkedIn={checkedIn} role={role} userId={userId} flash={flash} />}
          {page === "pembelajaran" && <JurnalPembelajaran t={t} checkedIn={checkedIn} role={role} userId={userId} profileName={profileName} flash={flash} />}
          {page === "penilaian" && <PenilaianMingguan t={t} checkedIn={checkedIn} role={role} userId={userId} siswaList={siswaList} flash={flash} />}
          {page === "rekap" && <RekapLaporan t={t} dark={dark} siswaList={siswaList} settings={settings} flash={flash} />}
          {page === "pengaturan" && <Pengaturan t={t} settings={settings} setSettings={setSettings} flash={flash} />}
          {page === "profil" && <Profil t={t} role={role} profileName={profileName} userId={userId} fotoUrl={profileFotoUrl} setFotoUrl={setProfileFotoUrl} flash={flash} />}
        </main>
      </div>
      <Toast msg={toast?.msg} tone={toast?.tone} />
    </div>
  );
}

/* ---------------------------------- LOGIN ---------------------------------- */
function LoginScreen({ t, dark, setDark, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMsg("");
    if (!email || !password) { setErrorMsg("Email dan password wajib diisi."); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg("Email atau password salah. Coba lagi.");
      setLoading(false);
      return;
    }
    await onLoginSuccess(data.user.id);
    setLoading(false);
  };

  return (
    <div className={`min-h-[700px] w-full ${t.bg} flex items-center justify-center p-4 relative`}>
      <button onClick={() => setDark(!dark)} className={`absolute top-4 right-4 p-2 rounded-lg ${t.panel} border ${t.border}`}>
        {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className={t.textMuted} />}
      </button>
      <div className={`w-full max-w-sm rounded-2xl ${t.panel} border ${t.border} shadow-xl p-8`}>
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-3" style={{ backgroundColor: EMERALD }}>MSM</div>
          <h1 className={`text-lg font-semibold ${t.text}`}>Madrasah Sore Madani</h1>
          <p className={`text-xs ${t.textMuted}`}>Sistem Manajemen Madrasah</p>
        </div>
        <Field t={t} label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@madani.app"
            className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </Field>
        <Field t={t} label="Password">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
            className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </Field>
        {errorMsg && <p className="text-xs text-red-500 mb-2">{errorMsg}</p>}
        <button onClick={handleLogin} disabled={loading} className="w-full mt-2 rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
        <p className={`text-[11px] text-center mt-4 ${t.textMuted}`}>Gunakan akun yang sudah didaftarkan di Supabase Authentication</p>
      </div>
    </div>
  );
}

/* ---------------------------------- DASHBOARD ---------------------------------- */
function Dashboard({ t, role, guruList, siswaList }) {
  const countByLevel = (lvl) => siswaList.filter((s) => s.level === lvl && s.aktif).length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard t={t} label="Jumlah Guru" value={guruList.filter(g => g.aktif).length} icon={Users} accent={EMERALD} />
        <StatCard t={t} label="Siswa Level 1" value={countByLevel("Level 1")} icon={GraduationCap} accent={GOLD} />
        <StatCard t={t} label="Siswa Level 2" value={countByLevel("Level 2")} icon={GraduationCap} accent={GOLD} />
        <StatCard t={t} label="Siswa Level 3" value={countByLevel("Level 3")} icon={GraduationCap} accent={GOLD} />
        <StatCard t={t} label="Guru Hadir Hari Ini" value="3 / 4" icon={CheckCircle2} accent={EMERALD} />
        <StatCard t={t} label="Guru Tidak Hadir" value="1" icon={Clock} accent="#ef4444" />
        <StatCard t={t} label="Siswa Hadir Hari Ini" value="26 / 30" icon={CheckCircle2} accent={EMERALD} />
        <StatCard t={t} label="Progress Hafalan" value="62%" icon={TrendingUp} accent={GOLD} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-2 rounded-xl border ${t.border} ${t.panel} p-4`}>
          <p className={`text-sm font-semibold mb-3 ${t.text}`}>Grafik Kehadiran Mingguan (%)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border.includes("800") ? "#1f2937" : "#e5e7eb"} />
              <XAxis dataKey="hari" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="guru" name="Guru" fill={EMERALD} radius={[4, 4, 0, 0]} />
              <Bar dataKey="siswa" name="Siswa" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={`rounded-xl border ${t.border} ${t.panel} p-4`}>
          <p className={`text-sm font-semibold mb-3 ${t.text}`}>Progress Hafalan</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={hafalanStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {hafalanStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-1 flex-wrap">
            {hafalanStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} /> <span className={t.textMuted}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-xl border ${t.border} ${t.panel} p-4`}>
        <p className={`text-sm font-semibold mb-3 ${t.text}`}>Aktivitas Terbaru</p>
        <ul className="space-y-3">
          {[
            { who: "Ust. Ahmad Fauzi", what: "melakukan check-in absensi", when: "15:32" },
            { who: "Ustzh. Siti Nurhaliza", what: "mengisi Catatan Harian Level 1", when: "16:10" },
            { who: "Ust. Rizky Ramadhan", what: "mengisi progress hafalan Umar Faruq", when: "16:22" },
          ].map((a, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: EMERALD }} />
              <span className={t.text}><b>{a.who}</b> {a.what}</span>
              <span className={`ml-auto text-xs ${t.textMuted}`}>{a.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------------------------- DATA GURU ---------------------------------- */
function DataGuru({ t, guruList, setGuruList, flash }) {
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null); // {mode, data}
  const [pg, setPg] = useState(1);
  const perPage = 5;

  const filtered = guruList.filter((g) => g.nama.toLowerCase().includes(q.toLowerCase()) || g.nik.includes(q));
  const paged = filtered.slice((pg - 1) * perPage, pg * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const save = (form) => {
    if (modal.mode === "add") {
      setGuruList([...guruList, { ...form, id: Date.now(), aktif: true }]);
      flash("Data guru berhasil ditambahkan");
    } else {
      setGuruList(guruList.map((g) => (g.id === modal.data.id ? { ...g, ...form } : g)));
      flash("Data guru berhasil diperbarui");
    }
    setModal(null);
  };
  const remove = (id) => { setGuruList(guruList.filter((g) => g.id !== id)); flash("Data guru dihapus", "error"); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className={`flex items-center gap-2 rounded-lg border ${t.border} ${t.input} px-3 py-2 w-full sm:w-72`}>
          <Search size={16} className={t.textMuted} />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPg(1); }} placeholder="Cari nama atau NIK..." className="bg-transparent outline-none text-sm w-full" />
        </div>
        <button onClick={() => setModal({ mode: "add", data: { nama: "", nik: "", hp: "", email: "", alamat: "", username: "", role: "Guru" } })}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shrink-0" style={{ backgroundColor: EMERALD }}>
          <Plus size={16} /> Tambah Guru
        </button>
      </div>

      <div className={`rounded-xl border ${t.border} ${t.panel} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`text-left ${t.textMuted} border-b ${t.border}`}>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">NIK</th>
              <th className="px-4 py-3 font-medium">No HP</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((g) => (
              <tr key={g.id} className={`border-b ${t.border} last:border-0`}>
                <td className={`px-4 py-3 ${t.text} font-medium`}>{g.nama}</td>
                <td className={`px-4 py-3 ${t.textMuted}`}>{g.nik}</td>
                <td className={`px-4 py-3 ${t.textMuted}`}>{g.hp}</td>
                <td className="px-4 py-3"><Badge tone="blue">{g.role}</Badge></td>
                <td className="px-4 py-3">{g.aktif ? <Badge tone="emerald">Aktif</Badge> : <Badge tone="gray">Nonaktif</Badge>}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setModal({ mode: "edit", data: g })} className={`p-1.5 rounded-md ${t.hover}`}><Pencil size={14} className={t.textMuted} /></button>
                    <button onClick={() => remove(g.id)} className={`p-1.5 rounded-md ${t.hover}`}><Trash2 size={14} className="text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={6} className={`px-4 py-8 text-center ${t.textMuted}`}>Tidak ada data ditemukan</td></tr>}
          </tbody>
        </table>
      </div>

      <Pagination t={t} pg={pg} setPg={setPg} totalPages={totalPages} total={filtered.length} />

      {modal && (
        <GuruModal t={t} modal={modal} onClose={() => setModal(null)} onSave={save} />
      )}
    </div>
  );
}

function GuruModal({ t, modal, onClose, onSave }) {
  const [form, setForm] = useState(modal.data);
  return (
    <Modal t={t} title={modal.mode === "add" ? "Tambah Data Guru" : "Edit Data Guru"} onClose={onClose}>
      <Field t={t} label="Nama Lengkap"><input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
      <Field t={t} label="NIK"><input value={form.nik} onChange={(e) => setForm({ ...form, nik: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
      <Field t={t} label="No HP"><input value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
      <Field t={t} label="Email"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
      <Field t={t} label="Role">
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
          <option>Guru</option><option>Admin</option><option>Super Admin</option>
        </select>
      </Field>
      <button onClick={() => onSave(form)} className="w-full mt-2 rounded-lg py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: EMERALD }}>Simpan</button>
    </Modal>
  );
}

/* ---------------------------------- DATA SISWA ---------------------------------- */
function DataSiswa({ t, siswaList, setSiswaList, flash }) {
  const [q, setQ] = useState("");
  const [levelFilter, setLevelFilter] = useState("Semua");
  const [modal, setModal] = useState(null);
  const [pg, setPg] = useState(1);
  const perPage = 5;

  const filtered = siswaList.filter((s) =>
    (s.nama.toLowerCase().includes(q.toLowerCase()) || s.nis.includes(q)) &&
    (levelFilter === "Semua" || s.level === levelFilter)
  );
  const paged = filtered.slice((pg - 1) * perPage, pg * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const save = async (form) => {
    if (modal.mode === "add") {
      const { data, error } = await supabase.from("students").insert({
        nama: form.nama, nis: form.nis, jenis_kelamin: form.jk,
        level: form.level, nama_ortu: form.ortu, hp_ortu: form.hpOrtu, aktif: true,
      }).select().single();
      if (error) { flash("Gagal menyimpan: " + error.message, "error"); return; }
      setSiswaList([...siswaList, { id: data.id, nama: data.nama, nis: data.nis, jk: data.jenis_kelamin, level: data.level, ortu: data.nama_ortu, hpOrtu: data.hp_ortu, aktif: data.aktif }]);
      flash("Data siswa ditambahkan");
    } else {
      const { error } = await supabase.from("students").update({
        nama: form.nama, nis: form.nis, jenis_kelamin: form.jk,
        level: form.level, nama_ortu: form.ortu, hp_ortu: form.hpOrtu,
      }).eq("id", modal.data.id);
      if (error) { flash("Gagal memperbarui: " + error.message, "error"); return; }
      setSiswaList(siswaList.map((s) => (s.id === modal.data.id ? { ...s, ...form } : s)));
      flash("Data siswa diperbarui");
    }
    setModal(null);
  };
  const remove = async (id) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) { flash("Gagal menghapus: " + error.message, "error"); return; }
    setSiswaList(siswaList.filter((s) => s.id !== id));
    flash("Data siswa dihapus", "error");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className={`flex items-center gap-2 rounded-lg border ${t.border} ${t.input} px-3 py-2 w-full sm:w-64`}>
            <Search size={16} className={t.textMuted} />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPg(1); }} placeholder="Cari nama atau NIS..." className="bg-transparent outline-none text-sm w-full" />
          </div>
          <select value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value); setPg(1); }} className={`rounded-lg border px-3 py-2 text-sm ${t.input}`}>
            <option>Semua</option><option>Level 1</option><option>Level 2</option><option>Level 3</option>
          </select>
        </div>
        <button onClick={() => setModal({ mode: "add", data: { nama: "", nis: "", jk: "L", level: "Level 1", ortu: "", hpOrtu: "" } })}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shrink-0" style={{ backgroundColor: EMERALD }}>
          <Plus size={16} /> Tambah Siswa
        </button>
      </div>

      <div className={`rounded-xl border ${t.border} ${t.panel} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`text-left ${t.textMuted} border-b ${t.border}`}>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">NIS</th>
              <th className="px-4 py-3 font-medium">JK</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Orang Tua</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => (
              <tr key={s.id} className={`border-b ${t.border} last:border-0`}>
                <td className={`px-4 py-3 ${t.text} font-medium`}>{s.nama}</td>
                <td className={`px-4 py-3 ${t.textMuted}`}>{s.nis}</td>
                <td className={`px-4 py-3 ${t.textMuted}`}>{s.jk}</td>
                <td className="px-4 py-3"><Badge tone="gray">{s.level}</Badge></td>
                <td className={`px-4 py-3 ${t.textMuted}`}>{s.ortu}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setModal({ mode: "edit", data: s })} className={`p-1.5 rounded-md ${t.hover}`}><Pencil size={14} className={t.textMuted} /></button>
                    <button onClick={() => remove(s.id)} className={`p-1.5 rounded-md ${t.hover}`}><Trash2 size={14} className="text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={6} className={`px-4 py-8 text-center ${t.textMuted}`}>Tidak ada data ditemukan</td></tr>}
          </tbody>
        </table>
      </div>

      <Pagination t={t} pg={pg} setPg={setPg} totalPages={totalPages} total={filtered.length} />

      {modal && <SiswaModal t={t} modal={modal} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
}

function SiswaModal({ t, modal, onClose, onSave }) {
  const [form, setForm] = useState(modal.data);
  return (
    <Modal t={t} title={modal.mode === "add" ? "Tambah Data Siswa" : "Edit Data Siswa"} onClose={onClose}>
      <Field t={t} label="Nama Lengkap"><input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
      <Field t={t} label="NIS"><input value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field t={t} label="Jenis Kelamin">
          <select value={form.jk} onChange={(e) => setForm({ ...form, jk: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
            <option value="L">Laki-laki</option><option value="P">Perempuan</option>
          </select>
        </Field>
        <Field t={t} label="Level">
          <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
            <option>Level 1</option><option>Level 2</option><option>Level 3</option>
          </select>
        </Field>
      </div>
      <Field t={t} label="Nama Orang Tua"><input value={form.ortu} onChange={(e) => setForm({ ...form, ortu: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
      <Field t={t} label="No HP Orang Tua"><input value={form.hpOrtu} onChange={(e) => setForm({ ...form, hpOrtu: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
      <button onClick={() => onSave(form)} className="w-full mt-2 rounded-lg py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: EMERALD }}>Simpan</button>
    </Modal>
  );
}

/* ---------------------------------- ABSENSI GURU ---------------------------------- */
function AbsensiGuru({ t, role, profileName, userId, settings, checkedIn, setCheckedIn, checkInTime, setCheckInTime, flash }) {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().slice(0, 10);
  const hariIni = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const jamMasukPatokan = (settings?.jam_masuk || "15:30").slice(0, 5);

  const fetchRiwayat = async () => {
    setLoading(true);
    let query = supabase.from("teacher_attendance").select("*, profiles(nama)").order("tanggal", { ascending: false }).limit(30);
    if (role === "Guru" && userId) query = query.eq("teacher_id", userId);
    const { data, error } = await query;
    if (!error && data) {
      setRiwayat(data.map((r) => ({
        id: r.id, guru: r.profiles?.nama || "-", tanggal: r.tanggal,
        masuk: r.jam_masuk || "-", pulang: r.jam_pulang || "-", status: r.status,
      })));
      const todays = data.find((r) => r.teacher_id === userId && r.tanggal === today);
      if (todays) { setCheckedIn(true); setCheckInTime(todays.jam_masuk); }
    }
    setLoading(false);
  };

  useEffect(() => { fetchRiwayat(); }, [role, userId]);

  const now = () => nowHHMM();

  const handleCheckIn = async () => {
    const time = now();
    const status = time > jamMasukPatokan ? "Terlambat" : "Hadir";
    const { error } = await supabase.from("teacher_attendance").insert({
      teacher_id: userId, tanggal: today, jam_masuk: time, status,
    });
    if (error) { flash("Gagal check-in: " + error.message, "error"); return; }
    setCheckedIn(true); setCheckInTime(time);
    flash(status === "Terlambat" ? "Check-in tercatat (Terlambat)" : "Check-in berhasil dicatat");
    fetchRiwayat();
  };

  const handleCheckOut = async () => {
    const time = now();
    const { data: todayRecord } = await supabase.from("teacher_attendance").select("id").eq("teacher_id", userId).eq("tanggal", today).single();
    if (!todayRecord) { flash("Data check-in hari ini tidak ditemukan", "error"); return; }
    const { error } = await supabase.from("teacher_attendance").update({ jam_pulang: time }).eq("id", todayRecord.id);
    if (error) { flash("Gagal check-out: " + error.message, "error"); return; }
    flash("Check-out berhasil dicatat");
    fetchRiwayat();
  };

  const hapusAbsensiGuru = async (id) => {
    if (!window.confirm("Hapus catatan absensi ini?")) return;
    const { error } = await supabase.from("teacher_attendance").delete().eq("id", id);
    if (error) { flash("Gagal menghapus: " + error.message, "error"); return; }
    flash("Catatan absensi dihapus", "error");
    fetchRiwayat();
  };

  if (role === "Guru") {
    return (
      <div className="space-y-5">
        <div className={`rounded-xl border ${t.border} ${t.panel} p-6 text-center max-w-md mx-auto`}>
          <Clock size={28} className="mx-auto mb-2" style={{ color: EMERALD }} />
          <p className={`text-sm ${t.textMuted}`}>{hariIni}</p>
          <p className={`text-3xl font-semibold my-2 ${t.text}`}>{checkInTime || "--:--"}</p>
          <p className={`text-xs ${t.textMuted} mb-4`}>{checkedIn ? "Anda sudah check-in hari ini" : `Anda belum melakukan absensi hari ini · Jam masuk: ${jamMasukPatokan}`}</p>
          {!checkedIn ? (
            <button onClick={handleCheckIn} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: EMERALD }}>Check-In Sekarang</button>
          ) : (
            <button onClick={handleCheckOut} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white bg-amber-500">Check-Out</button>
          )}
          {!checkedIn && <p className="text-[11px] text-red-500 mt-3">Catatan Harian belum bisa diisi sebelum Anda check-in.</p>}
        </div>
        {loading ? <p className={`text-sm ${t.textMuted} text-center`}>Memuat riwayat...</p> : <RiwayatTable t={t} data={riwayat} />}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className={`text-sm ${t.textMuted}`}>Rekap absensi seluruh guru. Patokan jam masuk: <b>{jamMasukPatokan}</b> (bisa diubah di menu Pengaturan).</p>
      <RekapAbsensiExcel t={t} flash={flash} />
      <div>
        <p className={`text-sm font-semibold mb-2 ${t.text}`}>Riwayat Terbaru (30 catatan terakhir)</p>
        {loading ? <p className={`text-sm ${t.textMuted}`}>Memuat...</p> : <RiwayatTable t={t} data={riwayat} showName onDelete={hapusAbsensiGuru} />}
      </div>
    </div>
  );
}

function RekapAbsensiExcel({ t, flash }) {
  const today = new Date();
  const [tglMulai, setTglMulai] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString().slice(0, 10));
  const [tglSelesai, setTglSelesai] = useState(today.toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [rows, setRows] = useState([]);
  const [exporting, setExporting] = useState(false);

  const setPreset = (kind) => {
    const d = new Date();
    if (kind === "minggu") d.setDate(d.getDate() - 6);
    if (kind === "bulan") d.setMonth(d.getMonth() - 1);
    if (kind === "semester") d.setMonth(d.getMonth() - 6);
    setTglMulai(d.toISOString().slice(0, 10));
    setTglSelesai(new Date().toISOString().slice(0, 10));
    setLoaded(false);
  };

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("teacher_attendance").select("*, profiles(nama)").gte("tanggal", tglMulai).lte("tanggal", tglSelesai).order("tanggal");
    if (error) { flash("Gagal memuat: " + error.message, "error"); setLoading(false); return; }
    const map = {};
    (data || []).forEach((r) => {
      const key = r.teacher_id;
      if (!map[key]) map[key] = { nama: r.profiles?.nama || "-", totalHari: 0, hadir: 0, terlambat: 0, izin: 0, sakit: 0, alpha: 0, totalMenit: 0 };
      map[key].totalHari++;
      if (r.status === "Hadir") map[key].hadir++;
      else if (r.status === "Terlambat") map[key].terlambat++;
      else if (r.status === "Izin") map[key].izin++;
      else if (r.status === "Sakit") map[key].sakit++;
      else if (r.status === "Alpha") map[key].alpha++;
      if (r.jam_masuk && r.jam_pulang) {
        const [h1, m1] = r.jam_masuk.split(":").map(Number);
        const [h2, m2] = r.jam_pulang.split(":").map(Number);
        const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff > 0) map[key].totalMenit += diff;
      }
    });
    setRows(Object.values(map));
    setLoading(false);
    setLoaded(true);
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const dataForSheet = rows.map((r, i) => ({
        "No": i + 1,
        "Nama Guru": r.nama,
        "Total Hari Tercatat": r.totalHari,
        "Hadir": r.hadir,
        "Terlambat": r.terlambat,
        "Izin": r.izin,
        "Sakit": r.sakit,
        "Alpha": r.alpha,
        "% Kehadiran": r.totalHari ? Math.round(((r.hadir + r.terlambat) / r.totalHari) * 100) + "%" : "0%",
        "Total Jam Mengajar": `${Math.floor(r.totalMenit / 60)}j ${r.totalMenit % 60}m`,
      }));
      const ws = XLSX.utils.json_to_sheet(dataForSheet);
      ws["!cols"] = [{ wch: 4 }, { wch: 24 }, { wch: 14 }, { wch: 8 }, { wch: 10 }, { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 12 }, { wch: 16 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Absensi Guru");
      XLSX.writeFile(wb, `Rekap-Absensi-Guru-${tglMulai}_sd_${tglSelesai}.xlsx`);
      flash("Rekap absensi guru berhasil diunduh");
    } catch (e) {
      flash("Gagal membuat Excel: " + e.message, "error");
    }
    setExporting(false);
  };

  return (
    <div className={`rounded-xl border ${t.border} ${t.panel} p-4 space-y-3`}>
      <p className={`text-sm font-semibold ${t.text}`}>Rekap Absensi Guru (Excel)</p>
      <div className="flex flex-wrap gap-3 items-end">
        <Field t={t} label="Tanggal Mulai">
          <input type="date" value={tglMulai} onChange={(e) => { setTglMulai(e.target.value); setLoaded(false); }} className={`rounded-lg border px-3 py-2 text-sm ${t.input}`} />
        </Field>
        <Field t={t} label="Tanggal Selesai">
          <input type="date" value={tglSelesai} onChange={(e) => { setTglSelesai(e.target.value); setLoaded(false); }} className={`rounded-lg border px-3 py-2 text-sm ${t.input}`} />
        </Field>
        <button onClick={loadData} disabled={loading} className="rounded-lg px-4 py-2 text-sm font-medium text-white h-fit disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
          {loading ? "Memuat..." : "Muat Rekap"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setPreset("minggu")} className={`text-xs px-3 py-1.5 rounded-full border ${t.border} ${t.text} ${t.hover}`}>1 Pekan Terakhir</button>
        <button onClick={() => setPreset("bulan")} className={`text-xs px-3 py-1.5 rounded-full border ${t.border} ${t.text} ${t.hover}`}>1 Bulan Terakhir</button>
        <button onClick={() => setPreset("semester")} className={`text-xs px-3 py-1.5 rounded-full border ${t.border} ${t.text} ${t.hover}`}>Per Semester (6 Bulan)</button>
      </div>

      {loaded && (
        <>
          <div className="flex justify-end">
            <button onClick={exportExcel} disabled={exporting || rows.length === 0} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
              <Download size={14} /> {exporting ? "Memproses..." : "Download Excel (.xlsx)"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left ${t.textMuted} border-b ${t.border}`}>
                  <th className="px-3 py-2 font-medium">Nama Guru</th>
                  <th className="px-3 py-2 font-medium">Hadir</th>
                  <th className="px-3 py-2 font-medium">Terlambat</th>
                  <th className="px-3 py-2 font-medium">Izin</th>
                  <th className="px-3 py-2 font-medium">Sakit</th>
                  <th className="px-3 py-2 font-medium">Alpha</th>
                  <th className="px-3 py-2 font-medium">% Hadir</th>
                  <th className="px-3 py-2 font-medium">Jam Mengajar</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={8} className={`px-3 py-6 text-center ${t.textMuted}`}>Tidak ada data pada periode ini</td></tr>
                ) : rows.map((r, i) => (
                  <tr key={i} className={`border-b ${t.border} last:border-0`}>
                    <td className={`px-3 py-2 ${t.text} font-medium whitespace-nowrap`}>{r.nama}</td>
                    <td className={`px-3 py-2 ${t.textMuted}`}>{r.hadir}</td>
                    <td className={`px-3 py-2 ${t.textMuted}`}>{r.terlambat}</td>
                    <td className={`px-3 py-2 ${t.textMuted}`}>{r.izin}</td>
                    <td className={`px-3 py-2 ${t.textMuted}`}>{r.sakit}</td>
                    <td className={`px-3 py-2 ${t.textMuted}`}>{r.alpha}</td>
                    <td className={`px-3 py-2 ${t.textMuted}`}>{r.totalHari ? Math.round(((r.hadir + r.terlambat) / r.totalHari) * 100) : 0}%</td>
                    <td className={`px-3 py-2 ${t.textMuted}`}>{Math.floor(r.totalMenit / 60)}j {r.totalMenit % 60}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function RiwayatTable({ t, data, showName, onDelete }) {
  return (
    <div className={`rounded-xl border ${t.border} ${t.panel} overflow-x-auto`}>
      <table className="w-full text-sm">
        <thead>
          <tr className={`text-left ${t.textMuted} border-b ${t.border}`}>
            {showName && <th className="px-4 py-3 font-medium">Nama Guru</th>}
            <th className="px-4 py-3 font-medium">Tanggal</th>
            <th className="px-4 py-3 font-medium">Jam Masuk</th>
            <th className="px-4 py-3 font-medium">Jam Pulang</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {onDelete && <th className="px-4 py-3 font-medium text-right">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr key={a.id} className={`border-b ${t.border} last:border-0`}>
              {showName && <td className={`px-4 py-3 ${t.text} font-medium`}>{a.guru}</td>}
              <td className={`px-4 py-3 ${t.textMuted}`}>{a.tanggal}</td>
              <td className={`px-4 py-3 ${t.textMuted}`}>{a.masuk}</td>
              <td className={`px-4 py-3 ${t.textMuted}`}>{a.pulang}</td>
              <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
              {onDelete && (
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onDelete(a.id)} className="p-1.5 rounded-md hover:bg-red-50"><Trash2 size={14} className="text-red-500" /></button>
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={onDelete ? 6 : 5} className={`px-4 py-8 text-center ${t.textMuted}`}>Belum ada riwayat</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------- CATATAN HARIAN ---------------------------------- */
function CatatanHarian({ t, siswaList, checkedIn, role, userId, flash }) {
  const [level, setLevel] = useState("Level 1");
  const [tab, setTab] = useState("absensi");
  const [absensi, setAbsensi] = useState({});
  const [savingAbsensi, setSavingAbsensi] = useState(false);
  const [hafalan, setHafalan] = useState({ siswa: "", juz: "", surah: "", halaman: "", ayat: "", status: "Lancar", catatan: "" });
  const [tahsin, setTahsin] = useState({ siswa: "", jilid: "", halaman: "", status: "Lancar", catatan: "" });
  const [savingTahsin, setSavingTahsin] = useState(false);
  const [savingHafalan, setSavingHafalan] = useState(false);
  const [riwayatTahsin, setRiwayatTahsin] = useState([]);
  const [riwayatHafalan, setRiwayatHafalan] = useState([]);

  const today = new Date().toISOString().slice(0, 10);
  const students = siswaList.filter((s) => s.level === level);

  useEffect(() => {
    const loadAbsensi = async () => {
      const ids = students.map((s) => s.id);
      if (ids.length === 0) return;
      const { data } = await supabase.from("student_attendance").select("*").in("student_id", ids).eq("tanggal", today);
      if (data) {
        const map = {};
        data.forEach((r) => { map[r.student_id] = r.status; });
        setAbsensi(map);
      }
    };
    loadAbsensi();
    fetchRiwayatTahsin();
    fetchRiwayatHafalan();
  }, [level]);

  const fetchRiwayatTahsin = async () => {
    const ids = students.map((s) => s.id);
    if (ids.length === 0) { setRiwayatTahsin([]); return; }
    const { data } = await supabase.from("tahsin_progress").select("*").in("student_id", ids).eq("tanggal", today).order("created_at", { ascending: false });
    setRiwayatTahsin(data || []);
  };

  const fetchRiwayatHafalan = async () => {
    const ids = students.map((s) => s.id);
    if (ids.length === 0) { setRiwayatHafalan([]); return; }
    const { data } = await supabase.from("memorization_progress").select("*").in("student_id", ids).eq("tanggal", today).order("created_at", { ascending: false });
    setRiwayatHafalan(data || []);
  };

  const namaSiswa = (id) => students.find((s) => s.id === id)?.nama || "-";

  const hapusTahsin = async (id) => {
    if (!window.confirm("Hapus catatan tahsin ini?")) return;
    const { error } = await supabase.from("tahsin_progress").delete().eq("id", id);
    if (error) { flash("Gagal menghapus: " + error.message, "error"); return; }
    flash("Catatan tahsin dihapus", "error");
    fetchRiwayatTahsin();
  };

  const hapusHafalan = async (id) => {
    if (!window.confirm("Hapus catatan hafalan ini?")) return;
    const { error } = await supabase.from("memorization_progress").delete().eq("id", id);
    if (error) { flash("Gagal menghapus: " + error.message, "error"); return; }
    flash("Catatan hafalan dihapus", "error");
    fetchRiwayatHafalan();
  };

  if (role === "Guru" && !checkedIn) {
    return (
      <div className={`rounded-xl border ${t.border} ${t.panel} p-8 text-center max-w-lg mx-auto`}>
        <ClipboardCheck size={28} className="mx-auto mb-3 text-red-500" />
        <p className={`font-semibold ${t.text}`}>Anda belum melakukan absensi</p>
        <p className={`text-sm ${t.textMuted} mt-1`}>Silakan lakukan Check-In pada menu Absensi Guru terlebih dahulu sebelum mengisi Catatan Harian.</p>
      </div>
    );
  }

  const tabs = [
    { key: "absensi", label: "Absensi Siswa" },
    { key: "tahsin", label: "Mutaba'ah Tahsin" },
    { key: "hafalan", label: "Progress Hafalan" },
  ];

  const handleSaveAbsensi = async () => {
    setSavingAbsensi(true);
    const jamTercatat = nowHHMM();
    const rows = students.map((s) => ({
      student_id: s.id, teacher_id: userId, tanggal: today, status: absensi[s.id] || "Hadir", jam_tercatat: jamTercatat,
    }));
    const { error } = await supabase.from("student_attendance").upsert(rows, { onConflict: "student_id,tanggal" });
    setSavingAbsensi(false);
    if (error) { flash("Gagal menyimpan: " + error.message, "error"); return; }
    flash("Absensi siswa tersimpan");
  };

  const handleSaveTahsin = async () => {
    if (!tahsin.siswa) { flash("Pilih siswa terlebih dahulu", "error"); return; }
    setSavingTahsin(true);
    const { error } = await supabase.from("tahsin_progress").insert({
      student_id: tahsin.siswa, teacher_id: userId, tanggal: today,
      jilid_juz: tahsin.jilid, halaman: tahsin.halaman, status: tahsin.status, catatan: tahsin.catatan,
    });
    setSavingTahsin(false);
    if (error) { flash("Gagal menyimpan: " + error.message, "error"); return; }
    flash("Data tahsin tersimpan");
    setTahsin({ siswa: "", jilid: "", halaman: "", status: "Lancar", catatan: "" });
    fetchRiwayatTahsin();
  };

  const handleSaveHafalan = async () => {
    if (!hafalan.siswa) { flash("Pilih siswa terlebih dahulu", "error"); return; }
    setSavingHafalan(true);
    const { error } = await supabase.from("memorization_progress").insert({
      student_id: hafalan.siswa, teacher_id: userId, tanggal: today,
      juz: hafalan.juz, surah: hafalan.surah, halaman: hafalan.halaman, ayat: hafalan.ayat,
      status: hafalan.status, catatan: hafalan.catatan,
    });
    setSavingHafalan(false);
    if (error) { flash("Gagal menyimpan: " + error.message, "error"); return; }
    flash("Progress hafalan tersimpan");
    setHafalan({ siswa: "", juz: "", surah: "", halaman: "", ayat: "", status: "Lancar", catatan: "" });
    fetchRiwayatHafalan();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["Level 1", "Level 2", "Level 3"].map((l) => (
          <button key={l} onClick={() => setLevel(l)} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${level === l ? "text-white border-transparent" : `${t.text} ${t.border}`}`}
            style={level === l ? { backgroundColor: EMERALD } : {}}>
            {l}
          </button>
        ))}
      </div>

      <div className={`flex gap-1 border-b ${t.border}`}>
        {tabs.map((tb) => (
          <button key={tb.key} onClick={() => setTab(tb.key)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === tb.key ? "border-current" : "border-transparent " + t.textMuted}`}
            style={tab === tb.key ? { color: EMERALD } : {}}>
            {tb.label}
          </button>
        ))}
      </div>

      {tab === "absensi" && (
        <div className={`rounded-xl border ${t.border} ${t.panel} overflow-x-auto`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left ${t.textMuted} border-b ${t.border}`}>
                <th className="px-4 py-3 font-medium">Nama Siswa</th>
                <th className="px-4 py-3 font-medium">NIS</th>
                <th className="px-4 py-3 font-medium">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className={`border-b ${t.border} last:border-0`}>
                  <td className={`px-4 py-3 ${t.text} font-medium`}>{s.nama}</td>
                  <td className={`px-4 py-3 ${t.textMuted}`}>{s.nis}</td>
                  <td className="px-4 py-3">
                    <select value={absensi[s.id] || "Hadir"} onChange={(e) => setAbsensi({ ...absensi, [s.id]: e.target.value })}
                      className={`rounded-lg border px-2 py-1 text-xs ${t.input}`}>
                      <option>Hadir</option><option>Izin</option><option>Sakit</option><option>Alpha</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 border-t flex justify-end" style={{ borderColor: t.border.includes("800") ? "#1f2937" : "#e5e7eb" }}>
            <button onClick={handleSaveAbsensi} disabled={savingAbsensi} className="rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
              {savingAbsensi ? "Menyimpan..." : "Simpan Absensi"}
            </button>
          </div>
        </div>
      )}

      {tab === "tahsin" && (
        <div className={`rounded-xl border ${t.border} ${t.panel} p-5 max-w-xl`}>
          <Field t={t} label="Siswa">
            <select value={tahsin.siswa} onChange={(e) => setTahsin({ ...tahsin, siswa: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
              <option value="">Pilih siswa...</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field t={t} label={level === "Level 1" ? "Jilid Iqra'" : "Juz"}>
              <input value={tahsin.jilid} onChange={(e) => setTahsin({ ...tahsin, jilid: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} />
            </Field>
            <Field t={t} label="Halaman">
              <input value={tahsin.halaman} onChange={(e) => setTahsin({ ...tahsin, halaman: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} />
            </Field>
          </div>
          <Field t={t} label="Status">
            <select value={tahsin.status} onChange={(e) => setTahsin({ ...tahsin, status: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
              <option>Lancar</option><option>Mengulang</option><option>Belum</option>
            </select>
          </Field>
          <Field t={t} label="Catatan"><textarea value={tahsin.catatan} onChange={(e) => setTahsin({ ...tahsin, catatan: e.target.value })} rows={3} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <button onClick={handleSaveTahsin} disabled={savingTahsin} className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
            {savingTahsin ? "Menyimpan..." : "Simpan Tahsin"}
          </button>

          {riwayatTahsin.length > 0 && (
            <div className={`mt-5 pt-4 border-t ${t.border}`}>
              <p className={`text-xs font-semibold mb-2 ${t.textMuted}`}>Catatan Tahsin Hari Ini</p>
              <div className="space-y-2">
                {riwayatTahsin.map((r) => (
                  <div key={r.id} className={`flex items-center justify-between rounded-lg border ${t.border} px-3 py-2`}>
                    <div className="text-xs">
                      <p className={`font-medium ${t.text}`}>{namaSiswa(r.student_id)} — {r.jilid_juz || "-"} hal.{r.halaman || "-"}</p>
                      <p className={t.textMuted}>{r.status}{r.catatan ? ` · ${r.catatan}` : ""}</p>
                    </div>
                    <button onClick={() => hapusTahsin(r.id)} className="p-1.5 rounded-md hover:bg-red-50"><Trash2 size={14} className="text-red-500" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "hafalan" && (
        <div className={`rounded-xl border ${t.border} ${t.panel} p-5 max-w-xl`}>
          <Field t={t} label="Siswa">
            <select value={hafalan.siswa} onChange={(e) => setHafalan({ ...hafalan, siswa: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
              <option value="">Pilih siswa...</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field t={t} label="Nama Juz"><input value={hafalan.juz} onChange={(e) => setHafalan({ ...hafalan, juz: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
            <Field t={t} label="Nama Surah"><input value={hafalan.surah} onChange={(e) => setHafalan({ ...hafalan, surah: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
            <Field t={t} label="Halaman"><input value={hafalan.halaman} onChange={(e) => setHafalan({ ...hafalan, halaman: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
            <Field t={t} label="Ayat"><input value={hafalan.ayat} onChange={(e) => setHafalan({ ...hafalan, ayat: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          </div>
          <Field t={t} label="Status">
            <select value={hafalan.status} onChange={(e) => setHafalan({ ...hafalan, status: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
              <option>Lancar</option><option>Mengulang</option><option>Belum</option>
            </select>
          </Field>
          <Field t={t} label="Catatan Guru"><textarea value={hafalan.catatan} onChange={(e) => setHafalan({ ...hafalan, catatan: e.target.value })} rows={3} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <button onClick={handleSaveHafalan} disabled={savingHafalan} className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
            {savingHafalan ? "Menyimpan..." : "Simpan Hafalan"}
          </button>

          {riwayatHafalan.length > 0 && (
            <div className={`mt-5 pt-4 border-t ${t.border}`}>
              <p className={`text-xs font-semibold mb-2 ${t.textMuted}`}>Catatan Hafalan Hari Ini</p>
              <div className="space-y-2">
                {riwayatHafalan.map((r) => (
                  <div key={r.id} className={`flex items-center justify-between rounded-lg border ${t.border} px-3 py-2`}>
                    <div className="text-xs">
                      <p className={`font-medium ${t.text}`}>{namaSiswa(r.student_id)} — {r.surah || "-"} ayat {r.ayat || "-"}</p>
                      <p className={t.textMuted}>{r.status}{r.catatan ? ` · ${r.catatan}` : ""}</p>
                    </div>
                    <button onClick={() => hapusHafalan(r.id)} className="p-1.5 rounded-md hover:bg-red-50"><Trash2 size={14} className="text-red-500" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- JURNAL PEMBELAJARAN ---------------------------------- */
function JurnalPembelajaran({ t, checkedIn, role, userId, profileName, flash }) {
  const [level, setLevel] = useState("Level 1");
  const [form, setForm] = useState({ materi: "", metode: "", tujuan: "", evaluasi: "" });
  const [saving, setSaving] = useState(false);
  const [riwayat, setRiwayat] = useState([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  const fetchRiwayat = async () => {
    setLoadingRiwayat(true);
    let query = supabase.from("teaching_journal").select("*").order("tanggal", { ascending: false }).limit(10);
    if (role === "Guru" && userId) query = query.eq("teacher_id", userId);
    const { data, error } = await query;
    if (!error && data) setRiwayat(data);
    setLoadingRiwayat(false);
  };

  useEffect(() => { fetchRiwayat(); }, [role, userId]);

  const hapusJurnal = async (id) => {
    if (!window.confirm("Hapus jurnal pembelajaran ini?")) return;
    const { error } = await supabase.from("teaching_journal").delete().eq("id", id);
    if (error) { flash("Gagal menghapus: " + error.message, "error"); return; }
    flash("Jurnal dihapus", "error");
    fetchRiwayat();
  };

  if (role === "Guru" && !checkedIn) {
    return (
      <div className={`rounded-xl border ${t.border} ${t.panel} p-8 text-center max-w-lg mx-auto`}>
        <BookOpen size={28} className="mx-auto mb-3 text-red-500" />
        <p className={`font-semibold ${t.text}`}>Anda belum melakukan absensi</p>
        <p className={`text-sm ${t.textMuted} mt-1`}>Silakan lakukan Check-In pada menu Absensi Guru terlebih dahulu sebelum mengisi Jurnal Pembelajaran.</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!form.materi.trim()) { flash("Materi/Topik wajib diisi", "error"); return; }
    setSaving(true);
    const { error } = await supabase.from("teaching_journal").insert({
      teacher_id: userId,
      level,
      tanggal: today,
      materi: form.materi,
      metode: form.metode,
      tujuan: form.tujuan,
      evaluasi: form.evaluasi,
    });
    setSaving(false);
    if (error) { flash("Gagal menyimpan: " + error.message, "error"); return; }
    flash("Jurnal pembelajaran tersimpan");
    setForm({ materi: "", metode: "", tujuan: "", evaluasi: "" });
    fetchRiwayat();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["Level 1", "Level 2", "Level 3"].map((l) => (
          <button key={l} onClick={() => setLevel(l)} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${level === l ? "text-white border-transparent" : `${t.text} ${t.border}`}`}
            style={level === l ? { backgroundColor: EMERALD } : {}}>
            {l}
          </button>
        ))}
      </div>

      <div className={`rounded-xl border ${t.border} ${t.panel} p-5 max-w-2xl`}>
        <p className={`text-xs ${t.textMuted} mb-3`}>Tanggal: {today} · Diisi oleh: {profileName}</p>
        <Field t={t} label="Materi / Topik yang Diajarkan">
          <input value={form.materi} onChange={(e) => setForm({ ...form, materi: e.target.value })} placeholder="Contoh: Iqra' Jilid 2 - Huruf Sambung"
            className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} />
        </Field>
        <Field t={t} label="Metode Mengajar">
          <input value={form.metode} onChange={(e) => setForm({ ...form, metode: e.target.value })} placeholder="Contoh: Talaqqi, drill baca bergantian"
            className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} />
        </Field>
        <Field t={t} label="Tujuan Pembelajaran">
          <textarea value={form.tujuan} onChange={(e) => setForm({ ...form, tujuan: e.target.value })} rows={2}
            placeholder="Contoh: Siswa mampu membaca huruf sambung dengan benar" className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} />
        </Field>
        <Field t={t} label="Evaluasi / Kendala di Kelas">
          <textarea value={form.evaluasi} onChange={(e) => setForm({ ...form, evaluasi: e.target.value })} rows={2}
            placeholder="Contoh: 2 siswa masih kesulitan membedakan huruf ba dan ta" className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} />
        </Field>
        <button onClick={handleSave} disabled={saving} className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
          {saving ? "Menyimpan..." : "Simpan Jurnal"}
        </button>
      </div>

      <div className={`rounded-xl border ${t.border} ${t.panel} p-4`}>
        <p className={`text-sm font-semibold mb-3 ${t.text}`}>Riwayat Jurnal Terbaru</p>
        {loadingRiwayat ? (
          <p className={`text-sm ${t.textMuted}`}>Memuat...</p>
        ) : riwayat.length === 0 ? (
          <p className={`text-sm ${t.textMuted}`}>Belum ada jurnal tercatat.</p>
        ) : (
          <div className="space-y-3">
            {riwayat.map((r) => (
              <div key={r.id} className={`border-b ${t.border} last:border-0 pb-3 last:pb-0 flex items-start justify-between gap-2`}>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge tone="gray">{r.level}</Badge>
                    <span className={`text-xs ${t.textMuted}`}>{r.tanggal}</span>
                  </div>
                  <p className={`text-sm font-medium ${t.text}`}>{r.materi}</p>
                  {r.metode && <p className={`text-xs ${t.textMuted}`}>Metode: {r.metode}</p>}
                  {r.evaluasi && <p className={`text-xs ${t.textMuted}`}>Evaluasi: {r.evaluasi}</p>}
                </div>
                <button onClick={() => hapusJurnal(r.id)} className="p-1.5 rounded-md hover:bg-red-50 shrink-0"><Trash2 size={14} className="text-red-500" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- PENILAIAN MINGGUAN ---------------------------------- */
const PREDIKAT_OPTIONS = ["Sangat Baik", "Baik", "Cukup", "Perlu Bimbingan"];

function nowHHMM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}
function getWeekEnd(weekStartStr) {
  const d = new Date(weekStartStr);
  d.setDate(d.getDate() + 5);
  return d.toISOString().slice(0, 10);
}

function PredikatBadge({ value }) {
  const tone = { "Sangat Baik": "emerald", "Baik": "blue", "Cukup": "amber", "Perlu Bimbingan": "red" }[value] || "gray";
  return <Badge tone={tone}>{value}</Badge>;
}

function PenilaianMingguan({ t, checkedIn, role, userId, siswaList, flash }) {
  const [level, setLevel] = useState("Level 1");
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd(weekStart);
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalSiswa, setModalSiswa] = useState(null);

  const students = siswaList.filter((s) => s.level === level && s.aktif !== false);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("weekly_assessment").select("*").eq("level", level).eq("week_start", weekStart);
    if (!error && data) {
      const map = {};
      data.forEach((r) => { map[r.student_id] = r; });
      setRecords(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, [level]);

  if (role === "Guru" && !checkedIn) {
    return (
      <div className={`rounded-xl border ${t.border} ${t.panel} p-8 text-center max-w-lg mx-auto`}>
        <Award size={28} className="mx-auto mb-3 text-red-500" />
        <p className={`font-semibold ${t.text}`}>Anda belum melakukan absensi</p>
        <p className={`text-sm ${t.textMuted} mt-1`}>Silakan lakukan Check-In pada menu Absensi Guru terlebih dahulu sebelum mengisi Penilaian Mingguan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {["Level 1", "Level 2", "Level 3"].map((l) => (
            <button key={l} onClick={() => setLevel(l)} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${level === l ? "text-white border-transparent" : `${t.text} ${t.border}`}`}
              style={level === l ? { backgroundColor: EMERALD } : {}}>
              {l}
            </button>
          ))}
        </div>
        <p className={`text-xs ${t.textMuted}`}>Minggu ini: {weekStart} s/d {weekEnd}</p>
      </div>

      <div className={`rounded-xl border ${t.border} ${t.panel} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`text-left ${t.textMuted} border-b ${t.border}`}>
              <th className="px-4 py-3 font-medium">Nama Siswa</th>
              <th className="px-4 py-3 font-medium">Tahsin</th>
              <th className="px-4 py-3 font-medium">Sikap</th>
              <th className="px-4 py-3 font-medium">Tahfidz</th>
              <th className="px-4 py-3 font-medium">Pembelajaran</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className={`px-4 py-8 text-center ${t.textMuted}`}>Memuat...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={6} className={`px-4 py-8 text-center ${t.textMuted}`}>Belum ada siswa di level ini</td></tr>
            ) : students.map((s) => {
              const r = records[s.id];
              return (
                <tr key={s.id} className={`border-b ${t.border} last:border-0`}>
                  <td className={`px-4 py-3 ${t.text} font-medium`}>{s.nama}</td>
                  <td className="px-4 py-3">{r ? <PredikatBadge value={r.nilai_tahsin} /> : <span className={t.textMuted}>-</span>}</td>
                  <td className="px-4 py-3">{r ? <PredikatBadge value={r.nilai_sikap} /> : <span className={t.textMuted}>-</span>}</td>
                  <td className="px-4 py-3">{r ? <PredikatBadge value={r.nilai_tahfidz} /> : <span className={t.textMuted}>-</span>}</td>
                  <td className="px-4 py-3">{r ? <PredikatBadge value={r.nilai_pembelajaran} /> : <span className={t.textMuted}>-</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModalSiswa(s)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-white" style={{ backgroundColor: r ? GOLD : EMERALD }}>
                      {r ? "Edit Nilai" : "Isi Nilai"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalSiswa && (
        <PenilaianModal
          t={t} siswa={modalSiswa} existing={records[modalSiswa.id]} weekStart={weekStart} level={level} userId={userId}
          onClose={() => setModalSiswa(null)}
          onSaved={() => { setModalSiswa(null); fetchRecords(); flash("Penilaian tersimpan"); }}
          onDeleted={() => { setModalSiswa(null); fetchRecords(); flash("Penilaian dihapus", "error"); }}
          onError={(msg) => flash("Gagal menyimpan: " + msg, "error")}
        />
      )}
    </div>
  );
}

function PenilaianModal({ t, siswa, existing, weekStart, level, userId, onClose, onSaved, onDeleted, onError }) {
  const [form, setForm] = useState({
    nilai_tahsin: existing?.nilai_tahsin || "Baik",
    nilai_sikap: existing?.nilai_sikap || "Baik",
    nilai_tahfidz: existing?.nilai_tahfidz || "Baik",
    materi_pembelajaran: existing?.materi_pembelajaran || "",
    tema_pembelajaran: existing?.tema_pembelajaran || "",
    nilai_pembelajaran: existing?.nilai_pembelajaran || "Baik",
    catatan: existing?.catatan || "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("weekly_assessment").upsert({
      student_id: siswa.id, teacher_id: userId, level, week_start: weekStart, ...form,
    }, { onConflict: "student_id,week_start" });
    setSaving(false);
    if (error) { onError(error.message); return; }
    onSaved();
  };

  const handleDelete = async () => {
    if (!window.confirm("Hapus penilaian minggu ini untuk siswa ini?")) return;
    setDeleting(true);
    const { error } = await supabase.from("weekly_assessment").delete().eq("id", existing.id);
    setDeleting(false);
    if (error) { onError(error.message); return; }
    onDeleted();
  };

  return (
    <Modal t={t} title={`Penilaian Mingguan — ${siswa.nama}`} onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field t={t} label="Nilai Tahsin">
          <select value={form.nilai_tahsin} onChange={(e) => setForm({ ...form, nilai_tahsin: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
            {PREDIKAT_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field t={t} label="Nilai Sikap">
          <select value={form.nilai_sikap} onChange={(e) => setForm({ ...form, nilai_sikap: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
            {PREDIKAT_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field t={t} label="Nilai Tahfidz">
          <select value={form.nilai_tahfidz} onChange={(e) => setForm({ ...form, nilai_tahfidz: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
            {PREDIKAT_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
      </div>

      <p className={`text-xs font-semibold mt-2 mb-1 ${t.textMuted}`}>Nilai Pembelajaran</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field t={t} label="Materi"><input value={form.materi_pembelajaran} onChange={(e) => setForm({ ...form, materi_pembelajaran: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
        <Field t={t} label="Tema"><input value={form.tema_pembelajaran} onChange={(e) => setForm({ ...form, tema_pembelajaran: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
      </div>
      <Field t={t} label="Nilai">
        <select value={form.nilai_pembelajaran} onChange={(e) => setForm({ ...form, nilai_pembelajaran: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`}>
          {PREDIKAT_OPTIONS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </Field>
      <Field t={t} label="Catatan Tambahan (opsional)">
        <textarea value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} rows={2} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} />
      </Field>

      <div className="flex gap-2 mt-2">
        <button onClick={handleSave} disabled={saving || deleting} className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
          {saving ? "Menyimpan..." : "Simpan Penilaian"}
        </button>
        {existing && (
          <button onClick={handleDelete} disabled={saving || deleting} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-60">
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        )}
      </div>
    </Modal>
  );
}

/* ---------------------------------- REKAP LAPORAN (WRAPPER TAB) ---------------------------------- */
function RekapLaporan({ t, dark, siswaList, settings, flash }) {
  const [tab, setTab] = useState("harian");
  return (
    <div className="space-y-4">
      <div className={`flex gap-1 border-b ${t.border}`}>
        {[{ key: "harian", label: "Laporan Harian" }, { key: "periode", label: "Laporan Periode (Rapor)" }].map((tb) => (
          <button key={tb.key} onClick={() => setTab(tb.key)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === tb.key ? "border-current" : "border-transparent " + t.textMuted}`}
            style={tab === tb.key ? { color: EMERALD } : {}}>
            {tb.label}
          </button>
        ))}
      </div>
      {tab === "harian" && <RekapHarian t={t} dark={dark} siswaList={siswaList} settings={settings} flash={flash} />}
      {tab === "periode" && <RekapPeriode t={t} siswaList={siswaList} settings={settings} flash={flash} />}
    </div>
  );
}

/* ---------------------------------- LAPORAN HARIAN PER LEVEL ---------------------------------- */
function RekapHarian({ t, dark, siswaList, settings, flash }) {
  const [level, setLevel] = useState("Level 1");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [pesanGuru, setPesanGuru] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [materiHariIni, setMateriHariIni] = useState(null);
  const reportRef = React.useRef(null);

  const students = siswaList.filter((s) => s.level === level && s.aktif !== false);

  const loadData = async () => {
    setLoading(true);
    const ids = students.map((s) => s.id);
    const weekStart = getWeekStart(new Date(tanggal));

    const [{ data: att }, { data: tahsin }, { data: hafalan }, { data: nilai }, { data: jurnal }] = await Promise.all([
      ids.length ? supabase.from("student_attendance").select("*").in("student_id", ids).eq("tanggal", tanggal) : { data: [] },
      ids.length ? supabase.from("tahsin_progress").select("*").in("student_id", ids).eq("tanggal", tanggal).order("created_at", { ascending: false }) : { data: [] },
      ids.length ? supabase.from("memorization_progress").select("*").in("student_id", ids).eq("tanggal", tanggal).order("created_at", { ascending: false }) : { data: [] },
      ids.length ? supabase.from("weekly_assessment").select("*").eq("level", level).eq("week_start", weekStart) : { data: [] },
      supabase.from("teaching_journal").select("*").eq("level", level).eq("tanggal", tanggal).order("created_at", { ascending: false }).limit(1),
    ]);

    setMateriHariIni(jurnal && jurnal.length > 0 ? jurnal[0] : null);

    const attMap = {}; (att || []).forEach((r) => { attMap[r.student_id] = r; });
    const tahsinMap = {}; (tahsin || []).forEach((r) => { if (!tahsinMap[r.student_id]) tahsinMap[r.student_id] = r; });
    const hafalanMap = {}; (hafalan || []).forEach((r) => { if (!hafalanMap[r.student_id]) hafalanMap[r.student_id] = r; });
    const nilaiMap = {}; (nilai || []).forEach((r) => { nilaiMap[r.student_id] = r; });

    setRows(students.map((s) => ({
      ...s,
      attendance: attMap[s.id],
      tahsin: tahsinMap[s.id],
      hafalan: hafalanMap[s.id],
      nilai: nilaiMap[s.id],
    })));
    setLoading(false);
    setLoaded(true);
  };

  const exportImage = async (format) => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const mime = format === "jpeg" ? "image/jpeg" : "image/png";
      const url = canvas.toDataURL(mime, 0.95);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-${level.replace(" ", "")}-${tanggal}.${format === "jpeg" ? "jpg" : "png"}`;
      a.click();
      flash(`Laporan berhasil diunduh (${format.toUpperCase()})`);
    } catch (e) {
      flash("Gagal membuat gambar: " + e.message, "error");
    }
    setExporting(false);
  };

  const hariIndo = new Date(tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const hadirCount = rows.filter((r) => (r.attendance?.status || "Hadir") === "Hadir").length;

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border ${t.border} ${t.panel} p-4 flex flex-wrap gap-3 items-end`}>
        <Field t={t} label="Level">
          <select value={level} onChange={(e) => { setLevel(e.target.value); setLoaded(false); }} className={`rounded-lg border px-3 py-2 text-sm ${t.input}`}>
            <option>Level 1</option><option>Level 2</option><option>Level 3</option>
          </select>
        </Field>
        <Field t={t} label="Tanggal">
          <input type="date" value={tanggal} onChange={(e) => { setTanggal(e.target.value); setLoaded(false); }} className={`rounded-lg border px-3 py-2 text-sm ${t.input}`} />
        </Field>
        <button onClick={loadData} disabled={loading} className="rounded-lg px-4 py-2 text-sm font-medium text-white h-fit disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
          {loading ? "Memuat..." : "Muat Data"}
        </button>
      </div>

      {loaded && (
        <>
          <div className={`rounded-xl border ${t.border} ${t.panel} p-4`}>
            <Field t={t} label="Catatan / Pesan untuk Wali Santri (opsional)">
              <textarea value={pesanGuru} onChange={(e) => setPesanGuru(e.target.value)} rows={2}
                placeholder="Contoh: Alhamdulillah kegiatan hari ini berjalan lancar. Mohon dukung ananda mengulang bacaan di rumah."
                className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} />
            </Field>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <button onClick={() => exportImage("png")} disabled={exporting} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
              <Download size={14} /> {exporting ? "Memproses..." : "Download PNG"}
            </button>
            <button onClick={() => exportImage("jpeg")} disabled={exporting} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: GOLD }}>
              <Download size={14} /> {exporting ? "Memproses..." : "Download JPEG"}
            </button>
          </div>

          {/* ====== AREA YANG DI-RENDER JADI GAMBAR ====== */}
          <div className="overflow-x-auto">
            <div ref={reportRef} style={{ width: 720, fontFamily: "sans-serif", backgroundColor: "#ffffff" }} className="mx-auto rounded-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${EMERALD} 0%, ${EMERALD_DARK} 100%)` }} className="px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} crossOrigin="anonymous" alt="Logo" className="h-11 w-11 rounded-lg object-contain bg-white/15 p-1" />
                  ) : (
                    <div className="h-11 w-11 rounded-lg bg-white/15 flex items-center justify-center font-bold text-lg">MSM</div>
                  )}
                  <div>
                    <p className="font-bold text-lg leading-tight">{settings?.nama_madrasah || "Madrasah Sore Madani"}</p>
                    <p className="text-xs opacity-90">Laporan Kegiatan Harian</p>
                  </div>
                </div>
              </div>

              <div className="px-6 pt-4 pb-1 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{level}</p>
                  <p className="text-xs text-gray-500">{hariIndo}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Kehadiran</p>
                  <p className="text-sm font-bold" style={{ color: EMERALD }}>{hadirCount} / {rows.length} Siswa</p>
                </div>
              </div>

              {materiHariIni && (
                <div className="mx-6 mt-2 rounded-xl px-4 py-2.5" style={{ backgroundColor: "#f0f9f5" }}>
                  <p className="text-[11px] font-semibold" style={{ color: EMERALD }}>Materi / Topik Pembelajaran Hari Ini</p>
                  <p className="text-xs text-gray-700">{materiHariIni.materi}</p>
                </div>
              )}

              <div className="px-6 pb-4 pt-3 space-y-3">
                {rows.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">Belum ada siswa di level ini.</p>
                )}
                {rows.map((r, idx) => {
                  const statusAbsen = r.attendance?.status || "Belum Diabsen";
                  const statusTone = { Hadir: "#059669", Izin: "#2563eb", Sakit: "#6b7280", Alpha: "#dc2626", "Belum Diabsen": "#9ca3af" }[statusAbsen];
                  return (
                    <div key={r.id} className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: "#f8faf9" }}>
                        <p className="text-sm font-semibold text-gray-800">{idx + 1}. {r.nama}</p>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: statusTone }}>{statusAbsen}</span>
                      </div>
                      <div className="px-4 py-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11.5px]">
                        <p className="text-gray-500">Tahsin: <span className="text-gray-800 font-medium">{r.tahsin ? `${r.tahsin.jilid_juz || "-"} hal.${r.tahsin.halaman || "-"} (${r.tahsin.status})` : "-"}</span></p>
                        <p className="text-gray-500">Hafalan: <span className="text-gray-800 font-medium">{r.hafalan ? `${r.hafalan.surah || "-"} ayat ${r.hafalan.ayat || "-"} (${r.hafalan.status})` : "-"}</span></p>
                        <p className="text-gray-500 col-span-2">Nilai Minggu Ini:{" "}
                          {r.nilai ? (
                            <span className="text-gray-800 font-medium">
                              Tahsin {r.nilai.nilai_tahsin} · Sikap {r.nilai.nilai_sikap} · Tahfidz {r.nilai.nilai_tahfidz} · Pembelajaran {r.nilai.nilai_pembelajaran}
                            </span>
                          ) : <span className="text-gray-400">Belum dinilai</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {pesanGuru && (
                <div className="mx-6 mb-4 rounded-xl px-4 py-3" style={{ backgroundColor: "#fdf8ec", borderLeft: `4px solid ${GOLD}` }}>
                  <p className="text-[11px] font-semibold mb-0.5" style={{ color: GOLD }}>Pesan untuk Wali Santri</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{pesanGuru}</p>
                </div>
              )}

              <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[10px] text-gray-400">Dibuat otomatis oleh Sistem Manajemen Madrasah Sore Madani</p>
                <p className="text-[10px] text-gray-400">{new Date().toLocaleString("id-ID")}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------- LAPORAN PERIODE (SEMESTER / TAHUNAN) ---------------------------------- */
function getMode(arr) {
  if (!arr || arr.length === 0) return "-";
  const count = {};
  arr.forEach((v) => { if (v) count[v] = (count[v] || 0) + 1; });
  const keys = Object.keys(count);
  if (keys.length === 0) return "-";
  return keys.reduce((a, b) => (count[a] >= count[b] ? a : b));
}

function RekapPeriode({ t, siswaList, settings, flash }) {
  const [level, setLevel] = useState("Level 1");
  const today = new Date();
  const [tglMulai, setTglMulai] = useState(new Date(today.getFullYear(), today.getMonth() - 5, 1).toISOString().slice(0, 10));
  const [tglSelesai, setTglSelesai] = useState(today.toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [rows, setRows] = useState([]);
  const [exporting, setExporting] = useState(false);

  const students = siswaList.filter((s) => s.level === level && s.aktif !== false);

  const setPreset = (bulan) => {
    const d = new Date();
    d.setMonth(d.getMonth() - bulan);
    setTglMulai(d.toISOString().slice(0, 10));
    setTglSelesai(new Date().toISOString().slice(0, 10));
  };

  const loadData = async () => {
    setLoading(true);
    const ids = students.map((s) => s.id);
    if (ids.length === 0) { setRows([]); setLoading(false); setLoaded(true); return; }

    const [{ data: att }, { data: tahsin }, { data: hafalan }, { data: nilai }] = await Promise.all([
      supabase.from("student_attendance").select("*").in("student_id", ids).gte("tanggal", tglMulai).lte("tanggal", tglSelesai),
      supabase.from("tahsin_progress").select("*").in("student_id", ids).gte("tanggal", tglMulai).lte("tanggal", tglSelesai).order("tanggal", { ascending: false }),
      supabase.from("memorization_progress").select("*").in("student_id", ids).gte("tanggal", tglMulai).lte("tanggal", tglSelesai).order("tanggal", { ascending: false }),
      supabase.from("weekly_assessment").select("*").eq("level", level).gte("week_start", tglMulai).lte("week_start", tglSelesai),
    ]);

    const result = students.map((s) => {
      const attS = (att || []).filter((r) => r.student_id === s.id);
      const hadir = attS.filter((r) => r.status === "Hadir").length;
      const izin = attS.filter((r) => r.status === "Izin").length;
      const sakit = attS.filter((r) => r.status === "Sakit").length;
      const alpha = attS.filter((r) => r.status === "Alpha").length;
      const totalPertemuan = attS.length;
      const persenHadir = totalPertemuan > 0 ? Math.round((hadir / totalPertemuan) * 100) : 0;

      const tahsinS = (tahsin || []).filter((r) => r.student_id === s.id);
      const tahsinTerakhir = tahsinS[0] ? `${tahsinS[0].jilid_juz || "-"} hal.${tahsinS[0].halaman || "-"} (${tahsinS[0].status})` : "-";

      const hafalanS = (hafalan || []).filter((r) => r.student_id === s.id && r.status === "Lancar");
      const surahSelesai = [...new Set(hafalanS.map((r) => r.surah).filter(Boolean))];

      const nilaiS = (nilai || []).filter((r) => r.student_id === s.id);
      const modusTahsin = getMode(nilaiS.map((r) => r.nilai_tahsin));
      const modusSikap = getMode(nilaiS.map((r) => r.nilai_sikap));
      const modusTahfidz = getMode(nilaiS.map((r) => r.nilai_tahfidz));
      const modusPembelajaran = getMode(nilaiS.map((r) => r.nilai_pembelajaran));

      const jamMasukPatokan = (settings?.jam_masuk || "15:30").slice(0, 5);
      const hadirRecords = attS.filter((r) => r.status === "Hadir" && r.jam_tercatat);
      const tepatWaktu = hadirRecords.filter((r) => r.jam_tercatat <= jamMasukPatokan).length;
      const terlambat = hadirRecords.filter((r) => r.jam_tercatat > jamMasukPatokan).length;

      return {
        nama: s.nama, nis: s.nis,
        totalPertemuan, hadir, izin, sakit, alpha, persenHadir,
        tahsinTerakhir, surahSelesai: surahSelesai.length ? surahSelesai.join(", ") : "-",
        modusTahsin, modusSikap, modusTahfidz, modusPembelajaran,
        tepatWaktu, terlambat,
      };
    });

    setRows(result);
    setLoading(false);
    setLoaded(true);
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const XLSX = await import("xlsx");

      const hariTanggalCetak = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      const fmtTgl = (iso) => new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

      const headerRows = [
        ["LAPORAN REKAP PERIODE (RAPOR)"],
        ["Madrasah Sore Madani"],
        [`Level: ${level}`],
        [`Periode: ${fmtTgl(tglMulai)}  s/d  ${fmtTgl(tglSelesai)}`],
        [`Dicetak pada: ${hariTanggalCetak}`],
        [],
      ];
      const dataForSheet = rows.map((r, i) => ({
        "No": i + 1,
        "Nama Siswa": r.nama,
        "NIS": r.nis,
        "Total Pertemuan": r.totalPertemuan,
        "Hadir": r.hadir,
        "Izin": r.izin,
        "Sakit": r.sakit,
        "Alpha": r.alpha,
        "% Kehadiran": r.persenHadir + "%",
        "Hari Tepat Waktu": r.tepatWaktu,
        "Hari Terlambat": r.terlambat,
        "Tahsin Terakhir": r.tahsinTerakhir,
        "Surah Hafalan Selesai": r.surahSelesai,
        "Nilai Tahsin": r.modusTahsin,
        "Nilai Sikap": r.modusSikap,
        "Nilai Tahfidz": r.modusTahfidz,
        "Nilai Pembelajaran": r.modusPembelajaran,
      }));
      const ws = XLSX.utils.aoa_to_sheet(headerRows);
      XLSX.utils.sheet_add_json(ws, dataForSheet, { origin: -1, skipHeader: false });
      ws["!cols"] = [{ wch: 4 }, { wch: 22 }, { wch: 12 }, { wch: 8 }, { wch: 7 }, { wch: 6 }, { wch: 6 }, { wch: 7 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 16 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, level.replace(" ", ""));

      // Sheet ke-2: Materi/Topik Pembelajaran selama periode ini
      const { data: jurnalData } = await supabase.from("teaching_journal").select("*").eq("level", level).gte("tanggal", tglMulai).lte("tanggal", tglSelesai).order("tanggal");
      const materiHeaderRows = [
        ["MATERI / TOPIK PEMBELAJARAN"],
        [`Level: ${level}  ·  Periode: ${fmtTgl(tglMulai)} s/d ${fmtTgl(tglSelesai)}`],
        [],
      ];
      const materiData = (jurnalData || []).map((j) => ({
        "Tanggal": j.tanggal,
        "Hari": fmtTgl(j.tanggal).split(",")[0] || fmtTgl(j.tanggal),
        "Materi / Topik": j.materi,
        "Metode": j.metode || "-",
        "Tujuan Pembelajaran": j.tujuan || "-",
        "Evaluasi / Kendala": j.evaluasi || "-",
      }));
      const wsMateri = XLSX.utils.aoa_to_sheet(materiHeaderRows);
      XLSX.utils.sheet_add_json(wsMateri, materiData, { origin: -1, skipHeader: false });
      wsMateri["!cols"] = [{ wch: 12 }, { wch: 10 }, { wch: 28 }, { wch: 20 }, { wch: 30 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, wsMateri, "Materi Pembelajaran");

      XLSX.writeFile(wb, `Rapor-${level.replace(" ", "")}-${tglMulai}_sd_${tglSelesai}.xlsx`);
      flash("Laporan Excel berhasil diunduh");
    } catch (e) {
      flash("Gagal membuat Excel: " + e.message, "error");
    }
    setExporting(false);
  };

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border ${t.border} ${t.panel} p-4 space-y-3`}>
        <div className="flex flex-wrap gap-3 items-end">
          <Field t={t} label="Level">
            <select value={level} onChange={(e) => { setLevel(e.target.value); setLoaded(false); }} className={`rounded-lg border px-3 py-2 text-sm ${t.input}`}>
              <option>Level 1</option><option>Level 2</option><option>Level 3</option>
            </select>
          </Field>
          <Field t={t} label="Tanggal Mulai">
            <input type="date" value={tglMulai} onChange={(e) => { setTglMulai(e.target.value); setLoaded(false); }} className={`rounded-lg border px-3 py-2 text-sm ${t.input}`} />
          </Field>
          <Field t={t} label="Tanggal Selesai">
            <input type="date" value={tglSelesai} onChange={(e) => { setTglSelesai(e.target.value); setLoaded(false); }} className={`rounded-lg border px-3 py-2 text-sm ${t.input}`} />
          </Field>
          <button onClick={loadData} disabled={loading} className="rounded-lg px-4 py-2 text-sm font-medium text-white h-fit disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
            {loading ? "Memuat..." : "Muat Rekap"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setPreset(1)} className={`text-xs px-3 py-1.5 rounded-full border ${t.border} ${t.text} ${t.hover}`}>1 Bulan Terakhir</button>
          <button onClick={() => setPreset(3)} className={`text-xs px-3 py-1.5 rounded-full border ${t.border} ${t.text} ${t.hover}`}>3 Bulan Terakhir</button>
          <button onClick={() => setPreset(6)} className={`text-xs px-3 py-1.5 rounded-full border ${t.border} ${t.text} ${t.hover}`}>6 Bulan (≈ Semester)</button>
          <button onClick={() => setPreset(12)} className={`text-xs px-3 py-1.5 rounded-full border ${t.border} ${t.text} ${t.hover}`}>1 Tahun Terakhir</button>
        </div>
      </div>

      {loaded && (
        <>
          <div className="flex justify-end">
            <button onClick={exportExcel} disabled={exporting || rows.length === 0} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
              <Download size={14} /> {exporting ? "Memproses..." : "Download Excel (.xlsx)"}
            </button>
          </div>

          <div className={`rounded-xl border ${t.border} ${t.panel} overflow-x-auto`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left ${t.textMuted} border-b ${t.border}`}>
                  <th className="px-3 py-3 font-medium">Nama</th>
                  <th className="px-3 py-3 font-medium">Hadir</th>
                  <th className="px-3 py-3 font-medium">Izin</th>
                  <th className="px-3 py-3 font-medium">Sakit</th>
                  <th className="px-3 py-3 font-medium">Alpha</th>
                  <th className="px-3 py-3 font-medium">% Hadir</th>
                  <th className="px-3 py-3 font-medium">Tepat Waktu</th>
                  <th className="px-3 py-3 font-medium">Terlambat</th>
                  <th className="px-3 py-3 font-medium">Tahsin Terakhir</th>
                  <th className="px-3 py-3 font-medium">Hafalan Selesai</th>
                  <th className="px-3 py-3 font-medium">Sikap</th>
                  <th className="px-3 py-3 font-medium">Pembelajaran</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={12} className={`px-4 py-8 text-center ${t.textMuted}`}>Tidak ada data pada periode ini</td></tr>
                ) : rows.map((r, i) => (
                  <tr key={i} className={`border-b ${t.border} last:border-0`}>
                    <td className={`px-3 py-3 ${t.text} font-medium whitespace-nowrap`}>{r.nama}</td>
                    <td className={`px-3 py-3 ${t.textMuted}`}>{r.hadir}</td>
                    <td className={`px-3 py-3 ${t.textMuted}`}>{r.izin}</td>
                    <td className={`px-3 py-3 ${t.textMuted}`}>{r.sakit}</td>
                    <td className={`px-3 py-3 ${t.textMuted}`}>{r.alpha}</td>
                    <td className={`px-3 py-3 ${t.textMuted}`}>{r.persenHadir}%</td>
                    <td className={`px-3 py-3 ${t.textMuted}`}>{r.tepatWaktu}</td>
                    <td className={`px-3 py-3 ${t.textMuted}`}>{r.terlambat}</td>
                    <td className={`px-3 py-3 ${t.textMuted} whitespace-nowrap`}>{r.tahsinTerakhir}</td>
                    <td className={`px-3 py-3 ${t.textMuted} max-w-[160px] truncate`} title={r.surahSelesai}>{r.surahSelesai}</td>
                    <td className="px-3 py-3"><PredikatBadge value={r.modusSikap} /></td>
                    <td className="px-3 py-3"><PredikatBadge value={r.modusPembelajaran} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`text-xs ${t.textMuted}`}>* Kolom Nilai Tahsin & Nilai Tahfidz juga ikut ter-export ke file Excel meski tidak ditampilkan penuh di tabel ini (supaya tabel tidak terlalu lebar).</p>
        </>
      )}
    </div>
  );
}

/* ---------------------------------- PENGATURAN ---------------------------------- */
function Pengaturan({ t, settings, setSettings, flash }) {
  const [form, setForm] = useState(settings);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const onLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { flash("Ukuran file maksimal 2MB", "error"); return; }
    setUploadingLogo(true);
    const path = `logos/logo-${Date.now()}.${file.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage.from("madani-uploads").upload(path, file, { upsert: true });
    if (uploadError) { flash("Gagal upload logo: " + uploadError.message, "error"); setUploadingLogo(false); return; }
    const { data: urlData } = supabase.storage.from("madani-uploads").getPublicUrl(path);
    const publicUrl = urlData.publicUrl;
    const { error: updateError } = await supabase.from("settings").update({ logo_url: publicUrl }).eq("id", 1);
    setUploadingLogo(false);
    if (updateError) { flash("Gagal menyimpan logo: " + updateError.message, "error"); return; }
    setSettings({ ...settings, logo_url: publicUrl });
    flash("Logo berhasil diunggah");
  };

  const removeLogo = async () => {
    const { error } = await supabase.from("settings").update({ logo_url: null }).eq("id", 1);
    if (error) { flash("Gagal menghapus logo: " + error.message, "error"); return; }
    setSettings({ ...settings, logo_url: null });
    flash("Logo dihapus", "error");
  };

  const saveIdentitas = async () => {
    setSaving(true);
    const { error } = await supabase.from("settings").update({
      nama_madrasah: form.nama_madrasah, nama_yayasan: form.nama_yayasan, alamat: form.alamat,
      no_hp: form.no_hp, email: form.email, website: form.website,
      kepala_madrasah: form.kepala_madrasah, tahun_berdiri: form.tahun_berdiri,
      jam_masuk: form.jam_masuk, jam_pulang: form.jam_pulang,
    }).eq("id", 1);
    setSaving(false);
    if (error) { flash("Gagal menyimpan: " + error.message, "error"); return; }
    setSettings(form);
    flash("Identitas madrasah tersimpan");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className={`rounded-xl border ${t.border} ${t.panel} p-5`}>
        <p className={`text-sm font-semibold mb-4 flex items-center gap-2 ${t.text}`}><ImageIcon size={16} /> Upload Logo</p>
        <div className={`h-32 rounded-lg border-2 border-dashed ${t.border} flex items-center justify-center mb-3 overflow-hidden`}>
          {settings.logo_url ? <img src={settings.logo_url} alt="logo" className="h-full object-contain" /> : <p className={`text-xs ${t.textMuted}`}>Preview logo (maks. 2MB)</p>}
        </div>
        <label className={`flex items-center justify-center gap-2 rounded-lg border ${t.border} ${t.hover} py-2 text-sm cursor-pointer ${t.text}`}>
          <Upload size={14} /> {uploadingLogo ? "Mengunggah..." : "Pilih File"}
          <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onLogoUpload} disabled={uploadingLogo} />
        </label>
        {settings.logo_url && <button onClick={removeLogo} className="w-full mt-2 text-xs text-red-500">Hapus Logo</button>}
        <p className={`text-[11px] mt-2 ${t.textMuted}`}>Logo ini otomatis tampil di sidebar dan di laporan yang di-download (PNG/JPEG).</p>
      </div>

      <div className={`rounded-xl border ${t.border} ${t.panel} p-5 lg:col-span-2`}>
        <p className={`text-sm font-semibold mb-4 ${t.text}`}>Identitas Madrasah</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field t={t} label="Nama Madrasah"><input value={form.nama_madrasah || ""} onChange={(e) => setForm({ ...form, nama_madrasah: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <Field t={t} label="Nama Yayasan"><input value={form.nama_yayasan || ""} onChange={(e) => setForm({ ...form, nama_yayasan: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <Field t={t} label="Alamat"><input value={form.alamat || ""} onChange={(e) => setForm({ ...form, alamat: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <Field t={t} label="Nomor HP"><input value={form.no_hp || ""} onChange={(e) => setForm({ ...form, no_hp: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <Field t={t} label="Email"><input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <Field t={t} label="Website"><input value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <Field t={t} label="Kepala Madrasah"><input value={form.kepala_madrasah || ""} onChange={(e) => setForm({ ...form, kepala_madrasah: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <Field t={t} label="Tahun Berdiri"><input value={form.tahun_berdiri || ""} onChange={(e) => setForm({ ...form, tahun_berdiri: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <Field t={t} label="Jam Masuk (patokan tepat waktu)"><input type="time" value={form.jam_masuk || "15:30"} onChange={(e) => setForm({ ...form, jam_masuk: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
          <Field t={t} label="Jam Pulang"><input type="time" value={form.jam_pulang || "17:30"} onChange={(e) => setForm({ ...form, jam_pulang: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm ${t.input}`} /></Field>
        </div>
        <p className={`text-[11px] mb-2 ${t.textMuted}`}>Jam Masuk dipakai sebagai patokan status "Terlambat/Tepat Waktu" pada Absensi Guru dan Absensi Siswa. Keterangan ini akan muncul di Laporan Excel (Periode), tidak ditampilkan di Laporan Harian (PNG/JPEG).</p>
        <button onClick={saveIdentitas} disabled={saving} className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white mt-2 disabled:opacity-60" style={{ backgroundColor: EMERALD }}>
          {saving ? "Menyimpan..." : "Simpan Identitas"}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- PROFIL ---------------------------------- */
function Profil({ t, role, profileName, userId, fotoUrl, setFotoUrl, flash }) {
  const Icon = roster[role]?.icon || User;
  const [uploading, setUploading] = useState(false);

  const onFotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { flash("Ukuran file maksimal 2MB", "error"); return; }
    setUploading(true);
    const path = `profile-photos/${userId}.${file.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage.from("madani-uploads").upload(path, file, { upsert: true });
    if (uploadError) { flash("Gagal upload foto: " + uploadError.message, "error"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("madani-uploads").getPublicUrl(path);
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    const { error: updateError } = await supabase.from("profiles").update({ foto_url: publicUrl }).eq("id", userId);
    setUploading(false);
    if (updateError) { flash("Gagal menyimpan foto: " + updateError.message, "error"); return; }
    setFotoUrl(publicUrl);
    flash("Foto profil berhasil diperbarui");
  };

  return (
    <div className={`rounded-xl border ${t.border} ${t.panel} p-6 max-w-md`}>
      <div className="flex items-center gap-4 mb-5">
        {fotoUrl ? (
          <img src={fotoUrl} alt={profileName} className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="h-16 w-16 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: EMERALD }}><Icon size={26} /></div>
        )}
        <div>
          <p className={`font-semibold ${t.text}`}>{profileName}</p>
          <Badge tone="blue">{role}</Badge>
        </div>
      </div>

      <label className={`flex items-center justify-center gap-2 rounded-lg border ${t.border} ${t.hover} py-2 text-sm cursor-pointer ${t.text} mb-4`}>
        <Upload size={14} /> {uploading ? "Mengunggah..." : "Ganti Foto Profil"}
        <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onFotoUpload} disabled={uploading} />
      </label>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className={t.textMuted}>Status</span><Badge tone="emerald">Aktif</Badge></div>
      </div>
    </div>
  );
}

/* ---------------------------------- PAGINATION ---------------------------------- */
function Pagination({ t, pg, setPg, totalPages, total }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className={t.textMuted}>Menampilkan {total === 0 ? 0 : (pg - 1) * 5 + 1}-{Math.min(pg * 5, total)} dari {total} data</span>
      <div className="flex gap-1">
        <button disabled={pg === 1} onClick={() => setPg(pg - 1)} className={`px-3 py-1.5 rounded-md border ${t.border} ${t.text} disabled:opacity-40`}>Sebelumnya</button>
        <span className={`px-3 py-1.5 ${t.text}`}>{pg} / {totalPages}</span>
        <button disabled={pg === totalPages} onClick={() => setPg(pg + 1)} className={`px-3 py-1.5 rounded-md border ${t.border} ${t.text} disabled:opacity-40`}>Berikutnya</button>
      </div>
    </div>
  );
}
