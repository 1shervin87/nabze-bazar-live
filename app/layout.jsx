export const metadata = {
  title: 'نبض بازار',
  description: 'داشبورد فارسی داده و تحلیل بازارهای مالی'
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ margin: 0, background: '#07110f' }}>{children}</body>
    </html>
  );
}
