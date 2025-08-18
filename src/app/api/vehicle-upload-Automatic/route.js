import { supabase } from "@/app/lib/supabaseClient";

export async function POST(req) {
  try {
    // Get credentials from environment variables
    const apiKey = process.env.AUTOTRADER_API_KEY;
    const apiSecret = process.env.AUTOTRADER_API_SECRET;

    // Validate that credentials exist
    if (!apiKey || !apiSecret) {
      throw new Error("AutoTrader API credentials not found in environment variables");
    }

    console.log("Attempting authentication with AutoTrader API...");
    
    const authResponse = await fetch("https://api-sandbox.autotrader.co.uk/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "User-Agent": "PostmanRuntime/7.37.3"
      },
      body: `key=${apiKey}&secret=${apiSecret}`
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Authentication failed: ${authResponse.status} - ${errorText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    if (!accessToken) {
      throw new Error("No access token received from AutoTrader API");
    }

    console.log("Authentication successful!");

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
      const errorText = await stockResponse.text();
      throw new Error(`Failed to fetch vehicle data: ${stockResponse.status} - ${errorText}`);
    }

    const stockData = await stockResponse.json();
    console.log("Vehicle data fetched successfully");
    console.log("Stock data structure:", Object.keys(stockData));
    
    // Log the full response to understand the structure
    console.log("Full stock data response:", JSON.stringify(stockData, null, 2));

    // More comprehensive check for vehicle arrays
    let vehicles = [];
    
    // Check if the response itself is an array
    if (Array.isArray(stockData)) {
      vehicles = stockData;
      console.log("Found vehicles at root level (array)");
    }
    // Check common property names for vehicle arrays
    else if (stockData.data && Array.isArray(stockData.data)) {
      vehicles = stockData.data;
      console.log("Found vehicles in stockData.data");
    }
    else if (stockData.vehicles && Array.isArray(stockData.vehicles)) {
      vehicles = stockData.vehicles;
      console.log("Found vehicles in stockData.vehicles");
    }
    else if (stockData.stock && Array.isArray(stockData.stock)) {
      vehicles = stockData.stock;
      console.log("Found vehicles in stockData.stock");
    }
    else if (stockData.results && Array.isArray(stockData.results)) {
      vehicles = stockData.results;
      console.log("Found vehicles in stockData.results");
    }
    else if (stockData.adverts && Array.isArray(stockData.adverts)) {
      vehicles = stockData.adverts;
      console.log("Found vehicles in stockData.adverts");
    }
    else if (stockData.items && Array.isArray(stockData.items)) {
      vehicles = stockData.items;
      console.log("Found vehicles in stockData.items");
    }
    // Check nested properties
    else if (stockData.response && stockData.response.data && Array.isArray(stockData.response.data)) {
      vehicles = stockData.response.data;
      console.log("Found vehicles in stockData.response.data");
    }
    // Check if there's a single vehicle object that should be converted to array
    else if (stockData.vehicle || stockData.advert) {
      vehicles = [stockData.vehicle || stockData.advert];
      console.log("Found single vehicle, converting to array");
    }
    // If we still can't find vehicles, try to extract from any array property
    else {
      // Look for any property that contains an array
      const arrayProperties = Object.keys(stockData).filter(key => Array.isArray(stockData[key]));
      
      if (arrayProperties.length > 0) {
        // Use the first array we find
        vehicles = stockData[arrayProperties[0]];
        console.log(`Found vehicles in property: ${arrayProperties[0]}`);
      } else {
        // Check if there's any nested object with arrays
        for (const [key, value] of Object.entries(stockData)) {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const nestedArrays = Object.keys(value).filter(nestedKey => Array.isArray(value[nestedKey]));
            if (nestedArrays.length > 0) {
              vehicles = value[nestedArrays[0]];
              console.log(`Found vehicles in nested property: ${key}.${nestedArrays[0]}`);
              break;
            }
          }
        }
        
        // If still no array found, create array from the response itself if it looks like a vehicle object
        if (vehicles.length === 0 && (stockData.make || stockData.model || stockData.registration)) {
          vehicles = [stockData];
          console.log("Treating entire response as single vehicle object");
        }
      }
    }

    console.log(`Found ${vehicles.length} vehicles in response`);

    if (vehicles.length === 0) {
      return Response.json({ 
        message: "No vehicles found in AutoTrader API response. Check the API response structure in server logs.",
        rawResponse: stockData,
        count: 0 
      }, { status: 200 });
    }

    // Log sample vehicle structure for debugging
    if (vehicles.length > 0) {
      console.log("Sample vehicle structure:", JSON.stringify(vehicles[0], null, 2));
    }

    // Transform the data for our database
    const inserts = vehicles.map((data, index) => {
      try {
        // Handle different possible data structures
        const vehicle = data.vehicle || data || {};
        const advertiser = data.advertiser || {};
        const advertData = data.adverts?.retailAdverts || data.advert || {};
        const metadata = data.metadata || {};

        return {
          full_name: `${vehicle.make || ""} ${vehicle.model || ""} ${vehicle.generation || ""}`.trim(),
          registration: vehicle.registration || null,
          ownership_condition: vehicle.ownershipCondition || null,
          make: vehicle.make || null,
          model: vehicle.model || null,
          generation: vehicle.generation || null,
          derivative_id: vehicle.derivativeId || null,
          vehicle_type: vehicle.vehicleType || null,
          fuel_type: vehicle.fuelType || null,
          transmission_type: vehicle.transmissionType || null,
          drivetrain: vehicle.drivetrain || null,
          seats: vehicle.seats || null,
          doors: vehicle.doors || null,
          cylinders: vehicle.cylinders || null,
          valves: vehicle.valves || null,
          top_speed_mph: vehicle.topSpeedMPH || null,
          zero_to_100_kmph_seconds: vehicle.zeroToOneHundredKMPHSeconds || null,
          badge_engine_size_litres: vehicle.badgeEngineSizeLitres || null,
          engine_capacity_cc: vehicle.engineCapacityCC || null,
          engine_power_bhp: vehicle.enginePowerBHP || null,
          fuel_capacity_litres: vehicle.fuelCapacityLitres || null,
          co2_emission_gpkm: vehicle.co2EmissionGPKM || null,
          emission_class: vehicle.emissionClass || null,
          insurance_group: vehicle.insuranceGroup || null,
          road_tax_gbp: vehicle.vehicleExciseDutyWithoutSupplementGBP || null,
          odometer_miles: vehicle.odometerReadingMiles || null,
          fuel_economy_combined_mpg: vehicle.fuelEconomyNEDCCombinedMPG || null,
          wltp_combined_mpg: vehicle.fuelEconomyWLTPCombinedMPG || null,
          boot_space_litres: vehicle.bootSpaceSeatsUpLitres || null,
          length_mm: vehicle.lengthMM || null,
          width_mm: vehicle.widthMM || null,
          height_mm: vehicle.heightMM || null,
          wheelbase_mm: vehicle.wheelbaseMM || null,
          kerb_weight_kg: vehicle.minimumKerbWeightKG || null,
          first_registration_date: vehicle.firstRegistrationDate || null,
          plate: vehicle.plate || null,
          year_of_manufacture: parseInt(vehicle.yearOfManufacture) || null,

          advertiser_name: advertiser.name || null,
          advertiser_segment: advertiser.segment || null,
          advertiser_phone: advertiser.phone || null,
          advertiser_website: advertiser.website || null,
          advertiser_location_town: advertiser.location?.town || null,
          advertiser_location_region: advertiser.location?.region || null,

          price_gbp: advertData.totalPrice?.amountGBP || null,
          price_indicator_rating: advertData.priceIndicatorRating || null,
          autotrader_status: advertData.autotraderAdvert?.status || null,

          stock_id: metadata.stockId || data.stockId || null,
          last_updated: metadata.lastUpdated || data.lastUpdated || null,
          lifecycle_state: metadata.lifecycleState || null,
          date_on_forecourt: metadata.dateOnForecourt || null,

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
      } catch (mappingError) {
        console.error(`Error mapping vehicle ${index}:`, mappingError);
        console.log(`Problematic vehicle data:`, JSON.stringify(data, null, 2));
        throw new Error(`Error processing vehicle ${index}: ${mappingError.message}`);
      }
    });

    console.log(`Inserting ${inserts.length} vehicles into database...`);

    // Insert into Supabase in batches to avoid potential size limits
    const batchSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < inserts.length; i += batchSize) {
      const batch = inserts.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from("vehicles")
        .insert(batch);

      if (error) {
        console.error("Database insertion error:", error);
        return Response.json({ 
          error: `Database insertion failed at batch ${Math.floor(i/batchSize) + 1}: ${error.message}`,
          insertedSoFar: totalInserted
        }, { status: 500 });
      }
      
      totalInserted += batch.length;
      console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}, total so far: ${totalInserted}`);
    }

    console.log("All vehicles inserted successfully");

    return Response.json({ 
      message: `Successfully imported ${totalInserted} vehicles from AutoTrader API`,
      count: totalInserted 
    }, { status: 200 });

  } catch (err) {
    console.error("AutoTrader import error:", err);
    return Response.json({ 
      error: `Failed to import vehicles: ${err.message}` 
    }, { status: 500 });
  }
}