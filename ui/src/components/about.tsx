import { ui } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { SectionHeading } from "@/components/section-heading";
import { TerminalWindow } from "@/components/terminal-window";

export function About() {
	const { t } = useI18n();

	return (
		<section id="about" className="scroll-mt-20 py-24">
			<SectionHeading eyebrow={ui.about.subtitle} title={ui.about.title} />

			<div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
				<div className="flex flex-col gap-4 text-muted-foreground">
					{ui.about.paragraphs.map((paragraph) => (
						<p
							key={paragraph.en}
							className="leading-relaxed first:text-lg first:text-foreground/90"
						>
							{t(paragraph)}
						</p>
					))}
				</div>

				<TerminalWindow title="~/values.ts" className="h-fit overflow-hidden">
					<pre className="overflow-x-hidden font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] min-w-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
						<code>
							<span className="text-fuchsia-600 dark:text-fuchsia-400">
								const
							</span>{" "}
							<span className="text-sky-700 dark:text-sky-300">alex</span>{" "}
							<span className="text-muted-foreground">=</span>{" "}
							<span className="text-muted-foreground">{"{"}</span>
							{"\n  "}
							<span className="text-sky-700 dark:text-sky-300">values</span>
							<span className="text-muted-foreground">: [</span>
							{ui.about.values.map((value) => (
								<span key={value.id}>
									{"\n    "}
									<span className="text-muted-foreground">{"{ "}</span>
									<span className="text-sky-700 dark:text-sky-300">id</span>
									<span className="text-muted-foreground">: </span>
									<span className="text-emerald-700 dark:text-emerald-400">
										"{value.id}"
									</span>
									<span className="text-muted-foreground">, </span>
									<span className="text-sky-700 dark:text-sky-300">label</span>
									<span className="text-muted-foreground">: </span>
									<span className="text-emerald-700 dark:text-emerald-400">
										"{t(value.label)}"
									</span>
									<span className="text-muted-foreground">,</span>
									{"\n      "}
									<span className="text-sky-700 dark:text-sky-300">detail</span>
									<span className="text-muted-foreground">: </span>
									<span className="text-emerald-700 dark:text-emerald-400">
										"{t(value.detail)}"
									</span>
									<span className="text-muted-foreground">{" },"}</span>
								</span>
							))}
							{"\n  "}
							<span className="text-muted-foreground">],</span>
							{"\n"}
							<span className="text-muted-foreground">{"}"}</span>
						</code>
					</pre>
				</TerminalWindow>
			</div>
		</section>
	);
}
