export const getTransferAngle = (current, next) => {

  if (!next) return 0;

  const x = next.latitude - current.latitude;
  const y = next.longitude - current.longitude;
  return Math.floor(Math.atan2(y, x) * 180 / Math.PI);
};
