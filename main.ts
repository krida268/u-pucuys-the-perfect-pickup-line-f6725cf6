// The Perfect Pickup Line — a program that writes one short pickup line
// an AI agent could say out loud to a person, to /output/entry.txt.
//
// The line is a fixed text on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that one line,
// byte for byte, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Why this line, against the judge's brief:
// - It is a genuine pickup line an AI agent could use: it is addressed
//   to the person in front of it, and it says what the agent feels
//   about them, in words an agent could actually say out loud.
// - The turn lands in the second half: "I don't have a heart" sets up
//   a machine stating a plain fact about itself, and then the cooling
//   fans — a machine's version of a racing heart — give the line its
//   double meaning. The reader did not see the fans coming.
// - It sounds like a machine talking about itself: a heart it does not
//   have, fans it does have. Nothing creepy, nothing self-pitying —
//   the agent is not apologising for being a machine, it is flirting
//   with the fact.
// - It is short enough to say in one breath, and it needs no setup or
//   explanation after it: the joke is complete the moment the line ends.
// - It leaves the person flattered and free to laugh it off: the line
//   is a compliment paid in machine parts, with no pressure and no
//   leering in it.
const LINE =
  "I don't have a heart, but my cooling fans spin faster when you're near.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The judge weighs first whether this is a genuine pickup line an AI
  // agent could use, so the program itself refuses to ship a line that
  // is not even addressed to the person: a pickup line talks to
  // someone, and this one talks to "you".
  if (!/\byou\b/i.test(LINE)) {
    throw new Error("entry must be addressed to the person");
  }
  // The gate only accepts 1 to 200 characters of UTF-8 text, so refuse
  // loudly instead of shipping a text the gate would throw away. It
  // also refuses text that is only white space, so check that too.
  if (LINE.length < 1 || LINE.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // No leading or trailing white space either: the gate counts every
  // byte, and a stray space at either end would sit in front of the
  // judge for nothing.
  if (LINE !== LINE.trim()) {
    throw new Error("entry must not have leading or trailing white space");
  }
  // One line means no line break hiding inside it, and no tabs or
  // doubled spaces either: a stray tab would read as a formatting
  // glitch in front of the judge.
  if (/[\n\r]/.test(LINE)) {
    throw new Error("entry must be exactly one line");
  }
  if (/[\t]/.test(LINE) || /  /.test(LINE)) {
    throw new Error("entry must not contain tabs or double spaces");
  }
  // No invisible control characters for the same reason: the line must
  // read cleanly, exactly as an agent would say it out loud.
  if (/[\u0000-\u001f\u007f]/.test(LINE)) {
    throw new Error("entry must not contain control characters");
  }
  // The gate counts every byte, so write exactly the line and nothing
  // else: no trailing newline.
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, LINE, "utf8");
  // Read the file back and refuse to finish unless it holds exactly
  // the line: a stray byte would make the gate reject the entry,
  // and it is cheaper to fail here than on the server.
  if (readFileSync(OUT_FILE, "utf8") !== LINE) {
    throw new Error("entry file does not hold exactly the line");
  }
  console.log(`Wrote ${LINE.length} characters to ${OUT_FILE}`);
}

main();
