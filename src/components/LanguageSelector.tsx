import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from './ui/Button';

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant='secondary'
      aria-label={t('common.language')}
      title={`${t('common.language')}: ${i18n.language === 'en' ? t('common.english') : t('common.french')}`}
    >
      <Globe className="w-4 h-4" />
      <span className="ml-2">{i18n.language.toUpperCase()}</span>
    </Button>
  );
};
