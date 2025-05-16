import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.2,
    topP: 0.8,
    topK: 40
  }
});

export const generateIndustryInsights = async (userData) => {
  try {
    console.log("Generating insights for:", userData);

    // Validate API key
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set or invalid");
      throw new Error("API key configuration error");
    }

    // Extract user data with defaults
    const industry = userData.industry || "Software Development";
    const experience = userData.experience || 1;
    const skills = userData.skills || [];
    const country = userData.country || "US";
    const salaryExpectation = userData.salaryExpectation || "";
    const preferredRoles = userData.preferredRoles || [];
    const isIndianData = userData.isIndianData || (country && country.toLowerCase().includes('india'));

    console.log("Processed user data:", {
      industry,
      experience,
      skills: Array.isArray(skills) ? skills : [],
      country,
      salaryExpectation,
      preferredRoles: Array.isArray(preferredRoles) ? preferredRoles : [],
      isIndianData
    });

    // Create a more structured prompt with explicit instructions
    const currency = "USD"; // Always use USD for currency
    

    const prompt = `Analyze the current state of the ${industry} industry${country} and provide insights in ONLY the following JSON format without any additional notes or explanations:

    {
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "industryOverview": "Honest Industry overview for next 5 years",
      "marketDemand": [
        { "skill": "string", "demandScore": number, "location": "string" }
      ],
      "expectedSalaryRange": {
        "min": number,
        "max": number,
        "currency": "${currency}",
        "location": "${country}"
      },
      "citySalaryData": [
        {
          "city": "string",
          "avgSalary": number,
          "salaryTrend": "Increasing" | "Stable" | "Decreasing",
          "demandLevel": "High" | "Medium" | "Low",
          "rolesSalaries": [
            {
              "role": "string",
              "minSalary": number,
              "medianSalary": number,
              "maxSalary": number,
              "location": "string"
            }
          ]
        }
      ],
      "skillBasedBoosts": [
        { "skill": "string", "salaryIncrease": number, "location": "string" }
      ],
      "topCompanies": [
        { "name": "string", "openPositions": number, "roles": ["string"], "location": "string" }
      ],
      "recommendedCourses": [
        { "name": "string", "platform": "string", "url": "string", "skillsCovered": ["string"], "location": "string" }
      ],
      "careerPathInsights": [
        { "title": "string", "description": "string", "growthPotential": "string", "location": "string" }
      ],
      "emergingTrends": [
        { "name": "string", "description": "string", "location": "string" }
      ],
      "quickInsights": [
        { "title": "string", "type": "string", "location": "string" }
      ],
      "nextActions": [
        { "title": "string", "description": "string", "priority": number }
      ]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    For citySalaryData, provide data for exactly the top 3 cities in ${country} with the highest demand for ${industry} professionals according to the ${experience}.
    For each city, include at least 5 common job roles with their salary ranges (min, median, max).
    Growth rate should be a percentage.
    Include at least 5 skills in topSkills and marketDemand.
    Include at least 3 companies in topCompanies.
    Include at least 3 courses in recommendedCourses.
    Include at least 3 career paths in careerPathInsights.
    Include at least 3 trends in emergingTrends.
    Include at least 3 quick insights in quickInsights.
    Include at least 3 next actions in nextActions.
    ${preferredRoles && preferredRoles.length > 0 ? `Focus on these preferred roles: ${preferredRoles.join(', ')}.` : ''}
    ${salaryExpectation ? `Consider the user's salary expectation of ${salaryExpectation} ${currency} when providing insights.` : ''}
    PLEASE RETURN ONLY THE JSON FORMAT WITHOUT ANY ADDITIONAL TEXT, NOTES, OR EXPLANATIONS.
  `;

    console.log("Sending prompt to Gemini");

    // Call Gemini API
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log("Gemini response received");

      // Try to extract and parse JSON from the response
      try {
        // Log the raw response for debugging
        console.log("Raw response length:", text.length);
        console.log("Raw response preview:", text.substring(0, 200) + (text.length > 200 ? "..." : ""));

        // Preprocessing: Clean up the response text before attempting to parse
        const preprocessResponse = (rawText) => {
          // Remove any markdown code block markers
          let cleaned = rawText.replace(/```json/g, '').replace(/```/g, '');

          // Remove any explanatory text before the JSON
          const jsonStartIndex = cleaned.indexOf('{');
          if (jsonStartIndex > 0) {
            const prefixText = cleaned.substring(0, jsonStartIndex).trim();
            if (prefixText) {
              console.log("Removing prefix text before JSON:", prefixText.substring(0, 50) + (prefixText.length > 50 ? "..." : ""));
              cleaned = cleaned.substring(jsonStartIndex);
            }
          }

          // Remove any explanatory text after the JSON
          const jsonEndIndex = cleaned.lastIndexOf('}');
          if (jsonEndIndex !== -1 && jsonEndIndex < cleaned.length - 1) {
            const suffixText = cleaned.substring(jsonEndIndex + 1).trim();
            if (suffixText) {
              console.log("Removing suffix text after JSON:", suffixText.substring(0, 50) + (suffixText.length > 50 ? "..." : ""));
              cleaned = cleaned.substring(0, jsonEndIndex + 1);
            }
          }

          // Fix common JSON syntax issues
          cleaned = cleaned
            // Fix trailing commas in arrays and objects
            .replace(/,\s*]/g, ']')
            .replace(/,\s*}/g, '}')
            // Fix missing quotes around property names
            .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
            // Fix unquoted string values
            .replace(/:\s*([^",{[\]}0-9true\s][^,{[\]}]*[^",{[\]}0-9\s])(\s*[,}])/g, ':"$1"$2')
            // Fix single quotes
            .replace(/:\s*'([^']*)'/g, ':"$1"')
            // Fix undefined and NaN values
            .replace(/:\s*undefined/g, ':null')
            .replace(/:\s*NaN/g, ':0');

          return cleaned;
        };

        // First preprocessing pass
        let cleanedText = preprocessResponse(text);

        // Function to extract and fix JSON from text
        const extractAndFixJSON = (inputText) => {
          // Store parsing errors for better diagnostics
          const errors = [];

          // Clean up the input text first
          let cleanedInput = inputText
            .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
            .replace(/,\s*}/g, '}')  // Remove trailing commas in objects
            .replace(/\[\s*,/g, '[') // Remove leading commas in arrays
            .replace(/{\s*,/g, '{'); // Remove leading commas in objects

          // Fix potential issues with arrays containing mixed quotes
          cleanedInput = cleanedInput.replace(/"([^"]*)'([^']*)'([^"]*)"/g, '"$1\\"$2\\"$3"');

          // Fix potential issues with unquoted property names
          cleanedInput = cleanedInput.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

          // Method 1: Try direct parsing first with cleaned input
          try {
            return JSON.parse(cleanedInput);
          } catch (directParseError) {
            errors.push({ method: "direct", error: directParseError.message });
            console.log("Direct JSON parse failed:", directParseError.message);
          }

          // Method 2: Extract JSON using balanced braces approach
          try {
            // Find the outermost JSON object using balanced braces
            let depth = 0;
            let start = -1;
            let end = -1;

            for (let i = 0; i < inputText.length; i++) {
              if (inputText[i] === '{') {
                if (depth === 0) {
                  start = i;
                }
                depth++;
              } else if (inputText[i] === '}') {
                depth--;
                if (depth === 0) {
                  end = i + 1;
                  break;
                }
              }
            }

            if (start !== -1 && end !== -1) {
              const jsonStr = inputText.substring(start, end);
              console.log("Extracted JSON using balanced braces");
              try {
                return JSON.parse(jsonStr);
              } catch (balancedError) {
                errors.push({ method: "balanced", error: balancedError.message, json: jsonStr.substring(0, 100) + "..." });
                console.log("Balanced braces extraction failed:", balancedError.message);
              }
            }
          } catch (extractError) {
            errors.push({ method: "extraction", error: extractError.message });
            console.log("JSON extraction error:", extractError.message);
          }

          // Method 3: Progressive JSON repair
          try {
            // Find the JSON-like structure
            const jsonStart = inputText.indexOf('{');
            const jsonEnd = inputText.lastIndexOf('}') + 1;

            if (jsonStart >= 0 && jsonEnd > jsonStart) {
              let jsonStr = inputText.substring(jsonStart, jsonEnd);

              // Step 1: Fix property names (ensure they have quotes)
              jsonStr = jsonStr.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

              // Step 2: Fix trailing commas in arrays and objects
              jsonStr = jsonStr.replace(/,(\s*[\]}])/g, '$1');

              // Step 3: Handle special characters in string values
              // First, identify all string values
              const stringValueRegex = /"([^"\\]*(\\.[^"\\]*)*)"(\s*:)/g;
              jsonStr = jsonStr.replace(stringValueRegex, (match) => {
                // Keep property names as they are
                return match;
              });

              // Then handle string values (not property names)
              const stringLiteralRegex = /:\s*"([^"\\]*(\\.[^"\\]*)*)"/g;
              jsonStr = jsonStr.replace(stringLiteralRegex, (match) => {
                // Escape any unescaped quotes, newlines, etc.
                return match
                  .replace(/\\n/g, '\\\\n')
                  .replace(/\\r/g, '\\\\r')
                  .replace(/\\t/g, '\\\\t')
                  .replace(/\\/g, '\\\\')
                  .replace(/\\\\"/g, '\\"'); // Fix double escaping
              });

              // Step 4: Fix common syntax errors
              jsonStr = jsonStr
                // Fix missing quotes around string values
                .replace(/:\s*([^",\{\[\]\}\d][^,\{\[\]\}]*[^",\{\[\]\}\d])(\s*[,\}])/g, ':"$1"$2')
                // Fix single quotes used instead of double quotes
                .replace(/'/g, '"')
                // Fix unquoted property values that should be strings
                .replace(/:\s*(true|false|null|undefined)(\s*[,\}])/g, ':"$1"$2');

              console.log("Attempting to parse with progressive JSON repair");
              try {
                return JSON.parse(jsonStr);
              } catch (repairError) {
                errors.push({ method: "progressive", error: repairError.message, json: jsonStr.substring(0, 100) + "..." });
                console.log("Progressive repair failed:", repairError.message);
              }
            }
          } catch (repairError) {
            errors.push({ method: "repair", error: repairError.message });
            console.log("JSON repair error:", repairError.message);
          }

          // Method 4: Handle the industryOverview field specifically
          try {
            // Find the JSON-like structure
            const jsonStart = inputText.indexOf('{');
            const jsonEnd = inputText.lastIndexOf('}') + 1;

            if (jsonStart >= 0 && jsonEnd > jsonStart) {
              let jsonStr = inputText.substring(jsonStart, jsonEnd);

              // Look for the industryOverview field
              const overviewMatch = jsonStr.match(/"industryOverview"\s*:\s*"([^"\\]*(\\.[^"\\]*)*)"/);

              if (overviewMatch) {
                // Extract the problematic field
                const originalOverview = overviewMatch[0];
                const overviewContent = overviewMatch[1];

                // Create a sanitized version
                const sanitizedOverview = `"industryOverview": "${overviewContent
                  .replace(/"/g, '\\"')
                  .replace(/\n/g, '\\n')
                  .replace(/\r/g, '\\r')
                  .replace(/\t/g, '\\t')}"`;

                // Replace in the JSON string
                jsonStr = jsonStr.replace(originalOverview, sanitizedOverview);

                console.log("Attempting to parse with sanitized industryOverview field");
                try {
                  return JSON.parse(jsonStr);
                } catch (overviewError) {
                  errors.push({ method: "overview", error: overviewError.message });
                  console.log("industryOverview sanitization failed:", overviewError.message);
                }
              }
            }
          } catch (fieldError) {
            errors.push({ method: "field", error: fieldError.message });
            console.log("Field-specific repair error:", fieldError.message);
          }

          // Method 5: Last resort - use a more aggressive approach
          try {
            // Extract what looks like a JSON object
            const jsonStart = inputText.indexOf('{');
            const jsonEnd = inputText.lastIndexOf('}') + 1;

            if (jsonStart >= 0 && jsonEnd > jsonStart) {
              let jsonStr = inputText.substring(jsonStart, jsonEnd);

              // Aggressively fix the JSON by handling one field at a time
              const fieldRegex = /"(\w+)"\s*:\s*([^,}]+)([,}])/g;
              jsonStr = jsonStr.replace(fieldRegex, (_, fieldName, fieldValue, delimiter) => {
                // Try to fix the field value based on expected type
                let fixedValue = fieldValue.trim();

                // Handle string values
                if (fixedValue.startsWith('"') && fixedValue.endsWith('"')) {
                  // Already a string, make sure internal quotes are escaped
                  fixedValue = `"${fixedValue.slice(1, -1).replace(/"/g, '\\"')}"`;
                }
                // Handle arrays
                else if (fixedValue.startsWith('[') && fixedValue.endsWith(']')) {
                  // Process array to ensure all elements are properly formatted
                  try {
                    // Extract the array content
                    const arrayContent = fixedValue.slice(1, -1).trim();

                    // If empty array, return as is
                    if (!arrayContent) {
                      // Empty array, leave as is
                    } else {
                      // Split by commas, but respect nested structures
                      let elements = [];
                      let currentElement = '';
                      let depth = 0;

                      for (let i = 0; i < arrayContent.length; i++) {
                        const char = arrayContent[i];

                        if (char === '{' || char === '[') {
                          depth++;
                          currentElement += char;
                        } else if (char === '}' || char === ']') {
                          depth--;
                          currentElement += char;
                        } else if (char === ',' && depth === 0) {
                          // End of element
                          elements.push(currentElement.trim());
                          currentElement = '';
                        } else {
                          currentElement += char;
                        }
                      }

                      // Add the last element
                      if (currentElement.trim()) {
                        elements.push(currentElement.trim());
                      }

                      // Process each element
                      elements = elements.map(element => {
                        element = element.trim();

                        // If element is already a string with quotes, leave it
                        if ((element.startsWith('"') && element.endsWith('"')) ||
                            (element.startsWith("'") && element.endsWith("'"))) {
                          // Ensure consistent quote usage (double quotes)
                          if (element.startsWith("'")) {
                            element = `"${element.slice(1, -1).replace(/"/g, '\\"')}"`;
                          }
                          return element;
                        }

                        // If element is an object or array, leave it
                        if ((element.startsWith('{') && element.endsWith('}')) ||
                            (element.startsWith('[') && element.endsWith(']'))) {
                          return element;
                        }

                        // If element is a number, leave it
                        if (!isNaN(Number(element))) {
                          return element;
                        }

                        // If element is a boolean or null, leave it
                        if (element === 'true' || element === 'false' || element === 'null') {
                          return element;
                        }

                        // Otherwise, treat as a string and add quotes
                        return `"${element.replace(/"/g, '\\"')}"`;
                      });

                      // Reconstruct the array
                      fixedValue = `[${elements.join(',')}]`;
                    }
                  } catch (arrayError) {
                    console.warn("Error processing array:", arrayError.message);
                    // If processing fails, leave as is
                  }
                }
                // Handle objects
                else if (fixedValue.startsWith('{') && fixedValue.endsWith('}')) {
                  // Already an object, leave as is
                }
                // Handle numbers
                else if (!isNaN(Number(fixedValue))) {
                  // Already a number, leave as is
                }
                // Handle booleans and null
                else if (fixedValue === 'true' || fixedValue === 'false' || fixedValue === 'null') {
                  // Already a boolean or null, leave as is
                }
                // Everything else should be a string
                else {
                  fixedValue = `"${fixedValue.replace(/"/g, '\\"')}"`;
                }

                return `"${fieldName}": ${fixedValue}${delimiter}`;
              });

              console.log("Attempting to parse with aggressive field-by-field repair");
              try {
                return JSON.parse(jsonStr);
              } catch (aggressiveError) {
                errors.push({ method: "aggressive", error: aggressiveError.message });
                console.log("Aggressive repair failed:", aggressiveError.message);
              }
            }
          } catch (lastError) {
            errors.push({ method: "last-resort", error: lastError.message });
            console.log("Last resort repair error:", lastError.message);
          }

          // If all methods fail, throw an error with detailed diagnostics
          const errorDetails = errors.map(e => `${e.method}: ${e.error}`).join('; ');
          throw new Error(`JSON parsing failed after multiple attempts: ${errorDetails}`);
        };

        // Try to extract and parse JSON
        let data;
        try {
          data = extractAndFixJSON(cleanedText);
          console.log("Successfully parsed JSON from response");
        } catch (parseError) {
          console.error("Initial JSON parsing failed, attempting emergency repair:", parseError.message);

          // Emergency repair for common array issues
          try {
            // First, try to identify and fix the specific issue with quickInsights
            // This is a common problem area based on the error messages
            const quickInsightsPattern = /"quickInsights"\s*:\s*\[(.*?)(?:\],|\}|$)/s;
            let fixedText = cleanedText;

            const quickInsightsMatch = quickInsightsPattern.exec(cleanedText);
            if (quickInsightsMatch) {
              const [fullMatch, arrayContent, endChar] = quickInsightsMatch;
              console.log("Found quickInsights array, attempting to fix");

              // If the array content is truncated (doesn't end with ] or }), force it to be an empty array
              if (!arrayContent.trim().endsWith(']') && !arrayContent.trim().endsWith('}')) {
                console.log("quickInsights array appears to be truncated, replacing with empty array");
                fixedText = fixedText.replace(fullMatch, '"quickInsights": []' + (endChar === '],' ? ',' : '}'));
              } else {
                // Parse the array content to find valid JSON objects
                const itemRegex = /{[^{}]*}/g;
                const validItems = [];
                let itemMatch;

                while ((itemMatch = itemRegex.exec(arrayContent)) !== null) {
                  try {
                    // Try to parse each item to ensure it's valid
                    const item = JSON.parse(itemMatch[0]);
                    if (item && typeof item === 'object' && (item.title || item.name)) {
                      validItems.push(itemMatch[0]);
                    }
                  } catch (e) {
                    // Log the error and skip invalid items
                    console.warn("Skipping invalid quickInsights item:", itemMatch[0], "Error:", e.message);

                    // Try to fix common JSON issues in the item
                    try {
                      const fixedItem = itemMatch[0]
                        .replace(/'/g, '"')
                        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
                        .replace(/:\s*([^",{[\]}d][^,{[\]}]*[^",{[\]}d])(\s*[,}])/g, ':"$1"$2');

                      const parsedItem = JSON.parse(fixedItem);
                      if (parsedItem && typeof parsedItem === 'object' && (parsedItem.title || parsedItem.name)) {
                        validItems.push(fixedItem);
                        console.log("Successfully fixed and added item:", fixedItem);
                      }
                    } catch (fixError) {
                      // If we can't fix it, just skip it
                      console.warn("Could not fix item, skipping:", fixError.message);
                    }
                  }
                }

                // Replace the problematic array with only valid items
                const fixedArray = validItems.join(',');
                const replacement = `"quickInsights": [${fixedArray}]${endChar === '],' ? ',' : '}'}`;
                fixedText = fixedText.replace(fullMatch, replacement);
              }
            }

            // Now look for other array patterns that might be causing issues
            const arrayPattern = /"([^"]+)":\s*\[(.*?)\]/gs;

            // Find all arrays in the JSON
            let match;
            while ((match = arrayPattern.exec(cleanedText)) !== null) {
              const [fullMatch, arrayName, arrayContent] = match;

              // Skip quickInsights as we already handled it
              if (arrayName === 'quickInsights') continue;

              // Check if this array might be problematic (contains mixed quotes, missing commas, etc.)
              if (arrayContent.includes("'") ||
                  /,\s*,/.test(arrayContent) ||
                  /\[\s*,/.test(arrayContent) ||
                  /,\s*\]/.test(arrayContent) ||
                  arrayContent.includes("undefined") ||
                  arrayContent.includes("NaN")) {

                console.log(`Potentially problematic array found: ${arrayName}`);

                // Fix the array content
                let fixedArray = arrayContent
                  .replace(/'/g, '"')                // Replace single quotes with double quotes
                  .replace(/,\s*,/g, ',')           // Fix double commas
                  .replace(/\[\s*,/g, '[')          // Remove leading commas in arrays
                  .replace(/,\s*\]/g, ']')          // Remove trailing commas in arrays
                  .replace(/,(\s*[}\]])/g, '$1')    // Remove trailing commas before closing brackets
                  .replace(/undefined/g, '"undefined"') // Quote undefined values
                  .replace(/NaN/g, '0');            // Replace NaN with 0

                // Replace the problematic array in the JSON
                fixedText = fixedText.replace(fullMatch, `"${arrayName}": [${fixedArray}]`);
              }
            }

            // Try parsing the fixed text
            data = JSON.parse(fixedText);
            console.log("Emergency JSON repair successful");
          } catch (emergencyError) {
            console.error("Emergency repair failed:", emergencyError.message);

            // Last resort: create a minimal valid object with empty arrays
            data = {
              growthRate: 10,
              demandLevel: "Medium",
              topSkills: [],
              marketOutlook: "Data unavailable due to parsing error",
              industryOverview: "Industry overview information not available due to parsing error.",
              marketDemand: [],
              expectedSalaryRange: { min: 80000, max: 120000, currency: "USD" },
              citySalaryData: [],
              skillBasedBoosts: [],
              topCompanies: [],
              recommendedCourses: [],
              careerPathInsights: [],
              emergingTrends: [],
              quickInsights: []
            };
            console.warn("Using fallback data structure due to parsing failures");
          }
        }

        // Validate and sanitize the data
        if (!data) {
          throw new Error("Empty data object after parsing");
        }

        // Post-processing: Handle specific fields that might need additional processing
        const postProcessData = (data) => {
          // Handle industryOverview field - ensure it's properly formatted
          if (data.industryOverview) {
            // If it's not a string, convert it to a string
            if (typeof data.industryOverview !== 'string') {
              console.warn("industryOverview is not a string, converting to string");
              data.industryOverview = String(data.industryOverview);
            }

            try {
              // Clean up any special characters or formatting issues
              data.industryOverview = data.industryOverview
                .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
                .replace(/\\"/g, '"')  // Convert escaped quotes to actual quotes
                .replace(/\s+/g, ' ')  // Normalize whitespace
                .trim();               // Remove leading/trailing whitespace

              console.log("Processed industryOverview field");
            } catch (overviewError) {
              console.warn("Error processing industryOverview field:", overviewError.message);
              // If processing fails, provide a fallback
              data.industryOverview = "Industry overview information not available due to formatting issues.";
            }
          } else {
            console.warn("No industryOverview field found in response");
            data.industryOverview = "Industry overview information not available.";
          }

          return data;
        };

        // Apply post-processing
        data = postProcessData(data);

        // Handle marketDemand array
        if (data.marketDemand) {
          if (Array.isArray(data.marketDemand)) {
            // Check if the array is valid (no truncated objects)
            const validDemand = data.marketDemand.filter(item =>
              item && typeof item === 'object' && item.skill && typeof item.demandScore === 'number'
            );

            if (validDemand.length !== data.marketDemand.length) {
              console.warn("Some marketDemand items were invalid or truncated, filtering them out");
              data.marketDemand = validDemand;
            }
          } else {
            console.warn("marketDemand is not an array, setting to empty array");
            data.marketDemand = [];
          }
        } else {
          data.marketDemand = [];
        }

        // Handle quickInsights if it's a string or truncated
        if (data.quickInsights) {
          console.log("Raw quickInsights data:", JSON.stringify(data.quickInsights));

          if (typeof data.quickInsights === 'string') {
            try {
              // Try to parse the string as JSON
              data.quickInsights = JSON.parse(data.quickInsights.replace(/'/g, '"'));
            } catch (error) {
              console.warn("Could not parse quickInsights string, setting to empty array", error);
              data.quickInsights = [];
            }
          } else if (Array.isArray(data.quickInsights)) {
            try {
              // Check if the array is truncated (last item is incomplete)
              const lastItem = data.quickInsights[data.quickInsights.length - 1];
              if (lastItem && typeof lastItem === 'object' &&
                  (!lastItem.title && !lastItem.name || !lastItem.type && !lastItem.category)) {
                console.warn("Last quickInsights item appears to be truncated, removing it");
                // Remove the last item if it appears to be truncated
                data.quickInsights.pop();
              }

              // First, convert the entire array to a string and back to handle any nested issues
              const quickInsightsStr = JSON.stringify(data.quickInsights);
              // Fix any potential issues with trailing commas or malformed JSON
              const fixedStr = quickInsightsStr
                .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
                .replace(/,\s*}/g, '}'); // Remove trailing commas in objects

              // Try to parse it back
              const parsedInsights = JSON.parse(fixedStr);

              // Now filter out invalid items
              const validInsights = parsedInsights.filter(item =>
                item && typeof item === 'object' &&
                (item.title || item.name) && // Accept either title or name
                (item.type || item.category) // Accept either type or category
              );

              if (validInsights.length !== data.quickInsights.length) {
                console.warn(`Some quickInsights items were invalid or truncated, filtering them out. Original: ${data.quickInsights.length}, Valid: ${validInsights.length}`);
              }

              data.quickInsights = validInsights;
            } catch (error) {
              console.warn("Error processing quickInsights array, setting to empty array", error);
              data.quickInsights = [];
            }
          } else {
            console.warn("quickInsights is not an array or string, setting to empty array");
            data.quickInsights = [];
          }
        } else {
          console.warn("quickInsights is missing, setting to empty array");
          data.quickInsights = [];
        }

        // Ensure quickInsights is always a valid array
        if (!Array.isArray(data.quickInsights)) {
          data.quickInsights = [];
        }

        // Ensure nextActions is an array
        if (!data.nextActions || !Array.isArray(data.nextActions)) {
          console.warn("nextActions is not an array, setting to empty array");
          data.nextActions = [];
        }

        // Ensure citySalaryData is properly structured
        if (data.citySalaryData) {
          console.log("Raw citySalaryData:", JSON.stringify(data.citySalaryData));

          // Ensure it's an array
          if (!Array.isArray(data.citySalaryData)) {
            console.warn("citySalaryData is not an array, converting to empty array");
            data.citySalaryData = [];
          } else {
            // Ensure each city has the required properties
            data.citySalaryData = data.citySalaryData.map(city => {
              if (!city || typeof city !== 'object') {
                return null; // Will be filtered out
              }

              // Ensure rolesSalaries is an array
              if (!city.rolesSalaries || !Array.isArray(city.rolesSalaries)) {
                console.warn(`City ${city.city} has no rolesSalaries array, adding empty array`);
                city.rolesSalaries = [];
              }

              return city;
            }).filter(city => city !== null);
          }
        } else {
          console.warn("No citySalaryData in response, adding empty array");
          data.citySalaryData = [];
        }

        // Ensure other required arrays exist
        if (!data.marketDemand || !Array.isArray(data.marketDemand)) {
          data.marketDemand = [];
        }

        if (!data.skillBasedBoosts || !Array.isArray(data.skillBasedBoosts)) {
          data.skillBasedBoosts = [];
        }

        if (!data.topCompanies || !Array.isArray(data.topCompanies)) {
          data.topCompanies = [];
        } else {
          // Ensure each company has properly formatted roles array
          data.topCompanies = data.topCompanies.map(company => {
            if (!company || typeof company !== 'object') {
              return null; // Will be filtered out
            }

            // Ensure roles is an array of strings
            if (!company.roles || !Array.isArray(company.roles)) {
              console.warn(`Company ${company.name} has no roles array, adding empty array`);
              company.roles = [];
            } else {
              // Ensure each role is a string
              company.roles = company.roles.map(role => {
                if (typeof role === 'string') {
                  return role;
                } else if (role && typeof role === 'object') {
                  // If it's an object, try to extract a string representation
                  return String(role.name || role.title || role.role || JSON.stringify(role));
                } else {
                  // Convert to string
                  return String(role);
                }
              });
            }

            return company;
          }).filter(company => company !== null);
        }

        // Handle recommendedCourses array
        if (data.recommendedCourses) {
          if (Array.isArray(data.recommendedCourses)) {
            // Check if the array is valid (no truncated objects)
            const validCourses = data.recommendedCourses.filter(item =>
              item && typeof item === 'object' && item.name && item.platform
            );

            if (validCourses.length !== data.recommendedCourses.length) {
              console.warn("Some recommendedCourses items were invalid or truncated, filtering them out");
              data.recommendedCourses = validCourses;
            }
          } else {
            console.warn("recommendedCourses is not an array, setting to empty array");
            data.recommendedCourses = [];
          }
        } else {
          data.recommendedCourses = [];
        }

        // Handle skillBasedBoosts array
        if (data.skillBasedBoosts) {
          if (Array.isArray(data.skillBasedBoosts)) {
            // Check if the array is valid (no truncated objects)
            const validBoosts = data.skillBasedBoosts.filter(item =>
              item && typeof item === 'object' && item.skill &&
              (typeof item.salaryIncrease === 'number' || typeof item.salaryIncrease === 'string')
            );

            if (validBoosts.length !== data.skillBasedBoosts.length) {
              console.warn("Some skillBasedBoosts items were invalid or truncated, filtering them out");
              data.skillBasedBoosts = validBoosts;
            }
          } else {
            console.warn("skillBasedBoosts is not an array, setting to empty array");
            data.skillBasedBoosts = [];
          }
        } else {
          data.skillBasedBoosts = [];
        }

        // Handle topCompanies array
        if (data.topCompanies) {
          if (Array.isArray(data.topCompanies)) {
            // Check if the array is valid (no truncated objects)
            const validCompanies = data.topCompanies.filter(item =>
              item && typeof item === 'object' && item.name
            );

            if (validCompanies.length !== data.topCompanies.length) {
              console.warn("Some topCompanies items were invalid or truncated, filtering them out");
              data.topCompanies = validCompanies;
            }
          } else {
            console.warn("topCompanies is not an array, setting to empty array");
            data.topCompanies = [];
          }
        } else {
          data.topCompanies = [];
        }

        // Handle careerPathInsights
        if (data.careerPathInsights) {
          if (Array.isArray(data.careerPathInsights)) {
            // Check if the array is valid (no truncated objects)
            const validInsights = data.careerPathInsights.filter(item =>
              item && typeof item === 'object' && item.title && item.description
            );

            if (validInsights.length !== data.careerPathInsights.length) {
              console.warn("Some careerPathInsights items were invalid or truncated, filtering them out");
              data.careerPathInsights = validInsights;
            }
          } else {
            console.warn("careerPathInsights is not an array, setting to empty array");
            data.careerPathInsights = [];
          }
        } else {
          data.careerPathInsights = [];
        }

        // Handle emergingTrends
        if (data.emergingTrends) {
          if (Array.isArray(data.emergingTrends)) {
            // Check if the array is valid (no truncated objects)
            const validTrends = data.emergingTrends.filter(item =>
              item && typeof item === 'object' && item.name && item.description
            );

            if (validTrends.length !== data.emergingTrends.length) {
              console.warn("Some emergingTrends items were invalid or truncated, filtering them out");
              data.emergingTrends = validTrends;
            }
          } else {
            console.warn("emergingTrends is not an array, setting to empty array");
            data.emergingTrends = [];
          }
        } else {
          data.emergingTrends = [];
        }

        // Handle citySalaryData array
        if (data.citySalaryData) {
          if (Array.isArray(data.citySalaryData)) {
            // Check if the array is valid (no truncated objects)
            const validCityData = data.citySalaryData.filter(item =>
              item && typeof item === 'object' && item.city &&
              (typeof item.avgSalary === 'number' || typeof item.avgSalary === 'string')
            );

            if (validCityData.length !== data.citySalaryData.length) {
              console.warn("Some citySalaryData items were invalid or truncated, filtering them out");
              data.citySalaryData = validCityData;
            }

            // Ensure each city has a valid rolesSalaries array
            data.citySalaryData = data.citySalaryData.map(city => {
              if (!city.rolesSalaries || !Array.isArray(city.rolesSalaries)) {
                console.warn(`City ${city.city} has no rolesSalaries array, adding empty array`);
                return {
                  ...city,
                  rolesSalaries: []
                };
              }

              // Filter out invalid role salary entries
              const validRoles = city.rolesSalaries.filter(role =>
                role && typeof role === 'object' && role.role &&
                (typeof role.minSalary === 'number' || typeof role.minSalary === 'string') &&
                (typeof role.medianSalary === 'number' || typeof role.medianSalary === 'string') &&
                (typeof role.maxSalary === 'number' || typeof role.maxSalary === 'string')
              );

              if (validRoles.length !== city.rolesSalaries.length) {
                console.warn(`Some rolesSalaries items for city ${city.city} were invalid, filtering them out`);
                return {
                  ...city,
                  rolesSalaries: validRoles
                };
              }

              return city;
            });
          } else {
            console.warn("citySalaryData is not an array, setting to empty array");
            data.citySalaryData = [];
          }
        } else {
          data.citySalaryData = [];
        }

        // Ensure expectedSalaryRange exists
        if (!data.expectedSalaryRange || typeof data.expectedSalaryRange !== 'object') {
          data.expectedSalaryRange = { min: 80000, max: 120000, currency: "USD" };
        }

        return data;
      } catch (parseError) {
        console.error("Error parsing JSON from Gemini:", parseError);
        console.error("Raw response text:", text);
        throw new Error("Failed to parse response: " + parseError.message);
      }
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      throw new Error("Gemini API error: " + apiError.message);
    }
  } catch (error) {
    console.error("Error in generateIndustryInsights:", error);
    throw new Error("Failed to generate insights: " + error.message);
  }
};

