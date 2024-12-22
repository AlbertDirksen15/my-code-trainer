import React from 'react';
import MainMenu from './pages/MainMenu'; // Основной компонент меню
import Header from './components/Header'; // Заголовок

const App = () => (
  <div>
    <Header /> {/* Заголовок будет отображаться сверху */}
    <MainMenu /> {/* Основное меню */}
  </div>
);

export default App;
