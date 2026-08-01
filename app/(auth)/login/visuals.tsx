import styles from "./login.module.css";

type IconType = "mail" | "lock" | "eye" | "arrow" | "bolt" | "shield" | "users" | "user" | "phone" | "shieldCheck";

export function Icon({ type }: { type: IconType }) {
  const shapes = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/><path d="M3 21 21 3"/></>,
    arrow: <><path d="M4 12h16M14 6l6 6-6 6"/></>,
    bolt: <path d="m13 2-8 11h7l-1 9 8-12h-7l1-8Z"/>,
    shield: <path d="M12 3 5 6v6c0 4.5 2.8 7.7 7 9 4.2-1.3 7-4.5 7-9V6l-7-3Z"/>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2M16 5a3 3 0 0 1 0 6M18 13a4 4 0 0 1 4 4v3"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4-7 8-7s7 2.5 8 7"/></>,
    phone: <path d="M6.5 3h3l1.5 5-2.3 1.7a12 12 0 0 0 5.6 5.6L15.5 13l5 1.5v3a2 2 0 0 1-2.2 2C11 19 5 13 3.5 6.2A2 2 0 0 1 5.5 4l1-1Z"/>,
    shieldCheck: <><path d="M12 3 5 6v6c0 4.5 2.8 7.7 7 9 4.2-1.3 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{shapes[type]}</svg>;
}