// // Function to generate fallback data based on user's industry
// function generateFallbackData(userData) {
//   const industry = userData.industry || "Software Development";
//   const experience = userData.experience || 1;
//   const skills = userData.skills || [];
//   const country = userData.country || "US";
//   const isIndianData = userData.isIndianData || (country && country.toLowerCase().includes('india'));
//   const currency = "USD"; // Always use USD for currency
//   const adjustmentFactor = 0.25; // For Indian locations, adjust salary to 1/4 of US salaries

//   // Determine location string
//   let locationStr = isIndianData ? "India" : "Global";

//   // Base data structure
//   const baseData = {
//     "marketOutlook": "Positive",
//     "growthRate": 12,
//     "demandLevel": "High",
//     "topSkills": ["JavaScript", "React", "Node.js", "Python", "AWS"],
//     "citySalaryData": [
//       {
//         "city": isIndianData ? "Bangalore" : "San Francisco",
//         "avgSalary": isIndianData ? 1200000 : 120000,
//         "salaryTrend": "Increasing",
//         "demandLevel": "High",
//         "rolesSalaries": [
//           { "role": "Junior Developer", "minSalary": isIndianData ? 600000 : 60000, "medianSalary": isIndianData ? 750000 : 75000, "maxSalary": isIndianData ? 900000 : 90000, "location": isIndianData ? "Bangalore" : "San Francisco" },
//           { "role": "Mid-level Developer", "minSalary": isIndianData ? 800000 : 80000, "medianSalary": isIndianData ? 950000 : 95000, "maxSalary": isIndianData ? 1100000 : 110000, "location": isIndianData ? "Bangalore" : "San Francisco" },
//           { "role": "Senior Developer", "minSalary": isIndianData ? 1000000 : 100000, "medianSalary": isIndianData ? 1200000 : 120000, "maxSalary": isIndianData ? 1500000 : 150000, "location": isIndianData ? "Bangalore" : "San Francisco" },
//           { "role": "DevOps Engineer", "minSalary": isIndianData ? 900000 : 90000, "medianSalary": isIndianData ? 1100000 : 110000, "maxSalary": isIndianData ? 1300000 : 130000, "location": isIndianData ? "Bangalore" : "San Francisco" },
//           { "role": "Product Manager", "minSalary": isIndianData ? 1200000 : 120000, "medianSalary": isIndianData ? 1500000 : 150000, "maxSalary": isIndianData ? 1800000 : 180000, "location": isIndianData ? "Bangalore" : "San Francisco" }
//         ]
//       },
//       {
//         "city": isIndianData ? "Hyderabad" : "New York",
//         "avgSalary": isIndianData ? 1100000 : 110000,
//         "salaryTrend": "Stable",
//         "demandLevel": "High",
//         "rolesSalaries": [
//           { "role": "Junior Developer", "minSalary": isIndianData ? 550000 : 55000, "medianSalary": isIndianData ? 700000 : 70000, "maxSalary": isIndianData ? 850000 : 85000, "location": isIndianData ? "Hyderabad" : "New York" },
//           { "role": "Mid-level Developer", "minSalary": isIndianData ? 750000 : 75000, "medianSalary": isIndianData ? 900000 : 90000, "maxSalary": isIndianData ? 1050000 : 105000, "location": isIndianData ? "Hyderabad" : "New York" },
//           { "role": "Senior Developer", "minSalary": isIndianData ? 950000 : 95000, "medianSalary": isIndianData ? 1150000 : 115000, "maxSalary": isIndianData ? 1400000 : 140000, "location": isIndianData ? "Hyderabad" : "New York" },
//           { "role": "DevOps Engineer", "minSalary": isIndianData ? 850000 : 85000, "medianSalary": isIndianData ? 1050000 : 105000, "maxSalary": isIndianData ? 1250000 : 125000, "location": isIndianData ? "Hyderabad" : "New York" },
//           { "role": "Product Manager", "minSalary": isIndianData ? 1150000 : 115000, "medianSalary": isIndianData ? 1400000 : 140000, "maxSalary": isIndianData ? 1700000 : 170000, "location": isIndianData ? "Hyderabad" : "New York" }
//         ]
//       },
//       {
//         "city": isIndianData ? "Pune" : "Seattle",
//         "avgSalary": isIndianData ? 1000000 : 100000,
//         "salaryTrend": "Increasing",
//         "demandLevel": "Medium",
//         "rolesSalaries": [
//           { "role": "Junior Developer", "minSalary": isIndianData ? 500000 : 50000, "medianSalary": isIndianData ? 650000 : 65000, "maxSalary": isIndianData ? 800000 : 80000, "location": isIndianData ? "Pune" : "Seattle" },
//           { "role": "Mid-level Developer", "minSalary": isIndianData ? 700000 : 70000, "medianSalary": isIndianData ? 850000 : 85000, "maxSalary": isIndianData ? 1000000 : 100000, "location": isIndianData ? "Pune" : "Seattle" },
//           { "role": "Senior Developer", "minSalary": isIndianData ? 900000 : 90000, "medianSalary": isIndianData ? 1100000 : 110000, "maxSalary": isIndianData ? 1300000 : 130000, "location": isIndianData ? "Pune" : "Seattle" },
//           { "role": "DevOps Engineer", "minSalary": isIndianData ? 800000 : 80000, "medianSalary": isIndianData ? 1000000 : 100000, "maxSalary": isIndianData ? 1200000 : 120000, "location": isIndianData ? "Pune" : "Seattle" },
//           { "role": "Product Manager", "minSalary": isIndianData ? 1100000 : 110000, "medianSalary": isIndianData ? 1350000 : 135000, "maxSalary": isIndianData ? 1600000 : 160000, "location": isIndianData ? "Pune" : "Seattle" }
//         ]
//       }
//     ],
//     "marketDemand": [
//       { "skill": "JavaScript", "demandScore": 85, "location": locationStr },
//       { "skill": "React", "demandScore": 90, "location": locationStr },
//       { "skill": "Node.js", "demandScore": 80, "location": locationStr },
//       { "skill": "Python", "demandScore": 88, "location": locationStr },
//       { "skill": "AWS", "demandScore": 92, "location": locationStr }
//     ],
//     "topCompanies": isIndianData ? [
//       { "name": "TCS", "openPositions": 200, "roles": ["Software Engineer", "Project Manager"], "location": "India" },
//       { "name": "Infosys", "openPositions": 180, "roles": ["Full Stack Developer", "DevOps Engineer"], "location": "India" },
//       { "name": "Wipro", "openPositions": 150, "roles": ["Software Developer", "Solutions Architect"], "location": "India" }
//     ] : [
//       { "name": "Google", "openPositions": 150, "roles": ["Software Engineer", "Product Manager"], "location": locationStr },
//       { "name": "Microsoft", "openPositions": 120, "roles": ["Full Stack Developer", "DevOps Engineer"], "location": locationStr },
//       { "name": "Amazon", "openPositions": 200, "roles": ["Software Developer", "Solutions Architect"], "location": locationStr }
//     ],
//     "quickInsights": [
//       { "title": "Remote work continues to be popular in " + industry, "type": "trend", "location": locationStr },
//       { "title": "AI skills are increasingly in demand", "type": "trend", "location": locationStr },
//       { "title": "Cybersecurity concerns are driving new hiring", "type": "alert", "location": locationStr }
//     ],
//     "nextActions": [
//       { "title": "Learn cloud technologies", "type": "skill development", "priority": 4 },
//       { "title": "Build a portfolio project", "type": "career development", "priority": 5 },
//       { "title": "Network with industry professionals", "type": "networking", "priority": 3 }
//     ],
//     "expectedSalaryRange": {
//       "min": isIndianData ? 80000 * adjustmentFactor : 80000,
//       "max": isIndianData ? 120000 * adjustmentFactor : 120000,
//       "currency": currency,
//       "location": locationStr
//     },
//     "skillBasedBoosts": [
//       { "skill": "AWS", "salaryIncrease": isIndianData ? 15000 * adjustmentFactor : 15000, "location": locationStr },
//       { "skill": "Machine Learning", "salaryIncrease": isIndianData ? 20000 * adjustmentFactor : 20000, "location": locationStr }
//     ],
//     "isIndianData": isIndianData
//   };

