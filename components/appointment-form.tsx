"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

export function AppointmentForm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [minimumDate, setMinimumDate] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ name: "", detail: "" });

  useEffect(() => {
    setMinimumDate(new Date().toISOString().split("T")[0]);
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setError("Please complete the date, time, name, and email fields.");
      form.reportValidity();
      return;
    }

    setError("");
    const data = new FormData(form);
    const rawDate = String(data.get("date"));
    const date = new Date(`${rawDate}T12:00:00`).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setSummary({
      name: String(data.get("name")).trim(),
      detail: `${date} · ${String(data.get("time"))}`,
    });
    dialogRef.current?.showModal();
  }

  return (
    <>
      <form className="appointment-card" onSubmit={submit} noValidate>
        <h3>Request an appointment</h3>
        <p>This demo reviews the details on your device. It does not send the form.</p>
        <div className="field-row">
          <label>Date<input type="date" name="date" min={minimumDate} required /></label>
          <fieldset>
            <legend>Time</legend>
            <select name="time" defaultValue="" required>
              <option value="">Select a time</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="4:30 PM">4:30 PM</option>
            </select>
          </fieldset>
        </div>
        <label>Your name<input type="text" name="name" autoComplete="name" required /></label>
        <label>Email<input type="email" name="email" autoComplete="email" required /></label>
        <button className="button" type="submit">Review appointment</button>
        <p className="form-message" role="alert">{error}</p>
      </form>

      <dialog ref={dialogRef} onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}>
        <button className="modal-close" type="button" aria-label="Close dialog" onClick={() => dialogRef.current?.close()}>×</button>
        <p className="section-label">Appointment review</p>
        <h2>Your request</h2>
        <div id="appointment-summary"><strong>{summary.name}</strong><span>{summary.detail}</span></div>
        <p>No information has been sent. Contact Noel to confirm the appointment.</p>
        <button className="button" type="button" onClick={() => dialogRef.current?.close()}>Close</button>
      </dialog>
    </>
  );
}
