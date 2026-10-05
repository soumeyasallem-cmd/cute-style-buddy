import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Camera,
  Check,
  ChevronLeft,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  Home,
  ImagePlus,
  Moon,
  Plus,
  RotateCcw,
  Search,
  Shirt,
  Sparkles,
  Star,
  Sun,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import mascot from "../assets/glowup-mascot-wordmark.png";
import siaCredit from "../assets/soumeya-credit.png";
import workoutMascot from "../assets/glowup-workout.png";
import bowSticker from "../assets/bow.png.asset.json";
import cupcakeSticker from "../assets/cupcake.png.asset.json";
import headphonesSticker from "../assets/headphones.png.asset.json";
import strawberrySticker from "../assets/strawberry.png.asset.json";
import teddySticker from "../assets/teddy.png.asset.json";
import tulipsSticker from "../assets/tulips.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlowUp - غلو أب | مساعدتك اليومية اللطيفة" },
      { name: "description", content: "خططي لأكلك وروتينك ورياضتك وإطلالاتك في تطبيق يومي لطيف." },
      { property: "og:title", content: "GlowUp - غلو أب" },
      { property: "og:description", content: "مساعدتك اليومية اللطيفة للأكل والروتين والرياضة والإطلالات." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GlowUpApp,
});

type Tab = "home" | "food" | "closet" | "routine" | "workout";
type RoutineKey = "water" | "skin" | "study" | "sleep";
type ClosetItem = { id: number; src: string; category: string };
type Outfit = { id: number; items: ClosetItem[]; title: string };

const foodDatabase: Record<string, number> = {
  "رز بالدجاج": 520,
  "أرز بالدجاج": 520,
  "سلطة": 180,
  "شوربة": 210,
  "بيتزا": 620,
  "زبادي": 120,
  "تمر": 70,
  "قهوة": 45,
  "rice chicken": 520,
  "salad": 180,
  "pizza": 620,
};

const initialRoutine = [
  { key: "water" as RoutineKey, label: "اشربي كوبين ماء", time: "الصباح", icon: "💧" },
  { key: "skin" as RoutineKey, label: "روتين العناية بالبشرة", time: "الصباح", icon: "🫧" },
  { key: "study" as RoutineKey, label: "ساعة دراسة بتركيز", time: "بعد الظهر", icon: "📚" },
  { key: "sleep" as RoutineKey, label: "النوم قبل 11 مساءً", time: "المساء", icon: "🌙" },
];

const workouts = [
  { id: "walk", label: "مشي", icon: Footprints, rate: 4, tint: "bg-mint" },
  { id: "yoga", label: "يوغا", icon: Sparkles, rate: 3, tint: "bg-lilac" },
  { id: "gym", label: "نادي", icon: Dumbbell, rate: 7, tint: "bg-peach" },
  { id: "dance", label: "رقص", icon: Star, rate: 6, tint: "bg-sunshine" },
];

function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      try { setValue(JSON.parse(stored) as T); } catch { /* keep defaults */ }
    }
  }, [key]);
  useEffect(() => { window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}

function IconButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick?: () => void }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className="icon-button">{children}</button>;
}

function StickerBackdrop() {
  return <div className="sticker-backdrop" aria-hidden="true">
    <img className="sticker sticker-bow" src={bowSticker.url} alt="" />
    <img className="sticker sticker-teddy" src={teddySticker.url} alt="" />
    <img className="sticker sticker-tulips" src={tulipsSticker.url} alt="" />
    <img className="sticker sticker-cupcake" src={cupcakeSticker.url} alt="" />
    <span className="sticker-star star-one">✦</span><span className="sticker-star star-two">✧</span>
  </div>;
}

