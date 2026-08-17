/**
 * Entrance motion for the site — GSAP 3 + ScrollTrigger.
 *
 * Source of truth: `.claude/epics/personal-site/epic.md` §8 (motion specification).
 * This module builds *only* the four animations in §8.3 and nothing else:
 *   1. Hero, on load — staged fade + rise of h1 → lead → meta → CTA row.
 *   2. Section headings/body, on enter — fade + rise.
 *   3. Project cards, on enter — fade + rise, staggered.
 *   4. CV page entries, on enter — fade only, no rise (it is a document).
 *
 * Explicitly NOT built (rejected in §8): number counters, a scroll-linked
 * progress spine, parallax, pinned sections, scrubbed timelines, text
 * scrambles, any ambient/background animation.
 *
 * ---------------------------------------------------------------------------
 * DATA-ATTRIBUTE CONTRACT (for whoever builds the markup — see epic §14 task 002)
 * ---------------------------------------------------------------------------
 * No CSS in this project may author a hidden start state (no `opacity: 0` in
 * a stylesheet). Every element below renders fully visible by default; this
 * module is the *only* thing that ever hides it, and only once JS has
 * actually run. With JavaScript disabled or broken, everything stays visible
 * and every link stays usable (epic §8.4.2, acceptance criterion 41).
 *
 * `[data-animate="hero"]`
 *   On the hero section's container element. On page load (no scroll
 *   trigger), every direct-or-nested descendant carrying `[data-animate-item]`
 *   *inside* this container is animated as one staged sequence, in DOM order:
 *   fade + 16px rise, 0.5s duration, 0.06s stagger between items, power2.out.
 *   Group multi-element rows (e.g. the CTA row's two/three links) inside a
 *   single wrapper that itself carries `[data-animate-item]`, so the row
 *   animates as one beat, not one per link.
 *   Example order: h1 → lead paragraph → meta line → CTA row wrapper.
 *
 * `[data-animate="section"]`
 *   On a section heading or body block that should fade + rise as the visitor
 *   scrolls to it. Each element gets its own ScrollTrigger
 *   (`start: "top 85%"`, fires once). Fade + 16px rise, 0.45s, power2.out, no
 *   stagger (apply the attribute to each heading/paragraph independently).
 *
 * `[data-animate="card"]` + `[data-animate-stagger]`
 *   `[data-animate="card"]` goes on each project card. `[data-animate-stagger]`
 *   goes on their shared container (e.g. the projects grid). The container
 *   gets one ScrollTrigger; when it fires, all `[data-animate="card"]`
 *   descendants inside it animate together: fade + 20px rise, 0.5s,
 *   0.08s stagger, power2.out.
 *
 * `[data-animate="fade"]`
 *   For the CV page. Fade only, no transform — "it is a document" (§8.3).
 *   Same scroll trigger mechanics as `"section"` (`start: "top 85%"`, once),
 *   0.5s duration, power2.out, but no y movement.
 *
 * ---------------------------------------------------------------------------
 * CALL SIGNATURE
 * ---------------------------------------------------------------------------
 *   import { initMotion } from '../scripts/motion';
 *   initMotion();
 *
 * Call once per page, any time after the animated elements exist in the DOM
 * (e.g. from an inline `<script type="module">` at the end of the layout, or
 * a `client:*`-less plain `<script>` in an Astro component — Astro module
 * scripts already run after parsing). Safe to call multiple times in the same
 * document; repeat calls are no-ops. Optionally pass a root element/document
 * to scope the query to a subtree (defaults to `document`).
 * ---------------------------------------------------------------------------
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Easing used everywhere — crisp, not bouncy (epic §8.2). No elastic/back/bounce. */
const EASE = "power2.out";

/** Durations in seconds, per epic §8.2 / §8.3. */
const DURATION = {
	hero: 0.5,
	section: 0.45,
	card: 0.5,
	fade: 0.5,
} as const;

/** Rise offsets in pixels, per epic §8.2 / §8.3. `fade` intentionally has none. */
const OFFSET = {
	hero: 16,
	section: 16,
	card: 20,
} as const;

