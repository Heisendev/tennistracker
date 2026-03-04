import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

const Header = ({ title, children }: { title: string, children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <header className="backdrop-blur-sm sticky top-0 z-10 border-b border-gray-300 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to={'..'}
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={e => {e.preventDefault(); navigate(-1); }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-display tracking-wider text-foreground">
            {t(title)}
          </h1>
          {children}
        </div>
      </header>
  );
}

export default Header;