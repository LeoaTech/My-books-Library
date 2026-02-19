import { useTheme } from '../context/ThemeContext';

const useColorMode = () => {
  const { colorMode, setColorMode } = useTheme();
  return [colorMode, setColorMode];
};

export default useColorMode;