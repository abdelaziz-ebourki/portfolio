import { persona } from "@/lib/persona";
import { ui } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowUp } from "lucide-react";
import { SocialLinks } from "@/components/social-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Footer() {
	const { t } = useI18n();
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border/60 py-10">
			<div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 sm:px-6">
				<SocialLinks />

				<Separator className="max-w-xs" />

				<p className="text-center text-sm text-muted-foreground">
					© {year} {persona.name} · {t(persona.location)}
				</p>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					<LanguageSwitcher />
				</div>

				<Button
					asChild
					variant="ghost"
					size="sm"
					className="gap-1.5 text-muted-foreground"
				>
					<a href="#top">
						<ArrowUp className="size-4" />
						{t(ui.footer.backToTop)}
					</a>
				</Button>
			</div>
		</footer>
	);
}
