
import { supabase } from "@/app/lib/supabaseClient";



export async function POST(req) {
  try {
    const body = await req.json();
const vehicles = Array.isArray(body) ? body : [body]; // ensure it's an array


const inserts = vehicles.map((data) => {
  const vehicle = data.vehicle || {};
  const advertiser = data.advertiser || {};
  const advertData = data.adverts?.retailAdverts || {};
  const metadata = data.metadata || {};

  return {
    full_name: `${vehicle.make || ""} ${vehicle.model || ""} ${vehicle.generation || ""}`.trim(),
    registration: vehicle.registration,
    ownership_condition: vehicle.ownershipCondition,
    make: vehicle.make,
    model: vehicle.model,
    generation: vehicle.generation,
    derivative_id: vehicle.derivativeId,
    vehicle_type: vehicle.vehicleType,
    fuel_type: vehicle.fuelType,
    transmission_type: vehicle.transmissionType,
    drivetrain: vehicle.drivetrain,
    seats: vehicle.seats,
    doors: vehicle.doors,
    cylinders: vehicle.cylinders,
    valves: vehicle.valves,
    top_speed_mph: vehicle.topSpeedMPH,
    zero_to_100_kmph_seconds: vehicle.zeroToOneHundredKMPHSeconds,
    badge_engine_size_litres: vehicle.badgeEngineSizeLitres,
    engine_capacity_cc: vehicle.engineCapacityCC,
    engine_power_bhp: vehicle.enginePowerBHP,
    fuel_capacity_litres: vehicle.fuelCapacityLitres,
    co2_emission_gpkm: vehicle.co2EmissionGPKM,
    emission_class: vehicle.emissionClass,
    insurance_group: vehicle.insuranceGroup,
    road_tax_gbp: vehicle.vehicleExciseDutyWithoutSupplementGBP,
    odometer_miles: vehicle.odometerReadingMiles,
    fuel_economy_combined_mpg: vehicle.fuelEconomyNEDCCombinedMPG,
    wltp_combined_mpg: vehicle.fuelEconomyWLTPCombinedMPG,
    boot_space_litres: vehicle.bootSpaceSeatsUpLitres,
    length_mm: vehicle.lengthMM,
    width_mm: vehicle.widthMM,
    height_mm: vehicle.heightMM,
    wheelbase_mm: vehicle.wheelbaseMM,
    kerb_weight_kg: vehicle.minimumKerbWeightKG,
    first_registration_date: vehicle.firstRegistrationDate,
    plate: vehicle.plate,
    year_of_manufacture: parseInt(vehicle.yearOfManufacture),

    advertiser_name: advertiser.name,
    advertiser_segment: advertiser.segment,
    advertiser_phone: advertiser.phone,
    advertiser_website: advertiser.website,
    advertiser_location_town: advertiser.location?.town,
    advertiser_location_region: advertiser.location?.region,

    price_gbp: advertData.totalPrice?.amountGBP,
    price_indicator_rating: advertData.priceIndicatorRating,
    autotrader_status: advertData.autotraderAdvert?.status,

    stock_id: metadata.stockId,
    last_updated: metadata.lastUpdated,
    lifecycle_state: metadata.lifecycleState,
    date_on_forecourt: metadata.dateOnForecourt,

    features_json: data.features || [],
    highlights_json: data.highlights || [],
    media_json: data.media || {},
    advertiser_location_json: advertiser.location || {},
    price_indicator_bands_json: advertData.priceIndicatorRatingBands || {},
    finance_offer_json: advertData.financeOffers?.headlineOffer || {},
    check_json: data.check || {},
    history_json: data.history || {},
    standard_spec_json: vehicle.standard || {}
  };
});

const { error } = await supabase.from("vehicles").insert(inserts);


    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: 'Vehicle inserted successfully.' }, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}