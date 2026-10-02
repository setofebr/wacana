import { useEffect } from 'react';
import TaskBoard from './components/todo/TaskBoard';

function App() {
  useEffect(() => {
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const applyColorScheme = ({
      matches,
    }: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.classList.toggle('dark', matches);
    };

    applyColorScheme(colorScheme);
    colorScheme.addEventListener('change', applyColorScheme);

    return () => colorScheme.removeEventListener('change', applyColorScheme);
  }, []);

  return <TaskBoard />;
}

export default App;
