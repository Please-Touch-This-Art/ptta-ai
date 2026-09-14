import { useRef, useState, type FormEvent } from "react";

interface ContactCopy {
  name: string;
  email: string;
  institution: string;
  institutionOptional: string;
  message: string;
  send: string;
  sending: string;
  required: string;
  invalidEmail: string;
  sent: string;
  failed: string;
}

interface Props {
  copy: ContactCopy;
  subject: string;
}

type FieldName = "name" | "email" | "institution" | "message";
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

/* Deliberately permissive: something@something.tld is as much as a front end can
   honestly check, and anything stricter starts rejecting addresses that work. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Web3Forms relays each submission to the inbox registered with this key. The
   key is public by design: it can only send to that one inbox. */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "022186a6-e997-481d-8042-3e92bbfdde17";

/**
 * The enquiry form for the contact band.
 *
 * Posts to Web3Forms, which emails the message on. GitHub Pages serves static
 * files only, so a hosted relay is the whole backend. The visitor's address is
 * sent as the reply-to, so answering the notification writes back to them.
 */
export function ContactForm({ copy, subject }: Props) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    institution: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  /* Hidden from people and screen readers; a bot filling every field ticks it. */
  const [trap, setTrap] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: FieldName) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Clear the error as soon as the field is being fixed, not on next submit.
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    const next: Errors = {};
    if (!values.name.trim()) next.name = copy.required;
    if (!values.email.trim()) next.email = copy.required;
    else if (!EMAIL.test(values.email.trim())) next.email = copy.invalidEmail;
    if (!values.message.trim()) next.message = copy.required;

    setErrors(next);

    const firstInvalid = (["name", "email", "message"] as FieldName[]).find(
      (f) => next[f],
    );
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    // Let the bot believe it worked; nothing is sent.
    if (trap) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject,
          from_name: "Please Touch This Art website",
          name: values.name.trim(),
          email: values.email.trim(),
          replyto: values.email.trim(),
          institution: values.institution.trim() || "-",
          message: values.message.trim(),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.message);

      setStatus("sent");
      setValues({ name: "", email: "", institution: "", message: "" });
    } catch {
      setStatus("failed");
    }
  };

  const note =
    status === "sending"
      ? copy.sending
      : status === "sent"
        ? copy.sent
        : status === "failed"
          ? copy.failed
          : "";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="mx-auto mt-10 md:mt-12 w-full max-w-[560px] text-left"
    >
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field
          name="name"
          label={copy.name}
          value={values.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          name="email"
          type="email"
          label={copy.email}
          value={values.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
        />
        <div className="sm:col-span-2">
          <Field
            name="institution"
            label={copy.institution}
            hint={copy.institutionOptional}
            value={values.institution}
            onChange={set("institution")}
            error={errors.institution}
            autoComplete="organization"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            name="message"
            label={copy.message}
            value={values.message}
            onChange={set("message")}
            error={errors.message}
            multiline
          />
        </div>
      </div>

      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        checked={trap}
        onChange={(e) => setTrap(e.target.checked)}
        className="hidden"
      />

      {/* Filled and square, not the page's underlined text-link CTA: next to a
          "Contact" nav item in the same small caps, an underlined word did not
          read as the thing you press to send. */}
      <div className="mt-9 text-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="prada-btn-solid prada-mono-caps inline-block px-9 py-3.5 text-[10.5px] transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-wait focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {status === "sending" ? copy.sending : copy.send}
        </button>
      </div>

      {/* Polite, not assertive: the visitor pressed Send and is waiting for this,
          so it confirms rather than interrupts. */}
      <p
        aria-live="polite"
        className={
          "prada-body mt-6 text-center text-[13px] leading-[1.6] min-h-[1.6em] " +
          (status === "failed" ? "text-[#8a2a1c]" : "text-black/60")
        }
      >
        {note}
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  hint,
  value,
  onChange,
  error,
  type = "text",
  multiline = false,
  autoComplete,
}: {
  name: FieldName;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;

  /* Underline-only, transparent, on the band's own ground — the page draws
     everything else with hairlines, and a boxed input would be the only filled
     control on it. */
  const shared = {
    id,
    name,
    value,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    className:
      "w-full bg-transparent pb-2 prada-body text-[15px] text-black " +
      "border-b transition-colors placeholder:text-black/30 " +
      "focus:outline-none focus:border-black " +
      (error ? "border-[#8a2a1c]" : "border-black/25 hover:border-black/45"),
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="prada-mono-caps block text-[9.5px] text-black/55 mb-2.5"
      >
        {label}
        {hint && <span className="normal-case tracking-normal"> ({hint})</span>}
      </label>
      {multiline ? (
        <textarea {...shared} rows={4} className={`${shared.className} resize-y`} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} />
      )}
      <p
        id={errorId}
        className="prada-mono-caps mt-2 text-[9px] text-[#8a2a1c] min-h-[1.2em]"
      >
        {error ?? ""}
      </p>
    </div>
  );
}
