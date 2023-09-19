import { useSelector } from 'react-redux';
import Loading from './components/loading/Loading';
import Routers from './Routers';
import { getLocation, getTheme, setLocation } from './stores/slices/appSlice';
import { useEffect } from 'react';
import { localKey, locations, themeMode } from './constants';
import Footer from './layouts/Footer';

function App() {
  const theme = useSelector(getTheme);
  const themeLocal = localStorage.getItem(localKey.theme) || theme;
  const element = document.documentElement;
  useEffect(() => {
    switch (themeLocal) {
      case themeMode.dark:
        element.classList.add('dark');
        break;
      case themeMode.light:
        element.classList.remove('dark');
        break;
      default:
        localStorage.removeItem(localKey.theme);
        break;
    }
  }, [theme]);

  const location = useSelector(getLocation);
  const isLocationIncluded = locations.includes(location);
  return (
    <>
      <Loading />
      <Routers />
      {isLocationIncluded ? <Footer /> : null}
    </>
  );
}

export default App;