//   // Customize based on industry
//   const industryLower = industry.toLowerCase();

//   // Prepare industry-specific data
//   let industryData = {};

//   if (industryLower.includes('software') || industryLower.includes('web') || industryLower.includes('development')) {
//     // Software Development specific data
//     industryData = {
//       "marketOutlook": "Very Positive",
//       "growthRate": 15,
//       "topSkills": ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
//       "quickInsights": [
//         { "title": "Full-stack developers are in high demand", "type": "trend", "location": locationStr },
//         { "title": "Remote work is standard in software development", "type": "trend", "location": locationStr },
//         { "title": "AI integration skills becoming essential", "type": "alert", "location": locationStr }
//       ]
//     };

//     // Add India-specific companies if needed
//     if (isIndianData) {
//       industryData.topCompanies = [
//         { "name": "TCS", "openPositions": 250, "roles": ["Software Engineer", "Full Stack Developer"], "location": "India" },
//         { "name": "Infosys", "openPositions": 200, "roles": ["React Developer", "Node.js Developer"], "location": "India" },
//         { "name": "Wipro", "openPositions": 180, "roles": ["JavaScript Developer", "DevOps Engineer"], "location": "India" }
//       ];
//     }
//   }
//   else if (industryLower.includes('data') || industryLower.includes('analytics')) {
//     // Data Science specific data
//     const salaryMultiplier = isIndianData ? adjustmentFactor : 1;

