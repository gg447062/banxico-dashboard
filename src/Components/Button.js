import styles from '@/styles/Buttons.module.css';

export default function Button({
  type = 'primary',
  onClick,
  text,
  label = '',
}) {
  return (
    <button
      className={styles[type]}
      onClick={onClick}
      aria-label={label ? label : text}
    >
      {text}
    </button>
  );
}
