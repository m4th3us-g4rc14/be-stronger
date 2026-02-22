import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TreinoProvider } from './context/TreinoContext';
import { AlimentacaoProvider } from './context/AlimentacaoContext';
import { SonoProvider } from './context/SonoContext';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <TreinoProvider>
        <AlimentacaoProvider>
          <SonoProvider>
            <Dashboard />
          </SonoProvider>
        </AlimentacaoProvider>
      </TreinoProvider>
    </ThemeProvider>
  );
}

export default App;