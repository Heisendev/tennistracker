# Localization Setup Guide

Your Tennis Tracker app now has **bilingual localization** (English & French) powered by **i18next**.

## 📁 Structure

```
src/
  i18n.ts                  # i18next configuration & initialization
  locales/
    en.json               # English translations
    fr.json               # French translations
  components/
    LanguageSelector.tsx  # Language switcher component
  providers/
    AppProviders.tsx      # Updated with I18nextProvider
  pages/
    Home.tsx             # Updated to use translations
```

## 🎯 How It Works

1. **Auto-detection**: The app automatically detects the user's browser language (EN/FR)
2. **Persistence**: Selected language is saved in localStorage
3. **Switching**: Users can toggle languages with the language selector button
4. **Dynamic**: All content updates instantly when language changes

## 🔧 Adding Translations

### Step 1: Add keys to translation files

**src/locales/en.json**
```json
{
  "mySection": {
    "myKey": "English text here"
  }
}
```

**src/locales/fr.json**
```json
{
  "mySection": {
    "myKey": "Texte français ici"
  }
}
```

### Step 2: Use in your components

```tsx
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('mySection.myKey')}</h1>;
}
```

## 📍 Where Language Selector Appears

- **Home page**: Top-right corner
- **Header**: All pages with the Header component

## 🌍 Currently Supported Languages

- ✅ English (en)
- ✅ French (fr)

## 📚 Adding New Languages

To add a new language (e.g., Spanish):

1. Create `src/locales/es.json` with all translation keys
2. Update `src/i18n.ts`:
```ts
import esTranslations from './locales/es.json';

const resources = {
  // ... existing languages
  es: {
    translation: esTranslations,
  },
};
```

3. Update language names in translation files:
```json
{
  "common": {
    "spanish": "Español"
  }
}
```

## 💾 Configuration

Language preference is stored in `localStorage` under the key `language`.

To reset to browser default, clear localStorage:
```ts
localStorage.removeItem('language');
```

## 🚀 Best Practices

- ✅ Keep translation keys descriptive: `home.matchStats` not `title1`
- ✅ Group related translations: `players.title`, `players.create`, etc.
- ✅ Use `useTranslation()` hook in functional components
- ✅ Keep translations in sync across all language files
- ✅ Test both languages regularly

## 🔗 Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Docs](https://react.i18next.com/)

