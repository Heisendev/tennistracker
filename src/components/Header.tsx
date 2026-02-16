import { Link } from 'react-router'
import { LanguageSelector } from './LanguageSelector'

const Header = ({ title }: { title: string }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/"><img src="/logo.png" alt="Homepage" className="h-8 w-auto" /></Link>
          <h1 className="text-2xl font-display tracking-wide text-foreground">
            {title}
          </h1>
        </div>
        <LanguageSelector />
      </div>
    </header>
  );
}

export default Header;