/** Stagger in seconds between siblings, per epic §8.2 / §8.3. */
const STAGGER = {
	hero: 0.06,
	card: 0.08,
} as const;

/** Where a ScrollTrigger fires, per epic §8.2. Fires once; never reverses on scroll-up. */
const SCROLL_START = "top 85%";

let hasInitialized = false;

function toggleWillChange(targets: Element[], active: boolean): void {
	for (const el of targets) {
		(el as HTMLElement).style.willChange = active ? "transform, opacity" : "auto";
	}
}

/** Hero: on-load staged fade + rise, no ScrollTrigger — it must be visible immediately. */
function animateHero(root: ParentNode): void {
	const heroes = root.querySelectorAll('[data-animate="hero"]');
	heroes.forEach((hero) => {
		const items = Array.from(hero.querySelectorAll("[data-animate-item]"));
		if (items.length === 0) return;

		gsap.set(items, { opacity: 0, y: OFFSET.hero });
		gsap.to(items, {
			opacity: 1,
			y: 0,
			duration: DURATION.hero,
			stagger: STAGGER.hero,
			ease: EASE,
			onStart: () => toggleWillChange(items, true),
			onComplete: () => toggleWillChange(items, false),
		});
	});
}

/** Section headings/body: fade + rise on scroll enter, one ScrollTrigger per element. */
function animateSections(root: ParentNode): void {
	const sections = root.querySelectorAll('[data-animate="section"]');
	sections.forEach((el) => {
		gsap.set(el, { opacity: 0, y: OFFSET.section });
		ScrollTrigger.create({
			trigger: el,
			start: SCROLL_START,
			once: true,
			onEnter: () => {
				gsap.to(el, {
					opacity: 1,
					y: 0,
					duration: DURATION.section,
					ease: EASE,
					onStart: () => toggleWillChange([el], true),
					onComplete: () => toggleWillChange([el], false),
				});
			},
		});
	});
}

/** Project cards: fade + rise on scroll enter, staggered as one group per container. */
function animateCardGroups(root: ParentNode): void {
	const containers = root.querySelectorAll("[data-animate-stagger]");
	containers.forEach((container) => {
		const cards = Array.from(container.querySelectorAll('[data-animate="card"]'));
		if (cards.length === 0) return;

		gsap.set(cards, { opacity: 0, y: OFFSET.card });
		ScrollTrigger.create({
			trigger: container,
			start: SCROLL_START,
			once: true,
			onEnter: () => {
				gsap.to(cards, {
					opacity: 1,
					y: 0,
					duration: DURATION.card,
					stagger: STAGGER.card,
					ease: EASE,
					onStart: () => toggleWillChange(cards, true),
					onComplete: () => toggleWillChange(cards, false),
				});
			},
		});
	});
}

/** CV page: fade only, no slide — "it is a document" (epic §8.3). */
function animateFadeOnly(root: ParentNode): void {
	const fadeEls = root.querySelectorAll('[data-animate="fade"]');
	fadeEls.forEach((el) => {
		gsap.set(el, { opacity: 0 });
		ScrollTrigger.create({
			trigger: el,
			start: SCROLL_START,
			once: true,
			onEnter: () => {
				gsap.to(el, {
					opacity: 1,
					duration: DURATION.fade,
					ease: EASE,
					onStart: () => toggleWillChange([el], true),
					onComplete: () => toggleWillChange([el], false),
				});
			},
		});
	});
}

/**
 * Registers and runs all entrance animations for the given root (defaults to
 * `document`). No-op on repeat calls within the same page load.
 *
 * Animations are registered only under `(prefers-reduced-motion: no-preference)`
 * via `gsap.matchMedia()` (epic §8.4.3, acceptance criterion 42). Under
 * `reduce`, this function does nothing: since no CSS ever hides these
 * elements, "doing nothing" already leaves every element in its final,
 * fully-visible state with no transform animation.
 */
export function initMotion(root: ParentNode = document): void {
	if (hasInitialized) return;
	hasInitialized = true;

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		animateHero(root);
		animateSections(root);
		animateCardGroups(root);
		animateFadeOnly(root);
	});
}

export default initMotion;
