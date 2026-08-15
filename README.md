# 🕵️ Murder Mystery Game Master

An interactive murder mystery game master and detective simulator built with **React 19, TypeScript, Tailwind CSS, Express, and Google Gemini AI**.

Play as the lead detective exploring crime scenes, interrogating suspects with dynamic AI dialogue, connecting forensic clues on an evidence corkboard, or use the **Party Game Master Mode** to host unforgettable murder mystery game nights for your friends!

---

## 🌟 Key Features

- 🔍 **Multi-Room Crime Scene Exploration**: Inspect locations, search under desks and safes, and uncover physical, toxicological, document, and digital clues.
- 👥 **Dynamic AI Suspect Interrogation**: Interrogate suspects powered by `gemini-3.7-flash` with realistic psychological stress meters, distinct personalities, hidden secrets, and telltale slip-ups.
- 📌 **Evidence Corkboard & Red-String Deduction Matrix**: Pin evidence, connect suspects to motives, uncover timeline contradictions, and take notes in your detective journal.
- ⏱️ **Timeline & Contradiction Analyzer**: Chronological timeline cross-referencing alibis with official logs and travel receipts.
- ⚖️ **The Grand Accusation & Judicial Verdict**: Deliver your formal indictment (suspect, weapon, motive, key clue) and receive a dramatic noir verdict with confession epilogue and detective ranking.
- 🎭 **Party Host GM Mode**: Host live games with friends (in-person or Discord) with printable/copyable character cards, secret envelopes, round-by-round GM scripts, and voting ballots.
- 🎵 **Procedural Noir Audio Synthesizer**: Built with Web Audio API for gentle rain ambience, typewriter keys, clue discovery chimes, tension stings, and gavel strikes.
- ⚡ **AI Mystery Forge**: Generate custom murder mysteries on any theme, era, and difficulty level on the fly.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Canvas Confetti
- **Backend / API**: Express 4, `@google/genai` SDK with `gemini-3.7-flash`
- **Build Tool**: Vite 6, `tsx`, `esbuild`
- **Audio Engine**: Web Audio API Procedural Synthesizer

---

## 🛠️ Quickstart & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/murder-mystery-game-master.git
cd murder-mystery-game-master
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deploying to Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "feat: Initial commit of Murder Mystery Game Master"
git remote add origin https://github.com/YOUR_USERNAME/murder-mystery-game-master.git
git branch -M main
git push -u origin main
```

2. Open [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Under **Project Settings > Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
5. Click **Deploy**.

---

## 📜 License
Apache-2.0
