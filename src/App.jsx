import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SimulatedExam from './pages/SimulatedExam';
import ExerciseMode from './pages/ExerciseMode';
import StudyMode from './pages/StudyMode';
import ImportData from './pages/ImportData';
import Header from './components/Header';
import Footer from './components/Footer';
import { QuestionsProvider } from './context/QuestionsContext';
import { questionsStorageKey } from './constants';

export default function App() {
  const [isDataImported, setIsDataImported] = useState(false);

  useEffect(() => {
    // Check if questions data is already in localStorage
    const storedQuestions = localStorage.getItem(questionsStorageKey);
    if (storedQuestions) {
      setIsDataImported(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <QuestionsProvider>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route 
              path="/" 
              element={isDataImported ? <HomePage /> : <ImportData onDataImported={() => setIsDataImported(true)} />} 
            />
            <Route path="/esame-simulato" element={<SimulatedExam />} />
            <Route path="/modalita-esercizio" element={<ExerciseMode />} />
            <Route path="/modalita-studio" element={<StudyMode />} />
            <Route path="/importa-dati" element={<ImportData onDataImported={() => setIsDataImported(true)} />} />
          </Routes>
        </main>
        <Footer />
      </QuestionsProvider>
    </div>
  );
}