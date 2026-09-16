/**
 * Runs before paint so the stored or system theme is applied without a flash.
 * Content is a static string (no user input).
 */
const code = `(function(){try{var t=localStorage.getItem('gg-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
