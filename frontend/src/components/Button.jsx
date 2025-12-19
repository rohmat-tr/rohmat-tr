export default function Button({ children, variant = 'primary', ...props }) {
  const styles = {
    primary:
      'inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-teal-700 rounded-lg transition',
    ghost:
      'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-teal-50 rounded-lg transition',
    danger:
      'inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition',
  };

  return (
    <button className={styles[variant]} {...props}>
      {children}
    </button>
  );
}
