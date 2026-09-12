// components/ConstructionValidationForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  constructionSchema,
  ConstructionInput,
} from "@/lib/validation/constructionValidationSchema";

interface FieldConfig {
  name: keyof ConstructionInput;
  label: string;
  unit: string;
  step?: string;
  helper: string;
}

const damFields: FieldConfig[] = [
  { name: "damName", label: "Dam Name", unit: "", helper: "Identifier for this dam/reservoir" },
  { name: "damHeightM", label: "Dam Height", unit: "m", helper: "0–300 m" },
  { name: "initialWaterLevelM", label: "Initial Water Level", unit: "m", helper: "Must not exceed dam height" },
  { name: "reservoirVolumeM3", label: "Reservoir Volume", unit: "m³", helper: "Total stored volume" },
  { name: "reservoirSurfaceAreaM2", label: "Reservoir Surface Area", unit: "m²", helper: "Surface area at current level" },
  { name: "damLatitude", label: "Dam Latitude", unit: "°", helper: "-90 to 90" },
  { name: "damLongitude", label: "Dam Longitude", unit: "°", helper: "-180 to 180" },
];

const breachFields: FieldConfig[] = [
  { name: "breachWidthM", label: "Final Breach Width", unit: "m", helper: "Should be reasonable relative to dam height" },
  { name: "breachDepthM", label: "Final Breach Depth", unit: "m", helper: "Cannot exceed dam height" },
  { name: "breachFormationTimeMin", label: "Breach Formation Time", unit: "min", helper: "Max 1440 min (24h)" },
  { name: "dischargeCoefficientCd", label: "Discharge Coefficient (Cd)", unit: "", step: "0.01", helper: "Typically 0.1–1.0" },
];

const simFields: FieldConfig[] = [
  { name: "scenarioName", label: "Scenario Name", unit: "", helper: "e.g. 'Moderate Breach'" },
  { name: "simulationDurationMin", label: "Simulation Duration", unit: "min", helper: "Max 10080 min (7 days)" },
  { name: "timeStepSec", label: "Time Step", unit: "sec", helper: "Small enough for ≥10 steps" },
];

export default function ConstructionValidationForm({
  onValidated,
}: {
  onValidated: (data: ConstructionInput) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConstructionInput>({
    resolver: zodResolver(constructionSchema),
    mode: "onBlur",
  });

  const [serverWarnings, setServerWarnings] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: ConstructionInput) => {
    setServerError(null);
    setServerWarnings([]);

    try {
      // Second layer of defense: server-side validation before job creation
      const res = await fetch("/api/validate/construction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!result.is_valid) {
        setServerError(result.errors.join(" "));
        return;
      }

      if (result.warnings?.length) {
        setServerWarnings(result.warnings);
      }

      onValidated(data);
    } catch (err) {
      setServerError("Could not reach validation service. Check your connection.");
    }
  };

  const renderField = (field: FieldConfig) => (
    <div key={field.name} className="flex flex-col gap-1 mb-4">
      <label className="text-sm font-medium text-slate-200">
        {field.label} {field.unit && <span className="text-slate-400">({field.unit})</span>}
      </label>
      <input
        {...register(field.name)}
        type={field.name === "damName" || field.name === "scenarioName" ? "text" : "number"}
        step={field.step ?? "any"}
        className="rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        placeholder={field.helper}
      />
      <span className="text-xs text-slate-400">{field.helper}</span>
      {errors[field.name] && (
        <span className="text-xs text-red-400">{String(errors[field.name]?.message)}</span>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-slate-100 mb-3">Reservoir / Dam</h3>
        {damFields.map(renderField)}
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-100 mb-3">Breach Parameters</h3>
        {breachFields.map(renderField)}
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-100 mb-3">Simulation Settings</h3>
        {simFields.map(renderField)}
      </section>

      {serverError && (
        <div className="rounded-md bg-red-950 border border-red-700 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}

      {serverWarnings.length > 0 && (
        <div className="rounded-md bg-amber-950 border border-amber-700 px-4 py-3 text-sm text-amber-300 space-y-1">
          {serverWarnings.map((w, i) => (
            <p key={i}>⚠ {w}</p>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-cyan-600 hover:bg-cyan-500 transition-colors py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {isSubmitting ? "Validating..." : "Validate & Continue"}
      </button>
    </form>
  );
}
