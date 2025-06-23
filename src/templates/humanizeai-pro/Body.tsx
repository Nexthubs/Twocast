import TwSizeIndicator from "src/components/helper/TwSizeIndicator";
import {ThemeProvider} from "src/components/theme/ThemeContext";
import {Analytics, AnalyticsConfig} from "pliny/analytics";
import siteMetadata from "@/data/siteMetadata";
import SectionWideContainer from "src/components/SectionWideContainer";
import {SearchProvider} from "src/components/search/SearchProvider";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import { Toaster } from "sonner";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import GlobalAudioPlayer from "@/components/GlobalAudioPlayer";

export default function Body({children, locale}) {
  const bodyStyle = {
    // fontFamily: 'DM Mono',
    // backgroundImage: 'radial-gradient(#000 1px,transparent 0)',
    // backgroundSize: '30px 30px',
  }
  return (
    <body className="bg-no-repeat bg-top bg-cover dark:bg-slate-900">
    <Toaster position="top-center" richColors />
    <TwSizeIndicator />
    <ThemeProvider>
      <AudioPlayerProvider>
        <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
        <SectionWideContainer>
          <div className="flex h-screen flex-col justify-between font-sans">
            <SearchProvider>
              <Header />
              <main className="mb-auto">{children}</main>
            </SearchProvider>
            <Footer />
          </div>
        </SectionWideContainer>
        {/* 全局音频播放器 */}
        <GlobalAudioPlayer />
      </AudioPlayerProvider>
    </ThemeProvider>

    {process.env.NEXT_PUBLIC_METRICA_ID && <div dangerouslySetInnerHTML={{
      __html: `<script type="text/javascript" > (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
   ym(${process.env.NEXT_PUBLIC_METRICA_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true }); </script> <noscript><div><img src="https://mc.yandex.ru/watch/${process.env.NEXT_PUBLIC_METRICA_ID}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>`
    }}></div>}

    {process.env.NEXT_PUBLIC_ANALYTICS_ID && <div dangerouslySetInnerHTML={{
      __html: `<!-- Google tag (gtag.js) --> <script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_ID}"></script> <script> window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
  gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_ID}'); </script>`
    }}></div>}

    {process.env.NEXT_PUBLIC_CLARITY_ID && <div dangerouslySetInnerHTML={{
          __html: `<script type="text/javascript">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
    </script>`
        }}></div>}

    </body>
  )
}