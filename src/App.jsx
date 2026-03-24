import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function KotobaFlashcards() {
  // --- State Management ---
  const [vocabData, setVocabData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Fallback data if no Excel file is uploaded
  const defaultData = [
    { kotoba: "猫", romaji: "Neko", arti: "Kucing" },
    { kotoba: "犬", romaji: "Inu", arti: "Anjing" },
    { kotoba: "家族", romaji: "Kazoku", arti: "Keluarga" },
    { kotoba: "水", romaji: "Mizu", arti: "Air" },
  ];

  useEffect(() => {
    // Load default data initially
    setVocabData(defaultData);
  }, []);

  // --- Handlers ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const arrayBuffer = evt.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData && jsonData.length > 0) {
        // Ensure columns match expected keys
        setVocabData(jsonData);
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const changeCard = (newIndex) => {
    if (newIndex < 0 || newIndex >= vocabData.length) return;
    
    // Trigger fade out
    setIsFading(true);
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFlipped(false); // Reset flip state for the new card
      setIsFading(false);  // Trigger fade in
    }, 250);
  };

  const handleShuffle = () => {
    setIsFading(true);
    setTimeout(() => {
      const shuffled = [...vocabData].sort(() => Math.random() - 0.5);
      setVocabData(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsFading(false);
    }, 250);
  };

  // --- Rendering Variables ---
  const currentCard = vocabData[currentIndex] || {};
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === vocabData.length - 1;
  const totalCards = vocabData.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans text-slate-800">
      
      {/* Header & Controls */}
      <div className="w-full max-w-md mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-center text-slate-800 tracking-tight">
          Latihan Kotoba 🇯🇵
        </h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm transition-colors w-full sm:w-auto text-center">
            Upload Excel
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
          
          <button 
            onClick={handleShuffle}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            🔀 Acak Kartu
          </button>
        </div>

        {totalCards > 0 && (
          <p className="text-center text-slate-500 font-medium">
            Kartu {currentIndex + 1} / {totalCards}
          </p>
        )}
      </div>

      {/* Flashcard Area */}
      {totalCards > 0 ? (
        <div 
          className={`w-full max-w-sm aspect-[3/4] transition-opacity duration-250 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
          style={{ perspective: '1000px' }}
        >
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative w-full h-full cursor-pointer transition-transform duration-500 ease-out shadow-xl hover:shadow-2xl rounded-3xl ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front Side (Japanese) */}
            <div
              className="absolute inset-0 bg-white rounded-3xl flex flex-col items-center justify-center p-8 border border-slate-100"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <h2 className="text-7xl font-bold text-slate-800 mb-6 drop-shadow-sm">
                {currentCard.kotoba}
              </h2>
              <p className="text-2xl text-slate-500 tracking-wide">
                {currentCard.romaji}
              </p>
            </div>

            {/* Back Side (Indonesian) */}
            <div
              className="absolute inset-0 bg-indigo-50 rounded-3xl flex flex-col items-center justify-center p-8 border border-indigo-100"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <span className="text-sm text-indigo-400 font-semibold tracking-wider uppercase mb-4">
                Arti
              </span>
              <p className="text-4xl font-semibold text-indigo-700 text-center leading-snug">
                {currentCard.arti}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm aspect-[3/4] bg-slate-200 animate-pulse rounded-3xl flex items-center justify-center">
          <p className="text-slate-400">Memuat data...</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-6 mt-10">
        <button
          onClick={() => changeCard(currentIndex - 1)}
          disabled={isFirst}
          className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-200 
            ${isFirst 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-white text-slate-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'}`}
        >
          <span>←</span> Kembali
        </button>

        <button
          onClick={() => changeCard(currentIndex + 1)}
          disabled={isLast}
          className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-200 
            ${isLast 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'}`}
        >
          Selanjutnya <span>→</span>
        </button>
      </div>

    </div>
  );
}