//     industryData = {
//       "topSkills": ["Python", "SQL", "Machine Learning", "TensorFlow", "Data Visualization"],
//       "citySalaryData": [
//         {
//           "city": isIndianData ? "Bangalore" : "San Francisco",
//           "avgSalary": isIndianData ? 1500000 * salaryMultiplier : 150000 * salaryMultiplier,
//           "salaryTrend": "Increasing",
//           "demandLevel": "High",
//           "rolesSalaries": [
//             { "role": "Data Analyst", "minSalary": isIndianData ? 650000 * salaryMultiplier : 65000 * salaryMultiplier, "medianSalary": isIndianData ? 850000 * salaryMultiplier : 85000 * salaryMultiplier, "maxSalary": isIndianData ? 1050000 * salaryMultiplier : 105000 * salaryMultiplier, "location": isIndianData ? "Bangalore" : "San Francisco" },
//             { "role": "Data Scientist", "minSalary": isIndianData ? 900000 * salaryMultiplier : 90000 * salaryMultiplier, "medianSalary": isIndianData ? 1150000 * salaryMultiplier : 115000 * salaryMultiplier, "maxSalary": isIndianData ? 1400000 * salaryMultiplier : 140000 * salaryMultiplier, "location": isIndianData ? "Bangalore" : "San Francisco" },
//             { "role": "ML Engineer", "minSalary": isIndianData ? 1100000 * salaryMultiplier : 110000 * salaryMultiplier, "medianSalary": isIndianData ? 1350000 * salaryMultiplier : 135000 * salaryMultiplier, "maxSalary": isIndianData ? 1600000 * salaryMultiplier : 160000 * salaryMultiplier, "location": isIndianData ? "Bangalore" : "San Francisco" },
//             { "role": "Data Engineer", "minSalary": isIndianData ? 850000 * salaryMultiplier : 85000 * salaryMultiplier, "medianSalary": isIndianData ? 1050000 * salaryMultiplier : 105000 * salaryMultiplier, "maxSalary": isIndianData ? 1250000 * salaryMultiplier : 125000 * salaryMultiplier, "location": isIndianData ? "Bangalore" : "San Francisco" },
//             { "role": "AI Researcher", "minSalary": isIndianData ? 1200000 * salaryMultiplier : 120000 * salaryMultiplier, "medianSalary": isIndianData ? 1500000 * salaryMultiplier : 150000 * salaryMultiplier, "maxSalary": isIndianData ? 1800000 * salaryMultiplier : 180000 * salaryMultiplier, "location": isIndianData ? "Bangalore" : "San Francisco" }
//           ]
//         },
//         {
//           "city": isIndianData ? "Hyderabad" : "New York",
//           "avgSalary": isIndianData ? 1400000 * salaryMultiplier : 140000 * salaryMultiplier,
//           "salaryTrend": "Stable",
//           "demandLevel": "High",
//           "rolesSalaries": [
//             { "role": "Data Analyst", "minSalary": isIndianData ? 600000 * salaryMultiplier : 60000 * salaryMultiplier, "medianSalary": isIndianData ? 800000 * salaryMultiplier : 80000 * salaryMultiplier, "maxSalary": isIndianData ? 1000000 * salaryMultiplier : 100000 * salaryMultiplier, "location": isIndianData ? "Hyderabad" : "New York" },
//             { "role": "Data Scientist", "minSalary": isIndianData ? 850000 * salaryMultiplier : 85000 * salaryMultiplier, "medianSalary": isIndianData ? 1100000 * salaryMultiplier : 110000 * salaryMultiplier, "maxSalary": isIndianData ? 1350000 * salaryMultiplier : 135000 * salaryMultiplier, "location": isIndianData ? "Hyderabad" : "New York" },
//             { "role": "ML Engineer", "minSalary": isIndianData ? 1050000 * salaryMultiplier : 105000 * salaryMultiplier, "medianSalary": isIndianData ? 1300000 * salaryMultiplier : 130000 * salaryMultiplier, "maxSalary": isIndianData ? 1550000 * salaryMultiplier : 155000 * salaryMultiplier, "location": isIndianData ? "Hyderabad" : "New York" },
//             { "role": "Data Engineer", "minSalary": isIndianData ? 800000 * salaryMultiplier : 80000 * salaryMultiplier, "medianSalary": isIndianData ? 1000000 * salaryMultiplier : 100000 * salaryMultiplier, "maxSalary": isIndianData ? 1200000 * salaryMultiplier : 120000 * salaryMultiplier, "location": isIndianData ? "Hyderabad" : "New York" },
//             { "role": "AI Researcher", "minSalary": isIndianData ? 1150000 * salaryMultiplier : 115000 * salaryMultiplier, "medianSalary": isIndianData ? 1450000 * salaryMultiplier : 145000 * salaryMultiplier, "maxSalary": isIndianData ? 1750000 * salaryMultiplier : 175000 * salaryMultiplier, "location": isIndianData ? "Hyderabad" : "New York" }
//           ]
//         },
//         {
//           "city": isIndianData ? "Pune" : "Seattle",
//           "avgSalary": isIndianData ? 1300000 * salaryMultiplier : 130000 * salaryMultiplier,
//           "salaryTrend": "Increasing",
//           "demandLevel": "Medium",
//           "rolesSalaries": [
//             { "role": "Data Analyst", "minSalary": isIndianData ? 550000 * salaryMultiplier : 55000 * salaryMultiplier, "medianSalary": isIndianData ? 750000 * salaryMultiplier : 75000 * salaryMultiplier, "maxSalary": isIndianData ? 950000 * salaryMultiplier : 95000 * salaryMultiplier, "location": isIndianData ? "Pune" : "Seattle" },
//             { "role": "Data Scientist", "minSalary": isIndianData ? 800000 * salaryMultiplier : 80000 * salaryMultiplier, "medianSalary": isIndianData ? 1050000 * salaryMultiplier : 105000 * salaryMultiplier, "maxSalary": isIndianData ? 1300000 * salaryMultiplier : 130000 * salaryMultiplier, "location": isIndianData ? "Pune" : "Seattle" },
//             { "role": "ML Engineer", "minSalary": isIndianData ? 1000000 * salaryMultiplier : 100000 * salaryMultiplier, "medianSalary": isIndianData ? 1250000 * salaryMultiplier : 125000 * salaryMultiplier, "maxSalary": isIndianData ? 1500000 * salaryMultiplier : 150000 * salaryMultiplier, "location": isIndianData ? "Pune" : "Seattle" },
//             { "role": "Data Engineer", "minSalary": isIndianData ? 750000 * salaryMultiplier : 75000 * salaryMultiplier, "medianSalary": isIndianData ? 950000 * salaryMultiplier : 95000 * salaryMultiplier, "maxSalary": isIndianData ? 1150000 * salaryMultiplier : 115000 * salaryMultiplier, "location": isIndianData ? "Pune" : "Seattle" },
//             { "role": "AI Researcher", "minSalary": isIndianData ? 1100000 * salaryMultiplier : 110000 * salaryMultiplier, "medianSalary": isIndianData ? 1400000 * salaryMultiplier : 140000 * salaryMultiplier, "maxSalary": isIndianData ? 1700000 * salaryMultiplier : 170000 * salaryMultiplier, "location": isIndianData ? "Pune" : "Seattle" }
//           ]
//         }
//       ],
//       "topCompanies": isIndianData ? [
//         { "name": "Mu Sigma", "openPositions": 120, "roles": ["Data Scientist", "ML Engineer"], "location": "India" },
//         { "name": "Tiger Analytics", "openPositions": 100, "roles": ["Data Analyst", "Data Engineer"], "location": "India" },
//         { "name": "Fractal Analytics", "openPositions": 80, "roles": ["Data Scientist", "AI Researcher"], "location": "India" }
//       ] : [
//         { "name": "Google", "openPositions": 120, "roles": ["Data Scientist", "ML Engineer"], "location": locationStr },
//         { "name": "Amazon", "openPositions": 150, "roles": ["Data Analyst", "Data Engineer"], "location": locationStr },
//         { "name": "Microsoft", "openPositions": 100, "roles": ["Data Scientist", "AI Researcher"], "location": locationStr }
//       ]
//     };
//   }
//   else if (industryLower.includes('finance') || industryLower.includes('banking')) {
//     // Finance specific data
//     const salaryMultiplier = isIndianData ? adjustmentFactor : 1;

