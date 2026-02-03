import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 text-center px-4">
      {/* 404 Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm">
        <span className="flex h-2 w-2 rounded-full bg-red-500" />
        <span>Page not found</span>
      </div>

      {/* Large 404 */}
      <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground via-foreground to-foreground/30">
        404
      </h1>

      {/* Message */}
      <p className="text-muted-foreground text-lg max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button asChild size="lg" className="gap-2 rounded-full">
          <Link href="/en">
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="gap-2 rounded-full"
        >
          <Link href="/en/events">
            <ArrowLeft className="h-4 w-4" />
            Browse events
          </Link>
        </Button>
      </div>
    </div>
  );
}
