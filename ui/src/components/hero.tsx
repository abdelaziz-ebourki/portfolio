import { useEffect, useRef, useState } from "react";
import { persona } from "@/lib/persona";
import { ui } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error — FaultyTerminal is JS (react-bits) with no types
import FaultyTerminal from "@/components/FaultyTerminal";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error — TextType is JS (react-bits) with no types
import TextType from "@/components/TextType";
import { ArrowDown } from "lucide-react";
import { SocialLinks } from "@/components/social-links";
import { LogoLoop } from "@/components/logo-loop";
import { techLogos } from "@/lib/tech-logos";

function usePrefersReducedMotion(): boolean {
	const [reduced, setReduced] = useState(() =>
		typeof window !== "undefined"
			? window.matchMedia("(prefers-reduced-motion: reduce)").matches
			: false,
	);
	useEffect(() => {
		const m = window.matchMedia("(prefers-reduced-motion: reduce)");
		const onChange = () => setReduced(m.matches);
		m.addEventListener("change", onChange);
		return () => m.removeEventListener("change", onChange);
	}, []);
	return reduced;
}

function useIsMobile(): boolean {
	const [isMobile, setIsMobile] = useState(() => false);
	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const m = window.matchMedia("(max-width: 768px)");
		const onChange = () => setIsMobile(m.matches);
		onChange();
		if (m.addEventListener) m.addEventListener("change", onChange);
		else m.addListener(onChange);
		return () => {
			if (m.removeEventListener) m.removeEventListener("change", onChange);
			else m.removeListener(onChange);
		};
	}, []);
	return isMobile;
}

