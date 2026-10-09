export interface HealthFundRecommendation {
  suggestedTarget: number;
  suggestedMonthly: number;
  monthsToTarget: number;
  protectionStatus: 'low' | 'moderate' | 'strong';
}

export function recommendHealthFund({
  monthlyIncome,
  monthlyEssentials,
  currentSavings,
  monthlyHealthcare,
  insuranceStatus,
}: {
  monthlyIncome: number;
  monthlyEssentials: number;
  currentSavings: number;
  monthlyHealthcare: number;
  insuranceStatus: 'none' | 'covered';
}): HealthFundRecommendation {
  const bufferMonths = insuranceStatus === 'none' ? 6 : 3;
  const baseTarget = Math.max(
    monthlyEssentials * bufferMonths,
    monthlyHealthcare * bufferMonths * 1.5
  );
  const suggestedTarget = Math.round(baseTarget);
  const gap = Math.max(0, suggestedTarget - currentSavings);
  const suggestedMonthly = gap === 0 ? 0 : Math.max(1000, Math.round(gap / 12));
  const monthsToTarget = suggestedMonthly === 0 ? 0 : Math.ceil(gap / suggestedMonthly);
  let protectionStatus: HealthFundRecommendation['protectionStatus'] = 'low';
  if (suggestedTarget === 0 || currentSavings >= suggestedTarget * 0.8) protectionStatus = 'strong';
  else if (currentSavings >= suggestedTarget * 0.5) protectionStatus = 'moderate';
  else protectionStatus = 'low';
  return { suggestedTarget, suggestedMonthly, monthsToTarget, protectionStatus };
}