function GlowUpApp() {
  const [onboarded, setOnboarded] = useStoredState("glowup-onboarded", false);
  const [tab, setTab] = useState<Tab>("home");
  const [routine, setRoutine] = useStoredState<Record<RoutineKey, boolean>>("glowup-routine", { water: true, skin: true, study: false, sleep: false });
  const [calories, setCalories] = useStoredState("glowup-calories", 1200);
  const [stars, setStars] = useStoredState("glowup-stars", 12);
  const [streak] = useStoredState("glowup-streak", 7);
  const [closet, setCloset] = useStoredState<ClosetItem[]>("glowup-closet", []);
  const [favorites, setFavorites] = useStoredState<Outfit[]>("glowup-favorites", []);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!onboarded) return <Onboarding onStart={() => setOnboarded(true)} />;

  const completed = Object.values(routine).filter(Boolean).length;
  return (
    <main className="app-stage" dir="rtl">
      <StickerBackdrop />
      <div className="mobile-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">مساء الورد يا جميلة 🧸✨</p>
            <h1>GlowUp <span>غلو أب</span></h1>
          </div>
          <div className="header-actions">
            <IconButton label="الإشعارات" onClick={() => setToast("تذكيرك اللطيف مضبوط على 8:00 صباحاً 💗")}><Bell size={19} /></IconButton>
            <div className="mini-avatar"><img src={mascot} alt="شعار Glow up مطرّز باللون الوردي" width={1024} height={1024} /></div>
          </div>
        </header>

        <div className="screen-scroll">
          {tab === "home" && <HomeScreen calories={calories} completed={completed} streak={streak} stars={stars} setTab={setTab} />}
          {tab === "food" && <FoodScreen calories={calories} setCalories={setCalories} showToast={setToast} />}
          {tab === "routine" && <RoutineScreen routine={routine} setRoutine={setRoutine} stars={stars} setStars={setStars} showToast={setToast} />}
          {tab === "workout" && <WorkoutScreen showToast={setToast} />}
          {tab === "closet" && <ClosetScreen closet={closet} setCloset={setCloset} favorites={favorites} setFavorites={setFavorites} showToast={setToast} />}
        </div>

        <nav className="bottom-nav" aria-label="التنقل الرئيسي">
          <NavButton active={tab === "home"} label="الرئيسية" icon={<Home />} onClick={() => setTab("home")} />
          <NavButton active={tab === "food"} label="الأكل" icon={<Utensils />} onClick={() => setTab("food")} />
          <NavButton active={tab === "closet"} label="دولابي" icon={<Shirt />} prominent onClick={() => setTab("closet")} />
          <NavButton active={tab === "routine"} label="روتيني" icon={<Check />} onClick={() => setTab("routine")} />
          <NavButton active={tab === "workout"} label="رياضتي" icon={<Dumbbell />} onClick={() => setTab("workout")} />
          </nav>
          <img className="made-by made-by-app" src={siaCredit} alt="من إبداع Soumeya Sallem" loading="lazy" /> 
          {toast && <div className="toast-message">{toast}</div>}
      </div>
    </main>
  );
}

function Onboarding({ onStart }: { onStart: () => void }) {
  const [goal, setGoal] = useState("أهتم بصحتي");
  return (
    <main className="onboarding" dir="rtl">
      <div className="sparkle s1">✦</div><div className="sparkle s2">✿</div><div className="sparkle s3">♡</div>
      <div className="brand-pill">GlowUp · غلو أب</div>
      <div className="mascot-wrap"><img src={mascot} alt="شعار Glow up مطرّز باللون الوردي" width={1024} height={1024} /></div>
      <section className="onboarding-copy">
        <p className="speech">أهلاً يا جميلة! 💕</p>
        <h1>ما هو هدفك اليوم؟</h1>
        <p>اختاري شيئاً صغيراً، وأنا سأكون معك خطوة بخطوة.</p>
        <div className="goal-grid">
          {["أهتم بصحتي", "أنظّم يومي", "أتحرك أكثر", "أختار إطلالتي"].map((item) => (
            <button key={item} className={goal === item ? "goal active" : "goal"} onClick={() => setGoal(item)}>{goal === item && <Check size={16} />}{item}</button>
          ))}
        </div>
        <button className="primary-button" onClick={onStart}>يلا نبدأ <Sparkles size={18} /></button>
      </section>
      <img className="made-by" src={siaCredit} alt="من إبداع Soumeya Sallem" loading="lazy" /> 
    </main>
  );
}