function useIsVisible<T extends HTMLElement>(
	ref: React.RefObject<T | null>,
): boolean {
	const [isVisible, setIsVisible] = useState(() => true);
	useEffect(() => {
		const el = ref.current;
		if (
			!el ||
			typeof window === "undefined" ||
			!("IntersectionObserver" in window)
		)
			return;
		const io = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ threshold: 0 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [ref]);
	return isVisible;
}

// fallow-ignore-next-line complexity -- hero composes 6 theme hooks + FaultyTerminal, intentional orchestration
export function Hero() {
	const { t } = useI18n();
	const { theme } = useTheme();
	const isLight = theme === "light";
	const prefersReduced = usePrefersReducedMotion();
	const isMobile = useIsMobile();
	const heroRef = useRef<HTMLElement>(null);
	const isVisible = useIsVisible(heroRef);
	const isPaused = prefersReduced || !isVisible;

	const faultyTerminalProps = isLight
		? {
				bg: "#f5f6f2",
				tint: "#1e5e0f",
				brightness: 1,
				curvature: 0.06,
				scanlineIntensity: 0.18,
				glitchAmount: 0.45,
				flickerAmount: 0.28,
				noiseAmp: 0.35,
			}
		: {
				bg: "#060805",
				tint: "#7ac23a",
				brightness: 0.4,
				curvature: 0.1,
				scanlineIntensity: 0.32,
				glitchAmount: 0.85,
				flickerAmount: 0.48,
				noiseAmp: 0.5,
			};

	return (
		<section
			ref={heroRef}
			id="top"
			className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-16"
		>
			<div aria-hidden className="absolute inset-0">
				<FaultyTerminal
					key={`${isLight ? "light" : "dark"}-${isMobile ? "mobile" : "desktop"}`}
					className="absolute inset-0"
					scale={1.15}
					gridMul={[2, 1]}
					digitSize={1.9}
					timeScale={1}
					pause={isPaused}
					scanlineIntensity={faultyTerminalProps.scanlineIntensity}
					glitchAmount={faultyTerminalProps.glitchAmount}
					flickerAmount={faultyTerminalProps.flickerAmount}
					noiseAmp={faultyTerminalProps.noiseAmp}
					chromaticAberration={0}
					dither={false}
					curvature={faultyTerminalProps.curvature}
					tint={faultyTerminalProps.tint}
					bg={faultyTerminalProps.bg}
					brightness={faultyTerminalProps.brightness}
					mouseReact={!isPaused && !isMobile}
					mouseStrength={0.14}
					pageLoadAnimation={!isPaused}
					dpr={
						typeof window !== "undefined"
							? isMobile
								? 1
								: Math.min(window.devicePixelRatio || 1, 2)
							: 1
					}
				/>
				<div className="pointer-events-none absolute inset-0 bg-[var(--hero-veil)]" />
			</div>

			<div className="pointer-events-none relative mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-24 sm:px-6">
				<div className="flex max-w-3xl origin-center flex-col gap-6 md:scale-[1.4] md:origin-left">
					<div className="font-mono text-sm text-primary/80">
						<span className="text-muted-foreground">alex@dev:~$</span>{" "}
						{prefersReduced ? (
							<span className="text-primary/80">whoami</span>
						) : (
							<TextType
								key="whoami"
								text="whoami"
								as="span"
								className="font-mono text-sm text-primary/80"
								typingSpeed={68}
								initialDelay={700}
								loop={false}
								showCursor
								cursorCharacter="█"
								cursorClassName="text-primary"
								cursorBlinkDuration={0.55}
							/>
						)}
					</div>

					<h1 className="text-4xl font-bold tracking-tight text-balance crt-glow sm:text-5xl md:text-6xl">
						{prefersReduced ? (
							<span>
								{persona.name}
								<span
									className="ml-1 inline-block animate-blink text-primary"
									aria-hidden
								>
									█
								</span>
							</span>
						) : (
							<TextType
								key={persona.name}
								text={persona.name}
								as="span"
								className="font-bold tracking-tight crt-glow"
								typingSpeed={62}
								initialDelay={1700}
								loop={false}
								showCursor
								cursorCharacter="█"
								cursorClassName="text-primary"
								cursorBlinkDuration={0.55}
							/>
						)}
					</h1>

					<p className="max-w-xl text-lg text-muted-foreground text-pretty leading-8">
						{prefersReduced ? (
							<>
								<span className="font-medium text-foreground">
									{t(persona.role)}
								</span>
								{" — "}
								<span className="text-foreground/85">{t(persona.tagline)}</span>
							</>
						) : (
							<>
								<TextType
									key={t(persona.role)}
									text={t(persona.role)}
									as="span"
									className="font-medium text-foreground"
									typingSpeed={38}
									initialDelay={3400}
									loop={false}
									showCursor
									cursorCharacter="█"
									cursorClassName="text-primary"
									cursorBlinkDuration={0.55}
								/>
								<span className="ml-1 inline text-foreground/85">
									{" — "}
									{t(persona.tagline)}
								</span>
							</>
						)}
					</p>

					<div className="pointer-events-auto flex flex-wrap items-center gap-3 pt-2">
						<Button asChild size="lg">
							<a href="#projects">{t(ui.hero.ctaProjects)}</a>
						</Button>
						<Button asChild size="lg" variant="outline">
							<a href="#contact">{t(ui.hero.ctaContact)}</a>
						</Button>
						<SocialLinks
							className="ml-1"
							iconClassName="transition-all hover:text-primary"
						/>
					</div>
				</div>
			</div>

			<a
				href="#about"
				className="pointer-events-auto group absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary sm:flex"
			>
				{t(ui.hero.scroll)}
				<ArrowDown className="size-4 animate-bounce" />
			</a>
			<div className="pointer-events-none relative z-10 mt-auto w-full border-t border-b border-border/60 bg-background py-6">
				<LogoLoop
					logos={techLogos}
					speed={prefersReduced || !isVisible ? 0 : 80}
					gap={64}
					logoHeight={28}
					pauseOnHover
					scaleOnHover
					fadeOut
					fadeOutColor={faultyTerminalProps.bg}
					ariaLabel="Technologies I work with"
					className="pointer-events-auto text-foreground/70"
				/>
			</div>
		</section>
	);
}
