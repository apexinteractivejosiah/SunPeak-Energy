import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SunlightExposure,
  calculateSolarEstimate,
  validateLeadStep,
  hasValidationErrors,
  clampBill,
  clampSqFt,
} from './solarEstimator';

test('clampBill enforces $50 to $800 slider bounds', () => {
  assert.equal(clampBill(20), 50);
  assert.equal(clampBill(950), 800);
  assert.equal(clampBill(325.4), 325);
});

test('clampSqFt enforces 800 to 6000 sq ft bounds', () => {
  assert.equal(clampSqFt(400), 800);
  assert.equal(clampSqFt(9000), 6000);
  assert.equal(clampSqFt(2450), 2450);
});

test('higher monthly electric bill increases recommended system size and monthly savings', () => {
  const lowBill = calculateSolarEstimate({
    monthlyBill: 120,
    sunlight: SunlightExposure.Medium,
    homeSqFt: 2800,
    zipCode: '85001',
    firstName: 'Jordan',
    email: 'jordan@example.com',
  });

  const highBill = calculateSolarEstimate({
    monthlyBill: 450,
    sunlight: SunlightExposure.Medium,
    homeSqFt: 2800,
    zipCode: '85001',
    firstName: 'Jordan',
    email: 'jordan@example.com',
  });

  assert.ok(highBill.recommendedKw > lowBill.recommendedKw);
  assert.ok(highBill.estimatedMonthlySavings > lowBill.estimatedMonthlySavings);
  assert.ok(highBill.tenYearTotalUtilitySavings > lowBill.tenYearTotalUtilitySavings);
});

test('high sunlight exposure yields better ROI and faster payback than low sunlight', () => {
  const lowSun = calculateSolarEstimate({
    monthlyBill: 300,
    sunlight: SunlightExposure.Low,
    homeSqFt: 2600,
    zipCode: '78701',
    firstName: 'Taylor',
    email: 'taylor@example.com',
  });

  const highSun = calculateSolarEstimate({
    monthlyBill: 300,
    sunlight: SunlightExposure.High,
    homeSqFt: 2600,
    zipCode: '78701',
    firstName: 'Taylor',
    email: 'taylor@example.com',
  });

  assert.ok(highSun.estimatedMonthlySavings >= lowSun.estimatedMonthlySavings);
  assert.ok(highSun.tenYearRoiPercent > lowSun.tenYearRoiPercent);
  assert.ok(highSun.paybackYears < lowSun.paybackYears);
});

test('roof square footage caps maximum panel count cleanly on compact homes', () => {
  const compactHome = calculateSolarEstimate({
    monthlyBill: 750,
    sunlight: SunlightExposure.Medium,
    homeSqFt: 900,
    zipCode: '85001',
    firstName: 'Sam',
    email: 'sam@example.com',
  });

  assert.ok(compactHome.requiredArraySqFt <= compactHome.usableRoofSqFt);
  assert.equal(compactHome.yearlyProjection.length, 10);
});

test('validateLeadStep catches empty, malformed zip, and invalid email inputs', () => {
  const emptyErrors = validateLeadStep({ zipCode: '', firstName: '', email: '' });
  assert.equal(hasValidationErrors(emptyErrors), true);
  assert.ok(emptyErrors.zipCode);
  assert.ok(emptyErrors.firstName);
  assert.ok(emptyErrors.email);

  const badFormatErrors = validateLeadStep({
    zipCode: '850',
    firstName: 'A',
    email: 'not-an-email',
  });
  assert.equal(hasValidationErrors(badFormatErrors), true);
  assert.ok(badFormatErrors.zipCode);
  assert.ok(badFormatErrors.firstName);
  assert.ok(badFormatErrors.email);

  const validErrors = validateLeadStep({
    zipCode: '85001',
    firstName: 'Maya',
    email: 'maya@sunpeak.io',
  });
  assert.equal(hasValidationErrors(validErrors), false);
});

test('roof upgrade bundle increases gross investment and recalculates tax credit', () => {
  const solarOnly = calculateSolarEstimate({
    monthlyBill: 320,
    sunlight: SunlightExposure.High,
    homeSqFt: 2400,
    zipCode: '80202',
    firstName: 'Alex',
    email: 'alex@example.com',
    includeRoofUpgrade: false,
  });

  const bundled = calculateSolarEstimate({
    monthlyBill: 320,
    sunlight: SunlightExposure.High,
    homeSqFt: 2400,
    zipCode: '80202',
    firstName: 'Alex',
    email: 'alex@example.com',
    includeRoofUpgrade: true,
  });

  assert.ok(bundled.grossSystemCost > solarOnly.grossSystemCost);
  assert.ok(bundled.federalTaxCredit > solarOnly.federalTaxCredit);
});
