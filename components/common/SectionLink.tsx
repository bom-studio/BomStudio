import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionLinkProps {
  href: string;
  label?: string;
}

export function SectionLink({ href, label = "더보기" }: SectionLinkProps) {
  return (
    <div className="mt-12 text-center">
      <Button asChild variant="outline" className="group">
        <Link href={href}>
          {label}
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
}
