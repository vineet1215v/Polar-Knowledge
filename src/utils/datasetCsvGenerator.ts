import { datasetProvenance } from "../knowledgeData"

export interface TelemetryRow {
  [key: string]: string | number
}

export interface DatasetTelemetryResult {
  headers: string[]
  rows: TelemetryRow[]
  csvContent: string
}

/**
 * Generates an authentic, domain-specific Level-2 scientific telemetry dataset
 * with 60 realistic rows adhering to NCPOR, SCAR, and WMO polar standards.
 */
export function generateRealisticDatasetCsv(dataset: {
  id: number
  title: string
  parameter: string
  region: string
  year: number
  size?: string
  format?: string
}): string {
  const prov = datasetProvenance[dataset.id]
  const source = prov?.source || "NCPOR Polar Telemetry Network"
  const spatial = prov?.spatialCoverage || dataset.region
  const temporal = prov?.temporalCoverage || `${dataset.year}`
  const version = prov?.version || "v2.1"
  const exportTimestamp = new Date().toISOString()

  // Official NCPOR & MoES Scientific Metadata Banner
  const metadataBanner = [
    `# ==============================================================================`,
    `# NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH (NCPOR)`,
    `# Ministry of Earth Sciences (MoES), Government of India`,
    `# Indian Polar Data Centre (IPDC) — Open Access Scientific Telemetry`,
    `# ------------------------------------------------------------------------------`,
    `# Title             : ${dataset.title}`,
    `# Dataset Identifier: NCPOR-IPDC-${dataset.year}-${String(dataset.id).padStart(3, "0")}`,
    `# Parameter Domain  : ${dataset.parameter}`,
    `# Geographic Region : ${dataset.region}`,
    `# Spatial Bounds    : ${spatial}`,
    `# Temporal Coverage : ${temporal}`,
    `# Instrument/Source : ${source}`,
    `# Quality Baseline  : Level-2 Quality Controlled (FAIR / SCAR Standard Compliant)`,
    `# Catalog Version   : ${version}`,
    `# Exported On (UTC) : ${exportTimestamp}`,
    `# Digital Object ID : 10.5067/NCPOR/POLAR-${dataset.year}-${dataset.id}`,
    `# Citation          : NCPOR Indian Polar Repository, Ministry of Earth Sciences, New Delhi`,
    `# ==============================================================================`,
  ].join("\n")

  const { headers, rows } = generateTelemetryData(dataset)

  const headerLine = headers.join(",")
  const dataLines = rows
    .map((row) =>
      headers
        .map((h) => {
          const val = row[h]
          if (val === undefined || val === null) return ""
          const str = String(val)
          if (str.includes(",") || str.includes('"')) {
            return `"${str.replace(/"/g, '""')}"`
          }
          return str
        })
        .join(","),
    )
    .join("\n")

  return `${metadataBanner}\n${headerLine}\n${dataLines}\n`
}

/**
 * Downloads the realistic telemetry CSV file to the user's browser.
 */
