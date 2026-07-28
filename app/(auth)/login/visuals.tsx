import styles from "./login.module.css";

type IconType = "mail" | "lock" | "eye" | "arrow" | "bolt" | "shield" | "users";

export function Icon({ type }: { type: IconType }) {
  const shapes = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/><path d="M3 21 21 3"/></>,
    arrow: <><path d="M4 12h16M14 6l6 6-6 6"/></>,
    bolt: <path d="m13 2-8 11h7l-1 9 8-12h-7l1-8Z"/>,
    shield: <path d="M12 3 5 6v6c0 4.5 2.8 7.7 7 9 4.2-1.3 7-4.5 7-9V6l-7-3Z"/>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2M16 5a3 3 0 0 1 0 6M18 13a4 4 0 0 1 4 4v3"/></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{shapes[type]}</svg>;
}

export function Logo() {
  return (
    <svg className={styles.logo} viewBox="0 0 100 90" aria-label="Enginex logo">
      <path fill="#2b9ed0" d="M8 74c5-20 17-35 35-42V20L70 3v37c-6 1-11 3-16 6V17l-7 5v27C30 54 20 64 17 79Z"/>
      <path fill="#43bd95" d="M18 76c10-13 23-19 38-17 10 1 20-5 27-18-2 21-13 34-34 36-10 1-18 5-24 11Z"/>
      <path fill="#ed9231" d="M39 66h43C76 81 64 88 47 87c-11 0-20-5-25-13 6 3 12 4 17 3Z"/>
      <rect x="51" y="28" width="5" height="5" fill="#fff"/>
      <rect x="61" y="22" width="5" height="5" fill="#fff"/>
      <rect x="61" y="32" width="5" height="5" fill="#fff"/>
      <circle cx="66" cy="62" r="5" fill="#2b9ed0"/>
      <path d="M59 75c0-6 3-10 7-10s7 4 7 10" fill="#2b9ed0"/>
    </svg>
  );
}
