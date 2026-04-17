import { FormEvent, useState } from "react";
import { LandingSubmitError, submitLandingLead } from "../api/landingApi.js";

type LandingFormProps = {
  slug: string;
  disabled?: boolean;
  onSubmittingChange: (submitting: boolean) => void;
  onSuccess: () => void;
};

export function LandingForm({
  slug,
  disabled = false,
  onSubmittingChange,
  onSuccess,
}: LandingFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) {
      return;
    }
    setSubmitError(null);
    onSubmittingChange(true);
    try {
      await submitLandingLead(slug, {
        firstName,
        lastName,
        email,
        company,
      });
      onSuccess();
    } catch (err) {
      const message =
        err instanceof LandingSubmitError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Submission failed";
      setSubmitError(message);
    } finally {
      onSubmittingChange(false);
    }
  }

  return (
    <section className="landing-form-section" aria-labelledby="lead-form-heading">
      <h2 id="lead-form-heading">Request information</h2>
      <form className="landing-form" onSubmit={(e) => void handleSubmit(e)}>
        <label className="form-field">
          <span>First name</span>
          <input
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(ev) => setFirstName(ev.target.value)}
            required
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
          />
        </label>
        {submitError !== null ? (
          <p className="form-local-error" role="alert">
            {submitError}
          </p>
        ) : null}
        <button type="submit" className="form-submit" disabled={disabled}>
          Submit
        </button>
      </form>
    </section>
  );
}
