import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* CSP is now handled by Next.js config */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}