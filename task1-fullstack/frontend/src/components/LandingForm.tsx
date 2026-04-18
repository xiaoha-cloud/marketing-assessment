import { type FormEvent, useEffect, useState } from "react";
import { useLandingSubmission } from "../hooks/useLandingSubmission.js";
import { buttonCta } from "../ui/buttonClasses.js";
import { PageSection } from "./PageSection.js";

type LandingFormProps = {
  slug: string;
  onSuccess: () => void;
};

export function LandingForm({ slug, onSuccess }: LandingFormProps) {
  const { isSubmitting, submitError, submit, reset } = useLandingSubmission(slug);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    reset();
    setFirstName("");
    setLastName("");
    setEmail("");
    setCompany("");
  }, [slug, reset]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    const ok = await submit({
      firstName,
      lastName,
      email,
      company,
    });
    if (ok) {
      onSuccess();
    }
  }

  const fieldClass =
    "flex flex-col gap-1 text-[0.88rem] font-semibold text-ink [&_input]:border-2 [&_input]:border-ink [&_input]:bg-surface [&_input]:px-2.5 [&_input]:py-2 [&_input]:text-ink [&_input]:outline-none [&_input]:ring-ink [&_input]:focus-visible:ring-2";

  return (
    <PageSection title="Request information" titleId="lead-form-title">
      <form className="grid max-w-88 gap-3.5" onSubmit={(e) => void handleSubmit(e)}>
        <label className={fieldClass}>
          <span>First name</span>
          <input
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(ev) => setFirstName(ev.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        <label className={fieldClass}>
          <span>Last name</span>
          <input
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(ev) => setLastName(ev.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        <label className={fieldClass}>
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        <label className={fieldClass}>
          <span>Company</span>
          <input
            name="company"
            autoComplete="organization"
            value={company}
            onChange={(ev) => setCompany(ev.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        {submitError !== null ? (
          <p className="m-0 text-[0.88rem] text-error" role="alert">
            {submitError}
          </p>
        ) : null}
        <button type="submit" className={`${buttonCta} mt-1 w-fit`} disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Submit"}
        </button>
      </form>
    </PageSection>
  );
}