//     industryData = {
//       "topSkills": ["Financial Analysis", "Excel", "SQL", "Python", "Risk Management"],
//       "citySalaryData": [
//         {
//           "city": isIndianData ? "Mumbai" : "New York",
//           "avgSalary": isIndianData ? 1800000 * salaryMultiplier : 180000 * salaryMultiplier,
//           "salaryTrend": "Increasing",
//           "demandLevel": "High",
//           "rolesSalaries": [
//             { "role": "Financial Analyst", "minSalary": isIndianData ? 700000 * salaryMultiplier : 70000 * salaryMultiplier, "medianSalary": isIndianData ? 900000 * salaryMultiplier : 90000 * salaryMultiplier, "maxSalary": isIndianData ? 1100000 * salaryMultiplier : 110000 * salaryMultiplier, "location": isIndianData ? "Mumbai" : "New York" },
//             { "role": "Investment Banker", "minSalary": isIndianData ? 1000000 * salaryMultiplier : 100000 * salaryMultiplier, "medianSalary": isIndianData ? 1500000 * salaryMultiplier : 150000 * salaryMultiplier, "maxSalary": isIndianData ? 2000000 * salaryMultiplier : 200000 * salaryMultiplier, "location": isIndianData ? "Mumbai" : "New York" },
//             { "role": "Risk Manager", "minSalary": isIndianData ? 850000 * salaryMultiplier : 85000 * salaryMultiplier, "medianSalary": isIndianData ? 1100000 * salaryMultiplier : 110000 * salaryMultiplier, "maxSalary": isIndianData ? 1350000 * salaryMultiplier : 135000 * salaryMultiplier, "location": isIndianData ? "Mumbai" : "New York" },
//             { "role": "Financial Advisor", "minSalary": isIndianData ? 650000 * salaryMultiplier : 65000 * salaryMultiplier, "medianSalary": isIndianData ? 850000 * salaryMultiplier : 85000 * salaryMultiplier, "maxSalary": isIndianData ? 1050000 * salaryMultiplier : 105000 * salaryMultiplier, "location": isIndianData ? "Mumbai" : "New York" },
//             { "role": "Portfolio Manager", "minSalary": isIndianData ? 1200000 * salaryMultiplier : 120000 * salaryMultiplier, "medianSalary": isIndianData ? 1600000 * salaryMultiplier : 160000 * salaryMultiplier, "maxSalary": isIndianData ? 2200000 * salaryMultiplier : 220000 * salaryMultiplier, "location": isIndianData ? "Mumbai" : "New York" }
//           ]
//         },
//         {
//           "city": isIndianData ? "Delhi" : "Chicago",
//           "avgSalary": isIndianData ? 1600000 * salaryMultiplier : 160000 * salaryMultiplier,
//           "salaryTrend": "Stable",
//           "demandLevel": "High",
//           "rolesSalaries": [
//             { "role": "Financial Analyst", "minSalary": isIndianData ? 650000 * salaryMultiplier : 65000 * salaryMultiplier, "medianSalary": isIndianData ? 850000 * salaryMultiplier : 85000 * salaryMultiplier, "maxSalary": isIndianData ? 1050000 * salaryMultiplier : 105000 * salaryMultiplier, "location": isIndianData ? "Delhi" : "Chicago" },
//             { "role": "Investment Banker", "minSalary": isIndianData ? 950000 * salaryMultiplier : 95000 * salaryMultiplier, "medianSalary": isIndianData ? 1400000 * salaryMultiplier : 140000 * salaryMultiplier, "maxSalary": isIndianData ? 1900000 * salaryMultiplier : 190000 * salaryMultiplier, "location": isIndianData ? "Delhi" : "Chicago" },
//             { "role": "Risk Manager", "minSalary": isIndianData ? 800000 * salaryMultiplier : 80000 * salaryMultiplier, "medianSalary": isIndianData ? 1050000 * salaryMultiplier : 105000 * salaryMultiplier, "maxSalary": isIndianData ? 1300000 * salaryMultiplier : 130000 * salaryMultiplier, "location": isIndianData ? "Delhi" : "Chicago" },
//             { "role": "Financial Advisor", "minSalary": isIndianData ? 600000 * salaryMultiplier : 60000 * salaryMultiplier, "medianSalary": isIndianData ? 800000 * salaryMultiplier : 80000 * salaryMultiplier, "maxSalary": isIndianData ? 1000000 * salaryMultiplier : 100000 * salaryMultiplier, "location": isIndianData ? "Delhi" : "Chicago" },
//             { "role": "Portfolio Manager", "minSalary": isIndianData ? 1150000 * salaryMultiplier : 115000 * salaryMultiplier, "medianSalary": isIndianData ? 1550000 * salaryMultiplier : 155000 * salaryMultiplier, "maxSalary": isIndianData ? 2100000 * salaryMultiplier : 210000 * salaryMultiplier, "location": isIndianData ? "Delhi" : "Chicago" }
//           ]
//         },
//         {
//           "city": isIndianData ? "Bangalore" : "Boston",
//           "avgSalary": isIndianData ? 1500000 * salaryMultiplier : 150000 * salaryMultiplier,
//           "salaryTrend": "Increasing",
//           "demandLevel": "Medium",
//           "rolesSalaries": [
//             { "role": "Financial Analyst", "minSalary": isIndianData ? 600000 * salaryMultiplier : 60000 * salaryMultiplier, "medianSalary": isIndianData ? 800000 * salaryMultiplier : 80000 * salaryMultiplier, "maxSalary": isIndianData ? 1000000 * salaryMultiplier : 100000 * salaryMultiplier, "location": isIndianData ? "Bangalore" : "Boston" },
//             { "role": "Investment Banker", "minSalary": isIndianData ? 900000 * salaryMultiplier : 90000 * salaryMultiplier, "medianSalary": isIndianData ? 1350000 * salaryMultiplier : 135000 * salaryMultiplier, "maxSalary": isIndianData ? 1850000 * salaryMultiplier : 185000 * salaryMultiplier, "location": isIndianData ? "Bangalore" : "Boston" },
//             { "role": "Risk Manager", "minSalary": isIndianData ? 750000 * salaryMultiplier : 75000 * salaryMultiplier, "medianSalary": isIndianData ? 1000000 * salaryMultiplier : 100000 * salaryMultiplier, "maxSalary": isIndianData ? 1250000 * salaryMultiplier : 125000 * salaryMultiplier, "location": isIndianData ? "Bangalore" : "Boston" },
//             { "role": "Financial Advisor", "minSalary": isIndianData ? 550000 * salaryMultiplier : 55000 * salaryMultiplier, "medianSalary": isIndianData ? 750000 * salaryMultiplier : 75000 * salaryMultiplier, "maxSalary": isIndianData ? 950000 * salaryMultiplier : 95000 * salaryMultiplier, "location": isIndianData ? "Bangalore" : "Boston" },
//             { "role": "Portfolio Manager", "minSalary": isIndianData ? 1100000 * salaryMultiplier : 110000 * salaryMultiplier, "medianSalary": isIndianData ? 1500000 * salaryMultiplier : 150000 * salaryMultiplier, "maxSalary": isIndianData ? 2000000 * salaryMultiplier : 200000 * salaryMultiplier, "location": isIndianData ? "Bangalore" : "Boston" }
//           ]
//         }
//       ],
//       "topCompanies": isIndianData ? [
//         { "name": "HDFC Bank", "openPositions": 150, "roles": ["Financial Analyst", "Investment Banker"], "location": "India" },
//         { "name": "ICICI Bank", "openPositions": 120, "roles": ["Investment Banker", "Risk Analyst"], "location": "India" },
//         { "name": "SBI", "openPositions": 180, "roles": ["Financial Advisor", "Credit Analyst"], "location": "India" }
//       ] : [
//         { "name": "JPMorgan Chase", "openPositions": 180, "roles": ["Financial Analyst", "Investment Banker"], "location": locationStr },
//         { "name": "Goldman Sachs", "openPositions": 150, "roles": ["Investment Banker", "Risk Analyst"], "location": locationStr },
//         { "name": "Bank of America", "openPositions": 200, "roles": ["Financial Advisor", "Credit Analyst"], "location": locationStr }
//       ]
//     };
//   }

