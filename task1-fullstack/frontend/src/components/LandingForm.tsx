import { type FormEvent, useEffect, useState } from "react";
import { useLandingSubmission } from "../hooks/useLandingSubmission.js";
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

  return (
    <PageSection title="Request information" titleId="lead-form-title" className="page-section--form">
      <form className="landing-form" onSubmit={(e) => void handleSubmit(e)}>
        <label className="form-field">
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
        <label className="form-field">
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
        <label className="form-field">
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
        <label className="form-field">
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
          <p className="form-local-error" role="alert">
            {submitError}
          </p>
        ) : null}
        <button type="submit" className="button button--cta" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Submit"}
        </button>
      </form>
    </PageSection>
  );
}
