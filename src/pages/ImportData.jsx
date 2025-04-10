import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { read, utils } from 'xlsx';
import { QuestionsContext } from '../context/QuestionsContext';

const ImportData = ({ onDataImported }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { importQuestions } = useContext(QuestionsContext);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const processExcelData = async (data) => {
    try {
      // Parse the Excel file data
      // Columns: A = question, B-D = options, E = correct answer index (1-3), F = rationale
      const questions = [];

      // Skip the header row if it exists
      const startRow = data[0][0] && typeof data[0][0] === 'string' && data[0][0].includes('domanda') ? 1 : 0;
      
      for (let i = startRow; i < data.length; i++) {
        const row = data[i];
        
        // Skip empty rows
        if (!row[0]) continue;
        
        const question = row[0];
        const options = [row[1], row[2], row[3]].filter(Boolean);
        
        // Excel column E contains a number 1-3 indicating which option is correct (B, C, or D)
        // We need to convert it to a 0-based index
        let correctAnswerIndex = 0;
        if (row[4] && !isNaN(Number(row[4]))) {
          correctAnswerIndex = Number(row[4]) - 1;
        }
        
        const rationale = row[5] || '';
        
        questions.push({
          id: i,
          question,
          options,
          correctAnswerIndex,
          rationale
        });
      }
      
      return questions;
    } catch (error) {
      console.error('Error processing Excel data:', error);
      Sentry.captureException(error);
      throw new Error('Il formato del file Excel non è valido. Assicurati che il file segua il formato richiesto.');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Seleziona un file Excel.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = read(data, { type: 'array' });
          
          // Assume the first sheet contains our data
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert sheet to array of arrays (rows)
          const rows = utils.sheet_to_json(worksheet, { header: 1 });
          
          if (rows.length < 1) {
            throw new Error('Il file Excel è vuoto.');
          }
          
          const questions = await processExcelData(rows);
          
          if (questions.length === 0) {
            throw new Error('Nessuna domanda trovata nel file Excel.');
          }
          
          importQuestions(questions);
          
          if (onDataImported) {
            onDataImported();
          }
          
          navigate('/');
          
        } catch (error) {
          console.error('Error importing Excel:', error);
          Sentry.captureException(error);
          setError(error.message || 'Si è verificato un errore durante l\'importazione del file Excel.');
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Si è verificato un errore durante la lettura del file.');
        setLoading(false);
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error('Error processing file:', error);
      Sentry.captureException(error);
      setError('Si è verificato un errore durante l\'elaborazione del file.');
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Importa dati Excel</h1>
      
      <p className="mb-6">
        Importa il file Excel contenente le domande dell'esame KB. 
        Il file deve contenere le seguenti colonne:
      </p>
      
      <ul className="list-disc pl-5 mb-6 space-y-2">
        <li>Colonna A: Domanda</li>
        <li>Colonna B, C, D: Opzioni di risposta</li>
        <li>Colonna E: Indicatore della risposta corretta (1 per B, 2 per C, 3 per D)</li>
        <li>Colonna F: Spiegazione della risposta corretta</li>
      </ul>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Seleziona il file Excel:</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-white p-2.5"
        />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          onClick={handleImport}
          disabled={!file || loading}
          className={`btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Importazione in corso...' : 'Importa dati'}
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="btn-outline"
          disabled={loading}
        >
          Annulla
        </button>
      </div>
    </div>
  );
};

export default ImportData;