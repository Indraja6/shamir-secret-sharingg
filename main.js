const fs = require('fs');
const math = require('mathjs');
function decodeValue(value, base) {
    return parseInt(value, base);
}
function readInput(filePath) {
    try {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading or parsing the input file:", err);
        return null;
    }
}
function calculateConstantTerm(xValues, yValues) {
    const n = yValues.length;
    let c = 0;

    for (let i = 0; i < n; i++) {
        let term = yValues[i];
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const denominator = xValues[i] - xValues[j];
                if (denominator === 0) {
                    console.error("Error: Division by zero in Lagrange interpolation");
                    return NaN;
                }
                term *= (0 - xValues[j]) / denominator;
            }
        }
        c += term;
    }

    return c;
}
function identifyWrongPoints(xValues, yValues, expectedY) {
    const wrongPoints = [];
    for (let i = 0; i < xValues.length; i++) {
        if (Math.abs(yValues[i] - expectedY) > 1e-6) {
            wrongPoints.push(xValues[i]);
        }
    }
    return wrongPoints;
}
function main() {
    const filePath = 'input.json'; 
    const inputData = readInput(filePath);
    if (!inputData) {
        console.error("No valid input data found.");
        return;
    }
    const testCases = inputData.testCases;
    for (const testCase of testCases) {
        const keys = testCase.keys;
        if (!keys || typeof keys.n === 'undefined' || typeof keys.k === 'undefined') {
            console.error("Invalid or missing 'keys' in the input JSON.");
            continue;
        }

        const xValues = [];
        const yValues = [];

        // Decode the values
        for (const key in testCase) {
            if (key !== "keys") {
                const base = parseInt(testCase[key].base);
                const value = testCase[key].value;
                const x = parseInt(key);
                const y = decodeValue(value, base);

                if (isNaN(y)) {
                    console.error(`Error decoding y-value for key ${key} with base ${base}.`);
                    continue;
                }

                xValues.push(x);
                yValues.push(y);
            }
        }
        const secret = calculateConstantTerm(xValues, yValues);
        
        if (isNaN(secret)) {
            console.error("Error calculating the constant term.");
            continue;
        }
        console.log("Calculated constant term (c):", secret);
        if (keys.k < keys.n) {
            const wrongPoints = identifyWrongPoints(xValues, yValues, secret);
            console.log("Wrong points:", wrongPoints);
        }
    }
}
main();
