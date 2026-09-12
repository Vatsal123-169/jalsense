// lib/validation/constructionValidationSchema.ts
import { z } from "zod";

export const constructionSchema = z
  .object({
    damName: z.string().min(2, "Dam name must be at least 2 characters").max(100),
    damHeightM: z.coerce.number().gt(0).lte(300, "Dam height must be 300m or less"),
    initialWaterLevelM: z.coerce.number().gt(0),
    reservoirVolumeM3: z.coerce.number().gt(0),
    reservoirSurfaceAreaM2: z.coerce.number().gt(0),
    damLatitude: z.coerce.number().gte(-90).lte(90),
    damLongitude: z.coerce.number().gte(-180).lte(180),

    breachWidthM: z.coerce.number().gt(0),
    breachDepthM: z.coerce.number().gt(0),
    breachFormationTimeMin: z.coerce.number().gt(0).lte(1440, "Max 1440 minutes (24h)"),
    dischargeCoefficientCd: z.coerce
      .number()
      .gte(0.1, "Cd must be at least 0.1")
      .lte(1.0, "Cd must be at most 1.0"),

    simulationDurationMin: z.coerce.number().gt(0).lte(10080, "Max 10080 minutes (7 days)"),
    timeStepSec: z.coerce.number().gt(0).lte(3600),
    scenarioName: z.string().min(2).max(100),
  })
  // Cross-field checks mirroring the backend model_validators
  .refine((data) => data.initialWaterLevelM <= data.damHeightM, {
    message: "Initial water level cannot exceed dam height",
    path: ["initialWaterLevelM"],
  })
  .refine((data) => data.breachDepthM <= data.damHeightM, {
    message: "Breach depth cannot exceed dam height",
    path: ["breachDepthM"],
  })
  .refine((data) => data.breachWidthM <= data.damHeightM * 50, {
    message: "Breach width is unrealistically large relative to dam height",
    path: ["breachWidthM"],
  })
  .refine(
    (data) => {
      const durationSec = data.simulationDurationMin * 60;
      return data.timeStepSec < durationSec && durationSec / data.timeStepSec >= 10;
    },
    {
      message: "Time step must be small enough to allow at least 10 simulation steps",
      path: ["timeStepSec"],
    }
  )
  .refine(
    (data) => {
      const impliedAvgDepth = data.reservoirVolumeM3 / data.reservoirSurfaceAreaM2;
      return impliedAvgDepth <= data.damHeightM * 2;
    },
    {
      message: "Reservoir volume/area imply a depth inconsistent with dam height",
      path: ["reservoirVolumeM3"],
    }
  );

export type ConstructionInput = z.infer<typeof constructionSchema>;