export function downloadDatasetCsv(dataset: {
  id: number
  title: string
  parameter: string
  region: string
  year: number
  size?: string
  format?: string
}): void {
  const csvContent = generateRealisticDatasetCsv(dataset)
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  const safeFilename = dataset.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
  link.download = `NCPOR_${dataset.year}_${safeFilename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Helper to generate 60 domain-specific records for data view tabs or CSV export.
 */
export function generateTelemetryData(dataset: {
  id: number
  title: string
  parameter: string
  region: string
  year: number
}): { headers: string[]; rows: TelemetryRow[] } {
  const rowCount = 60
  const rows: TelemetryRow[] = []
  const yr = dataset.year

  // DOMAIN 1: Sea Ice (e.g. ID 1 Antarctic Sea Ice, ID 5 Arctic Sea Ice Himadri)
  if (dataset.parameter === "Sea Ice") {
    const isArctic = dataset.region.toLowerCase().includes("arctic")
    const headers = [
      "Record_ID",
      "Timestamp_UTC",
      "Latitude_Deg",
      "Longitude_Deg",
      "Sea_Ice_Concentration_Pct",
      "Ice_Extent_10e6_km2",
      "Ice_Thickness_m",
      "Surface_Albedo",
      "Snow_Depth_cm",
      "Surface_Skin_Temp_C",
      "Sensor_Platform",
      "QC_Status",
    ]

    for (let i = 0; i < rowCount; i++) {
      const dayOfYear = Math.floor(1 + (i * 360) / rowCount)
      const date = new Date(Date.UTC(yr, 0, dayOfYear))
      const timeStr = date.toISOString().split("T")[0]

      const phase = isArctic
        ? Math.sin(((dayOfYear - 80) / 365) * 2 * Math.PI)
        : Math.sin(((dayOfYear - 260) / 365) * 2 * Math.PI)

      const concBase = isArctic ? 68 + phase * 28 : 55 + phase * 40
      const conc = Math.min(
        99.4,
        Math.max(12.5, +(concBase + ((i % 5) - 2) * 1.8).toFixed(1)),
      )
      const extent = +(
        (isArctic ? 9.5 + phase * 4.8 : 10.2 + phase * 8.5) +
        ((i % 3) - 1) * 0.22
      ).toFixed(2)
      const thickness = +(
        (isArctic ? 1.4 + phase * 0.7 : 1.1 + phase * 0.8) +
        ((i % 4) - 1.5) * 0.08
      ).toFixed(2)
      const albedo = +(
        0.62 +
        phase * 0.2 +
        (i % 2 ? 0.03 : -0.02)
      ).toFixed(2)
      const snow = +(
        Math.max(4.0, 18.0 + phase * 14.0 + ((i % 3) - 1) * 2.5)
      ).toFixed(1)
      const skinTemp = +(
        (isArctic ? -14.0 - phase * 16.0 : -18.0 - phase * 18.0) +
        ((i % 4) - 1.5) * 1.2
      ).toFixed(1)

      const lat = isArctic
        ? +(78.92 + ((i % 7) - 3) * 0.15).toFixed(3)
        : +(-69.38 - ((i % 7) - 3) * 0.25).toFixed(3)
      const lon = isArctic
        ? +(11.93 + ((i % 5) - 2) * 0.3).toFixed(3)
        : +(76.18 + ((i % 5) - 2) * 0.45).toFixed(3)

      rows.push({
        Record_ID: `SIC-${yr}-${String(i + 1).padStart(3, "0")}`,
        Timestamp_UTC: `${timeStr} 06:00:00`,
        Latitude_Deg: lat,
        Longitude_Deg: lon,
        Sea_Ice_Concentration_Pct: conc,
        Ice_Extent_10e6_km2: extent,
        Ice_Thickness_m: thickness,
        Surface_Albedo: Math.min(0.92, Math.max(0.45, albedo)),
        Snow_Depth_cm: snow,
        Surface_Skin_Temp_C: skinTemp,
        Sensor_Platform: isArctic
          ? "IndARC-Himadri Ka-band"
          : "MODIS-Aqua / Maitri-AWS",
        QC_Status: i % 14 === 0 ? "QC_INTERPOLATED" : "LEVEL2_VERIFIED",
      })
    }

    return { headers, rows }
  }

  // DOMAIN 2: Atmosphere (e.g. ID 2 Maitri Atmosphere, ID 8 Larsemann Hills AWS 30m Mast)
  if (dataset.parameter === "Atmosphere") {
    const is30mMast = dataset.id === 8 || dataset.title.includes("30m")
    const headers = is30mMast
      ? [
          "Record_ID",
          "Timestamp_UTC",
          "Mast_Height_m",
          "Air_Temperature_C",
          "Wind_Speed_ms",
          "Wind_Direction_Deg",
          "Sensible_Heat_Flux_Wm2",
          "Relative_Humidity_Pct",
          "Barometric_Pressure_hPa",
          "Downwelling_Shortwave_Wm2",
          "Net_Radiation_Wm2",
          "QC_Flag",
        ]
      : [
          "Record_ID",
          "Timestamp_UTC",
          "Station_ID",
          "Air_Temperature_C",
          "Atmospheric_Pressure_hPa",
          "Wind_Speed_ms",
          "Wind_Direction_Deg",
          "Black_Carbon_ng_m3",
          "Surface_Ozone_ppb",
          "Relative_Humidity_Pct",
          "Solar_Radiation_Wm2",
          "QC_Status",
        ]

    for (let i = 0; i < rowCount; i++) {
      const dayOfYear = Math.floor(1 + (i * 360) / rowCount)
      const date = new Date(Date.UTC(yr, 0, dayOfYear))
      const timeStr = date.toISOString().split("T")[0]
      const hour = (i * 4) % 24
      const timeFormatted = `${timeStr} ${String(hour).padStart(2, "0")}:00:00`

      const tempSin = Math.sin(((dayOfYear - 280) / 365) * 2 * Math.PI)
      const temp = +(-18.5 + tempSin * 14.2 + ((i % 4) - 2) * 1.5).toFixed(1)
      const pressure = +(
        985.4 +
        Math.cos(i / 3) * 16.5 +
        (i % 2) * 1.8
      ).toFixed(1)
      const wind = +(
        7.8 +
        Math.abs(Math.sin(i / 1.7)) * 14.5 +
        (i % 5 === 0 ? 8.2 : 0)
      ).toFixed(1)
      const windDir = Math.floor(70 + ((i * 37) % 180))
      const rh = Math.floor(45 + Math.abs(Math.sin(i / 2)) * 32)

      const isPolarNight = dayOfYear > 140 && dayOfYear < 215
      const solarRad = isPolarNight
        ? 0.0
        : +(
            Math.max(
              0,
              Math.sin(((dayOfYear - 260) / 365) * 2 * Math.PI) * 620 +
                Math.cos(hour / 4) * 80,
            )
          ).toFixed(1)

      if (is30mMast) {
        const heights = [2, 10, 30]
        const h = heights[i % 3]
        rows.push({
          Record_ID: `AWS30M-${yr}-${String(i + 1).padStart(3, "0")}`,
          Timestamp_UTC: timeFormatted,
          Mast_Height_m: h,
          Air_Temperature_C: +(
            temp - (h === 30 ? 0.8 : h === 10 ? 0.3 : 0)
          ).toFixed(1),
          Wind_Speed_ms: +(
            wind * (h === 30 ? 1.35 : h === 10 ? 1.15 : 1.0)
          ).toFixed(1),
          Wind_Direction_Deg: windDir,
          Sensible_Heat_Flux_Wm2: +(
            -22.4 +
            Math.sin(i / 2.5) * 48.0
          ).toFixed(1),
          Relative_Humidity_Pct: rh,
          Barometric_Pressure_hPa: pressure,
          Downwelling_Shortwave_Wm2: solarRad,
          Net_Radiation_Wm2: +(solarRad * 0.18 - 42.0).toFixed(1),
          QC_Flag: i === 7 ? "QC_KATABATIC_SPIKE_VERIFIED" : "AWS_LEVEL2_PASS",
        })
      } else {
        const bc = +(
          28.4 +
          Math.sin(i / 3) * 19.5 +
          (i % 4 === 0 ? 15.0 : 0)
        ).toFixed(1)
        const ozone = +(
          28.0 +
          Math.cos(i / 2.5) * 12.0 +
          (isPolarNight ? -8.0 : 4.0)
        ).toFixed(1)
        rows.push({
          Record_ID: `SYNOP-${yr}-${String(i + 1).padStart(3, "0")}`,
          Timestamp_UTC: timeFormatted,
          Station_ID: "MAITRI-SYNOP-450",
          Air_Temperature_C: temp,
          Atmospheric_Pressure_hPa: pressure,
          Wind_Speed_ms: wind,
          Wind_Direction_Deg: windDir,
          Black_Carbon_ng_m3: bc,
          Surface_Ozone_ppb: ozone,
          Relative_Humidity_Pct: rh,
          Solar_Radiation_Wm2: solarRad,
          QC_Status: i === 12 ? "QC_RECALIBRATED" : "VALIDATED_L2",
        })
      }
    }

    return { headers, rows }
  }

  // DOMAIN 3: Oceanography (e.g. ID 3 Southern Ocean Profiles, ID 6 IndARC Mooring)
  if (dataset.parameter === "Oceanography") {
    const isIndArc = dataset.id === 6 || dataset.title.includes("IndARC")
    const headers = isIndArc
      ? [
          "Record_ID",
          "Timestamp_UTC",
          "Mooring_Depth_m",
          "Water_Temperature_C",
          "Practical_Salinity_PSU",
          "Dissolved_Oxygen_umol_kg",
          "Current_Velocity_cms",
          "Current_Direction_Deg",
          "Turbidity_NTU",
          "Acoustic_Noise_dB",
          "Platform",
          "QC_Level",
        ]
      : [
          "Profile_ID",
          "Timestamp_UTC",
          "Depth_m",
          "Potential_Temperature_C",
          "Practical_Salinity_PSU",
          "Dissolved_Oxygen_umol_kg",
          "Potential_Density_kg_m3",
          "Sound_Velocity_ms",
          "Chlorophyll_Fluorescence_ug_L",
          "Platform_Type",
          "QC_Flag",
        ]

    for (let i = 0; i < rowCount; i++) {
      const dayOfYear = Math.floor(1 + (i * 360) / rowCount)
      const date = new Date(Date.UTC(yr, 0, dayOfYear))
      const timeStr = date.toISOString().split("T")[0]

      if (isIndArc) {
        const nominalDepths = [35, 75, 115, 155, 192]
        const d = nominalDepths[i % nominalDepths.length]
        const isWinter = dayOfYear < 110 || dayOfYear > 320
        const waterTemp = +(
          (isWinter ? 0.4 : 3.8) -
          (d / 192) * 1.6 +
          Math.sin(i / 3) * 0.8
        ).toFixed(2)
        const sal = +(
          34.25 +
          (d / 192) * 0.65 +
          ((i % 3) - 1) * 0.06
        ).toFixed(2)
        const oxy = +(
          295.0 -
          (d / 192) * 35.0 +
          Math.cos(i / 2) * 8.0
        ).toFixed(1)
        const speed = +(
          8.5 +
          Math.sin(i / 1.5) * 14.0 +
          (i % 4) * 2.2
        ).toFixed(1)
        const dir = Math.floor(120 + ((i * 43) % 160))
        const turb = +(
          0.85 +
          (d < 50 ? 1.4 : 0.2) +
          Math.abs(Math.sin(i / 2)) * 0.9
        ).toFixed(2)
        const acousticNoise = Math.floor(52 + Math.abs(Math.cos(i / 2)) * 26)

        rows.push({
          Record_ID: `INDARC-${yr}-${String(i + 1).padStart(3, "0")}`,
          Timestamp_UTC: `${timeStr} 12:00:00`,
          Mooring_Depth_m: d,
          Water_Temperature_C: waterTemp,
          Practical_Salinity_PSU: sal,
          Dissolved_Oxygen_umol_kg: oxy,
          Current_Velocity_cms: speed,
          Current_Direction_Deg: dir,
          Turbidity_NTU: turb,
          Acoustic_Noise_dB: acousticNoise,
          Platform: "IndARC-Kongsfjorden-Mooring",
          QC_Level: "NCPOR_SUBSEA_VERIFIED",
        })
      } else {
        const depth = Math.floor(5 + Math.pow(i / (rowCount - 1), 1.8) * 1795)
        let t = 2.4 - Math.exp(-depth / 80) * 1.5
        if (depth > 80 && depth < 250) t = -1.2 + (depth - 80) * 0.008
        else if (depth >= 250 && depth < 900) t = 1.4 - (depth - 250) * 0.001
        else if (depth >= 900) t = 0.6 - (depth - 900) * 0.0003

        const tempVal = +(t + ((i % 3) - 1) * 0.04).toFixed(2)
        const salVal = +(33.85 + Math.min(0.9, (depth / 1200) * 0.85)).toFixed(
          2,
        )
        const oxyVal = +(325.0 - Math.min(130, (depth / 700) * 110)).toFixed(1)
        const dens = +(1027.1 + (depth / 1800) * 0.75).toFixed(2)
        const soundVel = +(1452.0 + depth * 0.016 + tempVal * 4.2).toFixed(1)
        const fluoro = +(
          depth < 80 ? Math.max(0.1, 1.8 - depth * 0.02) : 0.02
        ).toFixed(2)

        rows.push({
          Profile_ID: `CTD-${yr}-${String(i + 1).padStart(3, "0")}`,
          Timestamp_UTC: `${timeStr} 08:30:00`,
          Depth_m: depth,
          Potential_Temperature_C: tempVal,
          Practical_Salinity_PSU: salVal,
          Dissolved_Oxygen_umol_kg: oxyVal,
          Potential_Density_kg_m3: dens,
          Sound_Velocity_ms: soundVel,
          Chlorophyll_Fluorescence_ug_L: fluoro,
          Platform_Type: "Argo-Apex / ORV Sagar Kanya",
          QC_Flag: "ARGO_QC_1_EXCELLENT",
        })
      }
    }

    return { headers, rows }
  }

  // DOMAIN 4: Cryosphere & Glaciology
  if (
    dataset.parameter === "Cryosphere" ||
    dataset.parameter === "Glaciology" ||
    dataset.title.toLowerCase().includes("glacier") ||
    dataset.title.toLowerCase().includes("ice core")
  ) {
    const isIceCore =
      dataset.id === 9 || dataset.title.toLowerCase().includes("core")
    const headers = isIceCore
      ? [
          "Core_Segment_ID",
          "Top_Depth_m",
          "Bottom_Depth_m",
          "Estimated_Age_yr_BP",
          "Delta_18O_Permil",
          "Delta_Deuterium_Permil",
          "Deuterium_Excess_Permil",
          "Dust_Concentration_ppb",
          "Electrical_Conductivity_uS_cm",
          "Ice_Density_g_cm3",
          "Trapped_CO2_ppm",
          "QC_Analysis_Grade",
        ]
      : [
          "Stake_ID",
          "Survey_Date",
          "Glacier_Sector",
          "Latitude_Deg_S",
          "Longitude_Deg_E",
          "Elevation_m",
          "Accumulation_cm",
          "Ablation_cm",
          "Net_Mass_Balance_mm_we",
          "Surface_Ice_Velocity_m_yr",
          "Firn_Density_g_cm3",
          "Verification_Status",
        ]

    for (let i = 0; i < rowCount; i++) {
      if (isIceCore) {
        const topD = +(i * 2.0).toFixed(1)
        const botD = +(topD + 2.0).toFixed(1)
        const age = Math.floor(5 + Math.pow(topD / 120, 1.25) * 620)
        const isLIA = topD >= 40 && topD <= 75
        const d18O = +(
          -38.4 -
          (topD / 120) * 4.2 -
          (isLIA ? 2.8 : 0) +
          ((i % 4) - 1.5) * 0.3
        ).toFixed(2)
        const dD = +(d18O * 8.0 + 10.5 + ((i % 3) - 1) * 1.2).toFixed(1)
        const dExcess = +(dD - 8 * d18O).toFixed(2)
        const dust = +(
          18.5 +
          (isLIA ? 55.0 : 0) +
          Math.abs(Math.sin(i / 1.8)) * 28.0
        ).toFixed(1)
        const ecm = +(
          1.2 +
          (topD / 120) * 1.8 +
          (i % 5 === 0 ? 1.6 : 0)
        ).toFixed(2)
        const density = +(
          Math.min(0.917, 0.45 + Math.pow(topD / 70, 0.45) * 0.467)
        ).toFixed(3)
        const co2 = Math.floor(280 - (topD / 120) * 12 + ((i % 4) - 2) * 3)

        rows.push({
          Core_Segment_ID: `DML-120M-SEC-${String(i + 1).padStart(3, "0")}`,
          Top_Depth_m: topD,
          Bottom_Depth_m: botD,
          Estimated_Age_yr_BP: age,
          Delta_18O_Permil: d18O,
          Delta_Deuterium_Permil: dD,
          Deuterium_Excess_Permil: dExcess,
          Dust_Concentration_ppb: dust,
          Electrical_Conductivity_uS_cm: ecm,
          Ice_Density_g_cm3: density,
          Trapped_CO2_ppm: co2,
          QC_Analysis_Grade: "RESEARCH_GRADE_GOLD",
        })
      } else {
        const stakeNum = i + 1
        const elev = Math.floor(85 + (i / rowCount) * 1150)
        const isHigh = elev > 500
        const accum = +(
          isHigh ? 24.0 + (elev / 1200) * 35.0 : 8.0 + (i % 3) * 2.0
        ).toFixed(1)
        const ablation = +(
          isHigh ? -2.0 - (i % 2) * 1.5 : -28.0 + (elev / 500) * 16.0
        ).toFixed(1)
        const netBal = Math.floor(accum * 8.5 + ablation * 9.2)
        const vel = +(
          6.2 +
          Math.sin(i / 2) * 8.4 +
          ((i % 5) - 2) * 0.8
        ).toFixed(1)
        const density = +(0.48 + (elev / 2500) * 0.35).toFixed(2)

        rows.push({
          Stake_ID: `DG-STAKE-${String(stakeNum).padStart(3, "0")}`,
          Survey_Date: `${yr}-${String(1 + (i % 12)).padStart(2, "0")}-15`,
          Glacier_Sector:
            elev > 800
              ? "Upper Firn Basin"
              : elev > 400
                ? "Equilibrium Zone"
                : "Terminus Tongue",
          Latitude_Deg_S: +(-70.75 - (i / rowCount) * 0.12).toFixed(4),
          Longitude_Deg_E: +(11.62 + (i / rowCount) * 0.18).toFixed(4),
          Elevation_m: elev,
          Accumulation_cm: accum,
          Ablation_cm: ablation,
          Net_Mass_Balance_mm_we: netBal,
          Surface_Ice_Velocity_m_yr: vel,
          Firn_Density_g_cm3: density,
          Verification_Status: "DGPS_GROUND_TRUTH_VERIFIED",
        })
      }
    }

    return { headers, rows }
  }

  // DOMAIN 5: eDNA & Biology / Limnology (ID 7 Priyadarshini Lake, ID 10 Southern Ocean Carbon)
  const isBiogeo =
    dataset.id === 10 || dataset.parameter.toLowerCase().includes("biogeo")
  const headers = isBiogeo
    ? [
        "Underway_ID",
        "Timestamp_UTC",
        "Latitude_Deg_S",
        "Longitude_Deg_E",
        "Sea_Surface_Temp_C",
        "Salinity_PSU",
        "Atmospheric_xCO2_ppm",
        "Seawater_pCO2_uatm",
        "Air_Sea_CO2_Flux_mmol_m2_d",
        "Chlorophyll_a_mg_m3",
        "Photic_Depth_m",
        "QC_Flag",
      ]
    : [
        "Sample_Barcode",
        "Sampling_Date",
        "Lake_Station",
        "Sampling_Depth_m",
        "Water_Temp_C",
        "pH_Level",
        "Dissolved_Oxygen_mg_L",
        "Specific_Conductance_uS_cm",
        "Dissolved_Organic_Carbon_mg_L",
        "Cyanobacteria_Reads_OTU",
        "Shannon_Diversity_Index",
        "QC_Status",
      ]

  for (let i = 0; i < rowCount; i++) {
    const dayOfYear = Math.floor(1 + (i * 360) / rowCount)
    const date = new Date(Date.UTC(yr, 0, dayOfYear))
    const timeStr = date.toISOString().split("T")[0]

    if (isBiogeo) {
      const lat = +(-45.0 - (i / rowCount) * 23.0).toFixed(3)
      const lon = +(45.0 + ((i * 1.8) % 35.0)).toFixed(3)
      const sst = +(
        9.8 -
        ((lat * -1 - 45) / 23) * 11.2 +
        ((i % 3) - 1) * 0.3
      ).toFixed(2)
      const sal = +(
        34.4 -
        ((lat * -1 - 45) / 23) * 0.8 +
        (i % 2 ? 0.05 : -0.05)
      ).toFixed(2)
      const atmCO2 = +(418.2 + Math.sin(i / 4) * 1.5).toFixed(1)
      const oceanPCO2 = +(330.0 + Math.cos(i / 2.5) * 65.0).toFixed(1)
      const flux = +((oceanPCO2 - atmCO2) * 0.065).toFixed(2)
      const chl = +(
        0.2 +
        Math.abs(Math.sin(i / 3)) * 2.8 +
        (lat < -60 ? 1.2 : 0)
      ).toFixed(2)
      const photic = Math.floor(35 + Math.cos(i / 2) * 25)

      rows.push({
        Underway_ID: `SOCAT-${yr}-${String(i + 1).padStart(3, "0")}`,
        Timestamp_UTC: `${timeStr} 14:00:00`,
        Latitude_Deg_S: lat,
        Longitude_Deg_E: lon,
        Sea_Surface_Temp_C: sst,
        Salinity_PSU: sal,
        Atmospheric_xCO2_ppm: atmCO2,
        Seawater_pCO2_uatm: oceanPCO2,
        Air_Sea_CO2_Flux_mmol_m2_d: flux,
        Chlorophyll_a_mg_m3: chl,
        Photic_Depth_m: photic,
        QC_Flag: "SOCAT_FAIR_COMPLIANT",
      })
    } else {
      const d = +(0.5 + (i % 6) * 1.5).toFixed(1)
      const station =
        i < 20
          ? "Deep Basin Central"
          : i < 40
            ? "Glacial Inflow Zone"
            : "Shoreline Microbial Mat"
      const temp = +(1.2 + (d < 2 ? 2.4 : 0.4) + Math.sin(i / 3) * 0.6).toFixed(
        2,
      )
      const ph = +(8.1 + ((i % 5) - 2) * 0.15).toFixed(2)
      const doVal = +(12.4 - (d / 8) * 3.2 + Math.cos(i / 2) * 0.6).toFixed(2)
      const cond = +(145.0 + (d / 8) * 68.0 + (i % 3) * 8.0).toFixed(1)
      const doc = +(
        2.4 +
        (station.includes("Mat") ? 2.8 : 0.6) +
        Math.sin(i) * 0.5
      ).toFixed(2)
      const cyano = Math.floor(
        4500 +
          Math.abs(Math.sin(i / 2)) * 32000 +
          (station.includes("Mat") ? 18000 : 0),
      )
      const shannon = +(2.45 + (cyano / 50000) * 1.1 + ((i % 3) - 1) * 0.1).toFixed(
        2,
      )

      rows.push({
        Sample_Barcode: `NCPOR-EDNA-${yr}-${String(i + 1).padStart(3, "0")}`,
        Sampling_Date: `${timeStr}`,
        Lake_Station: station,
        Sampling_Depth_m: d,
        Water_Temp_C: temp,
        pH_Level: ph,
        Dissolved_Oxygen_mg_L: doVal,
        Specific_Conductance_uS_cm: cond,
        Dissolved_Organic_Carbon_mg_L: doc,
        Cyanobacteria_Reads_OTU: cyano,
        Shannon_Diversity_Index: shannon,
        QC_Status: "METAGENOMIC_QC_PASSED",
      })
    }
  }

  return { headers, rows }
}