//   // Apply experience multiplier to salaries
//   const experienceMultiplier = 1 + (Math.min(experience, 15) * 0.05);

//   // Create a merged data object
//   const mergedData = { ...baseData, ...industryData };

//   // Adjust salary ranges based on experience
//   if (mergedData.salaryRanges) {
//     mergedData.salaryRanges = mergedData.salaryRanges.map(range => ({
//       ...range,
//       minSalary: Math.round(range.minSalary * experienceMultiplier),
//       medianSalary: Math.round(range.medianSalary * experienceMultiplier),
//       maxSalary: Math.round(range.maxSalary * experienceMultiplier)
//     }));
//   }

//   // Adjust expected salary range
//   if (mergedData.expectedSalaryRange) {
//     mergedData.expectedSalaryRange = {
//       ...mergedData.expectedSalaryRange,
//       min: Math.round(mergedData.expectedSalaryRange.min * experienceMultiplier),
//       max: Math.round(mergedData.expectedSalaryRange.max * experienceMultiplier)
//     };
//   }

//   // Add user's skills to market demand if they're not already there
//   if (skills && skills.length > 0 && mergedData.marketDemand) {
//     const existingSkills = new Set(mergedData.marketDemand.map(item => item.skill.toLowerCase()));

//     skills.forEach(skill => {
//       if (!existingSkills.has(skill.toLowerCase())) {
//         // Add user's skill with a random demand score between 60-85
//         mergedData.marketDemand.push({
//           skill: skill,
//           demandScore: Math.floor(Math.random() * 25) + 60,
//           location: locationStr
//         });
//       }
//     });

//     // Sort by demand score
//     mergedData.marketDemand.sort((a, b) => b.demandScore - a.demandScore);
//   }

//   return mergedData;
// }