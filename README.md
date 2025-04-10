# Esame KB - App di Studio per l'Esame di Certificazione KB Italiano

Un'applicazione web per aiutare gli studenti a prepararsi per l'esame del certificato KB italiano. L'esame richiede di rispondere correttamente ad almeno 18 domande su 20, selezionate casualmente da un totale di 515 domande predefinite, entro 30 minuti.

## Funzionalità

### Modalità Esame Simulato
- Simulazione dell'esame reale con 20 domande casuali
- Limite di tempo di 30 minuti
- Feedback dettagliato al termine dell'esame (risposte errate, spiegazioni, punteggio)
- Per superare l'esame sono necessarie almeno 18 risposte corrette

### Modalità Esercizio
- Pratica con un numero personalizzato di domande senza limiti di tempo
- Feedback immediato dopo ogni risposta
- Possibilità di mettere in pausa, fermare e riprendere in qualsiasi momento
- Tiene traccia delle domande già risposte

### Modalità Studio
- Studio sequenziale delle domande senza limiti di tempo
- Visualizzazione della spiegazione, poi della domanda, poi delle opzioni
- Pulsante per rivelare la risposta corretta
- Tiene traccia delle domande già studiate

## Importazione dei Dati
L'applicazione consente di importare le domande da un file Excel con la seguente struttura:
- Colonna A: Domanda
- Colonne B, C, D: Tre opzioni di risposta
- Colonna E: Indicatore della risposta corretta (1 per B, 2 per C, 3 per D)
- Colonna F: Spiegazione della risposta corretta

## Tecnologie Utilizzate
- React
- Tailwind CSS
- XLSX per l'elaborazione dei file Excel
- LocalStorage per il salvataggio dei progressi

## Come Usare l'App
1. Importa il file Excel con le domande
2. Scegli una delle tre modalità di studio
3. Monitora il tuo progresso in ogni modalità sulla pagina principale