function HomeScreen({ calories, completed, streak, stars, setTab }: { calories: number; completed: number; streak: number; stars: number; setTab: (tab: Tab) => void }) {
  const pct = Math.min(100, Math.round((calories / 1800) * 100));
  return <div className="page home-page">
    <section className="motivation-card">
      <img className="card-sticker motivation-sticker" src={strawberrySticker.url} alt="فراولة وردية" />
      <div><span className="tiny-label">رسالة اليوم</span><h2>أنتِ قادرة على صنع يوم جميل</h2><p>خطواتك الصغيرة تصنع فرقاً كبيراً يا ملكة!</p></div>
      <div className="streak"><Flame size={18} /><strong>{streak}</strong><span>أيام</span></div>
    </section>
    <section className="progress-layout">
      <img className="card-sticker progress-sticker" src={bowSticker.url} alt="فيونكة وردية" />
      <button className="calorie-ring" style={{ "--progress": `${pct * 3.6}deg` } as React.CSSProperties} onClick={() => setTab("food")}>
        <div><span>{calories}</span><small>من 1800</small><em>kcal</em></div>
      </button>
      <div className="daily-summary"><p>تقدمك اليوم</p><h2>{pct}%</h2><span>باقي {Math.max(0, 1800 - calories)} سعرة</span><button onClick={() => setTab("food")}>إضافة وجبة <Plus size={16} /></button></div>
    </section>
    <div className="section-heading"><div><span>خطتك اليومية</span><h2>كمّلي تألقك ✨</h2></div><span className="stars"><Star size={15} fill="currentColor" /> {stars}</span></div>
    <section className="quick-grid">
      <button onClick={() => setTab("routine")} className="quick-card pink"><span className="quick-icon"><img src={tulipsSticker.url} alt="زهور توليب وردية" /></span><div><small>روتيني</small><strong>{completed}/4 مهام</strong><i><b style={{ width: `${completed * 25}%` }} /></i></div><ChevronLeft size={18} /></button>
      <button onClick={() => setTab("closet")} className="quick-card cream"><span className="quick-icon"><img src={bowSticker.url} alt="فيونكة وردية" /></span><div><small>إطلالة اليوم</small><strong>خلّينا ننسق!</strong><p>3 اقتراحات لطيفة</p></div><ChevronLeft size={18} /></button>
      <button onClick={() => setTab("workout")} className="quick-card mint"><span className="quick-icon"><img src={headphonesSticker.url} alt="سماعات وردية" /></span><div><small>حركتك</small><strong>ابدئي نشاطك</strong><p>حتى 10 دقائق تحسب</p></div><ChevronLeft size={18} /></button>
    </section>
  </div>;
}

function FoodScreen({ calories, setCalories, showToast }: { calories: number; setCalories: (n: number) => void; showToast: (s: string) => void }) {
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useStoredState<{ name: string; kcal: number; photo?: string }[]>("glowup-meals", [{ name: "فطور خفيف", kcal: 340 }, { name: "رز بالدجاج", kcal: 520 }]);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const addPhotoMeal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const photo = typeof reader.result === "string" ? reader.result : undefined;
      setMeals([...meals, { name: "وجبة مصوّرة", kcal: 380, photo }]);
      setCalories(calories + 380);
      showToast("حفظنا وجبتك بالصورة: حوالي 380 kcal ✨");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const addFood = () => {
    const name = query.trim();
    if (!name) return showToast("اكتبي اسم الوجبة أولاً 🌸");
    const kcal = foodDatabase[name.toLowerCase()] ?? 320;
    setMeals([...meals, { name, kcal }]); setCalories(Math.min(3000, calories + kcal)); setQuery(""); showToast(`أضفنا ${kcal} سعرة لوجبتك 💕`);
  };
  return <div className="page"><PageTitle title="أكلي اليوم" subtitle="غذّي جسمك بحب" emoji="🍓✨" />
    <section className="food-progress"><div className="small-ring animated-ring" style={{ "--progress": `${Math.min(360, calories / 5)}deg` } as React.CSSProperties}><span>{calories}</span><small>kcal</small><i>♡</i></div><div><small>هدفك اليومي</small><h2>1800 سعرة</h2><p>باقي {Math.max(0, 1800 - calories)} سعرة لليوم</p></div></section>
    <section className="input-card"><label>ماذا أكلتِ؟</label><div className="search-row"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addFood()} placeholder="مثلاً: رز بالدجاج" /><button onClick={addFood}><Plus size={18} /></button></div><div className="camera-row"><button onClick={() => cameraRef.current?.click()}><Camera size={20} /> صوّري وجبتك</button><button onClick={() => fileRef.current?.click()}><ImagePlus size={20} /> من المعرض</button><span>سنقدّر السعرات تلقائياً</span></div><input ref={cameraRef} hidden type="file" accept="image/*" capture="environment" onChange={addPhotoMeal} /><input ref={fileRef} hidden type="file" accept="image/*" onChange={addPhotoMeal} /></section>
    <div className="section-heading"><h2>وجبات اليوم</h2><span>{meals.length} وجبات</span></div>
    <div className="meal-list">{meals.map((meal, i) => <div className="meal" key={`${meal.name}-${i}`}>{meal.photo ? <img className="meal-photo" src={meal.photo} alt={meal.name} /> : <span>{i === 0 ? "🥣" : i === 1 ? "🍛" : "🍽️"}</span>}<div><strong>{meal.name}</strong><small>{i === 0 ? "09:15" : "اليوم"}</small></div><b>{meal.kcal} kcal</b></div>)}</div>
  </div>;
}

