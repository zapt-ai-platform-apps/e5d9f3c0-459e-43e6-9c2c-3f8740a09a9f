import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { QuestionsContext } from '../context/QuestionsContext';
import ProgressCard from '../components/ProgressCard';

const HomePage = () => {
  const { 
    questions, 
    examProgress, 
    exerciseProgress, 
    studyProgress,
    resetExerciseProgress,
    resetStudyProgress
  } = useContext(QuestionsContext);

  const totalQuestions = questions.length;
  const exerciseCompleted = exerciseProgress.answeredQuestions.length;
  const studyCompleted = studyProgress.studiedQuestions.length;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center">Esame KB Italiano</h1>
      
      <p className="text-center text-lg mb-8">
        Prepara l'esame per il certificato KB italiano scegliendo una delle seguenti modalità di studio.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Esame Simulato */}
        <div className="card">
          <h2 className="text-xl font-bold mb-3">Esame Simulato</h2>
          <p className="mb-4">
            Simula l'esame reale con 20 domande casuali e un limite di tempo di 30 minuti.
            Dovrai rispondere correttamente ad almeno 18 domande per superare l'esame.
          </p>
          <div className="flex flex-col space-y-2">
            <Link to="/esame-simulato" className="btn-primary">
              Inizia Simulazione
            </Link>
            {examProgress && !examProgress.isCompleted && (
              <Link to="/esame-simulato" className="btn-outline">
                Continua Simulazione
              </Link>
            )}
          </div>
        </div>

        {/* Modalità Esercizio */}
        <div className="card">
          <h2 className="text-xl font-bold mb-3">Modalità Esercizio</h2>
          <p className="mb-4">
            Esercitati rispondendo alle domande senza limiti di tempo. 
            Ricevi feedback immediato dopo ogni risposta.
          </p>
          
          <ProgressCard 
            completed={exerciseCompleted} 
            total={totalQuestions} 
            label="Domande risposte"
            onReset={resetExerciseProgress}
          />
          
          <div className="mt-4">
            <Link to="/modalita-esercizio" className="btn-primary w-full">
              {exerciseCompleted > 0 ? 'Continua ad esercitarti' : 'Inizia ad esercitarti'}
            </Link>
          </div>
        </div>

        {/* Modalità Studio */}
        <div className="card">
          <h2 className="text-xl font-bold mb-3">Modalità Studio</h2>
          <p className="mb-4">
            Studia le domande in sequenza, visualizzando prima la spiegazione,
            poi la domanda e le risposte.
          </p>
          
          <ProgressCard 
            completed={studyCompleted} 
            total={totalQuestions} 
            label="Domande studiate"
            onReset={resetStudyProgress}
          />
          
          <div className="mt-4">
            <Link to="/modalita-studio" className="btn-primary w-full">
              {studyCompleted > 0 ? 'Continua a studiare' : 'Inizia a studiare'}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Link to="/importa-dati" className="btn-outline">
          Importa nuovi dati
        </Link>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-8">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Made on ZAPT
        </a>
      </div>
    </div>
  );
};

export default HomePage;