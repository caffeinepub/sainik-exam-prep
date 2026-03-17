import { Button } from "@/components/ui/button";
import { Download, ExternalLink, ImageIcon, Share2 } from "lucide-react";

const POSTER_URL = "/assets/generated/sainik-poster-v2.dim_800x1100.jpg";
const POSTER_FILENAME = "sainik-exam-prep-poster.jpg";

export function PosterPage() {
  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-saffron-400/20 border border-saffron-400/30 mb-4">
            <ImageIcon className="w-6 h-6 text-saffron-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Advertisement Poster
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Share this poster with students and parents to spread the word about
            Sainik Exam Prep.
          </p>
        </div>

        {/* Instructions Banner */}
        <div
          data-ocid="poster.section"
          className="bg-saffron-400/10 border border-saffron-400/30 rounded-xl p-4 mb-6 flex items-start gap-3"
        >
          <Share2 className="w-5 h-5 text-saffron-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-foreground mb-1">
              How to save on Android
            </p>
            <ol className="text-muted-foreground space-y-1 list-decimal list-inside">
              <li>
                Tap{" "}
                <strong className="text-foreground">"Download Poster"</strong>{" "}
                below to save directly to your Gallery.
              </li>
              <li>
                Or tap{" "}
                <strong className="text-foreground">"Open Full Size"</strong> to
                view in browser, then long-press the image and choose{" "}
                <em>Save image</em>.
              </li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <a
            data-ocid="poster.primary_button"
            href={POSTER_URL}
            download={POSTER_FILENAME}
            className="flex-1"
          >
            <Button className="w-full bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-bold gap-2 py-6 text-base">
              <Download className="w-5 h-5" />
              Download Poster
            </Button>
          </a>

          <a
            data-ocid="poster.secondary_button"
            href={POSTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted gap-2 py-6 text-base"
            >
              <ExternalLink className="w-5 h-5" />
              Open Full Size
            </Button>
          </a>
        </div>

        {/* Poster Preview */}
        <div className="rounded-2xl overflow-hidden border border-border shadow-lg bg-card">
          <img
            src={POSTER_URL}
            alt="Sainik Exam Prep Advertisement Poster"
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Right-click or long-press the image above to save if the download
          button doesn&apos;t work on your device.
        </p>
      </div>
    </main>
  );
}
