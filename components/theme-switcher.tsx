import { Ionicons } from '@expo/vector-icons';
import theme from 'lib/theme';
import { TouchableOpacity, View } from 'react-native';
import { useFlashcardStore } from 'stores/translation-store';
import { ThemeName } from 'types';

// --- Theme Switcher ---
const themeOptions: { key: ThemeName; icon: string; label: string }[] = [
  { key: 'light', icon: 'sunny', label: 'Light' },
  { key: 'dark', icon: 'moon', label: 'Dark' },
];

export function ThemeSwitcher({
  className,
  ...rest
}: { className?: string } & React.ComponentProps<typeof View>) {
  const { theme: selectedTheme, setTheme } = useFlashcardStore();
  const opt = themeOptions.find(o => o.key !== selectedTheme);

  if (!opt) {
    return null;
  }

  const handleThemeChange = () => {
    setTheme(opt.key);
  };

  return (
    <View
      className={`flex-row items-center justify-items-start ${className}`}
      {...rest}>
      <TouchableOpacity
        onPress={handleThemeChange}
        className="p-2 rounded-full bg-border border border-border shadow"
        accessibilityLabel={opt.label}>
        <Ionicons
          name={opt.icon as any}
          size={16}
          color={theme[selectedTheme].primary}
        />
      </TouchableOpacity>
    </View>
  );
}
