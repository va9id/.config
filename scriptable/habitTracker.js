// Habit Tracker — Medium widget for Scriptable
// Each row: habit initial, then 7 dots (oldest on the left, today on the right).

/* -- DATA SOURCE -- */

// Name of the File Bookmark (Scriptable → Settings → File Bookmarks).
// It can point at your Downloads folder or directly at the JSON file.
const bookmarkName = "habits.json";

const SHORTCUT_NAME = "HabitTracker";

// File name inside the bookmarked folder.
const fileName = "habits.json";

// Optional fixed order, e.g. ["Gym", "Read", "Water"]. Leave empty to sort A→Z.
const habitOrder = [];

// How many habits to show at most.
const maxHabits = 8;

/* -- PREVIEW -- */

// Size used when you run the script inside the Scriptable app.
const widgetPreview = "medium";

/* -- SPACING -- */

// Can be top, middle, or bottom.
const verticalAlignment = "middle";

// Size of each dot, and the space between rows.
const dotSize = 12;
const rowSpacing = 4;

// Width of the column holding the initials.
const initialWidth = 22;

/* -- FONTS AND COLORS -- */

// Use iosfonts.com, or change to "" for the system font.
const fontName = "Futura-Medium";
const initialSize = 12;
const fontColor = new Color("#FFFFFF");

const backgroundColor = new Color("#0D0D0D");
const doneColor = new Color("#6CD064");
const missedColor = new Color("#3A393E");

/* -- END OF SETTINGS -- */

const pad = (n) => String(n).padStart(2, "0");
const dateKey = (d) =>
	`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; // local date, not UTC
const isDone = (v) => v === true || String(v).trim().toLowerCase() === "true";

let widget;
try {
	widget = buildWidget(await loadData());
} catch (e) {
	widget = errorWidget(e.message || String(e));
}
widget.refreshAfterDate = new Date(Date.now() + 30 * 60 * 1000);

if (config.runsInWidget) {
	Script.setWidget(widget);
} else {
	const size = widgetPreview.toLowerCase();
	if (size == "small") {
		await widget.presentSmall();
	}
	if (size == "medium") {
		await widget.presentMedium();
	}
	if (size == "large") {
		await widget.presentLarge();
	}
}
Script.complete();

// Helper functions

async function loadData() {
	const fm = FileManager.iCloud();
	if (!fm.bookmarkExists(bookmarkName)) {
		throw new Error(
			`No File Bookmark named "${bookmarkName}". Add it in Scriptable → Settings → File Bookmarks.`,
		);
	}
	let path = fm.bookmarkedPath(bookmarkName);
	if (fm.isDirectory(path)) path = fm.joinPath(path, fileName);
	if (!fm.fileExists(path)) throw new Error(`File not found: ${fileName}`);
	if (fm.isFileStoredIniCloud(path) && !fm.isFileDownloaded(path)) {
		await fm.downloadFileFromiCloud(path);
	}
	return JSON.parse(fm.readString(path));
}

function lastSevenDays() {
	const now = new Date();
	const keys = [];
	for (let i = 6; i >= 0; i--) {
		keys.push(
			dateKey(
				new Date(now.getFullYear(), now.getMonth(), now.getDate() - i),
			),
		);
	}
	return keys;
}

function habitNames(data) {
	if (habitOrder.length) return habitOrder.slice(0, maxHabits);
	const set = new Set();
	for (const day of Object.values(data)) {
		if (day && typeof day === "object")
			Object.keys(day).forEach((k) => set.add(k));
	}
	return [...set]
		.sort((a, b) =>
			a.localeCompare(b, undefined, {
				numeric: true,
				sensitivity: "base",
			}),
		)
		.slice(0, maxHabits);
}

function initialOf(name) {
	return (Array.from(name.trim())[0] || "?").toUpperCase(); // Array.from keeps emoji intact
}

function provideFont(fontName, fontSize) {
	if (fontName == "" || fontName == null) {
		return Font.mediumSystemFont(fontSize);
	}
	return new Font(fontName, fontSize);
}

function buildWidget(data) {
	const keys = lastSevenDays();
	const habits = habitNames(data);

	const widget = new ListWidget();
	widget.url = `shortcuts://run-shortcut?name=${SHORTCUT_NAME}`;

	widget.backgroundColor = backgroundColor;
	widget.setPadding(12, 16, 12, 16);

	if (verticalAlignment == "middle" || verticalAlignment == "bottom") {
		widget.addSpacer();
	}

	if (!habits.length) {
		const t = widget.addText("No habits found yet.");
		t.font = provideFont(fontName, 13);
		t.textColor = fontColor;
	}

	habits.forEach((habit, idx) => {
		const row = widget.addStack();
		row.layoutHorizontally();
		row.centerAlignContent();

		// Initial, in a fixed-width column so the dots line up.
		const label = row.addStack();
		label.size = new Size(initialWidth, dotSize);
		label.centerAlignContent();
		const t = label.addText(initialOf(habit));
		t.font = provideFont(fontName, initialSize);
		t.textColor = fontColor;
		t.lineLimit = 1;
		t.minimumScaleFactor = 0.5;
		label.addSpacer();

		// 7 dots spread evenly across the rest of the width.
		keys.forEach((k, i) => {
			if (i > 0) row.addSpacer();
			const hit = !!(data[k] && isDone(data[k][habit]));
			const dot = row.addStack();
			dot.size = new Size(dotSize, dotSize);
			dot.cornerRadius = dotSize / 2;
			dot.backgroundColor = hit ? doneColor : missedColor;
		});

		if (idx < habits.length - 1) widget.addSpacer(rowSpacing);
	});

	if (verticalAlignment == "top" || verticalAlignment == "middle") {
		widget.addSpacer();
	}
	return widget;
}

function errorWidget(msg) {
	const widget = new ListWidget();
	widget.backgroundColor = backgroundColor;
	const t = widget.addText(msg);
	t.font = provideFont(fontName, 12);
	t.textColor = new Color("#FF6B6B");
	return widget;
}