function RoutineScreen({ routine, setRoutine, stars, setStars, showToast }: { routine: Record<RoutineKey, boolean>; setRoutine: (v: Record<RoutineKey, boolean>) => void; stars: number; setStars: (v: number) => void; showToast: (s: string) => void }) {
  const toggle = (key: RoutineKey) => { const next = !routine[key]; setRoutine({ ...routine, [key]: next }); if (next) { setStars(stars + 1); showToast("أحسنتي يا ملكة! نجمة جديدة لكِ ⭐"); } };
  return <div className="page"><PageTitle title="روتيني اللطيف" subtitle="كل عادة صغيرة هي حب لنفسك" emoji="🫧" />
    <section className="stars-banner"><div><Star fill="currentColor" /><span>{stars}</span></div><p>جمعتِ {stars} نجمة هذا الأسبوع</p></section>
    {["الصباح", "بعد الظهر", "المساء"].map((time) => <section className="routine-block" key={time}><h3>{time === "الصباح" ? <Sun size={18} /> : time === "المساء" ? <Moon size={18} /> : <Sparkles size={18} />}{time}</h3>{initialRoutine.filter((item) => item.time === time).map((item) => <button key={item.key} className={routine[item.key] ? "task done" : "task"} onClick={() => toggle(item.key)}><span className="task-emoji">{item.icon}</span><strong>{item.label}</strong><i>{routine[item.key] && <Check size={16} />}</i></button>)}</section>)}
    <div className="quote-card">“دلّلي نفسك بالإنجاز، ولو كان صغيراً.” <span>🌷</span></div>
  </div>;
}

function WorkoutScreen({ showToast }: { showToast: (s: string) => void }) {
  const [selected, setSelected] = useState("walk"); const [minutes, setMinutes] = useState(20); const [total, setTotal] = useStoredState("glowup-burned", 145);
  const workout = workouts.find((item) => item.id === selected); const burned = minutes * (workout?.rate ?? 4);
  return <div className="page"><PageTitle title="حركتي اليوم" subtitle="تحركي بالطريقة التي تسعدك" emoji="🎀" />
    <section className="workout-hero"><div><span>حرقتِ اليوم</span><strong>{total}</strong><small>سعرة حرارية</small></div><img src={workoutMascot} alt="شخصية غلو أب تتمرن" width={816} height={816} loading="lazy" /></section>
    <h2 className="standalone-title">اختاري نشاطك</h2><div className="workout-grid">{workouts.map(({ id, label, icon: Icon, tint }) => <button key={id} onClick={() => setSelected(id)} className={selected === id ? `workout-type selected ${tint}` : `workout-type ${tint}`}><Icon /><span>{label}</span>{selected === id && <Check size={14} />}</button>)}</div>
    <section className="minutes-card"><label>كم دقيقة؟</label><div className="stepper"><button onClick={() => setMinutes(Math.max(5, minutes - 5))}>−</button><strong>{minutes}<small> دقيقة</small></strong><button onClick={() => setMinutes(minutes + 5)}>+</button></div><div className="burned-preview"><Flame size={19} /> تقريباً <strong>{burned}</strong> سعرة</div><button className="primary-button" onClick={() => { setTotal(total + burned); showToast("رهيبة! سجّلنا نشاطك 🔥"); }}>سجّلي النشاط <Sparkles size={18} /></button></section>
  </div>;
}

