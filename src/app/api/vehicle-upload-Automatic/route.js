// /app/api/autotrader-import/route.js
import { supabase } from "@/app/lib/supabaseClient";

export async function POST(req) {
  try {
    // Step 1: Get authentication token
    console.log("Getting authentication token...");
    
    const authResponse = await fetch("https://api-sandbox.autotrader.co.uk/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        key: "BrownsAutosBrighton-SB-17-07-25",
        secret: "FaS8UNlxJBgl7fd7CK4pPsL60gxH6bei"
      })
    });

    if (!authResponse.ok) {
      throw new Error(`Authentication failed: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    if (!accessToken) {
      throw new Error("No access token received from authentication");
    }

    console.log("Authentication successful, token obtained");

    // Step 2: Fetch vehicle data using the token
    console.log("Fetching vehicle data...");
    
    const stockResponse = await fetch("https://api-sandbox.autotrader.co.uk/stock?advertiserId=66897&page=1&pageSize=50", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "User-Agent": "PostmanRuntime/7.37.3"
      }
    });

    if (!stockResponse.ok) {
      throw new Error(`Failed to fetch vehicle data: ${stockResponse.status}`);
    }

    const stockData = await stockResponse.json();
    console.log("Vehicle data fetched successfully");

    // Step 3: Process and insert data
    if (!stockData || !Array.isArray(stockData)) {
      throw new Error("Invalid response format from AutoTrader API");
    }

    if (stockData.length === 0) {
      return Response.json({ 
        message: "No vehicles found in AutoTrader API response",
        count: 0 
      }, { status: 200 });
    }

    // Transform the data for our database
    const inserts = stockData.map((data) => {
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

    console.log(`Inserting ${inserts.length} vehicles into database...`);

    // Insert into Supabase
    const { error } = await supabase
      .from("vehicles")
      .insert(inserts);

    if (error) {
      console.error("Database insertion error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log("Vehicles inserted successfully");

    return Response.json({ 
      message: `Successfully imported ${inserts.length} vehicles from AutoTrader API`,
      count: inserts.length 
    }, { status: 200 });

  } catch (err) {
    console.error("AutoTrader import error:", err);
    return Response.json({ 
      error: `Failed to import vehicles: ${err.message}` 
    }, { status: 500 });
  }
}