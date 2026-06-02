import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const heightClass = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-14',
  nav: 'h-11 sm:h-12 md:h-[3.25rem] max-w-[200px] sm:max-w-[220px]',
  footer: 'h-12 max-w-[200px]',
  auth: 'h-14 sm:h-16 max-w-[240px]',
};

export default function Logo({
  size = 'nav',
  asLink = false,
  className = '',
  imgClassName = '',
  onNavigate,
}) {
  const height = heightClass[size] || heightClass.nav;
  const image = (
    <img
      src={logoImg}
      alt="SportsGauge — AI-Powered Talent Assessment"
      className={`${height} w-auto object-contain object-left ${imgClassName}`}
    />
  );

  if (asLink) {
    return (
      <Link
        to="/"
        onClick={onNavigate}
        className={`inline-flex items-center shrink-0 group transition-opacity hover:opacity-90 ${className}`}
        aria-label="SportsGauge home"
      >
        {image}
      </Link>
    );
  }

  return <div className={`inline-flex items-center ${className}`}>{image}</div>;
}