function ClosetScreen({ closet, setCloset, favorites, setFavorites, showToast }: { closet: ClosetItem[]; setCloset: (v: ClosetItem[]) => void; favorites: Outfit[]; setFavorites: (v: Outfit[]) => void; showToast: (s: string) => void }) {
  const [category, setCategory] = useState("بلوزات"); const [outfits, setOutfits] = useState<Outfit[]>([]); const fileRef = useRef<HTMLInputElement>(null);
  const addImage = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === "string") { setCloset([...closet, { id: Date.now(), src: reader.result, category }]); showToast("أضفنا القطعة لدولابك 🎀"); } }; reader.readAsDataURL(file); };
  const mix = () => {
    if (closet.length < 2) return showToast("أضيفي قطعتين على الأقل لننسق لكِ 💗");
    const shuffled = [...closet].sort(() => Math.random() - .5);
    const generated = [0, 1, 2].flatMap((n) => {
      const first = shuffled[n % shuffled.length];
      const second = shuffled[(n + 1) % shuffled.length];
      if (!first || !second) return [];
      return [{ id: Date.now() + n, items: [first, second], title: `إطلالة ${["ناعمة", "كاجوال", "مميزة"][n] ?? "جميلة"}` }];
    });
    setOutfits(generated);
  };
  return <div className="page closet-page"><PageTitle title="دولابي اللطيف" subtitle="كل قطعك الجميلة في مكان واحد" emoji="🧸✨" />
    <section className="closet-upload"><div><ImagePlus size={28} /><h2>أضيفي قطعة جديدة</h2><p>التقطي صورة بخلفية بسيطة</p></div><div className="category-row">{["بلوزات", "بناطيل", "حجابات", "حقائب", "أحذية"].map((cat) => <button className={category === cat ? "active" : ""} key={cat} onClick={() => setCategory(cat)}>{cat}</button>)}</div><button className="outline-button" onClick={() => fileRef.current?.click()}><Camera size={19} /> تصوير أو اختيار صورة</button><input ref={fileRef} hidden type="file" accept="image/*" capture="environment" onChange={(e) => addImage(e.target.files?.[0])} /></section>
    <div className="section-heading"><h2>قطع دولابي</h2><span>{closet.length} قطعة</span></div>
    <div className="wardrobe-frame">
      <div className="wardrobe-top"><span>🎀</span><strong>خزانتي</strong><span>✨</span></div>
      {closet.length ? <div className="closet-shelves">{[0, 1].map((shelf) => <div className="closet-shelf" key={shelf}><div className="closet-grid">{closet.filter((_, index) => index % 2 === shelf).map((item) => <div className="closet-item" key={item.id}><span className="hanger">♡</span><img src={item.src} alt={item.category} /><span>{item.category}</span><button aria-label="حذف القطعة" onClick={() => setCloset(closet.filter((x) => x.id !== item.id))}><X size={14} /></button></div>)}</div></div>)}</div> : <div className="empty-closet"><div className="hanger-rail"><span>👚</span><span>👗</span><span>🧥</span></div><Shirt /><p>دولابك ينتظر قطعك الحلوة</p><small>أضيفي أول قطعة وعلّقيها هنا ✨</small></div>}
      <div className="wardrobe-drawers"><span>♡</span><span>♡</span></div>
    </div>
    <button className="mix-button" onClick={mix}><Sparkles /> نسّقي لي لبس اليوم</button>
    {outfits.length > 0 && <><div className="section-heading"><h2>اقتراحات لكِ</h2><IconButton label="اقتراحات جديدة" onClick={mix}><RotateCcw size={17} /></IconButton></div><div className="outfit-scroll">{outfits.map((outfit) => <article className="outfit-card" key={outfit.id}><div>{outfit.items.map((item) => <img key={item.id} src={item.src} alt={item.category} />)}</div><strong>{outfit.title}</strong><button aria-label="حفظ الإطلالة" onClick={() => { setFavorites([...favorites, outfit]); showToast("حفظنا الإطلالة في المفضلة 💕"); }}><Heart size={18} fill={favorites.some((x) => x.title === outfit.title) ? "currentColor" : "none"} /></button></article>)}</div></>}
    {favorites.length > 0 && <p className="favorites-note"><Heart size={15} fill="currentColor" /> لديكِ {favorites.length} إطلالات محفوظة</p>}
  </div>;
}

function PageTitle({ title, subtitle, emoji }: { title: string; subtitle: string; emoji: string }) { return <div className="page-title"><span>{emoji}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>; }
function NavButton({ active, label, icon, onClick, prominent }: { active: boolean; label: string; icon: React.ReactNode; onClick: () => void; prominent?: boolean }) { return <button className={`${active ? "active" : ""} ${prominent ? "prominent" : ""}`} onClick={onClick}><span>{icon}</span><small>{label}</small></button>; }