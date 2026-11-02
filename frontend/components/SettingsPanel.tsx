import type { ReactNode } from "react";

import {
  MIN_CUSTOM_WORDS,
  SETTING_OPTIONS,
  parseCustomWords,
  type RoomSettings,
} from "@/lib/room";

type Props = {
  settings: RoomSettings;
  onChange: (patch: Partial<RoomSettings>) => void;
  /** Non-hosts see the settings but can't change them. */
  readOnly: boolean;
};

const CONTROL =
  "rounded-lg border-2 border-black/15 bg-white px-3 py-2 outline-none focus:border-black/40 disabled:cursor-not-allowed disabled:bg-black/5 disabled:text-black/60";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[7rem_1fr] items-center gap-3">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}

function NumberSelect({
  id,
  value,
  options,
  onChange,
  disabled,
  format = String,
}: {
  id: string;
  value: number;
  options: readonly number[];
  onChange: (value: number) => void;
  disabled: boolean;
  format?: (value: number) => string;
}) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(Number(event.target.value))}
      className={CONTROL}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {format(option)}
        </option>
      ))}
    </select>
  );
}

export default function SettingsPanel({ settings, onChange, readOnly }: Props) {
  const customWordCount = parseCustomWords(settings.customWords).length;

  return (
    <section aria-labelledby="settings-heading" className="flex flex-col gap-3">
      <h2
        id="settings-heading"
        className="text-sm font-bold uppercase tracking-wide text-black/60"
      >
        Settings
      </h2>

      <Field label="Players" htmlFor="setting-max-players">
        <NumberSelect
          id="setting-max-players"
          value={settings.maxPlayers}
          options={SETTING_OPTIONS.maxPlayers}
          onChange={(maxPlayers) => onChange({ maxPlayers })}
          disabled={readOnly}
        />
      </Field>

      <Field label="Language" htmlFor="setting-language">
        <select
          id="setting-language"
          value={settings.language}
          disabled={readOnly}
          onChange={(event) => onChange({ language: event.target.value })}
          className={CONTROL}
        >
          {SETTING_OPTIONS.languages.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Draw time" htmlFor="setting-draw-time">
        <NumberSelect
          id="setting-draw-time"
          value={settings.drawTime}
          options={SETTING_OPTIONS.drawTime}
          onChange={(drawTime) => onChange({ drawTime })}
          disabled={readOnly}
          format={(seconds) => `${seconds} seconds`}
        />
      </Field>

      <Field label="Rounds" htmlFor="setting-rounds">
        <NumberSelect
          id="setting-rounds"
          value={settings.rounds}
          options={SETTING_OPTIONS.rounds}
          onChange={(rounds) => onChange({ rounds })}
          disabled={readOnly}
        />
      </Field>

      <Field label="Word count" htmlFor="setting-word-count">
        <NumberSelect
          id="setting-word-count"
          value={settings.wordCount}
          options={SETTING_OPTIONS.wordCount}
          onChange={(wordCount) => onChange({ wordCount })}
          disabled={readOnly}
        />
      </Field>

      <Field label="Hints" htmlFor="setting-hints">
        <NumberSelect
          id="setting-hints"
          value={settings.hints}
          options={SETTING_OPTIONS.hints}
          onChange={(hints) => onChange({ hints })}
          disabled={readOnly}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <label htmlFor="setting-custom-words" className="text-sm font-semibold">
          Custom words
        </label>
        <textarea
          id="setting-custom-words"
          value={settings.customWords}
          disabled={readOnly}
          onChange={(event) => onChange({ customWords: event.target.value })}
          rows={3}
          placeholder="Type your own words, separated by commas"
          className={`${CONTROL} resize-none`}
        />
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.customWordsOnly}
              disabled={readOnly}
              onChange={(event) =>
                onChange({ customWordsOnly: event.target.checked })
              }
              className="size-4 accent-blue-500"
            />
            Use custom words only
          </label>
          <span className="text-xs text-black/50">
            {customWordCount} {customWordCount === 1 ? "word" : "words"}
          </span>
        </div>
        {settings.customWordsOnly && customWordCount < MIN_CUSTOM_WORDS && (
          <p role="alert" className="text-xs text-red-600">
            Add at least {MIN_CUSTOM_WORDS} words to play with custom words only.
          </p>
        )}
      </div>
    </section>
  );
}
